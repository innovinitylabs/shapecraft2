'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower, Heart, Edit3, Clock, Users, Zap } from 'lucide-react';
import Flower3D from '@/components/Flower3D';
import MoodSlider from '@/components/MoodSlider';

interface NFT {
  id: number;
  name: string;
  mood: number;
  traits: {
    coreShape: number;
    petalCount: number;
    ringLayers: number;
    glowIntensity: number;
    rarityTier: number;
  };
  moodHistory: Array<{ mood: number; timestamp: number }>;
  nameHistory: Array<{ name: string; timestamp: number }>;
  lastUpdated: number;
}

export default function GalleryPage() {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newName, setNewName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Mock NFT data with deterministic traits
  const mockNFTs: NFT[] = useMemo(() => [
    {
      id: 1,
      name: "Serenity Bloom",
      mood: 7,
      traits: { coreShape: 0, petalCount: 8, ringLayers: 3, glowIntensity: 7, rarityTier: 3 },
      moodHistory: [
        { mood: 5, timestamp: Date.now() - 86400000 * 7 },
        { mood: 6, timestamp: Date.now() - 86400000 * 5 },
        { mood: 8, timestamp: Date.now() - 86400000 * 2 },
        { mood: 7, timestamp: Date.now() }
      ],
      nameHistory: [
        { name: "Flower #1", timestamp: Date.now() - 86400000 * 10 },
        { name: "Serenity Bloom", timestamp: Date.now() - 86400000 * 3 }
      ],
      lastUpdated: Date.now() - 86400000 * 2
    },
    {
      id: 2,
      name: "Cosmic Dreamer",
      mood: 4,
      traits: { coreShape: 2, petalCount: 12, ringLayers: 4, glowIntensity: 9, rarityTier: 4 },
      moodHistory: [
        { mood: 3, timestamp: Date.now() - 86400000 * 14 },
        { mood: 5, timestamp: Date.now() - 86400000 * 10 },
        { mood: 4, timestamp: Date.now() }
      ],
      nameHistory: [
        { name: "Flower #2", timestamp: Date.now() - 86400000 * 15 },
        { name: "Cosmic Dreamer", timestamp: Date.now() - 86400000 * 7 }
      ],
      lastUpdated: Date.now()
    },
    {
      id: 3,
      name: "Ethereal Whisper",
      mood: 9,
      traits: { coreShape: 1, petalCount: 6, ringLayers: 2, glowIntensity: 5, rarityTier: 2 },
      moodHistory: [
        { mood: 8, timestamp: Date.now() - 86400000 * 3 },
        { mood: 9, timestamp: Date.now() }
      ],
      nameHistory: [
        { name: "Flower #3", timestamp: Date.now() - 86400000 * 5 },
        { name: "Ethereal Whisper", timestamp: Date.now() - 86400000 * 1 }
      ],
      lastUpdated: Date.now() - 86400000 * 1
    }
  ], []);

  const handleMoodUpdate = async (nftId: number, newMood: number) => {
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      const updatedNFTs = mockNFTs.map(nft => 
        nft.id === nftId 
          ? { ...nft, mood: newMood, lastUpdated: Date.now() }
          : nft
      );
      setSelectedNFT(updatedNFTs.find(nft => nft.id === nftId) || null);
      setIsUpdating(false);
    }, 1000);
  };

  const handleRename = async (nftId: number) => {
    if (!newName.trim()) return;
    
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      const updatedNFTs = mockNFTs.map(nft => 
        nft.id === nftId 
          ? { 
              ...nft, 
              name: newName, 
              nameHistory: [...nft.nameHistory, { name: newName, timestamp: Date.now() }]
            }
          : nft
      );
      setSelectedNFT(updatedNFTs.find(nft => nft.id === nftId) || null);
      setNewName('');
      setIsUpdating(false);
    }, 1000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <span className="gradient-text">Your Flower</span>
              <br />
              <span className="text-white">Collection</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Manage your living NFT flowers, update their moods, and watch them grow with your emotional journey.
            </p>
          </motion.div>

          {/* Wallet Connection */}
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
            >
              <div className="glass p-8 rounded-2xl max-w-md mx-auto">
                <h3 className="text-xl font-bold mb-4">Connect Your Wallet</h3>
                <p className="text-gray-300 mb-6">Connect your wallet to view and manage your NFT flowers.</p>
                <button
                  onClick={() => setIsConnected(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  Connect Wallet
                </button>
              </div>
            </motion.div>
          )}

          {/* NFT Grid */}
          {isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {mockNFTs.map((nft, index) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 * index }}
                  className="glass p-6 rounded-2xl cursor-pointer hover:bg-white/5 transition-all duration-300"
                  onClick={() => setSelectedNFT(nft)}
                >
                  <div className="h-48 mb-4">
                    <Flower3D 
                      mood={nft.mood} 
                      traits={nft.traits} 
                      isInteractive={false}
                      size={1}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{nft.name}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-300">
                    <span>Mood: {nft.mood}/10</span>
                    <span>Rarity: {nft.traits.rarityTier}/5</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Last updated: {formatDate(nft.lastUpdated)}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* NFT Detail Modal */}
      <AnimatePresence>
        {selectedNFT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedNFT(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass p-8 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - Flower Display */}
                <div>
                  <h2 className="text-3xl font-bold mb-6">{selectedNFT.name}</h2>
                  <div className="h-80 mb-6">
                    <Flower3D 
                      mood={selectedNFT.mood} 
                      traits={selectedNFT.traits} 
                      isInteractive={true}
                      size={1.5}
                    />
                  </div>
                  
                  {/* Traits */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Flower Type</div>
                      <div className="font-semibold">{['Sunflower', 'Rose', 'Daisy', 'Lotus'][selectedNFT.traits.coreShape]}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Petal Count</div>
                      <div className="font-semibold">{selectedNFT.traits.petalCount}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Ring Layers</div>
                      <div className="font-semibold">{selectedNFT.traits.ringLayers}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Rarity Tier</div>
                      <div className="font-semibold">{selectedNFT.traits.rarityTier}/5</div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Interactions */}
                <div className="space-y-6">
                  {/* Mood Update */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Update Mood
                    </h3>
                    <MoodSlider 
                      value={selectedNFT.mood} 
                      onChange={(newMood) => handleMoodUpdate(selectedNFT.id, newMood)}
                      disabled={isUpdating}
                      size="sm"
                    />
                  </div>

                  {/* Rename */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Edit3 className="w-5 h-5" />
                      Rename Flower
                    </h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Enter new name..."
                        className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                      />
                      <button
                        onClick={() => handleRename(selectedNFT.id)}
                        disabled={!newName.trim() || isUpdating}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
                      >
                        Rename
                      </button>
                    </div>
                  </div>

                  {/* Mood History */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Mood History
                    </h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedNFT.moodHistory.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>Mood {entry.mood}/10</span>
                          <span className="text-gray-400">{formatDate(entry.timestamp)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Name History */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Edit3 className="w-5 h-5" />
                      Name History
                    </h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedNFT.nameHistory.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>{entry.name}</span>
                          <span className="text-gray-400">{formatDate(entry.timestamp)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gas Back Info */}
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
                      <Zap className="w-4 h-4" />
                      Gas Back Available
                    </div>
                    <p className="text-sm text-gray-300">
                      You'll receive 50% gas back for mood updates and renaming!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
