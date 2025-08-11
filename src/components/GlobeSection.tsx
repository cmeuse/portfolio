'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Play, Pause, Volume2, VolumeX, Settings } from 'lucide-react';
import { Globe } from './Globe';
import { useAppStore } from '@/store/useAppStore';
import type { CitySlug } from '@/types';

export function GlobeSection() {
  const {
    activeCity,
    dayNight,
    tourMode,
    audioEnabled,
    setCity,
    setDayNight,
    setTourMode,
    setAudioEnabled,
  } = useAppStore();

  const [showControls, setShowControls] = useState(false);

  const handleCitySelect = (citySlug: CitySlug) => {
    setCity(citySlug);
    setTourMode('manual'); // Switch to manual when user clicks
  };

  const toggleTour = () => {
    const newMode = tourMode === 'auto' ? 'manual' : 'auto';
    setTourMode(newMode);
    
    if (newMode === 'auto' && !activeCity) {
      // Start tour from first city
      setCity('new-york');
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Globe */}
      <Globe
        activeCity={activeCity}
        dayNight={dayNight}
        tourMode={tourMode}
        onCityHover={(city) => {
          // Show city info on hover
          console.log('Hovering city:', city);
        }}
        onCitySelect={handleCitySelect}
      />

      {/* UI Controls */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Controls */}
        <div className="absolute top-6 right-6 flex items-center space-x-4 pointer-events-auto">
          {/* Settings Toggle */}
          <motion.button
            onClick={() => setShowControls(!showControls)}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 focus-visible"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-5 h-5 text-white" />
          </motion.button>

          {/* Expanded Controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="flex items-center space-x-3"
              >
                {/* Day/Night Toggle */}
                <motion.button
                  onClick={() => setDayNight(dayNight === 'day' ? 'night' : 'day')}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 focus-visible"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Switch to ${dayNight === 'day' ? 'night' : 'day'} mode`}
                >
                  {dayNight === 'day' ? (
                    <Moon className="w-5 h-5 text-yellow-300" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  )}
                </motion.button>

                {/* Audio Toggle */}
                <motion.button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 focus-visible"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`${audioEnabled ? 'Mute' : 'Unmute'} audio`}
                >
                  {audioEnabled ? (
                    <Volume2 className="w-5 h-5 text-white" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-white/60" />
                  )}
                </motion.button>

                {/* Tour Toggle */}
                <motion.button
                  onClick={toggleTour}
                  className={`p-3 rounded-full backdrop-blur-sm border transition-all duration-300 focus-visible ${
                    tourMode === 'auto'
                      ? 'bg-primary-600 hover:bg-primary-700 border-primary-500'
                      : 'bg-white/10 hover:bg-white/20 border-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`${tourMode === 'auto' ? 'Stop' : 'Start'} auto tour`}
                >
                  {tourMode === 'auto' ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" />
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* City Info Panel */}
        <AnimatePresence>
          {activeCity && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-auto"
            >
              <div className="glass p-6 rounded-lg max-w-sm">
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  {activeCity.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </h3>
                <p className="text-slate-300 mb-4">
                  Explore this destination to see the case study
                </p>
                <motion.button
                  onClick={() => {
                    document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 focus-visible"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Story
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <div className="flex items-center space-x-3">
            {['new-york', 'washington-dc', 'los-angeles', 'tokyo', 'copenhagen'].map((citySlug, index) => (
              <motion.button
                key={citySlug}
                onClick={() => handleCitySelect(citySlug as CitySlug)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeCity === citySlug
                    ? 'bg-primary-500 scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to ${citySlug.replace('-', ' ')}`}
              />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 right-6 text-right pointer-events-none"
        >
          <p className="text-white/60 text-sm mb-1">
            Click pins to explore destinations
          </p>
          <p className="text-white/40 text-xs">
            Drag to rotate • Pinch to zoom • Middle-click to zoom
          </p>
        </motion.div>
      </div>
    </div>
  );
}