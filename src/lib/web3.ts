'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { http } from 'viem';
import { shapeSepolia } from 'viem/chains';

// Use compile-time injected NEXT_PUBLIC_* vars (required for client bundles)
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY || '';
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

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
