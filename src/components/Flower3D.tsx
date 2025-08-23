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

// Get mood color palette
const getMoodColors = (mood: number) => {
  if (mood <= 2) return { primary: '#4A90E2', secondary: '#2E5BBA', accent: '#1E3A8A' }; // Blue - Sad
  if (mood <= 4) return { primary: '#7ED321', secondary: '#5CB85C', accent: '#4CAF50' }; // Green - Calm
  if (mood <= 6) return { primary: '#F5A623', secondary: '#FF8C00', accent: '#FF6B35' }; // Orange - Neutral
  if (mood <= 8) return { primary: '#FF6B6B', secondary: '#E74C3C', accent: '#C0392B' }; // Red - Excited
  return { primary: '#FFD700', secondary: '#FFA500', accent: '#FF8C00' }; // Gold - Joy
};

// Get flower type based on core shape
const getFlowerType = (shapeType: number): string => {
  switch (shapeType) {
    case 0: return 'Sunflower';
    case 1: return 'Rose';
    case 2: return 'Daisy';
    case 3: return 'Lotus';
    default: return 'Sunflower';
  }
};

// Helper function to round CSS values to avoid hydration mismatches
const roundCSS = (value: number): number => {
  return Math.round(value * 100) / 100;
};

export default function Flower3D({ mood, traits, size = 1 }: Flower3DProps) {
  const colors = getMoodColors(mood);
  const flowerType = getFlowerType(traits.coreShape);
  const petalSize = 20 + (mood * 2) + (traits.rarityTier * 3);
  const stemHeight = 80 + (mood * 3);
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative" style={{ transform: `scale(${size})` }}>
        {/* Stem */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div 
            className="w-3 rounded-full"
            style={{ 
              height: `${stemHeight}px`,
              background: `linear-gradient(to top, #2D5016, #4A7C59)`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          />
          {/* Stem leaves */}
          <div className="absolute left-1/2 transform -translate-x-1/2" style={{ top: '60%' }}>
            <div 
              className="w-8 h-4 rounded-full transform rotate-45"
              style={{ 
                background: `linear-gradient(45deg, #4A7C59, #6B8E23)`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2" style={{ top: '40%' }}>
            <div 
              className="w-6 h-3 rounded-full transform -rotate-45"
              style={{ 
                background: `linear-gradient(-45deg, #4A7C59, #6B8E23)`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
          </div>
        </div>

        {/* Flower Center */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2" style={{ bottom: `${stemHeight}px` }}>
          {/* Main flower structure */}
          <div className="relative">
            
            {/* Petals Layer 1 - Outer petals */}
            <div className="relative">
              {Array.from({ length: traits.petalCount }).map((_, i) => {
                const angle = (i / traits.petalCount) * 360;
                const radius = petalSize + 10;
                const x = roundCSS(Math.cos((angle * Math.PI) / 180) * radius);
                const y = roundCSS(Math.sin((angle * Math.PI) / 180) * radius);
                
                return (
                  <div
                    key={`outer-${i}`}
                    className="absolute animate-float"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${roundCSS(i * 0.1)}s`,
                      animationDuration: `${roundCSS(3 + mood * 0.2)}s`
                    }}
                  >
                    {/* Petal shape */}
                    <div 
                      className="w-8 h-12 rounded-full transform rotate-12"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        boxShadow: `0 4px 12px ${colors.primary}40`,
                        filter: 'blur(0.5px)'
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Petals Layer 2 - Middle petals */}
            <div className="relative">
              {Array.from({ length: Math.floor(traits.petalCount * 0.7) }).map((_, i) => {
                const angle = (i / Math.floor(traits.petalCount * 0.7)) * 360 + 15;
                const radius = petalSize - 5;
                const x = roundCSS(Math.cos((angle * Math.PI) / 180) * radius);
                const y = roundCSS(Math.sin((angle * Math.PI) / 180) * radius);
                
                return (
                  <div
                    key={`middle-${i}`}
                    className="absolute animate-float"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${roundCSS(i * 0.15)}s`,
                      animationDuration: `${roundCSS(2.5 + mood * 0.2)}s`
                    }}
                  >
                    <div 
                      className="w-6 h-10 rounded-full transform rotate-6"
                      style={{
                        background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent})`,
                        boxShadow: `0 3px 8px ${colors.secondary}40`
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Petals Layer 3 - Inner petals */}
            <div className="relative">
              {Array.from({ length: Math.floor(traits.petalCount * 0.4) }).map((_, i) => {
                const angle = (i / Math.floor(traits.petalCount * 0.4)) * 360 + 30;
                const radius = petalSize - 15;
                const x = roundCSS(Math.cos((angle * Math.PI) / 180) * radius);
                const y = roundCSS(Math.sin((angle * Math.PI) / 180) * radius);
                
                return (
                  <div
                    key={`inner-${i}`}
                    className="absolute animate-float"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${roundCSS(i * 0.2)}s`,
                      animationDuration: `${roundCSS(2 + mood * 0.2)}s`
                    }}
                  >
                    <div 
                      className="w-4 h-8 rounded-full transform rotate-3"
                      style={{
                        background: `linear-gradient(135deg, ${colors.accent}, ${colors.primary})`,
                        boxShadow: `0 2px 6px ${colors.accent}40`
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Flower Center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Center glow */}
                <div 
                  className="absolute inset-0 rounded-full blur-lg animate-pulse"
                  style={{ 
                    backgroundColor: colors.primary,
                    animationDuration: `${roundCSS(2 + mood * 0.3)}s`
                  }}
                />
                
                {/* Main center */}
                <div
                  className="relative w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs border-2"
                  style={{ 
                    background: `radial-gradient(circle, ${colors.primary}, ${colors.secondary})`,
                    borderColor: colors.accent,
                    boxShadow: `0 0 20px ${colors.primary}60, inset 0 2px 4px rgba(255,255,255,0.3)`
                  }}
                >
                  {flowerType}
                </div>
                
                {/* Center details */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i / 8) * 360;
                    const radius = 6;
                    const x = roundCSS(Math.cos((angle * Math.PI) / 180) * radius);
                    const y = roundCSS(Math.sin((angle * Math.PI) / 180) * radius);
                    
                    return (
                      <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          backgroundColor: colors.accent,
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Ring layers around flower */}
            {Array.from({ length: traits.ringLayers }).map((_, i) => (
              <div
                key={`ring-${i}`}
                className="absolute inset-0 border rounded-full animate-spin"
                style={{
                  borderColor: colors.primary,
                  opacity: roundCSS(0.2 - (i * 0.05)),
                  animationDuration: `${roundCSS(15 + i * 3)}s`,
                  animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
                  transform: `scale(${roundCSS(1.2 + i * 0.3)})`
                }}
              />
            ))}
          </div>
        </div>

        {/* Ambient glow around entire flower */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-30 animate-pulse"
          style={{ 
            backgroundColor: colors.primary,
            animationDuration: `${roundCSS(4 + mood * 0.5)}s`,
            transform: 'scale(1.5)'
          }}
        />
      </div>
    </div>
  );
}
