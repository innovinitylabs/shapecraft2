'use client';

import React, { useState } from 'react';
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
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Mood Input & Preview */}
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

                    {/* Dev Container - All Mood Classifier Values */}
                    <div className="bg-red-900/20 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30">
                      <h3 className="text-xl font-semibold text-red-300 mb-4 flex items-center">
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs mr-2">DEV</span>
                        Mood Classifier Parameters
                      </h3>
                      
                      <div className="space-y-6 text-xs">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-red-900/30 rounded p-2">
                            <p className="text-red-300/60">Current Emotion</p>
                            <p className="text-red-200 font-mono">{moodParams.currentEmotion}</p>
                          </div>
                          <div className="bg-red-900/30 rounded p-2">
                            <p className="text-red-300/60">Confidence</p>
                            <p className="text-red-200 font-mono">{moodParams.confidence.toFixed(3)}</p>
                          </div>
                          <div className="bg-red-900/30 rounded p-2">
                            <p className="text-red-300/60">Confidence %</p>
                            <p className="text-red-200 font-mono">{moodParams.confidencePercentage.toFixed(1)}%</p>
                          </div>
                          <div className="bg-red-900/30 rounded p-2">
                            <p className="text-red-300/60">Mood Intensity</p>
                            <p className="text-red-200 font-mono">{moodParams.moodSettings.intensity}</p>
                          </div>
                        </div>

                        {/* Petal Parameters */}
                        <div className="bg-red-900/20 rounded p-3">
                          <h4 className="text-red-300 font-semibold mb-2">Petal Parameters</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div><span className="text-red-300/60">Layer Count:</span> <span className="text-red-200 font-mono">{moodParams.petalParams.layerCount}</span></div>
                            <div><span className="text-red-300/60">Petal Count:</span> <span className="text-red-200 font-mono">{moodParams.petalParams.petalCount}</span></div>
                            <div><span className="text-red-300/60">Base Radius:</span> <span className="text-red-200 font-mono">{moodParams.petalParams.baseLayerRadius}</span></div>
                            <div><span className="text-red-300/60">Radius Decrease:</span> <span className="text-red-200 font-mono">{moodParams.petalParams.layerRadiusDecrease}</span></div>
                            <div><span className="text-red-300/60">Petal Rotation:</span> <span className="text-red-200 font-mono">{moodParams.petalParams.petalRotation}</span></div>
                            <div><span className="text-red-300/60">Geometry Segments:</span> <span className="text-red-200 font-mono">{moodParams.petalParams.geometrySegments}</span></div>
                          </div>
                          <div className="mt-2">
                            <span className="text-red-300/60">Layer Rotations:</span> <span className="text-red-200 font-mono">[{moodParams.petalParams.layerRotations.join(', ')}]</span>
                          </div>
                          <div className="mt-1">
                            <span className="text-red-300/60">Layer Offsets:</span> <span className="text-red-200 font-mono">[{moodParams.petalParams.layerOffsets.join(', ')}]</span>
                          </div>
                        </div>

                        {/* Heartbeat Settings */}
                        <div className="bg-red-900/20 rounded p-3">
                          <h4 className="text-red-300 font-semibold mb-2">Heartbeat Settings</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div><span className="text-red-300/60">BPM:</span> <span className="text-red-200 font-mono">{moodParams.heartbeatSettings.bpm}</span></div>
                            <div><span className="text-red-300/60">Intensity:</span> <span className="text-red-200 font-mono">{moodParams.heartbeatSettings.intensity}</span></div>
                            <div><span className="text-red-300/60">Pulse Rate:</span> <span className="text-red-200 font-mono">{moodParams.heartbeatParams.pulseUpdateRate}</span></div>
                            <div><span className="text-red-300/60">Dual Pulse:</span> <span className="text-red-200 font-mono">{moodParams.heartbeatParams.dualPulseEnabled ? 'Yes' : 'No'}</span></div>
                            <div><span className="text-red-300/60">Secondary Intensity:</span> <span className="text-red-200 font-mono">{moodParams.heartbeatParams.secondaryPulseIntensity}</span></div>
                            <div><span className="text-red-300/60">Glow Range:</span> <span className="text-red-200 font-mono">{moodParams.heartbeatParams.glowIntensityRange.min}-{moodParams.heartbeatParams.glowIntensityRange.max}</span></div>
                          </div>
                        </div>

                        {/* Rotation Parameters */}
                        <div className="bg-red-900/20 rounded p-3">
                          <h4 className="text-red-300 font-semibold mb-2">Rotation Parameters</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div><span className="text-red-300/60">Update Rate:</span> <span className="text-red-200 font-mono">{moodParams.rotationParams.rotationUpdateRate}</span></div>
                            <div><span className="text-red-300/60">Alternating:</span> <span className="text-red-200 font-mono">{moodParams.rotationParams.alternatingEnabled ? 'Yes' : 'No'}</span></div>
                            <div><span className="text-red-300/60">Individual Layer:</span> <span className="text-red-200 font-mono">{moodParams.rotationParams.individualLayerRotation ? 'Yes' : 'No'}</span></div>
                            <div><span className="text-red-300/60">Direction:</span> <span className="text-red-200 font-mono">{moodParams.moodSettings.direction === 1 ? 'Clockwise' : 'Counter'}</span></div>
                            <div><span className="text-red-300/60">Intensity Range:</span> <span className="text-red-200 font-mono">{moodParams.rotationParams.rotationIntensityRange.min}-{moodParams.rotationParams.rotationIntensityRange.max}</span></div>
                          </div>
                        </div>

                        {/* Stalk Parameters */}
                        <div className="bg-red-900/20 rounded p-3">
                          <h4 className="text-red-300 font-semibold mb-2">Stalk Parameters</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div><span className="text-red-300/60">Base Length:</span> <span className="text-red-200 font-mono">{moodParams.stalkParams.baseLength}</span></div>
                            <div><span className="text-red-300/60">Min Length:</span> <span className="text-red-200 font-mono">{moodParams.stalkParams.minLength}</span></div>
                            <div><span className="text-red-300/60">Max Length:</span> <span className="text-red-200 font-mono">{moodParams.stalkParams.maxLength}</span></div>
                            <div><span className="text-red-300/60">Current Length:</span> <span className="text-red-200 font-mono">{moodParams.stalkParams.currentLength}</span></div>
                            <div><span className="text-red-300/60">Growth Speed:</span> <span className="text-red-200 font-mono">{moodParams.stalkParams.growthSpeed}</span></div>
                            <div><span className="text-red-300/60">Decay Speed:</span> <span className="text-red-200 font-mono">{moodParams.stalkParams.decaySpeed}</span></div>
                          </div>
                        </div>

                        {/* Bee Parameters */}
                        <div className="bg-red-900/20 rounded p-3">
                          <h4 className="text-red-300 font-semibold mb-2">Bee Parameters</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div><span className="text-red-300/60">Base Scale:</span> <span className="text-red-200 font-mono">{moodParams.beeParams.baseScale}</span></div>
                            <div><span className="text-red-300/60">Wing Speed:</span> <span className="text-red-200 font-mono">{moodParams.beeParams.wingSpeed}</span></div>
                            <div><span className="text-red-300/60">Should Appear:</span> <span className="text-red-200 font-mono">{moodParams.beeParams.shouldAppear ? 'Yes' : 'No'}</span></div>
                            <div><span className="text-red-300/60">Position:</span> <span className="text-red-200 font-mono">({moodParams.beeParams.basePosition.x.toFixed(1)}, {moodParams.beeParams.basePosition.y.toFixed(1)}, {moodParams.beeParams.basePosition.z.toFixed(1)})</span></div>
                          </div>
                        </div>

                        {/* Streak Parameters */}
                        <div className="bg-red-900/20 rounded p-3">
                          <h4 className="text-red-300 font-semibold mb-2">Streak Parameters</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div><span className="text-red-300/60">Current Streak:</span> <span className="text-red-200 font-mono">{moodParams.streakParams.currentStreakDays} days</span></div>
                            <div><span className="text-red-300/60">Max Streak:</span> <span className="text-red-200 font-mono">{moodParams.streakParams.maxStreakDays} days</span></div>
                            <div><span className="text-red-300/60">Decay Rate:</span> <span className="text-red-200 font-mono">{moodParams.streakParams.streakDecayRate}</span></div>
                            <div><span className="text-red-300/60">Multiplier:</span> <span className="text-red-200 font-mono">{moodParams.streakParams.streakMultiplier}</span></div>
                          </div>
                          <div className="mt-2">
                            <span className="text-red-300/60">Streak Features:</span>
                            <div className="grid grid-cols-2 gap-1 mt-1">
                              <span className="text-red-200 font-mono">Bee Appearance: {moodParams.streakParams.streakFeatures.beeAppearance ? 'Yes' : 'No'}</span>
                              <span className="text-red-200 font-mono">Bee Range: {moodParams.streakParams.streakFeatures.beeRangeControl ? 'Yes' : 'No'}</span>
                              <span className="text-red-200 font-mono">Stalk Growth: {moodParams.streakParams.streakFeatures.stalkGrowth ? 'Yes' : 'No'}</span>
                              <span className="text-red-200 font-mono">Glow Intensity: {moodParams.streakParams.streakFeatures.glowIntensity ? 'Yes' : 'No'}</span>
                            </div>
                          </div>
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

            {/* Flower Canvas - Full Screen */}
            <div className="relative h-[800px] bg-black rounded-xl overflow-hidden flex items-center justify-center">
              {moodParams ? (
                <FlowerArt
                  moodParams={moodParams}
                  size={800}
                  className=""
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white/50">
                    <Flower size={64} className="mx-auto mb-6 opacity-50" />
                    <p className="text-lg mb-2">Your flower will appear here</p>
                    <p className="text-sm">Describe your mood to generate a unique flower</p>
                  </div>
                </div>
              )}
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
