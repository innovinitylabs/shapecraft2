import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from '@/lib/web3';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

// Create a client
const queryClient = new QueryClient();

export const metadata: Metadata = {
  title: "Shapes of Mind - Living NFT Flowers",
  description: "A generative NFT collection of living flowers that reflect your mood and the collective consciousness of the community. Each flower evolves based on your emotional state and on-chain interactions.",
  keywords: "NFT, generative art, mood tracking, blockchain, flowers, 3D art",
  icons: {
    icon: '/valipokkann.ico',
    shortcut: '/valipokkann.ico',
    apple: '/valipokkann.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${inter.className} bg-black text-white min-h-screen`}
        suppressHydrationWarning={true}
      >
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <Navigation />
              <main className="pt-16">
                {children}
              </main>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1f2937',
                    color: '#fff',
                    border: '1px solid #374151',
                  },
                }}
              />
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
