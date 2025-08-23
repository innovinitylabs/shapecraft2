'use client';

import { useEffect, useRef } from 'react';

interface FlowerTraits {
  // Core shape rarity
  coreShape: 'circle' | 'hexagon' | 'star' | 'spiral';
  // Mood-based traits
  mood: number; // 1-10 scale
  petalCount: number;
  petalShape: 'rounded' | 'sharp' | 'drooping';
  // Rarity traits
  ringCount: number;
  petalThickness: number;
  glowIntensity: number;
  // Collective traits
  collectiveMood: number;
  tradingActivity: number;
}

interface FlowerArtProps {
  traits: FlowerTraits;
  size?: number;
  interactive?: boolean;
  onMoodChange?: (mood: number) => void;
}

export default function FlowerArt({ 
  traits, 
  size = 300, 
  interactive = false,
  onMoodChange 
}: FlowerArtProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple fallback for now
    if (!containerRef.current) return;
    
    // Create a simple CSS-based flower visualization
    const container = containerRef.current;
    container.innerHTML = `
      <div style="
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle, rgba(${traits.mood * 25}, 50, ${traits.mood * 20}, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        position: relative;
      ">
        <div style="
          width: 60px;
          height: 60px;
          background: hsl(${traits.mood * 36}, 70%, 60%);
          border-radius: 50%;
          box-shadow: 0 0 20px hsl(${traits.mood * 36}, 70%, 60%);
        "></div>
        ${Array.from({ length: traits.petalCount }, (_, i) => `
          <div style="
            position: absolute;
            width: 40px;
            height: 80px;
            background: hsl(${traits.mood * 36}, 60%, 50%);
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            transform: rotate(${(i * 360) / traits.petalCount}deg) translateY(-50px);
            transform-origin: center bottom;
            opacity: 0.8;
          "></div>
        `).join('')}
      </div>
    `;
    
    if (interactive && onMoodChange) {
      container.addEventListener('click', () => {
        const newMood = Math.floor(Math.random() * 10) + 1;
        onMoodChange(newMood);
      });
    }
  }, [traits, size, interactive, onMoodChange]);

  return (
    <div 
      ref={containerRef} 
      className="relative cursor-pointer"
      style={{ width: size, height: size }}
    >
      {interactive && (
        <div className="absolute bottom-2 left-2 text-xs text-gray-400">
          Click to change mood
        </div>
      )}
    </div>
  );
}

// Utility function to generate random flower traits
export function generateFlowerTraits(tokenId: number): FlowerTraits {
  const seed = tokenId;
  const random = (min: number, max: number) => {
    const x = Math.sin(seed + min + max) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };

  const coreShapes: Array<'circle' | 'hexagon' | 'star' | 'spiral'> = ['circle', 'hexagon', 'star', 'spiral'];
  const petalShapes: Array<'rounded' | 'sharp' | 'drooping'> = ['rounded', 'sharp', 'drooping'];

  return {
    coreShape: coreShapes[Math.floor(random(0, 4))],
    mood: Math.floor(random(1, 11)),
    petalCount: Math.floor(random(5, 13)),
    petalShape: petalShapes[Math.floor(random(0, 3))],
    ringCount: Math.floor(random(2, 6)),
    petalThickness: random(0.5, 1.5),
    glowIntensity: random(0.3, 1.0),
    collectiveMood: random(1, 11),
    tradingActivity: random(0, 1)
  };
}