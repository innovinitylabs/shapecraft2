import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition-ethers";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    shapeSepolia: {
      url: process.env.SHAPE_SEPOLIA_RPC_URL || "https://shape-sepolia.g.alchemy.com/v2/your-api-key",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11011,
    },
    shape: {
      url: process.env.SHAPE_MAINNET_RPC_URL || "https://shape-mainnet.g.alchemy.com/v2/your-api-key",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 360,
    },
  },
  etherscan: {
    apiKey: {
      shapeSepolia: process.env.ETHERSCAN_API_KEY || "",
      shape: process.env.ETHERSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "shapeSepolia",
        chainId: 11011,
        urls: {
          apiURL: "https://sepolia.explorer.shape.network/api",
          browserURL: "https://sepolia.explorer.shape.network",
        },
      },
      {
        network: "shape",
        chainId: 360,
        urls: {
          apiURL: "https://explorer.shape.network/api",
          browserURL: "https://explorer.shape.network",
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};

export default config;
