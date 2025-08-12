'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Play, Pause, Volume2, VolumeX, Settings } from 'lucide-react';
import RealisticGlobe from './Globe';
import { useAppStore } from '@/store/useAppStore';
import { allDestinations } from 'contentlayer/generated';
import type { CitySlug } from '@/types';

export function GlobeSection() {
  const {
    activeCity,
    globeSelectedCity,
    dayNight,
    tourMode,
    audioEnabled,
    setCity,
    setDayNight,
    setTourMode,
    setAudioEnabled,
  } = useAppStore();

  const [showControls, setShowControls] = useState(false);

  // Get destination data and visuals for city preview
  const getDestinationData = (slug: string) => {
    const destination = allDestinations.find(dest => dest.slug === slug);
    const visuals = {
      'new-york': { 
        image: '/assets/spotify-logo.png', 
        bgColor: 'bg-black/40'
      },
      'washington-dc': { 
        image: '/assets/georgetown-logo.png', 
        bgColor: 'bg-blue-900/40'
      },
      'mountain-view': { 
        image: '/assets/google.png', 
        bgColor: 'bg-red-900/40' 
      },
      'los-angeles': { 
        image: '/assets/tagger.png', 
        bgColor: 'bg-purple-900/40'
      },
      'tokyo': { 
        image: '/assets/shibuya.jpg', 
        bgColor: 'bg-orange-900/40'
      },
      'copenhagen': { 
        image: '/assets/cope.png', 
        bgColor: 'bg-purple-900'
      },
      'toronto': { 
        image: '/assets/airfairness.png',
        bgColor: 'bg-blue-900/40'
      },
    };
    
    return {
      destination,
      visuals: visuals[slug as keyof typeof visuals] || { 
        image: '', 
        bgColor: 'bg-primary-900/40' 
      }
    };
  };

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
    <div className={`relative w-full h-full transition-colors duration-500 ${
      dayNight === 'day' 
        ? 'bg-gradient-to-b from-slate-50 via-sky-50 to-slate-50' 
        : 'bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800'
    }`}>
      {/* Globe */}
      <RealisticGlobe />

      {/* UI Controls */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Controls */}
        <div className="absolute top-6 right-6 flex items-center space-x-4 pointer-events-auto">
          {/* Settings Toggle */}
          <motion.button
            onClick={() => setShowControls(!showControls)}
            className="p-3 ui-pill rounded-full transition-all duration-300 focus-visible"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-5 h-5 heading-lg" />
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
                  className="p-3 ui-pill rounded-full transition-all duration-300 focus-visible"
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
                  className="p-3 ui-pill rounded-full transition-all duration-300 focus-visible"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`${audioEnabled ? 'Mute' : 'Unmute'} audio`}
                >
                  {audioEnabled ? (
                    <Volume2 className="w-5 h-5 heading-lg" />
                  ) : (
                    <VolumeX className="w-5 h-5 subtle" />
                  )}
                </motion.button>

                {/* Tour Toggle */}
                <motion.button
                  onClick={toggleTour}
                  className={`p-3 rounded-full border transition-all duration-300 focus-visible ${
                    tourMode === 'auto'
                      ? 'bg-primary-600 hover:bg-primary-700 border-primary-500'
                      : 'ui-pill'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`${tourMode === 'auto' ? 'Stop' : 'Start'} auto tour`}
                >
                  {tourMode === 'auto' ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 heading-lg" />
                  )}
                </motion.button>
              </motion.div>
            )}
                </AnimatePresence>
      
      {/* Top gradient overlay for smooth entry from previous section */}
      <div className={`absolute top-0 left-0 right-0 h-24 pointer-events-none transition-colors duration-500 ${
        dayNight === 'day'
          ? 'bg-gradient-to-b from-slate-50 via-slate-50/30 to-transparent'
          : 'bg-gradient-to-b from-slate-800 via-slate-800/30 to-transparent'
      }`} />
    </div>

        {/* City Info Panel */}
        <AnimatePresence>
          {globeSelectedCity && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-auto"
            >
              <div className={`rounded-2xl overflow-hidden max-w-sm shadow-2xl transition-all duration-500 ${
                dayNight === 'day' 
                  ? 'bg-white/90 backdrop-blur-md border border-slate-200' 
                  : 'bg-slate-800/90 backdrop-blur-md border border-slate-700'
              }`}>
                {/* Destination Image */}
                {getDestinationData(globeSelectedCity).visuals.image && (
                  <div className="relative h-48 overflow-hidden flex items-center justify-center">
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${
                      dayNight === 'day' 
                        ? 'from-slate-100 via-slate-50 to-white' 
                        : 'from-slate-800 via-slate-700 to-slate-900'
                    }`} />
                    
                    <img 
                      src={getDestinationData(globeSelectedCity).visuals.image}
                      alt={getDestinationData(globeSelectedCity).destination?.headline || 'Destination'}
                      className="relative z-10 max-w-full max-h-full object-contain drop-shadow-lg"
                    />
                    
                    {/* Subtle overlay for blending */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent`} />
                  </div>
                )}
                
                {/* Content */}
                <div className="p-6">
                  <h3 className={`text-xl font-display mb-2 transition-colors duration-500 ${
                    dayNight === 'day' ? 'text-slate-900' : 'text-white'
                  }`}>
                    {getDestinationData(globeSelectedCity).destination?.headline || 
                      globeSelectedCity.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')
                    }
                  </h3>
                  <p className={`text-sm mb-4 transition-colors duration-500 ${
                    dayNight === 'day' ? 'text-slate-600' : 'text-slate-300'
                  }`}>
                    {getDestinationData(globeSelectedCity).destination?.role || 
                      'Explore this destination to see associated project / experience'
                    }
                  </p>
                  <motion.button
                    onClick={() => {
                      const cityPanel = document.getElementById(`destination-${globeSelectedCity}`);
                      if (cityPanel) {
                        cityPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      } else {
                        document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 focus-visible"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Placeholder Panel when nothing is selected */}
        <AnimatePresence>
          {!globeSelectedCity && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-none"
            >
              <div
                className={`rounded-2xl overflow-hidden max-w-sm shadow-2xl transition-all duration-500 ${
                  dayNight === 'day'
                    ? 'bg-white/90 backdrop-blur-md border border-slate-200'
                    : 'bg-slate-800/90 backdrop-blur-md border border-slate-700'
                }`}
              >
                {/* Simple visual header */}
                <div className="relative h-40 overflow-hidden flex items-center justify-center">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      dayNight === 'day'
                        ? 'from-slate-100 via-slate-50 to-white'
                        : 'from-slate-800 via-slate-700 to-slate-900'
                    }`}
                  />
                  <div className="relative z-10 text-5xl select-none">🗺️</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                </div>

                <div className="p-6">
                  <h3
                    className={`text-xl font-display mb-2 transition-colors duration-500 ${
                      dayNight === 'day' ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    Click an emoji pin to get started
                  </h3>
                  <p
                    className={`text-sm mb-1 transition-colors duration-500 ${
                      dayNight === 'day' ? 'text-slate-600' : 'text-slate-300'
                    }`}
                  >
                    Hover or click any emoji on the globe to preview a destination.
                  </p>
                  <p
                    className={`text-xs transition-colors duration-500 ${
                      dayNight === 'day' ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    Tip: Drag to rotate the globe.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <div className="flex items-center space-x-3">
            {['new-york', 'tokyo', 'toronto', 'copenhagen', 'washington-dc', 'mountain-view', 'los-angeles'].map((citySlug, index) => (
              <motion.button
                key={citySlug}
                onClick={() => handleCitySelect(citySlug as CitySlug)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeCity === citySlug
                    ? 'bg-primary-500 scale-125'
                    : 'bg-slate-400 hover:bg-slate-500'
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
          <p className="subtle text-sm mb-1">
            Click pins to explore destinations
          </p>
          <p className="icon-muted text-xs">
            Drag to rotate • Pinch to zoom • Middle-click to zoom
          </p>
        </motion.div>
      </div>
    </div>
  );
}