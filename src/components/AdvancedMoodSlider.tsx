'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoodData {
  value: number; // 1-10
  label: string;
  color: string;
  description: string;
  emoji: string;
}

const MOOD_DATA: MoodData[] = [
  { value: 1, label: 'Devastated', color: '#2c3e50', description: 'Deep sadness, loss of hope', emoji: '😢' },
  { value: 2, label: 'Depressed', color: '#34495e', description: 'Low energy, withdrawn', emoji: '😔' },
  { value: 3, label: 'Sad', color: '#7f8c8d', description: 'Feeling down, melancholic', emoji: '😞' },
  { value: 4, label: 'Disappointed', color: '#95a5a6', description: 'Let down, frustrated', emoji: '😕' },
  { value: 5, label: 'Neutral', color: '#bdc3c7', description: 'Balanced, calm', emoji: '😐' },
  { value: 6, label: 'Content', color: '#f39c12', description: 'Satisfied, peaceful', emoji: '🙂' },
  { value: 7, label: 'Happy', color: '#e67e22', description: 'Joyful, positive', emoji: '😊' },
  { value: 8, label: 'Excited', color: '#e74c3c', description: 'Energetic, enthusiastic', emoji: '😃' },
  { value: 9, label: 'Elated', color: '#c0392b', description: 'Overjoyed, ecstatic', emoji: '🤩' },
  { value: 10, label: 'Euphoric', color: '#ff6b6b', description: 'Pure bliss, overwhelming joy', emoji: '🥳' }
];

interface AdvancedMoodSliderProps {
  value: number;
  onChange: (mood: number) => void;
  disabled?: boolean;
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function AdvancedMoodSlider({
  value,
  onChange,
  disabled = false,
  showDetails = true,
  size = 'medium'
}: AdvancedMoodSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredMood, setHoveredMood] = useState<MoodData | null>(null);

  const currentMood = MOOD_DATA.find(mood => mood.value === value) || MOOD_DATA[4];

  const handleSliderChange = useCallback((newValue: number) => {
    if (!disabled) {
      onChange(Math.round(newValue));
    }
  }, [onChange, disabled]);

  const handleMoodClick = useCallback((moodValue: number) => {
    if (!disabled) {
      onChange(moodValue);
    }
  }, [onChange, disabled]);

  const sizeClasses = {
    small: 'w-64 h-16',
    medium: 'w-80 h-20',
    large: 'w-96 h-24'
  };

  const sliderSizeClasses = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  };

  return (
    <div className="space-y-4">
      {/* Current Mood Display */}
      <div className="text-center">
        <motion.div
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gray-900/50 border border-gray-700"
        >
          <span className="text-2xl">{currentMood.emoji}</span>
          <div>
            <div className="font-semibold text-white">{currentMood.label}</div>
            <div className="text-xs text-gray-400">{currentMood.description}</div>
          </div>
        </motion.div>
      </div>

      {/* Mood Slider */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Mood Labels */}
        <div className="absolute -top-8 left-0 right-0 flex justify-between text-xs text-gray-400">
          <span>Sad</span>
          <span>Happy</span>
        </div>

        {/* Slider Track */}
        <div className={`relative ${sliderSizeClasses[size]} bg-gray-800 rounded-full overflow-hidden`}>
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-gray-500 to-red-500 opacity-30" />
          
          {/* Active Fill */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-red-500 rounded-full"
            style={{
              width: `${((value - 1) / 9) * 100}%`,
              background: `linear-gradient(to right, ${MOOD_DATA[0].color}, ${MOOD_DATA[4].color}, ${MOOD_DATA[9].color})`
            }}
            transition={{ duration: isDragging ? 0 : 0.3 }}
          />

          {/* Slider Handle */}
          <motion.div
            className="absolute top-1/2 w-6 h-6 bg-white rounded-full shadow-lg cursor-pointer border-2 border-gray-300"
            style={{
              left: `${((value - 1) / 9) * 100}%`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: currentMood.color
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 100 }}
            dragElastic={0}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            onDrag={(event, info) => {
              const rect = (event.target as HTMLElement).parentElement?.getBoundingClientRect();
              if (rect) {
                const percentage = Math.max(0, Math.min(1, info.point.x / rect.width));
                const newValue = Math.round(1 + percentage * 9);
                handleSliderChange(newValue);
              }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 rounded-full bg-white/20" />
          </motion.div>
        </div>

        {/* Mood Scale Markers */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between">
          {MOOD_DATA.map((mood, index) => (
            <button
              key={mood.value}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                mood.value === value ? 'scale-150' : 'scale-100'
              }`}
              style={{ backgroundColor: mood.color }}
              onClick={() => handleMoodClick(mood.value)}
              onMouseEnter={() => setHoveredMood(mood)}
              onMouseLeave={() => setHoveredMood(null)}
            />
          ))}
        </div>
      </div>

      {/* Mood Details */}
      <AnimatePresence>
        {showDetails && hoveredMood && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-center p-3 bg-gray-900/50 rounded-lg border border-gray-700"
          >
            <div className="text-lg">{hoveredMood.emoji}</div>
            <div className="font-semibold text-white">{hoveredMood.label}</div>
            <div className="text-sm text-gray-400">{hoveredMood.description}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Mood Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {MOOD_DATA.map((mood) => (
          <button
            key={mood.value}
            className={`p-2 rounded-lg transition-all duration-200 ${
              mood.value === value
                ? 'bg-gray-700 border-2 border-white'
                : 'bg-gray-800 hover:bg-gray-700 border-2 border-transparent'
            }`}
            onClick={() => handleMoodClick(mood.value)}
            disabled={disabled}
          >
            <div className="text-center">
              <div className="text-lg">{mood.emoji}</div>
              <div className="text-xs text-gray-400">{mood.value}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Mood History Preview */}
      {showDetails && (
        <div className="mt-4 p-3 bg-gray-900/30 rounded-lg border border-gray-700">
          <div className="text-sm text-gray-400 mb-2">Mood Impact on Flower:</div>
          <div className="space-y-1 text-xs">
            <div>• Petal Count: {Math.max(5, Math.min(13, 5 + Math.floor(value / 2)))}</div>
            <div>• Petal Shape: {value <= 3 ? 'Drooping' : value >= 8 ? 'Sharp' : 'Rounded'}</div>
            <div>• Glow Intensity: {((value / 10) * 100).toFixed(0)}%</div>
            <div>• Color: {currentMood.label}</div>
          </div>
        </div>
      )}
    </div>
  );
}
