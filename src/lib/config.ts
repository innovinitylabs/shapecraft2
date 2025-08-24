export const config = {
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 11011, // Default to Shape Sepolia
  alchemyKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY as string,
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
} as const;
