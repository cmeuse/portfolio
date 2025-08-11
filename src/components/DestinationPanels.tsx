'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { allDestinations } from 'contentlayer/generated';
import { useAppStore } from '@/store/useAppStore';
import type { CitySlug, Metric, Link } from '@/types';

function DestinationPanel({ destination }: { destination: typeof allDestinations[0] }) {
  const setCity = useAppStore((state) => state.setCity);
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // Update active city when panel comes into view
  React.useEffect(() => {
    if (inView) {
      setCity(destination.slug as CitySlug);
    }
  }, [inView, destination.slug, setCity]);

  return (
    <motion.div
      ref={ref}
      className="min-h-screen flex items-center justify-center scroll-snap-start destination-panel"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
                         <motion.h2
               className="text-5xl font-display font-bold text-white mb-6"
               initial={{ opacity: 0, x: -30 }}
               animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -30 }}
               transition={{ delay: 0.2, duration: 0.6 }}
             >
               {destination.city}
             </motion.h2>
             
             <motion.p
               className="text-xl text-slate-300 mb-2"
               initial={{ opacity: 0, x: -30 }}
               animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -30 }}
               transition={{ delay: 0.4, duration: 0.6 }}
             >
               {destination.headline}
             </motion.p>

             <motion.p
               className="text-lg text-slate-400 mb-8"
               initial={{ opacity: 0, x: -30 }}
               animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -30 }}
               transition={{ delay: 0.5, duration: 0.6 }}
             >
               {destination.role} • {destination.timeframe}
             </motion.p>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
                             {/* Metrics */}
               {destination.metrics && (
                 <div className="grid grid-cols-3 gap-4 mb-6">
                   {(destination.metrics as Metric[]).map((metric, index) => (
                     <div key={index} className="text-center p-4 glass rounded-lg">
                       <div className="text-3xl font-bold text-primary-400">
                         {metric.prefix || ''}{metric.value}{metric.suffix || ''}
                       </div>
                       <div className="text-sm text-slate-400">{metric.label}</div>
                     </div>
                   ))}
                 </div>
               )}

               {/* Tech Stack */}
               {destination.stack && (
                 <div className="mb-6">
                   <h4 className="text-lg font-semibold text-white mb-3">Tech Stack</h4>
                   <div className="flex flex-wrap gap-2">
                     {(destination.stack as string[]).map((tech) => (
                       <span key={tech} className="tech-chip px-3 py-1 rounded-full text-sm">
                         {tech}
                       </span>
                     ))}
                   </div>
                 </div>
               )}

               {/* Overview */}
               <div className="mb-6">
                 <p className="text-slate-300 leading-relaxed">
                   {destination.overview}
                 </p>
               </div>

               {/* Call to Action */}
               <div className="flex gap-4">
                 <motion.button
                   className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 focus-visible"
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   Read Full Case Study
                 </motion.button>
                 {destination.links && (destination.links as Link[])[0] && (
                   <motion.a
                     href={(destination.links as Link[])[0].url}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 border border-white/20 hover:border-white/30 focus-visible"
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                   >
                     {(destination.links as Link[])[0].label}
                   </motion.a>
                 )}
               </div>
            </motion.div>
          </div>

          {/* Placeholder visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.8 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="aspect-video bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-lg border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <p className="text-slate-300">Case study coming soon</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function DestinationPanels() {
  // Sort destinations in the desired order
  const sortedDestinations = allDestinations.sort((a, b) => {
    const order = ['new-york', 'washington-dc', 'los-angeles', 'tokyo', 'copenhagen'];
    return order.indexOf(a.slug) - order.indexOf(b.slug);
  });

  return (
    <div className="relative">
      {sortedDestinations.map((destination) => (
        <DestinationPanel key={destination.slug} destination={destination} />
      ))}
    </div>
  );
}