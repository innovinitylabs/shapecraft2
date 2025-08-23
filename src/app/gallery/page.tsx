'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, Edit3, TrendingUp } from 'lucide-react';
import FlowerArt, { generateFlowerTraits } from '@/components/FlowerArt';
import AdvancedMoodSlider from '@/components/AdvancedMoodSlider';

interface NFT {
  id: number;
  name: string;
  traits: ReturnType<typeof generateFlowerTraits> & {
    mood: number;
    collectiveMood: number;
    tradingActivity: number;
  };
  moodHistory: Array<{
    mood: number;
    timestamp: number;
    label: string;
  }>;
  nameHistory: Array<{
    name: string;
    timestamp: number;
  }>;
  lastMoodUpdate: number;
  tradingActivity: number;
  collectiveMood: number;
}

export default function GalleryPage() {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isUpdatingMood, setIsUpdatingMood] = useState(false);
  const [newName, setNewName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  // Mock NFT data with deterministic traits
  const mockNFTs = useMemo(() => {
    const nfts: NFT[] = [];
    for (let i = 1; i <= 3; i++) {
      const baseTraits = generateFlowerTraits(i);
      const moodHistory = [
        { mood: 5, timestamp: Date.now() - 86400000 * 7, label: 'Neutral' },
        { mood: 7, timestamp: Date.now() - 86400000 * 3, label: 'Happy' },
        { mood: 3, timestamp: Date.now() - 86400000, label: 'Sad' },
        { mood: 8, timestamp: Date.now(), label: 'Excited' }
      ];
      
      nfts.push({
        id: i,
        name: `Flower #${i}`,
        traits: {
          ...baseTraits,
          mood: moodHistory[moodHistory.length - 1].mood,
          collectiveMood: 7,
          tradingActivity: 0.3 + (i * 0.2)
        },
        moodHistory,
        nameHistory: [
          { name: `Flower #${i}`, timestamp: Date.now() - 86400000 * 14 },
          { name: `My Flower ${i}`, timestamp: Date.now() - 86400000 * 7 },
          { name: `Flower #${i}`, timestamp: Date.now() }
        ],
        lastMoodUpdate: Date.now(),
        tradingActivity: 0.3 + (i * 0.2),
        collectiveMood: 7
      });
    }
    return nfts;
  }, []);

  const handleMoodUpdate = async (nft: NFT, newMood: number) => {
    setIsUpdatingMood(true);
    // Simulate blockchain interaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update the NFT's mood
    nft.traits.mood = newMood;
    nft.moodHistory.push({
      mood: newMood,
      timestamp: Date.now(),
      label: ['Devastated', 'Depressed', 'Sad', 'Disappointed', 'Neutral', 'Content', 'Happy', 'Excited', 'Elated', 'Euphoric'][newMood - 1]
    });
    nft.lastMoodUpdate = Date.now();
    
    setIsUpdatingMood(false);
    // TODO: Integrate with smart contract
  };

  const handleRename = async (nft: NFT) => {
    if (!newName.trim()) return;
    
    setIsRenaming(true);
    // Simulate blockchain interaction
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    nft.name = newName.trim();
    nft.nameHistory.push({
      name: newName.trim(),
      timestamp: Date.now()
    });
    
    setNewName('');
    setIsRenaming(false);
    // TODO: Integrate with smart contract
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
              My Flower Garden
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Manage your living NFT flowers. Update moods, rename, and watch them evolve with the community.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {selectedNFT ? (
          /* NFT Detail View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Back Button */}
            <button
              onClick={() => setSelectedNFT(null)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Gallery
            </button>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Flower Display */}
              <div className="space-y-6">
                <div className="bg-gray-900/30 rounded-2xl p-8 border border-gray-700">
                  <h2 className="text-2xl font-semibold mb-4">{selectedNFT.name}</h2>
                  <FlowerArt
                    traits={selectedNFT.traits}
                    size={400}
                    interactive={true}
                  />
                </div>

                {/* Current Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-pink-400" />
                      <span className="text-sm text-gray-400">Current Mood</span>
                    </div>
                    <div className="text-xl font-semibold">
                      {['Devastated', 'Depressed', 'Sad', 'Disappointed', 'Neutral', 'Content', 'Happy', 'Excited', 'Elated', 'Euphoric'][selectedNFT.traits.mood - 1]}
                    </div>
                  </div>
                  <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-400">Trading Activity</span>
                    </div>
                    <div className="text-xl font-semibold">
                      {Math.round(selectedNFT.tradingActivity * 100)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls and History */}
              <div className="space-y-6">
                {/* Mood Update */}
                <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4">Update Mood</h3>
                  <AdvancedMoodSlider
                    value={selectedNFT.traits.mood}
                    onChange={(newMood) => handleMoodUpdate(selectedNFT, newMood)}
                    disabled={isUpdatingMood}
                    size="medium"
                  />
                  {isUpdatingMood && (
                    <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-400">
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        Updating mood on blockchain...
                      </div>
                    </div>
                  )}
                </div>

                {/* Rename */}
                <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4">Rename Flower</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Enter new name..."
                      className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={() => handleRename(selectedNFT)}
                      disabled={!newName.trim() || isRenaming}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                    >
                      {isRenaming ? 'Renaming...' : 'Rename'}
                    </button>
                  </div>
                </div>

                {/* Mood History */}
                <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Mood History
                  </h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {selectedNFT.moodHistory.slice().reverse().map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {['😢', '😔', '😞', '😕', '😐', '🙂', '😊', '😃', '🤩', '🥳'][entry.mood - 1]}
                          </span>
                          <div>
                            <div className="font-semibold">{entry.label}</div>
                            <div className="text-sm text-gray-400">
                              {new Date(entry.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Name History */}
                <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Edit3 className="w-5 h-5" />
                    Name History
                  </h3>
                  <div className="space-y-2">
                    {selectedNFT.nameHistory.slice().reverse().map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                        <span className="font-medium">{entry.name}</span>
                        <span className="text-sm text-gray-400">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Gallery Grid */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700 text-center">
                <div className="text-2xl font-bold text-purple-400">{mockNFTs.length}</div>
                <div className="text-sm text-gray-400">Flowers Owned</div>
              </div>
              <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700 text-center">
                <div className="text-2xl font-bold text-pink-400">
                  {Math.round(mockNFTs.reduce((sum, nft) => sum + nft.traits.mood, 0) / mockNFTs.length)}
                </div>
                <div className="text-sm text-gray-400">Avg Mood</div>
              </div>
              <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {mockNFTs.reduce((sum, nft) => sum + nft.moodHistory.length, 0)}
                </div>
                <div className="text-sm text-gray-400">Mood Updates</div>
              </div>
              <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700 text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {mockNFTs.reduce((sum, nft) => sum + nft.nameHistory.length, 0)}
                </div>
                <div className="text-sm text-gray-400">Name Changes</div>
              </div>
            </div>

            {/* NFT Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockNFTs.map((nft) => (
                <motion.div
                  key={nft.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-900/30 rounded-2xl p-6 border border-gray-700 cursor-pointer hover:border-purple-500/50 transition-all duration-200"
                  onClick={() => setSelectedNFT(nft)}
                >
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold mb-2">{nft.name}</h3>
                    <div className="text-sm text-gray-400">#{nft.id}</div>
                  </div>
                  
                  <div className="mb-4">
                    <FlowerArt
                      traits={nft.traits}
                      size={200}
                      interactive={false}
                    />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mood:</span>
                      <span className="text-white">
                        {['Devastated', 'Depressed', 'Sad', 'Disappointed', 'Neutral', 'Content', 'Happy', 'Excited', 'Elated', 'Euphoric'][nft.traits.mood - 1]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Petal Count:</span>
                      <span className="text-white">{nft.traits.petalCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Core Shape:</span>
                      <span className="text-white capitalize">Sunflower</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Updated:</span>
                      <span className="text-white">
                        {new Date(nft.lastMoodUpdate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Click to manage</span>
                      <span>→</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
