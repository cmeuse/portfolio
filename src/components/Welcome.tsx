'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Play, MapPin, FileDown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function Welcome() {
  const setScene = useAppStore((state) => state.setScene);
  const setTourMode = useAppStore((state) => state.setTourMode);

  const handleStartJourney = () => {
    setScene('globe');
    document.getElementById('globe')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePlayTour = () => {
    setTourMode('auto');
    setScene('globe');
    document.getElementById('globe')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollHint = () => {
    document.getElementById('transition')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        {/* Floating clouds */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-16 bg-white/5 rounded-full blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-12 bg-white/3 rounded-full blur-xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Moving plane silhouette */}
        <motion.div
          className="absolute top-1/3 w-8 h-8 text-white/20"
          animate={{
            x: [-100, 1200],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.56 3.91C21.15 4.5 21.15 5.45 20.56 6.04L16.67 9.93L18.79 19.11L17.38 20.53L13.5 13.1L9.93 16.67L10.64 18.79L9.93 19.5L8.5 17.38L6.38 16.07L7.09 15.36L9.21 16.07L12.78 12.5L5.35 8.62L6.76 7.21L15.94 9.33L19.83 5.44C20.39 4.89 21.2 4.89 21.76 5.44L20.56 3.91Z"/>
          </svg>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Boarding Pass Card */}
        <motion.div
          className="boarding-pass w-96 h-64 mx-auto mb-8 p-8 rounded-lg shadow-2xl"
          initial={{ scale: 0.8, opacity: 0, rotateY: -10 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ 
            scale: 1.02, 
            rotateY: 2,
            transition: { duration: 0.3 }
          }}
        >
          <div className="relative z-10 h-full flex flex-col justify-between text-white">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-mono opacity-80">BOARDING PASS</h3>
                <h1 className="text-2xl font-display font-bold">PORTFOLIO</h1>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono opacity-80">GATE</div>
                <div className="text-lg font-bold">DEV</div>
              </div>
            </div>

            {/* Route */}
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="text-xs opacity-80">FROM</div>
                <div className="text-xl font-bold font-mono">HOME</div>
              </div>
              <motion.div
                className="flex-1 h-px bg-white/30 relative"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <motion.div
                  className="absolute top-0 left-0 h-2 w-2 bg-white rounded-full transform -translate-y-1/2"
                  animate={{ x: [0, 120] }}
                  transition={{ delay: 1.3, duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <div className="text-center">
                <div className="text-xs opacity-80">TO</div>
                <div className="text-xl font-bold font-mono">WORLD</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs opacity-80">PASSENGER</div>
                <div className="text-sm font-mono">BUILDER OF AI + MUSIC</div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-80">SEAT</div>
                <div className="text-sm font-mono">∞A</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Building playful AI + music products that travel the world
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <button
            onClick={handleStartJourney}
            className="group flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 focus-visible shadow-lg"
          >
            <MapPin className="w-5 h-5" />
            <span>Explore the Map</span>
          </button>

          <button
            onClick={handlePlayTour}
            className="group flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30 focus-visible"
          >
            <Play className="w-5 h-5" />
            <span>Play the Tour</span>
          </button>

          <button
            onClick={() => window.open('/resume.pdf', '_blank')}
            className="group flex items-center space-x-2 text-slate-300 hover:text-white px-6 py-4 rounded-full font-medium transition-all duration-300 hover:bg-white/5 focus-visible"
          >
            <FileDown className="w-5 h-5" />
            <span>View Resume</span>
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={handleScrollHint}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 hover:text-white transition-colors duration-300 focus-visible"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label="Scroll to begin journey"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </div>
  );
}