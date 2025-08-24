'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { http } from 'viem';
import { shapeSepolia } from 'viem/chains';

// Use compile-time injected NEXT_PUBLIC_* vars (required for client bundles)
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY || 'uJcSWfOiuE1n2zPxXsTvE';
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'b4eab67cb34a96048b206d59b927975f';

export const wagmiConfig = getDefaultConfig({
  appName: 'Shapes of Mind',
  ssr: false,
  projectId: walletConnectProjectId,
  chains: [shapeSepolia],
  transports: {
    [shapeSepolia.id]: http(`https://shape-sepolia.g.alchemy.com/v2/${alchemyKey}`, {
      batch: true,
    }),
  },
});
