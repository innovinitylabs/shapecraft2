import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ShapesOfMind contract...");

  const ShapesOfMind = await ethers.getContractFactory("ShapesOfMind");
  const shapesOfMind = await ShapesOfMind.deploy();

  await shapesOfMind.waitForDeployment();

  const address = await shapesOfMind.getAddress();
  console.log("ShapesOfMind deployed to:", address);

  // Verify the deployment
  console.log("Waiting for deployment confirmation...");
  await shapesOfMind.deploymentTransaction()?.wait(5);

  console.log("Deployment completed successfully!");
  console.log("Contract address:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
