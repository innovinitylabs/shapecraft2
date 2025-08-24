import { expect } from "chai";
import { ethers } from "hardhat";
import { ShapesOfMind } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ShapesOfMind", function () {
  let shapesOfMind: ShapesOfMind;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const ShapesOfMind = await ethers.getContractFactory("ShapesOfMind");
    shapesOfMind = await ShapesOfMind.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await shapesOfMind.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await shapesOfMind.name()).to.equal("Shapes of Mind");
      expect(await shapesOfMind.symbol()).to.equal("SOM");
    });
  });

  describe("Minting", function () {
    it("Should mint a flower with valid parameters", async function () {
      const mintTx = await shapesOfMind.connect(user1).mintFlower(
        0, // Joy mood
        "Sunshine",
        6, // petalCount
        45, // colorHue
        80, // saturation
        90, // brightness
        true // isAnimated
      );

      await expect(mintTx)
        .to.emit(shapesOfMind, "FlowerMinted")
        .withArgs(1, user1.address, 0, "Sunshine", await ethers.provider.getBlock("latest").then(b => b?.timestamp));

      expect(await shapesOfMind.ownerOf(1)).to.equal(user1.address);
    });

    it("Should reject minting with invalid petal count", async function () {
      await expect(
        shapesOfMind.connect(user1).mintFlower(
          0, // Joy mood
          "Test",
          3, // Invalid petal count (less than 5)
          45,
          80,
          90,
          false
        )
      ).to.be.revertedWith("Petal count must be between 5-10");
    });

    it("Should reject minting with invalid color hue", async function () {
      await expect(
        shapesOfMind.connect(user1).mintFlower(
          0,
          "Test",
          6,
          400, // Invalid hue (greater than 360)
          80,
          90,
          false
        )
      ).to.be.revertedWith("Color hue must be 0-360");
    });

    it("Should reject minting with empty name", async function () {
      await expect(
        shapesOfMind.connect(user1).mintFlower(
          0,
          "", // Empty name
          6,
          45,
          80,
          90,
          false
        )
      ).to.be.revertedWith("Name cannot be empty");
    });
  });

  describe("Flower Data", function () {
    beforeEach(async function () {
      await shapesOfMind.connect(user1).mintFlower(
        1, // Calm mood
        "Peaceful",
        7,
        120,
        70,
        85,
        false
      );
    });

    it("Should return correct flower data", async function () {
      const flowerData = await shapesOfMind.getFlowerData(1);
      
      expect(flowerData.mood).to.equal(1); // Calm
      expect(flowerData.name).to.equal("Peaceful");
      expect(flowerData.petalCount).to.equal(7);
      expect(flowerData.colorHue).to.equal(120);
      expect(flowerData.saturation).to.equal(70);
      expect(flowerData.brightness).to.equal(85);
      expect(flowerData.isAnimated).to.equal(false);
    });

    it("Should return user tokens", async function () {
      const userTokens = await shapesOfMind.getTokensByOwner(user1.address);
      expect(userTokens).to.deep.equal([1n]);
    });
  });

  describe("Updating Flowers", function () {
    beforeEach(async function () {
      await shapesOfMind.connect(user1).mintFlower(
        2, // Melancholy mood
        "Blue Rose",
        8,
        240,
        60,
        70,
        true
      );
    });

    it("Should allow owner to update flower", async function () {
      const updateTx = await shapesOfMind.connect(user1).updateFlower(
        1,
        3, // Energy mood
        "Energized Rose"
      );

      await expect(updateTx)
        .to.emit(shapesOfMind, "FlowerUpdated")
        .withArgs(1, 3, "Energized Rose", await ethers.provider.getBlock("latest").then(b => b?.timestamp));

      const flowerData = await shapesOfMind.getFlowerData(1);
      expect(flowerData.mood).to.equal(3);
      expect(flowerData.name).to.equal("Energized Rose");
    });

    it("Should reject update from non-owner", async function () {
      await expect(
        shapesOfMind.connect(user2).updateFlower(
          1,
          4, // Serenity mood
          "Stolen Flower"
        )
      ).to.be.revertedWith("Not the owner of this flower");
    });

    it("Should reject update with empty name", async function () {
      await expect(
        shapesOfMind.connect(user1).updateFlower(
          1,
          5, // Passion mood
          "" // Empty name
        )
      ).to.be.revertedWith("Name cannot be empty");
    });
  });

  describe("Token URI", function () {
    beforeEach(async function () {
      await shapesOfMind.connect(user1).mintFlower(
        6, // Contemplation mood
        "Thoughtful",
        9,
        180,
        50,
        75,
        false
      );
    });

    it("Should return valid token URI", async function () {
      const tokenURI = await shapesOfMind.tokenURI(1);
      expect(tokenURI).to.include("data:application/json;base64,");
    });
  });

  describe("Multiple Mints", function () {
    it("Should handle multiple mints from same user", async function () {
      await shapesOfMind.connect(user1).mintFlower(
        0, // Joy
        "First Flower",
        5,
        30,
        90,
        95,
        true
      );

      await shapesOfMind.connect(user1).mintFlower(
        7, // Wonder
        "Second Flower",
        10,
        300,
        85,
        80,
        false
      );

      const userTokens = await shapesOfMind.getTokensByOwner(user1.address);
      expect(userTokens).to.deep.equal([1n, 2n]);
      expect(await shapesOfMind.balanceOf(user1.address)).to.equal(2);
    });

    it("Should handle mints from different users", async function () {
      await shapesOfMind.connect(user1).mintFlower(
        0, // Joy
        "User1 Flower",
        6,
        45,
        80,
        90,
        true
      );

      await shapesOfMind.connect(user2).mintFlower(
        4, // Serenity
        "User2 Flower",
        7,
        150,
        70,
        85,
        false
      );

      expect(await shapesOfMind.balanceOf(user1.address)).to.equal(1);
      expect(await shapesOfMind.balanceOf(user2.address)).to.equal(1);
      expect(await shapesOfMind.ownerOf(1)).to.equal(user1.address);
      expect(await shapesOfMind.ownerOf(2)).to.equal(user2.address);
    });
  });
});
