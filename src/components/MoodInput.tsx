'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { moodClassifierService, FlowerArtParameters } from '@/services/moodClassifierService';

interface MoodInputProps {
  onMoodAnalyzed: (params: FlowerArtParameters) => void;
  onLoadingChange: (loading: boolean) => void;
  className?: string;
}

export default function MoodInput({ onMoodAnalyzed, onLoadingChange, className = '' }: MoodInputProps) {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check API connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const healthy = await moodClassifierService.healthCheck();
      setIsConnected(healthy);
    } catch (error) {
      setIsConnected(false);
      console.error('API connection failed:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze your mood');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    onLoadingChange(true);

    try {
      const params = await moodClassifierService.analyzeMood({
        text: text.trim(),
        streakDays: 0, // Will be updated with actual streak data
        communityMood: 0.5, // Will be updated with actual community data
        tradingActivity: 0.5, // Will be updated with actual trading data
      });

      onMoodAnalyzed(params);
      
      // Show success feedback
      setText('');
    } catch (error) {
      setError('Failed to analyze mood. Please try again.');
      console.error('Mood analysis error:', error);
    } finally {
      setIsAnalyzing(false);
      onLoadingChange(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const getExampleMood = async () => {
    try {
      const example = await moodClassifierService.getExample();
      setText(example.example_request.text);
    } catch (error) {
      console.error('Failed to get example:', error);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Connection Status */}
      <div className="mb-4 flex items-center justify-center">
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
          isConnected 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{isConnected ? 'Mood Classifier Connected' : 'Mood Classifier Offline'}</span>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="mb-4">
          <label htmlFor="mood-text" className="block text-sm font-medium text-white/80 mb-2">
            How are you feeling today?
          </label>
          <textarea
            id="mood-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your mood... (e.g., 'I'm feeling really happy and excited today!')"
            className="w-full h-24 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            disabled={isAnalyzing || !isConnected}
          />
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={getExampleMood}
            disabled={isAnalyzing || !isConnected}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors disabled:opacity-50"
          >
            <Sparkles size={16} />
            <span>Try Example</span>
          </button>

          <motion.button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !isConnected || !text.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Analyze Mood</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-white/60 text-sm">
        <p>Describe your emotions and the AI will generate unique flower art parameters</p>
      </div>
    </div>
  );
}
