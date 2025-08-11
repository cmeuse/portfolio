'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { allDestinations } from 'contentlayer/generated';
import { useAppStore } from '@/store/useAppStore';
import { TransitionParallax } from '@/components/TransitionParallax';
import type { CitySlug, Metric, Link, Artifact } from '@/types';

function DestinationPanel({ destination }: { destination: typeof allDestinations[0] }) {
  const setCity = useAppStore((state) => state.setCity);
  
  // Get unique visual elements for each destination
  const getDestinationVisuals = (slug: string) => {
    const visuals = {
      'new-york': { 
        type: 'image', 
        image: '/assets/spotify-logo.png', 
        gradient: 'from-green-500/20 to-black/20', 
        title: 'Spotify Notebook Sharing',
        bgColor: 'bg-black/40'
      },
      'washington-dc': { 
        type: 'image', 
        image: '/assets/georgetown-logo.png', 
        gradient: 'from-blue-500/20 to-gray-500/20', 
        title: 'Georgetown Developer Community',
        bgColor: 'bg-blue-900/40'
      },
      'mountain-view': { type: 'image', image: '/assets/google.png', gradient: 'from-red-500/20 to-yellow-500/20', title: 'Google Solutions Challenge Winner', bgColor: 'bg-red-900/40' },
      'los-angeles': { 
        type: 'image', 
        image: '/assets/tagger.png', 
        gradient: 'from-purple-500/20 to-blue-500/20', 
        title: 'Tagger Media (Sprout Social)',
        bgColor: 'bg-purple-900/40'
      },
      'tokyo': { 
        type: 'image', 
        image: '/assets/shibuya.jpg', 
        gradient: 'from-orange-500/20 to-red-500/20', 
        title: 'A Vinyl Bar in Shibuya',
        bgColor: 'bg-orange-900/40'
      },
      'copenhagen': { type: 'image', image: '/assets/cope.png', gradient: 'from-purple-500/20 to-pink-500/20', title: 'AI Art Generation Research', bgColor: 'bg-purple-900' },
      'toronto': { 
        type: 'image', 
        image: '/assets/airfairness.png', 
        gradient: 'from-blue-500/20 to-green-500/20', 
        title: 'FlightorFight.ai Acquisition',
        bgColor: 'bg-blue-900/40'
      },
    };
    return visuals[slug as keyof typeof visuals] || { type: 'emoji', emoji: '🚀', gradient: 'from-primary-500/20 to-purple-500/20', title: 'Tech Innovation' };
  };
  
  const visuals = getDestinationVisuals(destination.slug);
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
      id={`destination-${destination.slug}`}
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
               className="text-5xl font-display heading-hero mb-6"
               initial={{ opacity: 0, x: -30 }}
               animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -30 }}
               transition={{ delay: 0.2, duration: 0.6 }}
             >
               {destination.city}
             </motion.h2>
             
             <motion.p
               className="text-xl heading-lg mb-2"
               initial={{ opacity: 0, x: -30 }}
               animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -30 }}
               transition={{ delay: 0.4, duration: 0.6 }}
             >
               {destination.headline}
             </motion.p>

             <motion.p
               className="text-lg subtle mb-8"
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
                     <div key={index} className="text-center p-4 card-surface rounded-lg">
                       <div className="text-3xl heading-lg">
                         {metric.prefix || ''}{metric.value}{metric.suffix || ''}
                       </div>
                       <div className="text-sm subtle">{metric.label}</div>
                     </div>
                   ))}
                 </div>
               )}

               {/* Tech Stack */}
               {destination.stack && (
                 <div className="mb-6">
                   <h4 className="text-lg heading-lg mb-3">Tech Stack</h4>
                   <div className="flex flex-wrap gap-2">
                     {(destination.stack as string[]).map((tech) => (
                       <span key={tech} className="chip px-3 py-1 rounded-full text-sm">
                         {tech}
                       </span>
                     ))}
                   </div>
                 </div>
               )}

                             {/* Overview */}
              <div className="mb-6">
                <p className="body-text leading-relaxed">
                  {destination.overview}
                </p>
              </div>

              {/* Build Notes */}
              {destination.buildNotes && (destination.buildNotes as string[]).length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg heading-lg mb-3">Technical Implementation</h4>
                  <div className="space-y-2">
                    {(destination.buildNotes as string[]).map((note, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="body-text text-sm">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Artifacts */}
              {destination.artifacts && (destination.artifacts as Artifact[]).length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg heading-lg mb-3">Project Artifacts</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(destination.artifacts as Artifact[]).map((artifact, index) => (
                      <a
                        key={index}
                        href={artifact.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-3 glass rounded-lg hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
                      >
                        <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          {artifact.type === 'video' && <span className="text-sm">🎥</span>}
                          {artifact.type === 'document' && <span className="text-sm">📄</span>}
                          {artifact.type === 'demo' && <span className="text-sm">🚀</span>}
                          {artifact.type === 'image' && <span className="text-sm">🖼️</span>}
                          {artifact.type === 'link' && <span className="text-sm">🔗</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="heading-lg font-medium text-sm group-hover:text-sky-700 transition-colors">
                            {artifact.title}
                          </p>
                          {artifact.description && (
                            <p className="subtle text-xs mt-1 truncate">
                              {artifact.description}
                            </p>
                          )}
                        </div>
                        <div className="subtle group-hover:text-slate-800 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {destination.links && (destination.links as Link[]).length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg heading-lg mb-3">Project Links</h4>
                  <div className="flex flex-wrap gap-3">
                    {(destination.links as Link[]).map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 ui-pill rounded-full font-medium transition-all duration-300 text-sm group hover:bg-slate-100"
                      >
                        {link.type === 'github' && <span className="text-sm">🔗</span>}
                        {link.type === 'demo' && <span className="text-sm">🚀</span>}
                        {link.type === 'press' && <span className="text-sm">📰</span>}
                        {link.type === 'external' && <span className="text-sm">🌐</span>}
                        <span>{link.label}</span>
                        <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              
            </motion.div>
          </div>

          {/* Project Image Placeholder */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.8 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className={`aspect-video bg-gradient-to-br ${visuals.gradient} rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden group`}>
              {visuals.type === 'image' ? (
                /* Clean Image - No Text Overlay */
                <img 
                  src={(visuals as any).image} 
                  alt={visuals.title}
                  className="absolute inset-0 w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                /* Emoji Layout for other destinations */
                <>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="w-full h-full" style={{
                      backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}></div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="text-center z-10">
                    <div className={`w-20 h-20 ${(visuals as any).bgColor || 'bg-white/10'} rounded-2xl mx-auto mb-4 flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl">{(visuals as any).emoji}</span>
                    </div>
                    <h3 className="heading-lg font-semibold text-lg mb-2">{visuals.title}</h3>
                    <p className="body-text text-sm px-4">Project showcase image coming soon</p>
                  </div>
                  
                  {/* Bottom Gradient Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
                </>
              )}
              
              {/* Corner Badge */}
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20 z-30">
                <span className="heading-lg text-xs font-medium">{destination.city}</span>
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
    const order = ['new-york', 'washington-dc', 'mountain-view', 'los-angeles', 'tokyo', 'copenhagen', 'toronto'];
    return order.indexOf(a.slug) - order.indexOf(b.slug);
  });

  return (
    <div className="relative">
      {sortedDestinations.map((destination, index) => (
        <React.Fragment key={destination.slug}>
          <DestinationPanel destination={destination} />
          {/* Add plane transition between each destination (except after the last one) */}
          {index < sortedDestinations.length - 1 && (
            <TransitionParallax />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}