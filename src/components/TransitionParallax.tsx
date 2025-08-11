'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function TransitionParallax() {
  const ref = useRef<HTMLDivElement>(null);
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
    <div ref={ref} className="relative h-[40vh] overflow-hidden bg-gradient-to-b from-sky-50 via-slate-50 to-sky-50">
      {/* Background Layers */}
      
      {/* Clouds - Slowest */}
      <motion.div
        style={{ y: yClouds, opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-8 left-1/4 w-20 h-10 bg-slate-200/60 rounded-full blur-xl" />
        <div className="absolute top-16 right-1/3 w-16 h-8 bg-blue-200/50 rounded-full blur-lg" />
        <div className="absolute top-24 left-1/2 w-14 h-7 bg-slate-300/40 rounded-full blur-md" />
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
          {/* Main flight path */}
          <motion.path
            d="M0,150 Q200,120 400,150 T800,150 T1600,150"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="6"
            strokeDasharray="12,6"
            fill="none"
            style={{ pathLength: pathProgress }}
          />
          
          {/* Vapor trail behind plane */}
          <motion.path
            d="M0,150 Q200,120 400,150 T800,150 T1600,150"
            stroke="rgba(59, 130, 246, 0.1)"
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
            {/* Exhaust particles */}
            <g transform="translate(-80,-40) scale(10)">
              <motion.circle
                cx="-6" cy="4" r="0.8"
                fill="#60a5fa"
                style={{ opacity: exhaustOpacity }}
              />
              <motion.circle
                cx="-4" cy="3.5" r="0.6"
                fill="#93c5fd"
                style={{ opacity: exhaustOpacity }}
              />
              <motion.circle
                cx="-4" cy="4.5" r="0.6"
                fill="#93c5fd"
                style={{ opacity: exhaustOpacity }}
              />
            </g>
            
            {/* Airplane SVG */}
            <g transform="translate(-80,-40) scale(10)">
              {/* Fuselage */}
              <ellipse cx="6" cy="4" rx="8" ry="2" fill="#1e40af" />
              {/* Wings */}
              <ellipse cx="4" cy="4" rx="3" ry="6" fill="#3b82f6" />
              {/* Tail */}
              <path d="M-2,4 L-4,2 L-4,6 Z" fill="#1e40af" />
              {/* Engine highlights */}
              <circle cx="2" cy="4" r="1" fill="#60a5fa" />
              <circle cx="10" cy="4" r="0.5" fill="#93c5fd" />
              {/* Cockpit window */}
              <ellipse cx="8" cy="4" rx="2" ry="1" fill="#bfdbfe" opacity="0.7" />
            </g>
          </motion.g>
        </svg>
      </motion.div>


      {/* Gradient Overlay for smooth transition */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-sky-50 to-transparent pointer-events-none" />
    </div>
  );
}