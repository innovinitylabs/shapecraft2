'use client';

import React from 'react';
import { FlowerArtParameters } from '@/services/moodClassifierService';

interface FlowerArtProps {
  parameters: FlowerArtParameters;
  size?: number;
  className?: string;
}

export default function FlowerArt({ parameters, size = 400, className = '' }: FlowerArtProps) {
  // Get emotion color based on the emotion
  const getEmotionColor = (emotion: string) => {
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
    return emotionColors[emotion.toLowerCase()] || '#FFD700';
  };

  const emotionColor = getEmotionColor(parameters.emotion);
  const confidencePercentage = (parameters.confidence * 100).toFixed(1);

  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Flower Art Placeholder */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative">
          {/* Flower Petals */}
          <div className="relative">
            {Array.from({ length: Math.min(8, Math.max(5, Math.round(parameters.confidence * 8))) }).map((_, i) => (
              <div
                key={i}
                className="absolute w-16 h-16 rounded-full opacity-80 animate-pulse"
                style={{
                  backgroundColor: emotionColor,
                  transform: `rotate(${i * (360 / Math.min(8, Math.max(5, Math.round(parameters.confidence * 8))))}deg) translateY(-40px)`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${2 + parameters.confidence}s`,
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

      {/* Emotion Info Overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium capitalize">{parameters.emotion}</div>
            <div className="text-xs opacity-80">{confidencePercentage}% confidence</div>
          </div>
          <div className="text-xs opacity-60">
            Entropy: {parameters.entropy.toFixed(1)}
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
