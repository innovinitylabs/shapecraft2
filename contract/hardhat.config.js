require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    // Shape Sepolia (Alchemy)
    "shape-sepolia": {
      url: `https://shape-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY || process.env.NEXT_PUBLIC_ALCHEMY_KEY || ''}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11011,
      gasPrice: 1000000000,
    },
    // Local development
    hardhat: {
      chainId: 31337,
      gas: 12000000,
      blockGasLimit: 12000000,
      allowUnlimitedContractSize: true,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    gasPrice: 20,
    showMethodSig: true,
    showTimeSpent: true,
  },
  etherscan: {
    apiKey: {
      "shape-sepolia": process.env.SHAPE_L2_API_KEY || "",
    },
    customChains: [
      {
        network: "shape-sepolia",
        chainId: 11011,
        urls: {
          apiURL: "https://explorer-sepolia.shape.network/api",
          browserURL: "https://explorer-sepolia.shape.network",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};
