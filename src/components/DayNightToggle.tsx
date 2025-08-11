'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function DayNightToggle() {
  const { dayNight, setDayNight } = useAppStore();

  const toggleDayNight = () => {
    setDayNight(dayNight === 'day' ? 'night' : 'day');
  };

  return (
    <motion.button
      onClick={toggleDayNight}
      className={`relative p-3 rounded-full transition-all duration-500 backdrop-blur-md border-2 shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        dayNight === 'day'
          ? 'bg-white/80 border-slate-200 text-slate-800 hover:bg-white focus:ring-yellow-500'
          : 'bg-slate-800/80 border-slate-600 text-slate-200 hover:bg-slate-700 focus:ring-blue-500'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${dayNight === 'day' ? 'night' : 'day'} mode`}
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            opacity: dayNight === 'day' ? 1 : 0,
            rotate: dayNight === 'day' ? 0 : 180,
            scale: dayNight === 'day' ? 1 : 0.5,
          }}
          transition={{ duration: 0.3 }}
        >
          <Sun className="w-6 h-6 text-yellow-500" />
        </motion.div>

        {/* Moon Icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            opacity: dayNight === 'night' ? 1 : 0,
            rotate: dayNight === 'night' ? 0 : -180,
            scale: dayNight === 'night' ? 1 : 0.5,
          }}
          transition={{ duration: 0.3 }}
        >
          <Moon className="w-6 h-6 text-blue-400" />
        </motion.div>
      </div>

      {/* Background glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-full -z-10 ${
          dayNight === 'day'
            ? 'bg-yellow-400/20'
            : 'bg-blue-400/20'
        }`}
        animate={{
          scale: dayNight === 'day' ? [1, 1.2, 1] : [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
}
