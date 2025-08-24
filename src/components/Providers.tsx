'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from '@/lib/web3';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const projectId = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID : '';
  const hasWalletConnect = !!projectId && projectId !== 'demo' && projectId !== 'demo_project_id';

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {hasWalletConnect ? (
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        ) : (
          children
        )}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
