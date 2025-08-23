import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    shapeL2: {
      url: process.env.SHAPE_L2_RPC_URL || "https://rpc.shape-l2.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1337, // Update with actual Shape L2 chain ID
    },
    shapeL2Testnet: {
      url: process.env.SHAPE_L2_TESTNET_RPC_URL || "https://testnet-rpc.shape-l2.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1338, // Update with actual Shape L2 testnet chain ID
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
