export const config = {
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 11011, // Default to Shape Sepolia
  alchemyKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY || 'demo-key',
  // Using a valid WalletConnect project ID for demos
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '2f05a4334bb6b7e91913a63735f6bcad',
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
} as const;
