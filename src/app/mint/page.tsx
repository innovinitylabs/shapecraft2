'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flower, Wallet, Zap, Users, Coins } from 'lucide-react';
import Flower3D from '@/components/Flower3D';
import MoodSlider from '@/components/MoodSlider';

export default function MintPage() {
  const [mood, setMood] = useState(5);
  const [isConnected, setIsConnected] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  // Mock data for collection stats
  const collectionStats = {
    totalSupply: 1111,
    minted: 342,
    price: "0.01 ETH",
    gasBackPercentage: 50
  };

  // Mock flower traits
  const flowerTraits = {
    coreShape: Math.floor(Math.random() * 4),
    petalCount: Math.floor(Math.random() * 11) + 5, // 5-15
    ringLayers: Math.floor(Math.random() * 5) + 1, // 1-5
    glowIntensity: Math.floor(Math.random() * 10) + 1, // 1-10
    rarityTier: Math.floor(Math.random() * 5) + 1 // 1-5
  };

  const handleMint = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    setIsMinting(true);
    // Simulate minting process
    setTimeout(() => {
      setIsMinting(false);
      alert('NFT minted successfully! Check your wallet.');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Mint Your</span>
              <br />
              <span className="text-white">Living Flower</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join the Shapes of Mind community and mint your unique NFT flower that will grow and evolve with your emotions.
            </p>
          </motion.div>

          {/* Collection Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold gradient-text mb-2">{collectionStats.minted}</div>
              <div className="text-gray-300">Minted</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold gradient-text mb-2">{collectionStats.totalSupply}</div>
              <div className="text-gray-300">Total Supply</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold gradient-text mb-2">{collectionStats.price}</div>
              <div className="text-gray-300">Mint Price</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold gradient-text mb-2">{collectionStats.gasBackPercentage}%</div>
              <div className="text-gray-300">Gas Back</div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Flower Preview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass p-8 rounded-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Your Flower Preview</h2>
              <div className="h-96 mb-6">
                <Flower3D 
                  mood={mood} 
                  traits={flowerTraits} 
                  isInteractive={true}
                  size={1.5}
                />
              </div>
              
              {/* Mood Slider */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-center">Set Your Initial Mood</h3>
                <div className="flex justify-center">
                  <MoodSlider 
                    value={mood} 
                    onChange={setMood} 
                    disabled={!isConnected}
                    size="md"
                  />
                </div>
              </div>

              {/* Traits Display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Core Shape</div>
                  <div className="font-semibold">{['Circle', 'Hexagon', 'Star', 'Spiral'][flowerTraits.coreShape]}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Petal Count</div>
                  <div className="font-semibold">{flowerTraits.petalCount}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Ring Layers</div>
                  <div className="font-semibold">{flowerTraits.ringLayers}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Rarity Tier</div>
                  <div className="font-semibold">{flowerTraits.rarityTier}/5</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Minting Interface */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-8"
            >
              {/* Wallet Connection */}
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Wallet Connection
                </h3>
                {!isConnected ? (
                  <button
                    onClick={() => setIsConnected(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-5 h-5" />
                    Connect Wallet
                  </button>
                ) : (
                  <div className="text-center">
                    <div className="text-green-400 font-semibold mb-2">✓ Wallet Connected</div>
                    <div className="text-sm text-gray-400">0x1234...5678</div>
                  </div>
                )}
              </div>

              {/* Minting Section */}
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Flower className="w-5 h-5" />
                  Mint Your Flower
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Mint Price:</span>
                    <span className="font-semibold">{collectionStats.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Gas Back:</span>
                    <span className="font-semibold text-green-400">{collectionStats.gasBackPercentage}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Network:</span>
                    <span className="font-semibold text-purple-400">Shape L2</span>
                  </div>
                  
                  <button
                    onClick={handleMint}
                    disabled={!isConnected || isMinting}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMinting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Minting...
                      </>
                    ) : (
                      <>
                        <Flower className="w-5 h-5" />
                        Mint Flower
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Gas Back Info */}
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Gas Back Rewards
                </h3>
                <p className="text-gray-300 mb-4">
                  Get {collectionStats.gasBackPercentage}% of your gas fees back when you interact with your flower!
                </p>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <div className="text-green-400 font-semibold">Available for:</div>
                  <ul className="text-sm text-gray-300 mt-2 space-y-1">
                    <li>• Mood updates</li>
                    <li>• Flower renaming</li>
                    <li>• Trading activities</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
