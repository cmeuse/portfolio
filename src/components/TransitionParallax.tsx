'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function TransitionParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  // Parallax transforms
  const yClouds = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const yPath = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const ySkyline = useTransform(scrollYProgress, [0, 1], ['0%', '-60%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  return (
    <div ref={ref} className="relative min-h-[150vh] overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Background Layers */}
      
      {/* Clouds - Slowest */}
      <motion.div
        style={{ y: yClouds, opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-1/4 w-40 h-20 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute top-40 right-1/3 w-32 h-16 bg-white/8 rounded-full blur-xl" />
        <div className="absolute top-60 left-1/2 w-28 h-14 bg-white/6 rounded-full blur-lg" />
      </motion.div>

      {/* Flight Path - Medium */}
      <motion.div
        style={{ y: yPath, opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <svg
          className="absolute top-1/2 left-0 w-full h-32 transform -translate-y-1/2"
          viewBox="0 0 800 100"
          fill="none"
        >
          <motion.path
            d="M0,50 Q200,20 400,50 T800,50"
            stroke="rgba(14, 165, 233, 0.3)"
            strokeWidth="2"
            strokeDasharray="10,5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 0.5 }}
          />
          {/* Airplane on path */}
          <motion.circle
            r="3"
            fill="rgba(14, 165, 233, 0.8)"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{
              duration: 5,
              delay: 1,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              offsetPath: "path('M0,50 Q200,20 400,50 T800,50')",
              offsetRotate: "auto"
            }}
          />
        </svg>
      </motion.div>

      {/* Skyline Silhouettes - Fastest */}
      <motion.div
        style={{ y: ySkyline, opacity }}
        className="absolute bottom-0 left-0 w-full h-64 pointer-events-none"
      >
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 1200 200"
          fill="none"
        >
          <motion.path
            d="M0,200 L0,150 L50,150 L50,120 L80,120 L80,100 L120,100 L120,130 L150,130 L150,140 L200,140 L200,110 L230,110 L230,90 L280,90 L280,120 L320,120 L320,105 L360,105 L360,135 L400,135 L400,125 L450,125 L450,95 L500,95 L500,115 L550,115 L550,145 L600,145 L600,160 L1200,160 L1200,200 Z"
            fill="rgba(15, 23, 42, 0.8)"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />
        </svg>
      </motion.div>

      {/* Central Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            I build playful AI + music products that ship
          </motion.h2>
          
          <motion.div
            className="w-24 h-1 bg-primary-500 mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          />
        </motion.div>
      </div>

      {/* Gradient Overlay for smooth transition */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
    </div>
  );
}