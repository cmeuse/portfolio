'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

export function LoadingSpinner() {
  const dayNight = useAppStore((state) => state.dayNight);
  
  return (
    <div className={`flex items-center justify-center min-h-screen transition-colors duration-500 ${
      dayNight === 'day' 
        ? 'bg-gradient-to-b from-slate-50 via-sky-50 to-slate-50'
        : 'bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800'
    }`}>
      <div className="text-center">
        <motion.div
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          className={`text-lg transition-colors duration-500 ${
            dayNight === 'day' ? 'text-slate-700' : 'text-slate-300'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Preparing your journey...
        </motion.p>
      </div>
    </div>
  );
}