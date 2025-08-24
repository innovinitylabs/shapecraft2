'use client';

import React from 'react';
import { FlowerArtParameters } from '@/services/moodClassifierService';

interface FlowerArtProps {
  parameters?: FlowerArtParameters;
  traits?: {
    mood: number;
    petalCount: number;
    color: string;
    size: number;
    animation: string;
    collectiveMood?: number;
    tradingActivity?: number;
  };
  size?: number;
  className?: string;
  interactive?: boolean;
}

// Generate flower traits based on seed (for deterministic generation)
export function generateFlowerTraits(seed: number) {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
  const animations = ['pulse', 'bounce', 'spin', 'wiggle'];
  
  return {
    mood: (seed % 10) + 1, // 1-10 mood scale
    petalCount: (seed % 8) + 5, // 5-12 petals
    color: colors[seed % colors.length],
    size: (seed % 3) + 1, // 1-3 size scale
    animation: animations[seed % animations.length],
  };
}

export default function FlowerArt({ 
  parameters, 
  traits, 
  size = 400, 
  className = '', 
  interactive = false 
}: FlowerArtProps) {
  // Use parameters if available (new contract-based), otherwise use traits (legacy)
  const isNewFormat = !!parameters;
  
  // Get emotion color based on the emotion or mood
  const getEmotionColor = (emotionOrMood: string | number) => {
    if (typeof emotionOrMood === 'number') {
      // Legacy mood-based colors (1-10 scale)
      const moodColors = [
        '#FF6B6B', // 1 - Devastated
        '#FF8E8E', // 2 - Depressed
        '#4A90E2', // 3 - Sad
        '#6BA5E8', // 4 - Disappointed
        '#808080', // 5 - Neutral
        '#98D8C8', // 6 - Content
        '#FFD700', // 7 - Happy
        '#FF69B4', // 8 - Excited
        '#FFB6C1', // 9 - Elated
        '#FF1493', // 10 - Euphoric
      ];
      return moodColors[emotionOrMood - 1] || '#FFD700';
    } else {
      // New emotion-based colors
      const emotionColors: Record<string, string> = {
        happy: '#FFD700', // Gold
        joy: '#FF6B6B',   // Red
        sad: '#4A90E2',   // Blue
        fear: '#8B4513',  // Brown
        anger: '#FF4500', // Orange Red
        disgust: '#32CD32', // Lime Green
        shame: '#9370DB', // Medium Purple
        surprise: '#FF69B4', // Hot Pink
        neutral: '#808080', // Gray
      };
      return emotionColors[emotionOrMood.toLowerCase()] || '#FFD700';
    }
  };

  const emotionColor = isNewFormat 
    ? getEmotionColor(parameters?.emotion || 'neutral')
    : getEmotionColor(traits?.mood || 5);
  
  const confidencePercentage = isNewFormat 
    ? (typeof parameters?.confidence === 'number' ? (parameters!.confidence * 100).toFixed(1) : '0.0')
    : '100';

  const petalCount = isNewFormat 
    ? Math.min(8, Math.max(5, Math.round((parameters?.confidence || 0.5) * 8)))
    : (traits?.petalCount || 7);

  return (
    <div 
      className={`relative ${className} ${interactive ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
      style={{ width: size, height: size }}
    >
      {/* Flower Art */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative">
          {/* Flower Petals */}
          <div className="relative">
            {Array.from({ length: petalCount }).map((_, i) => (
              <div
                key={i}
                className="absolute w-16 h-16 rounded-full opacity-80 animate-pulse"
                style={{ 
                  backgroundColor: emotionColor,
                  transform: `rotate(${i * (360 / petalCount)}deg) translateY(-40px)`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${2 + (isNewFormat ? parameters!.confidence : 0.5)}s`,
                }}
              />
            ))}
          </div>
          
          {/* Flower Center */}
          <div 
            className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ backgroundColor: emotionColor }}
          />
        </div>
      </div>

      {/* Info Overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">
              {isNewFormat 
                ? (parameters?.emotion ? parameters.emotion.charAt(0).toUpperCase() + parameters.emotion.slice(1) : 'Neutral')
                : ['Devastated', 'Depressed', 'Sad', 'Disappointed', 'Neutral', 'Content', 'Happy', 'Excited', 'Elated', 'Euphoric'][(traits?.mood || 5) - 1]
              }
            </div>
            <div className="text-xs opacity-80">
              {isNewFormat ? `${confidencePercentage}% confidence` : `${traits?.petalCount || 7} petals`}
            </div>
          </div>
          <div className="text-xs opacity-60">
            {isNewFormat 
              ? `Entropy: ${typeof parameters?.entropy === 'number' ? parameters.entropy.toFixed(1) : '0.0'}`
              : `Size: ${traits?.size || 2}`
            }
          </div>
        </div>
      </div>

      {/* Animation Indicator */}
      <div className="absolute top-4 right-4">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
