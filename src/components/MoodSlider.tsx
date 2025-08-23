'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Frown, Meh, Smile, Laugh } from 'lucide-react';

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const moodData = [
  { value: 1, label: 'Very Sad', icon: Frown, color: '#4A90E2', emoji: '😢' },
  { value: 2, label: 'Sad', icon: Frown, color: '#5BA0F2', emoji: '😔' },
  { value: 3, label: 'Down', icon: Meh, color: '#6BB0F2', emoji: '😕' },
  { value: 4, label: 'Calm', icon: Meh, color: '#7ED321', emoji: '😌' },
  { value: 5, label: 'Neutral', icon: Meh, color: '#F5A623', emoji: '😐' },
  { value: 6, label: 'Content', icon: Smile, color: '#F5B623', emoji: '🙂' },
  { value: 7, label: 'Happy', icon: Smile, color: '#F5C623', emoji: '😊' },
  { value: 8, label: 'Excited', icon: Laugh, color: '#FF6B6B', emoji: '😃' },
  { value: 9, label: 'Very Happy', icon: Laugh, color: '#FF8B8B', emoji: '😄' },
  { value: 10, label: 'Ecstatic', icon: Heart, color: '#FFD700', emoji: '🤩' },
];

export default function MoodSlider({ value, onChange, disabled = false, size = 'md' }: MoodSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const currentMood = moodData.find(mood => mood.value === value) || moodData[4];

  const sizeClasses = {
    sm: 'w-64 h-20',
    md: 'w-80 h-24',
    lg: 'w-96 h-28'
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sliderRef.current || disabled) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newValue = Math.round(percentage * 9) + 1;
    
    if (!isDragging) {
      setHoverValue(newValue);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseUp = () => {
    if (isDragging && hoverValue !== null) {
      onChange(hoverValue);
    }
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    handleMouseMove(e);
    if (hoverValue !== null) {
      onChange(hoverValue);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, hoverValue, handleMouseUp]);

  const displayValue = isDragging ? hoverValue : value;
  const displayMood = moodData.find(mood => mood.value === displayValue) || currentMood;

  return (
    <div className={`${sizeClasses[size]} relative`}>
      {/* Background track */}
      <div 
        ref={sliderRef}
        className="w-full h-full bg-gray-800 rounded-2xl p-4 relative cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onMouseLeave={() => setHoverValue(null)}
      >
        {/* Gradient background */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-500 opacity-20" />
        
        {/* Mood indicators */}
        <div className="relative z-10 flex justify-between items-center h-full">
          {moodData.map((mood, index) => (
            <motion.div
              key={mood.value}
              className="flex flex-col items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors duration-200 ${
                  displayValue === mood.value 
                    ? 'bg-white shadow-lg' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                animate={{
                  scale: displayValue === mood.value ? 1.2 : 1,
                  y: displayValue === mood.value ? -2 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                {mood.emoji}
              </motion.div>
              <AnimatePresence>
                {displayValue === mood.value && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -bottom-8 text-xs text-gray-300 whitespace-nowrap"
                  >
                    {mood.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Slider thumb */}
        <motion.div
          className="absolute top-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-gray-200 cursor-pointer z-20"
          style={{
            left: `${((displayValue || 1) - 1) / 9 * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: isDragging ? 1.3 : 1,
            boxShadow: isDragging 
              ? '0 0 20px rgba(255, 255, 255, 0.5)' 
              : '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
          transition={{ duration: 0.2 }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{ backgroundColor: displayMood.color }}
          />
        </motion.div>

        {/* Current mood display */}
        <AnimatePresence>
          {displayValue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 rounded-lg px-3 py-2 text-sm font-medium"
              style={{ color: displayMood.color }}
            >
              {displayMood.label} ({displayValue}/10)
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Disabled overlay */}
      {disabled && (
        <div className="absolute inset-0 bg-gray-900/50 rounded-2xl flex items-center justify-center">
          <span className="text-gray-400 text-sm">Connect wallet to interact</span>
        </div>
      )}
    </div>
  );
}
