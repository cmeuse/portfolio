'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

export function TransitionParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const dayNight = useAppStore((state) => state.dayNight);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  // Parallax transforms
  const yClouds = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const yPath = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);
  
  // Plane animation based on scroll
  const planeX = useTransform(scrollYProgress, [0, 1], [-100, 1700]);
  const planeY = useTransform(scrollYProgress, [0, 0.5, 1], [150, 120, 150]);
  const planeRotation = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, -8, 0, 8, 0]);
  const pathProgress = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const trailProgress = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);
  const exhaustOpacity = useTransform(scrollYProgress, [0.1, 0.9], [0, 0.8]);
  


  return (
    <div ref={ref} className={`relative h-[50vh] overflow-hidden transition-colors duration-500 ${
      dayNight === 'day' 
        ? 'bg-gradient-to-b from-slate-50 via-sky-100 to-slate-50'
        : 'bg-gradient-to-b from-slate-800 via-blue-800 to-slate-800'
    }`}>
      {/* Background Layers */}
      
      {/* Clouds - Slowest */}
      <motion.div
        style={{ y: yClouds, opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className={`absolute top-8 left-1/4 w-20 h-10 rounded-full blur-xl transition-colors duration-500 ${
          dayNight === 'day' ? 'bg-sky-200/40' : 'bg-blue-600/30'
        }`} />
        <div className={`absolute top-16 right-1/3 w-16 h-8 rounded-full blur-lg transition-colors duration-500 ${
          dayNight === 'day' ? 'bg-slate-200/30' : 'bg-slate-600/25'
        }`} />
        <div className={`absolute top-24 left-1/2 w-14 h-7 rounded-full blur-md transition-colors duration-500 ${
          dayNight === 'day' ? 'bg-sky-300/35' : 'bg-blue-700/25'
        }`} />
      </motion.div>

      {/* Flight Path - Medium */}
      <motion.div
        style={{ y: yPath, opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <svg
          className="absolute top-1/2 left-0 w-full h-full transform -translate-y-1/2"
          viewBox="0 0 1600 300"
          fill="none"
        >
          {/* Visual defs for gradients and shadow */}
          <defs>
            <linearGradient id="fuselageGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={dayNight === 'day' ? '#e5e7eb' : '#9ca3af'} />
              <stop offset="55%" stopColor={dayNight === 'day' ? '#c7d2fe' : '#6b7280'} />
              <stop offset="100%" stopColor={dayNight === 'day' ? '#93c5fd' : '#475569'} />
            </linearGradient>
            <linearGradient id="wingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={dayNight === 'day' ? '#93c5fd' : '#64748b'} />
              <stop offset="100%" stopColor={dayNight === 'day' ? '#3b82f6' : '#334155'} />
            </linearGradient>
            <radialGradient id="windowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.6" />
            </radialGradient>
            <filter id="planeShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.25" />
            </filter>
          </defs>
          {/* Main flight path */}
          <motion.path
            d="M0,150 Q200,120 400,150 T800,150 T1600,150"
            stroke={dayNight === 'day' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(147, 197, 253, 0.6)'}
            strokeWidth="6"
            strokeDasharray="12,6"
            fill="none"
            style={{ pathLength: pathProgress }}
          />
          
          {/* Vapor trail behind plane */}
          <motion.path
            d="M0,150 Q200,120 400,150 T800,150 T1600,150"
            stroke={dayNight === 'day' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(147, 197, 253, 0.2)'}
            strokeWidth="16"
            strokeDasharray="30,15"
            fill="none"
            style={{ pathLength: trailProgress }}
          />
          
          {/* Airplane */}
          <motion.g
            style={{
              x: planeX,
              y: planeY,
              rotate: planeRotation
            }}
          >
            {/* Exhaust plume */}
            <g transform="translate(-80,-40) scale(10)">
              <motion.ellipse
                cx="-7" cy="4" rx="2.2" ry="0.9"
                fill="#60a5fa"
                style={{ opacity: exhaustOpacity }}
                filter="url(#planeShadow)"
              />
              <motion.ellipse
                cx="-5.5" cy="4" rx="1.6" ry="0.7"
                fill="#93c5fd"
                style={{ opacity: exhaustOpacity }}
              />
            </g>

            {/* Detailed airplane (top-down) */}
            <g transform="translate(-80,-40) scale(10)" filter="url(#planeShadow)">
              {/* Fuselage (rounded with nose and tail) */}
              <path
                d="M-6,4 C-5,2 -3,1 1,1 C6,1 9,2 11,4 C9,6 6,7 1,7 C-3,7 -5,6 -6,4 Z"
                fill="url(#fuselageGrad)"
                stroke={dayNight === 'day' ? '#1f2937' : '#0f172a'}
                strokeOpacity="0.25"
                strokeWidth="0.2"
              />
              {/* Cockpit window */}
              <ellipse cx="8.6" cy="4" rx="1.2" ry="0.7" fill="url(#windowGrad)" />
              {/* Main wings */}
              <path
                d="M0.5,4 L-8,-1 L-8,1 L0.5,5 Z"
                fill="url(#wingGrad)"
                stroke={dayNight === 'day' ? '#1f2937' : '#0f172a'}
                strokeOpacity="0.25"
                strokeWidth="0.2"
              />
              <path
                d="M0.5,4 L-8,9 L-8,7 L0.5,3 Z"
                fill="url(#wingGrad)"
                stroke={dayNight === 'day' ? '#1f2937' : '#0f172a'}
                strokeOpacity="0.25"
                strokeWidth="0.2"
              />
              {/* Horizontal stabilizers */}
              <path d="M-4,4 L-6,2.8 L-6,3.4 L-4,4.6 Z" fill={dayNight === 'day' ? '#93c5fd' : '#64748b'} />
              <path d="M-4,4 L-6,5.2 L-6,4.6 L-4,3.4 Z" fill={dayNight === 'day' ? '#93c5fd' : '#64748b'} />
              {/* Vertical stabilizer */}
              <path d="M-6.4,3.2 L-7.6,4 L-6.4,4.8 Z" fill={dayNight === 'day' ? '#64748b' : '#475569'} />
              {/* Engines */}
              <ellipse cx="-1.8" cy="2.8" rx="0.8" ry="0.5" fill={dayNight === 'day' ? '#334155' : '#1e293b'} />
              <ellipse cx="-1.8" cy="5.2" rx="0.8" ry="0.5" fill={dayNight === 'day' ? '#334155' : '#1e293b'} />
              {/* Wingtip nav lights */}
              <motion.circle
                cx="-8" cy="-1" r="0.35"
                fill="#22c55e"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <motion.circle
                cx="-8" cy="9" r="0.35"
                fill="#ef4444"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            </g>
          </motion.g>
        </svg>
      </motion.div>


      {/* Extended Top Gradient Overlay */}
      <div className={`absolute top-0 left-0 w-full h-40 pointer-events-none transition-colors duration-500 ${
        dayNight === 'day' 
          ? 'bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent'
          : 'bg-gradient-to-b from-slate-800 via-slate-800/80 to-transparent'
      }`} />
      
      {/* Extended Bottom Gradient Overlay */}
      <div className={`absolute bottom-0 left-0 w-full h-40 pointer-events-none transition-colors duration-500 ${
        dayNight === 'day' 
          ? 'bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent'
          : 'bg-gradient-to-t from-slate-800 via-slate-800/80 to-transparent'
      }`} />
    </div>
  );
}