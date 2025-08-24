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
    // Shape L2 Testnet
    "shape-l2-testnet": {
      url: "https://testnet-rpc.shape-l2.com", // Replace with actual Shape L2 testnet RPC
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1234, // Replace with actual Shape L2 testnet chain ID
      gasPrice: 1000000000, // 1 gwei
    },
    // Shape L2 Mainnet
    "shape-l2-mainnet": {
      url: "https://rpc.shape-l2.com", // Replace with actual Shape L2 mainnet RPC
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 5678, // Replace with actual Shape L2 mainnet chain ID
      gasPrice: 1000000000, // 1 gwei
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
      "shape-l2-mainnet": process.env.SHAPE_L2_API_KEY || "",
      "shape-l2-testnet": process.env.SHAPE_L2_API_KEY || "",
    },
    customChains: [
      {
        network: "shape-l2-mainnet",
        chainId: 5678, // Replace with actual chain ID
        urls: {
          apiURL: "https://explorer.shape-l2.com/api", // Replace with actual explorer API
          browserURL: "https://explorer.shape-l2.com", // Replace with actual explorer URL
        },
      },
      {
        network: "shape-l2-testnet",
        chainId: 1234, // Replace with actual chain ID
        urls: {
          apiURL: "https://testnet-explorer.shape-l2.com/api", // Replace with actual testnet explorer API
          browserURL: "https://testnet-explorer.shape-l2.com", // Replace with actual testnet explorer URL
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
