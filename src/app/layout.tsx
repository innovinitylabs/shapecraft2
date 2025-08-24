import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

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
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
