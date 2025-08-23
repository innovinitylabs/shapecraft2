'use client';

interface Flower3DProps {
  mood: number; // 1-10
  traits: {
    coreShape: number; // 0-3
    petalCount: number; // 5-15
    ringLayers: number; // 1-5
    glowIntensity: number; // 1-10
    rarityTier: number; // 1-5
  };
  isInteractive?: boolean;
  size?: number;
}

// Get mood color
const getMoodColor = (mood: number): string => {
  if (mood <= 2) return '#4A90E2'; // Blue - Sad
  if (mood <= 4) return '#7ED321'; // Green - Calm
  if (mood <= 6) return '#F5A623'; // Orange - Neutral
  if (mood <= 8) return '#FF6B6B'; // Red - Excited
  return '#FFD700'; // Gold - Joy
};

// Get shape name
const getShapeName = (shapeType: number): string => {
  switch (shapeType) {
    case 0: return 'Circle';
    case 1: return 'Hexagon';
    case 2: return 'Star';
    case 3: return 'Spiral';
    default: return 'Circle';
  }
};

export default function Flower3D({ mood, traits, isInteractive = true, size = 1 }: Flower3DProps) {
  const moodColor = getMoodColor(mood);
  const shapeName = getShapeName(traits.coreShape);
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse"
          style={{ 
            backgroundColor: moodColor,
            animationDuration: `${2 + mood * 0.2}s`
          }}
        />
        
        {/* Main flower */}
        <div className="relative z-10">
          {/* Petals */}
          <div className="relative w-32 h-32">
            {Array.from({ length: traits.petalCount }).map((_, i) => {
              const angle = (i / traits.petalCount) * 360;
              const radius = 60 + (mood * 2) + (traits.rarityTier * 3);
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              
              return (
                <div
                  key={i}
                  className="absolute w-4 h-4 rounded-full animate-bounce"
                  style={{
                    backgroundColor: moodColor,
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${1 + mood * 0.1}s`
                  }}
                />
              );
            })}
          </div>
          
          {/* Core shape */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ 
                backgroundColor: moodColor,
                boxShadow: `0 0 20px ${moodColor}40`
              }}
            >
              {shapeName}
            </div>
          </div>
        </div>
        
        {/* Ring layers */}
        {Array.from({ length: traits.ringLayers }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 border-2 rounded-full animate-spin"
            style={{
              borderColor: moodColor,
              opacity: 0.3 - (i * 0.1),
              animationDuration: `${10 + i * 2}s`,
              animationDirection: i % 2 === 0 ? 'normal' : 'reverse'
            }}
          />
        ))}
      </div>
    </div>
  );
}
