'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface MoodData {
  value: number; // 1-10
  label: string;
  color: string;
  description: string;
  emoji: string;
}

const MOOD_DATA: MoodData[] = [
  { value: 1, label: 'Devastated', color: '#4A148C', description: 'Deep sadness, loss of hope', emoji: '😢' },
  { value: 2, label: 'Depressed', color: '#1565C0', description: 'Low energy, withdrawn', emoji: '😔' },
  { value: 3, label: 'Sad', color: '#546E7A', description: 'Feeling down, melancholic', emoji: '😞' },
  { value: 4, label: 'Disappointed', color: '#8D6E63', description: 'Let down, frustrated', emoji: '😕' },
  { value: 5, label: 'Neutral', color: '#66BB6A', description: 'Balanced, calm', emoji: '😐' },
  { value: 6, label: 'Content', color: '#FFB300', description: 'Satisfied, peaceful', emoji: '🙂' },
  { value: 7, label: 'Happy', color: '#FF7043', description: 'Joyful, positive', emoji: '😊' },
  { value: 8, label: 'Excited', color: '#E91E63', description: 'Energetic, enthusiastic', emoji: '😃' },
  { value: 9, label: 'Elated', color: '#F44336', description: 'Overjoyed, ecstatic', emoji: '🤩' },
  { value: 10, label: 'Euphoric', color: '#FF1744', description: 'Pure bliss, overwhelming joy', emoji: '🥳' }
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
  const [hoveredMood, setHoveredMood] = useState<MoodData | null>(null);

  const currentMood = MOOD_DATA.find(mood => mood.value === value) || MOOD_DATA[4];

  const handleMoodClick = (moodValue: number) => {
    if (!disabled) {
      onChange(moodValue);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Mood Display */}
      <div className="text-center">
        <motion.div
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-4 px-6 py-3 rounded-xl bg-gray-900/50 border border-gray-700"
          style={{ borderColor: currentMood.color + '40' }}
        >
          <span className="text-3xl">{currentMood.emoji}</span>
          <div>
            <div className="font-bold text-white text-lg">{currentMood.label}</div>
            <div className="text-sm text-gray-400">{currentMood.description}</div>
          </div>
        </motion.div>
      </div>

      {/* Simple Mood Scale */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">How are you feeling?</h3>
          <p className="text-sm text-gray-400">Tap to select your mood</p>
        </div>

        {/* Mood Buttons Grid */}
        <div className="grid grid-cols-5 gap-3">
          {MOOD_DATA.map((mood) => (
            <motion.button
              key={mood.value}
              className={`relative p-4 rounded-xl transition-all duration-200 ${
                mood.value === value
                  ? 'ring-2 ring-white shadow-lg'
                  : 'hover:bg-gray-800/50'
              }`}
              style={{
                backgroundColor: mood.value === value ? mood.color + '20' : 'transparent',
                border: mood.value === value ? `2px solid ${mood.color}` : '2px solid transparent'
              }}
              onClick={() => handleMoodClick(mood.value)}
              disabled={disabled}
              onMouseEnter={() => setHoveredMood(mood)}
              onMouseLeave={() => setHoveredMood(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center space-y-2">
                <div className="text-2xl">{mood.emoji}</div>
                <div className="text-xs font-medium text-gray-300">{mood.value}</div>
                {mood.value === value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Mood Details */}
        {showDetails && hoveredMood && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-700"
            style={{ borderColor: hoveredMood.color + '40' }}
          >
            <div className="text-xl mb-2">{hoveredMood.emoji}</div>
            <div className="font-semibold text-white">{hoveredMood.label}</div>
            <div className="text-sm text-gray-400">{hoveredMood.description}</div>
          </motion.div>
        )}

        {/* Mood Impact Preview */}
        {showDetails && (
          <div className="p-4 bg-gray-900/30 rounded-xl border border-gray-700">
            <div className="text-sm font-medium text-gray-300 mb-3">Mood Impact on Flower:</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Petal Count:</span>
                <span className="text-white font-medium">{Math.max(5, Math.min(13, 5 + Math.floor(value / 2)))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Petal Shape:</span>
                <span className="text-white font-medium">{value <= 3 ? 'Drooping' : value >= 8 ? 'Sharp' : 'Rounded'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Glow Intensity:</span>
                <span className="text-white font-medium">{((value / 10) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Color Theme:</span>
                <span className="text-white font-medium">{currentMood.label}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
