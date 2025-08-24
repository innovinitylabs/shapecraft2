const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying ShapeL2FlowerMoodJournal contract...");

  // Get the contract factory
  const ShapeL2FlowerMoodJournal = await ethers.getContractFactory("ShapeL2FlowerMoodJournal");
  
  // Deploy the contract
  const flowerContract = await ShapeL2FlowerMoodJournal.deploy();
  
  // Wait for deployment to complete
  await flowerContract.waitForDeployment();
  
  const contractAddress = await flowerContract.getAddress();
  
  console.log("✅ Contract deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 Network:", network.name);
  console.log("👤 Deployer:", (await ethers.getSigners())[0].address);
  
  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  
  // Check initial state
  const maxSupply = await flowerContract.MAX_SUPPLY();
  const basePrice = await flowerContract.pricing();
  const artFeatures = await flowerContract.artFeatures();
  
  console.log("📊 Initial State:");
  console.log("   - Max Supply:", maxSupply.toString());
  console.log("   - Base Price:", ethers.formatEther(basePrice.basePrice), "ETH");
  console.log("   - Intro Price:", ethers.formatEther(basePrice.introPrice), "ETH");
  console.log("   - Bee Enabled:", artFeatures.beeEnabled);
  console.log("   - Community Influence:", artFeatures.communityInfluence);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: network.name,
    deployer: (await ethers.getSigners())[0].address,
    deploymentTime: new Date().toISOString(),
    constructorArgs: [],
    contractName: "ShapeL2FlowerMoodJournal",
    features: {
      maxSupply: maxSupply.toString(),
      basePrice: ethers.formatEther(basePrice.basePrice),
      introPrice: ethers.formatEther(basePrice.introPrice),
      beeEnabled: artFeatures.beeEnabled,
      communityInfluence: artFeatures.communityInfluence,
    }
  };
  
  // Write deployment info to file
  const fs = require("fs");
  const path = require("path");
  
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentsDir, `${network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n💾 Deployment info saved to:", deploymentFile);
  
  // Instructions for next steps
  console.log("\n🎯 Next Steps:");
  console.log("1. Update art version with HTML content");
  console.log("2. Configure art features");
  console.log("3. Test minting functionality");
  console.log("4. Verify contract on explorer");
  
  return contractAddress;
}

// Handle errors
main()
  .then((address) => {
    console.log("\n🎉 Deployment completed successfully!");
    console.log("Contract address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
