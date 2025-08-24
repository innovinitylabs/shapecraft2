const { expect } = require("chai");
const { ethers, anyValue } = require("hardhat");

describe("ShapeL2FlowerMoodJournal", function () {
  let flowerContract;
  let owner;
  let user1;
  let user2;
  let user3;

  const MINT_PRICE = ethers.parseEther("0.0042"); // Introductory price
  const PREMIUM_COST = ethers.parseEther("0.001");

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    
    const ShapeL2FlowerMoodJournal = await ethers.getContractFactory("ShapeL2FlowerMoodJournal");
    flowerContract = await ShapeL2FlowerMoodJournal.deploy();
  });

  describe("Deployment", function () {
    it("Should deploy with correct initial state", async function () {
      expect(await flowerContract.MAX_SUPPLY()).to.equal(1111);
      expect(await flowerContract.MAX_PER_WALLET()).to.equal(2);
      expect(await flowerContract.FREE_ENTRIES()).to.equal(3);
      
      const pricing = await flowerContract.pricing();
      expect(pricing.basePrice).to.equal(ethers.parseEther("0.0069"));
      expect(pricing.introPrice).to.equal(ethers.parseEther("0.0042"));
      
      const artFeatures = await flowerContract.artFeatures();
      expect(artFeatures.beeEnabled).to.be.true;
      expect(artFeatures.communityInfluence).to.be.true;
    });

    it("Should set correct owner", async function () {
      expect(await flowerContract.owner()).to.equal(owner.address);
    });
  });

  describe("NFT Minting", function () {
    it("Should mint NFT successfully", async function () {
      const emotion = 0; // happy
      const conf = 8500; // 85% confidence
      const probs = [85, 5, 3, 2, 1]; // Top 5 probabilities
      const entropy = 60;
      const gap = 80;

      await expect(
        flowerContract.connect(user1).mintFlowerNFT(
          emotion, conf, probs, entropy, gap,
          { value: MINT_PRICE }
        )
      ).to.emit(flowerContract, "FlowerMinted")
        .withArgs(user1.address, 1, MINT_PRICE);

      expect(await flowerContract.ownerOf(1)).to.equal(user1.address);
      expect(await flowerContract.userMintCount(user1.address)).to.equal(1);
    });

    it("Should fail if insufficient payment", async function () {
      const emotion = 0;
      const conf = 8500;
      const probs = [85, 5, 3, 2, 1];
      const entropy = 60;
      const gap = 80;

      await expect(
        flowerContract.connect(user1).mintFlowerNFT(
          emotion, conf, probs, entropy, gap,
          { value: ethers.parseEther("0.001") }
        )
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should fail if max per wallet reached", async function () {
      const emotion = 0;
      const conf = 8500;
      const probs = [85, 5, 3, 2, 1];
      const entropy = 60;
      const gap = 80;

      // Mint first NFT
      await flowerContract.connect(user1).mintFlowerNFT(
        emotion, conf, probs, entropy, gap,
        { value: MINT_PRICE }
      );

      // Mint second NFT
      await flowerContract.connect(user1).mintFlowerNFT(
        emotion, conf, probs, entropy, gap,
        { value: MINT_PRICE }
      );

      // Third NFT should fail
      await expect(
        flowerContract.connect(user1).mintFlowerNFT(
          emotion, conf, probs, entropy, gap,
          { value: MINT_PRICE }
        )
      ).to.be.revertedWith("Max per wallet reached");
    });
  });

  describe("Mood Recording", function () {
    beforeEach(async function () {
      // Mint an NFT first
      const emotion = 0;
      const conf = 8500;
      const probs = [85, 5, 3, 2, 1];
      const entropy = 60;
      const gap = 80;

      await flowerContract.connect(user1).mintFlowerNFT(
        emotion, conf, probs, entropy, gap,
        { value: MINT_PRICE }
      );
    });

    it("Should record mood successfully", async function () {
      const emotion = 1; // joy
      const conf = 9200; // 92% confidence
      const probs = [92, 3, 2, 1, 1];
      const entropy = 70;
      const gap = 85;
      const nftId = 1;

      await expect(
        flowerContract.connect(user1).recordMood(
          emotion, conf, probs, entropy, gap, nftId
        )
      ).to.emit(flowerContract, "MoodRecorded");

      const history = await flowerContract.getUserMoodHistory(user1.address);
      expect(history.totalEntries).to.equal(2); // Initial + new entry
    });

    it("Should require premium payment after free entries", async function () {
      const emotion = 1;
      const conf = 9200;
      const probs = [92, 3, 2, 1, 1];
      const entropy = 70;
      const gap = 85;
      const nftId = 1;

      // Record 2 additional free entries (1st was from minting)
      for (let i = 0; i < 2; i++) {
        await flowerContract.connect(user1).recordMood(
          emotion, conf, probs, entropy, gap, nftId
        );
      }

      // Fourth entry should require payment
      await expect(
        flowerContract.connect(user1).recordMood(
          emotion, conf, probs, entropy, gap, nftId
        )
      ).to.be.revertedWith("Premium entry cost required");

      // Should work with payment
      await flowerContract.connect(user1).recordMood(
        emotion, conf, probs, entropy, gap, nftId,
        { value: PREMIUM_COST }
      );
    });
  });

  describe("Streak System", function () {
    beforeEach(async function () {
      // Mint an NFT
      const emotion = 0;
      const conf = 8500;
      const probs = [85, 5, 3, 2, 1];
      const entropy = 60;
      const gap = 80;

      await flowerContract.connect(user1).mintFlowerNFT(
        emotion, conf, probs, entropy, gap,
        { value: MINT_PRICE }
      );
    });

    it("Should update streak for happy emotions", async function () {
      const nftId = 1;
      const happyEmotions = [0, 1, 7]; // happy, joy, surprise
      const conf = 8500;
      const probs = [85, 5, 3, 2, 1];
      const entropy = 60;
      const gap = 80;

      // Record 2 additional happy emotions (1st was from minting)
      for (let i = 0; i < 2; i++) {
        await flowerContract.connect(user1).recordMood(
          happyEmotions[i], conf, probs, entropy, gap, nftId
        );
      }

      const history = await flowerContract.getUserMoodHistory(user1.address);
      expect(history.currentStreak).to.equal(3); // 1 from mint + 2 additional
      expect(history.maxStreak).to.equal(3);
    });

    it("Should reset streak for non-happy emotions", async function () {
      const nftId = 1;
      const conf = 8500;
      const probs = [85, 5, 3, 2, 1];
      const entropy = 60;
      const gap = 80;

      // Record sad emotion (resets streak from mint)
      await flowerContract.connect(user1).recordMood(
        2, conf, probs, entropy, gap, nftId
      );

      const history = await flowerContract.getUserMoodHistory(user1.address);
      expect(history.currentStreak).to.equal(0);
      expect(history.maxStreak).to.equal(1); // 1 from mint
    });

    it("Should return correct streak features", async function () {
      const nftId = 1;
      const conf = 8500;
      const probs = [85, 5, 3, 2, 1];
      const entropy = 60;
      const gap = 80;

      // Record 2 additional happy emotions (1st was from minting, 2nd and 3rd are free)
      for (let i = 0; i < 2; i++) {
        await flowerContract.connect(user1).recordMood(
          0, conf, probs, entropy, gap, nftId
        );
      }

      // Record 2 more with premium payment
      for (let i = 0; i < 2; i++) {
        await flowerContract.connect(user1).recordMood(
          0, conf, probs, entropy, gap, nftId,
          { value: PREMIUM_COST }
        );
      }

      const features = await flowerContract.getStreakFeatures(user1.address);
      expect(features.beeAppearance).to.be.true; // 5 total (1 mint + 4 additional)
      expect(features.beeRangeControl).to.be.true; // 5 total
      expect(features.stalkGrowth).to.be.false; // Need 7 days
    });
  });

  describe("Dynamic Rarity/Leaderboard", function () {
    beforeEach(async function () {
      // Mint NFTs for multiple users
      const emotion = 0;
      const conf = 8500;
      const probs = [85, 5, 3, 2, 1];
      const entropy = 60;
      const gap = 80;

      await flowerContract.connect(user1).mintFlowerNFT(
        emotion, conf, probs, entropy, gap,
        { value: MINT_PRICE }
      );

      await flowerContract.connect(user2).mintFlowerNFT(
        emotion, conf, probs, entropy, gap,
        { value: MINT_PRICE }
      );
    });

    it("Should update user rankings", async function () {
      const nftId1 = 1;
      const nftId2 = 2;
      const conf1 = 9000; // Higher confidence
      const conf2 = 8000; // Lower confidence
      const probs = [85, 5, 3, 2, 1];
      const entropy = 60;
      const gap = 80;

      // Record moods
      await flowerContract.connect(user1).recordMood(
        0, conf1, probs, entropy, gap, nftId1
      );

      await flowerContract.connect(user2).recordMood(
        0, conf2, probs, entropy, gap, nftId2
      );

      const ranking1 = await flowerContract.getUserRanking(user1.address);
      const ranking2 = await flowerContract.getUserRanking(user2.address);

      expect(ranking1.rank).to.equal(1); // Higher score = rank 1
      expect(ranking2.rank).to.equal(2); // Lower score = rank 2
      // Average includes the minting entry (8500) and the new entry (conf1)
      expect(ranking1.averageMoodScore).to.equal((8500 + conf1) / 2);
      expect(ranking2.averageMoodScore).to.equal((8500 + conf2) / 2);
    });

    it("Should return top users correctly", async function () {
      const nftId1 = 1;
      const nftId2 = 2;
      const conf1 = 9000;
      const conf2 = 8000;
      const probs = [85, 5, 3, 2, 1];
      const entropy = 60;
      const gap = 80;

      // Record moods
      await flowerContract.connect(user1).recordMood(
        0, conf1, probs, entropy, gap, nftId1
      );

      await flowerContract.connect(user2).recordMood(
        0, conf2, probs, entropy, gap, nftId2
      );

      const [users, ranks, scores] = await flowerContract.getTopUsers(2);

      expect(users[0]).to.equal(user1.address); // Higher score first
      expect(users[1]).to.equal(user2.address); // Lower score second
      expect(ranks[0]).to.equal(1);
      expect(ranks[1]).to.equal(2);
      expect(scores[0]).to.equal((8500 + conf1) / 2);
      expect(scores[1]).to.equal((8500 + conf2) / 2);
    });
  });

  describe("Community Features", function () {
    beforeEach(async function () {
      // Mint NFTs for multiple users
      const emotion = 0;
      const conf = 8500;
      const probs = [85, 5, 3, 2, 1];
      const entropy = 60;
      const gap = 80;

      await flowerContract.connect(user1).mintFlowerNFT(
        emotion, conf, probs, entropy, gap,
        { value: MINT_PRICE }
      );

      await flowerContract.connect(user2).mintFlowerNFT(
        emotion, conf, probs, entropy, gap,
        { value: MINT_PRICE }
      );
    });

    it("Should calculate community stats correctly", async function () {
      const nftId1 = 1;
      const nftId2 = 2;
      const conf1 = 9000;
      const conf2 = 8000;
      const probs = [85, 5, 3, 2, 1];
      const entropy = 60;
      const gap = 80;

      // Record moods
      await flowerContract.connect(user1).recordMood(
        0, conf1, probs, entropy, gap, nftId1
      );

      await flowerContract.connect(user2).recordMood(
        0, conf2, probs, entropy, gap, nftId2
      );

      const stats = await flowerContract.getCommunityStats();
      expect(stats.totalParticipants).to.equal(4); // 2 minting + 2 additional entries
      // Average includes minting entries (8500 each) plus new entries
      expect(stats.averageCommunityMood).to.equal((8500 + conf1 + 8500 + conf2) / 4);
      expect(stats.totalMoodEntries).to.equal(8500 + conf1 + 8500 + conf2);
    });
  });

  describe("Art Management", function () {
    it("Should update art version", async function () {
      const version = "1.0.0";
      const htmlArt = "<html><body>Test Art</body></html>";
      const artAssets = "test-assets";

      await expect(
        flowerContract.connect(owner).updateArtVersion(version, htmlArt, artAssets)
      ).to.emit(flowerContract, "ArtVersionUpdated");

      const artVersion = await flowerContract.getArtVersion();
      expect(artVersion.version).to.equal(version);
    });

    it("Should update art features", async function () {
      await expect(
        flowerContract.connect(owner).updateArtFeatures(
          true,  // beeEnabled
          true,  // soundEnabled
          false, // particleEffects
          false, // advancedLighting
          false, // weatherEffects
          false, // timeOfDay
          true,  // communityInfluence
          false, // tradingActivity
          8,     // artComplexity
          2,     // animationSpeed
          3,     // colorPalette
          5      // specialEffects
        )
      ).to.emit(flowerContract, "ArtFeaturesUpdated");

      const features = await flowerContract.artFeatures();
      expect(features.beeEnabled).to.be.true;
      expect(features.soundEnabled).to.be.true;
      expect(features.artComplexity).to.equal(8);
    });

    it("Should fail if non-owner tries to update art", async function () {
      const version = "1.0.0";
      const htmlArt = "<html><body>Test Art</body></html>";
      const artAssets = "test-assets";

      await expect(
        flowerContract.connect(user1).updateArtVersion(version, htmlArt, artAssets)
      ).to.be.revertedWithCustomError(flowerContract, "OwnableUnauthorizedAccount");
    });
  });

  describe("Gasback System", function () {
    beforeEach(async function () {
      // Mint an NFT
      const emotion = 0;
      const conf = 8500;
      const probs = [85, 5, 3, 2, 1];
      const entropy = 60;
      const gap = 80;

      await flowerContract.connect(user1).mintFlowerNFT(
        emotion, conf, probs, entropy, gap,
        { value: MINT_PRICE }
      );
    });

    it("Should distribute gasback on mood recording", async function () {
      const nftId = 1;
      const emotion = 1;
      const conf = 9200;
      const probs = [92, 3, 2, 1, 1];
      const entropy = 70;
      const gap = 85;

      await flowerContract.connect(user1).recordMood(
        emotion, conf, probs, entropy, gap, nftId
      );

      const gasbackBalance = await flowerContract.userGasbackBalance(user1.address);
      expect(gasbackBalance).to.be.gt(0);
    });

    it("Should allow claiming gasback", async function () {
      const nftId = 1;
      const emotion = 1;
      const conf = 9200;
      const probs = [92, 3, 2, 1, 1];
      const entropy = 70;
      const gap = 85;

      // Record mood to earn gasback
      await flowerContract.connect(user1).recordMood(
        emotion, conf, probs, entropy, gap, nftId
      );

      // Check gasback balance
      const gasbackBalance = await flowerContract.userGasbackBalance(user1.address);
      expect(gasbackBalance).to.be.gt(0);
      
      // Claim gasback
      await flowerContract.connect(user1).claimGasback();
      
      // Check gasback balance is reset
      const newGasbackBalance = await flowerContract.userGasbackBalance(user1.address);
      expect(newGasbackBalance).to.equal(0);
    });
  });

  describe("Security", function () {
    it("Should pause and unpause correctly", async function () {
      await flowerContract.connect(owner).emergencyPause();
      expect(await flowerContract.paused()).to.be.true;

      await flowerContract.connect(owner).unpause();
      expect(await flowerContract.paused()).to.be.false;
    });

    it("Should fail operations when paused", async function () {
      await flowerContract.connect(owner).emergencyPause();

      const emotion = 0;
      const conf = 8500;
      const probs = [85, 5, 3, 2, 1];
      const entropy = 60;
      const gap = 80;

      await expect(
        flowerContract.connect(user1).mintFlowerNFT(
          emotion, conf, probs, entropy, gap,
          { value: MINT_PRICE }
        )
      ).to.be.revertedWithCustomError(flowerContract, "EnforcedPause");
    });

    it("Should fail if non-owner tries to pause", async function () {
      await expect(
        flowerContract.connect(user1).emergencyPause()
      ).to.be.revertedWithCustomError(flowerContract, "OwnableUnauthorizedAccount");
    });
  });

  describe("Helper Functions", function () {
    it("Should convert emotion codes correctly", async function () {
      expect(await flowerContract.getEmotionString(0)).to.equal("happy");
      expect(await flowerContract.getEmotionString(1)).to.equal("joy");
      expect(await flowerContract.getEmotionString(2)).to.equal("sad");
      expect(await flowerContract.getEmotionString(8)).to.equal("neutral");
      expect(await flowerContract.getEmotionString(9)).to.equal("unknown");
    });

    it("Should convert emotion strings to codes", async function () {
      expect(await flowerContract.getEmotionCode("happy")).to.equal(0);
      expect(await flowerContract.getEmotionCode("joy")).to.equal(1);
      expect(await flowerContract.getEmotionCode("sad")).to.equal(2);
      expect(await flowerContract.getEmotionCode("neutral")).to.equal(8);
      expect(await flowerContract.getEmotionCode("unknown")).to.equal(8); // default
    });
  });

  describe("Token URI", function () {
    beforeEach(async function () {
      // Mint an NFT
      const emotion = 0;
      const conf = 8500;
      const probs = [85, 5, 3, 2, 1];
      const entropy = 60;
      const gap = 80;

      await flowerContract.connect(user1).mintFlowerNFT(
        emotion, conf, probs, entropy, gap,
        { value: MINT_PRICE }
      );
    });

    it("Should return valid token URI", async function () {
      const tokenURI = await flowerContract.tokenURI(1);
      expect(tokenURI).to.include("data:application/json;base64,");
      
      // Decode and check metadata
      const base64Data = tokenURI.replace("data:application/json;base64,", "");
      const metadata = JSON.parse(Buffer.from(base64Data, 'base64').toString());
      
      expect(metadata.name).to.equal("Flower #1");
      expect(metadata.description).to.equal("AI-generated flower based on mood analysis");
      expect(metadata.attributes).to.be.an('array');
    });

    it("Should fail for non-existent token", async function () {
      await expect(
        flowerContract.tokenURI(999)
      ).to.be.revertedWithCustomError(flowerContract, "ERC721NonexistentToken");
    });
  });
});
