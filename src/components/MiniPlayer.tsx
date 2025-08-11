'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function MiniPlayer() {
  const { activeCity, audioEnabled, setAudioEnabled } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Only show mini player when there's an active city
  if (!activeCity) return null;

  const currentTrack = {
    title: `${activeCity.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Vibes`,
    artist: 'Curated Playlist',
    image: '/placeholder-album.jpg'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-6 right-6 z-50 pointer-events-auto"
      >
        <div className="mini-player rounded-full px-6 py-4 shadow-2xl max-w-md mx-auto">
          <div className="flex items-center space-x-4">
            {/* Album Art */}
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex-shrink-0 flex items-center justify-center">
              <span className="text-lg">🎵</span>
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <div className="heading-lg font-medium text-sm truncate">
                {currentTrack.title}
              </div>
              <div className="subtle text-xs truncate">
                {currentTrack.artist}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 heading-lg hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={!audioEnabled}
              >
                {isPlaying && audioEnabled ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </motion.button>

              <motion.button
                className="p-2 heading-lg hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={!audioEnabled}
              >
                <SkipForward className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="p-2 heading-lg hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {audioEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Progress Bar */}
          {audioEnabled && (
            <motion.div
              className="mt-3 h-1 bg-slate-200 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="h-full bg-primary-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: isPlaying ? '100%' : '0%' }}
                transition={{ duration: isPlaying ? 30 : 0, ease: "linear" }}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}