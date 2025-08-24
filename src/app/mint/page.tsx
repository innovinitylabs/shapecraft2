'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower, Sparkles, Heart, Zap, Code, Eye, EyeOff, Wallet, Clock, AlertCircle } from 'lucide-react';
import MoodInput from '@/components/MoodInput';
import FlowerArt from '@/components/FlowerArt';
import { FlowerArtParameters } from '@/services/moodClassifierService';
import { useShapeL2FlowerContract } from '@/services/contractService';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'react-hot-toast';

export default function MintPage() {
  const [moodParams, setMoodParams] = useState<FlowerArtParameters | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mintStep, setMintStep] = useState<'input' | 'preview' | 'mint'>('input');
  const [showRawData, setShowRawData] = useState(false);
  const [userText, setUserText] = useState('');

  const {
    address,
    isConnected,
    isLoading: contractLoading,
    error: contractError,
    balance,
    currentMintPrice,
    userMoodHistory,
    canRecordMood,
    getTimeUntilNextMood,
    mintNewFlower,
    recordMoodForNFT,
    convertMoodClassifierToContractParams,
    isMinting,
    isMintSuccess,
    isRecording,
    isRecordSuccess,
  } = useShapeL2FlowerContract();

  const handleMoodAnalyzed = (params: FlowerArtParameters) => {
    setMoodParams(params);
    setMintStep('preview');
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleMint = async () => {
    if (!moodParams) return;

    try {
      // Convert mood classifier response to contract params
      const contractParams = convertMoodClassifierToContractParams({
        emotion: moodParams.emotion,
        confidence: moodParams.confidence,
        probabilities: moodParams.probabilities,
        entropy: moodParams.entropy,
        gap: moodParams.gap,
      });

      // Mint the flower NFT
      await mintNewFlower(contractParams);
      
      toast.success('Minting your flower NFT...');
      setMintStep('mint');
    } catch (error) {
      toast.error('Failed to mint flower NFT');
      console.error('Mint error:', error);
    }
  };

  const handleRecordMood = async () => {
    if (!moodParams || !userMoodHistory) return;

    try {
      // Get the user's NFT ID (assuming they have one)
      const nftId = userMoodHistory[3] > 0 ? 1 : 1; // For now, use 1 as default

      const contractParams = convertMoodClassifierToContractParams({
        emotion: moodParams.emotion,
        confidence: moodParams.confidence,
        probabilities: moodParams.probabilities,
        entropy: moodParams.entropy,
        gap: moodParams.gap,
      });

      await recordMoodForNFT({
        ...contractParams,
        nftId,
      });

      toast.success('Recording your mood...');
    } catch (error) {
      toast.error('Failed to record mood');
      console.error('Record mood error:', error);
    }
  };

  const handleBackToInput = () => {
    setMintStep('input');
    setMoodParams(null);
  };

  // Handle mint success
  useEffect(() => {
    if (isMintSuccess) {
      toast.success('Flower NFT minted successfully! 🎉');
      setMintStep('input');
      setMoodParams(null);
    }
  }, [isMintSuccess]);

  // Handle record success
  useEffect(() => {
    if (isRecordSuccess) {
      toast.success('Mood recorded successfully! 🌸');
      setMintStep('input');
      setMoodParams(null);
    }
  }, [isRecordSuccess]);

  // Handle contract errors
  useEffect(() => {
    if (contractError) {
      toast.error(contractError);
    }
  }, [contractError]);

  const formatPrice = (price: bigint | undefined) => {
    if (!price) return '0 ETH';
    return `${Number(price) / 1e18} ETH`;
  };

  const formatBalance = (balance: bigint | undefined) => {
    if (!balance) return '0 ETH';
    return `${Number(balance) / 1e18} ETH`;
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

      {/* Wallet Connection */}
      <div className="relative z-10 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </div>

      {/* Wallet Info */}
      {isConnected && (
        <div className="relative z-10 mb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/80">Balance</div>
                  <div className="font-medium">{formatBalance(balance?.value)}</div>
                </div>
              </div>
              
              {currentMintPrice && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2">
                      <Flower className="w-5 h-5" />
                      <span className="text-sm">Mint Price</span>
                    </div>
                    <div className="font-medium">{formatPrice(currentMintPrice)}</div>
                  </div>
                </div>
              )}

              {/* 24h Mood Recording Status */}
              {userMoodHistory && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span className="text-sm">Next Mood</span>
                    </div>
                    <div className={`font-medium ${canRecordMood() ? 'text-green-400' : 'text-yellow-400'}`}>
                      {canRecordMood() ? 'Ready' : getTimeUntilNextMood()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                    {!isConnected ? (
                      <div className="text-center py-12">
                        <AlertCircle className="w-16 h-16 text-white/60 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-white mb-2">
                          Connect Your Wallet
                        </h3>
                        <p className="text-white/80 mb-6">
                          Please connect your wallet to mint your living flower NFT
                        </p>
                        <ConnectButton />
                      </div>
                    ) : (
                                             <MoodInput
                         onMoodAnalyzed={handleMoodAnalyzed}
                         onLoadingChange={handleLoadingChange}
                       />
                    )}
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
                          <p className="text-white font-medium capitalize">{moodParams.emotion}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-white/60 text-sm">Confidence</p>
                          <p className="text-white font-medium">{(moodParams.confidence * 100).toFixed(1)}%</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-white/60 text-sm">Entropy</p>
                          <p className="text-white font-medium">{moodParams.entropy.toFixed(1)}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-white/60 text-sm">Gap</p>
                          <p className="text-white font-medium">{moodParams.gap.toFixed(1)}</p>
                        </div>
                      </div>

                      {/* Raw Data Toggle */}
                      <div className="mt-4">
                        <button
                          onClick={() => setShowRawData(!showRawData)}
                          className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                        >
                          {showRawData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span className="text-sm">
                            {showRawData ? 'Hide' : 'Show'} Raw API Data
                          </span>
                        </button>
                        
                        {showRawData && (
                          <div className="mt-3 p-3 bg-black/20 rounded-lg">
                            <pre className="text-xs text-white/80 overflow-x-auto">
                              {JSON.stringify(moodParams, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Flower Preview */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <Flower className="mr-2" />
                        Your Flower Preview
                      </h3>
                      <div className="flex justify-center">
                        <FlowerArt parameters={moodParams} />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={handleBackToInput}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      >
                        Back to Input
                      </button>
                      
                                             {userMoodHistory && userMoodHistory[3] > 0 ? (
                        <button
                          onClick={handleRecordMood}
                          disabled={!canRecordMood() || isRecording || contractLoading}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
                        >
                          {isRecording ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Recording...</span>
                            </>
                          ) : (
                            <>
                              <Heart className="w-4 h-4" />
                              <span>Record Mood</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={handleMint}
                          disabled={isMinting || contractLoading}
                          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
                        >
                          {isMinting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Minting...</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4" />
                              <span>Mint Flower NFT</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {mintStep === 'mint' && (
                  <motion.div
                    key="mint"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      Minting Your Flower NFT
                    </h3>
                    <p className="text-white/80">
                      Please wait while your transaction is being processed...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
