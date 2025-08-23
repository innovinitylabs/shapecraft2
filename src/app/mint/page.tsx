'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flower, Zap, Users, Heart } from 'lucide-react';
import FlowerArt, { generateFlowerTraits } from '@/components/FlowerArt';
import AdvancedMoodSlider from '@/components/AdvancedMoodSlider';

export default function MintPage() {
  const [selectedMood, setSelectedMood] = useState(5);
  const [isMinting, setIsMinting] = useState(false);
  const [mintCount, setMintCount] = useState(1);

  // Generate deterministic flower traits based on mood
  const flowerTraits = useMemo(() => {
    const baseTraits = generateFlowerTraits(42); // Fixed seed for demo
    return {
      ...baseTraits,
      mood: selectedMood,
      petalCount: Math.max(5, Math.min(13, 5 + Math.floor(selectedMood / 2))),
      petalShape: selectedMood <= 3 ? 'drooping' as const : selectedMood >= 8 ? 'sharp' as const : 'rounded' as const,
      glowIntensity: selectedMood / 10,
      collectiveMood: 7, // Demo collective mood
      tradingActivity: 0.5 // Demo trading activity
    };
  }, [selectedMood]);

  const handleMint = async () => {
    setIsMinting(true);
    // Simulate minting process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsMinting(false);
    // TODO: Integrate with smart contract
  };

  const handleMoodChange = (newMood: number) => {
    setSelectedMood(newMood);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/20 to-transparent border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Mint Your Flower
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Create your unique living NFT flower. Each flower adapts to your mood and the collective consciousness of the community.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Flower Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Your Flower Preview</h2>
              <div className="bg-gray-900/30 rounded-2xl p-8 border border-gray-700">
                <FlowerArt
                  traits={flowerTraits}
                  size={400}
                  interactive={true}
                  onMoodChange={handleMoodChange}
                />
              </div>
            </div>

            {/* Flower Traits Display */}
            <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Flower Traits</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Core Shape:</span>
                  <span className="ml-2 text-white capitalize">{flowerTraits.coreShape}</span>
                </div>
                <div>
                  <span className="text-gray-400">Petal Count:</span>
                  <span className="ml-2 text-white">{flowerTraits.petalCount}</span>
                </div>
                <div>
                  <span className="text-gray-400">Petal Shape:</span>
                  <span className="ml-2 text-white capitalize">{flowerTraits.petalShape}</span>
                </div>
                <div>
                  <span className="text-gray-400">Ring Count:</span>
                  <span className="ml-2 text-white">{flowerTraits.ringCount}</span>
                </div>
                <div>
                  <span className="text-gray-400">Glow Intensity:</span>
                  <span className="ml-2 text-white">{Math.round(flowerTraits.glowIntensity * 100)}%</span>
                </div>
                <div>
                  <span className="text-gray-400">Rarity Score:</span>
                  <span className="ml-2 text-white">
                    {Math.round((flowerTraits.ringCount + flowerTraits.petalThickness + flowerTraits.glowIntensity) * 20)}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Minting Interface */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Mood Selection */}
            <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Set Your Initial Mood</h3>
              <p className="text-gray-400 mb-6">
                Choose the mood that will define your flower&apos;s initial appearance. You can change this later!
              </p>
              <AdvancedMoodSlider
                value={selectedMood}
                onChange={handleMoodChange}
                size="large"
              />
            </div>

            {/* Minting Options */}
            <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Minting Options</h3>
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setMintCount(Math.max(1, mintCount - 1))}
                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-2xl font-semibold min-w-[3rem] text-center">
                    {mintCount}
                  </span>
                  <button
                    onClick={() => setMintCount(Math.min(5, mintCount + 1))}
                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Display */}
              <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Price per NFT:</span>
                  <span className="text-xl font-semibold">0.01 ETH</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-300">Total:</span>
                  <span className="text-2xl font-bold text-purple-400">
                    {(0.01 * mintCount).toFixed(2)} ETH
                  </span>
                </div>
              </div>

              {/* Mint Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleMint}
                disabled={isMinting}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isMinting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Minting...
                  </div>
                ) : (
                  `Mint ${mintCount} Flower${mintCount > 1 ? 's' : ''}`
                )}
              </motion.button>
            </div>

            {/* Features */}
            <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">What You Get</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Flower className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">Unique 3D generative flower NFT</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-pink-400" />
                  <span className="text-gray-300">Mood-driven visual evolution</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">Collective mood integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300">Gas-back rewards for interactions</span>
                </div>
              </div>
            </div>

            {/* Collection Info */}
            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-700/30">
              <h3 className="text-xl font-semibold mb-4">Collection Info</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Total Supply:</span>
                  <span className="ml-2 text-white">1,111</span>
                </div>
                <div>
                  <span className="text-gray-400">Minted:</span>
                  <span className="ml-2 text-white">342/1,111</span>
                </div>
                <div>
                  <span className="text-gray-400">Price:</span>
                  <span className="ml-2 text-white">0.01 ETH</span>
                </div>
                <div>
                  <span className="text-gray-400">Royalties:</span>
                  <span className="ml-2 text-white">5%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
