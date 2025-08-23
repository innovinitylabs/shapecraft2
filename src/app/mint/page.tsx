'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower, Sparkles, Heart, Zap } from 'lucide-react';
import MoodInput from '@/components/MoodInput';
import FlowerArt from '@/components/FlowerArt';
import { FlowerArtParameters } from '@/services/moodClassifierService';

export default function MintPage() {
  const [moodParams, setMoodParams] = useState<FlowerArtParameters | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mintStep, setMintStep] = useState<'input' | 'preview' | 'mint'>('input');

  const handleMoodAnalyzed = (params: FlowerArtParameters) => {
    setMoodParams(params);
    setMintStep('preview');
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleMint = () => {
    // TODO: Implement actual minting logic
    setMintStep('mint');
    console.log('Minting with params:', moodParams);
  };

  const handleBackToInput = () => {
    setMintStep('input');
    setMoodParams(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      
      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Mint Your Living Flower
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Describe your mood and watch as AI creates a unique, living NFT flower that reflects your emotions
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Side - Mood Input & Preview */}
            <div className="space-y-8">
              <AnimatePresence mode="wait">
                {mintStep === 'input' && (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <MoodInput
                      onMoodAnalyzed={handleMoodAnalyzed}
                      onLoadingChange={handleLoadingChange}
                    />
                  </motion.div>
                )}

                {mintStep === 'preview' && moodParams && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    {/* Mood Analysis Results */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <Sparkles className="mr-2" />
                        Mood Analysis Results
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-white/60 text-sm">Emotion</p>
                          <p className="text-white font-medium capitalize">{moodParams.currentEmotion}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-white/60 text-sm">Confidence</p>
                          <p className="text-white font-medium">{moodParams.confidencePercentage.toFixed(1)}%</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-white/60 text-sm">Heartbeat</p>
                          <p className="text-white font-medium">{moodParams.heartbeatSettings.bpm} BPM</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-white/60 text-sm">Petal Count</p>
                          <p className="text-white font-medium">{moodParams.petalParams.petalCount}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button
                        onClick={handleBackToInput}
                        className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors border border-white/20"
                      >
                        Back to Input
                      </button>
                      <button
                        onClick={handleMint}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      >
                        <Zap size={18} />
                        <span>Mint NFT</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {mintStep === 'mint' && (
                  <motion.div
                    key="mint"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="text-green-400" size={32} />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Minting Your Flower...
                      </h3>
                      <p className="text-white/70">
                        Your unique living flower NFT is being created on the blockchain
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side - Flower Preview */}
            <div className="relative">
              <div className="sticky top-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Flower className="mr-2" />
                    Flower Preview
                  </h3>
                  
                  <div className="relative h-96 bg-black/20 rounded-xl overflow-hidden">
                    {moodParams ? (
                      <FlowerArt
                        emotion={moodParams.currentEmotion}
                        petalCount={moodParams.petalParams.petalCount}
                        layerCount={moodParams.petalParams.layerCount}
                        heartbeatBPM={moodParams.heartbeatSettings.bpm}
                        heartbeatIntensity={moodParams.heartbeatSettings.intensity}
                        rotationSpeed={moodParams.moodSettings.intensity}
                        rotationDirection={moodParams.moodSettings.direction}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-white/50">
                          <Flower size={48} className="mx-auto mb-4 opacity-50" />
                          <p>Your flower will appear here</p>
                          <p className="text-sm">Describe your mood to generate a unique flower</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Analyzing Your Mood...
              </h3>
              <p className="text-white/70">
                Our AI is understanding your emotions and creating your unique flower
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
