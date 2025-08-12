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
  const dayNight = useAppStore((state) => state.dayNight);
  
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
      className={`relative min-h-screen flex items-center justify-center scroll-snap-start transition-colors duration-500 ${
        dayNight === 'day' 
          ? 'bg-gradient-to-b from-slate-50 via-sky-50 to-slate-50'
          : 'bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800'
      }`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
                         <motion.h2
               className={`text-5xl font-display mb-6 transition-colors duration-500 ${
                 dayNight === 'day' ? 'text-slate-900/95' : 'text-slate-100'
               }`}
               initial={{ opacity: 0, x: -30 }}
               animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -30 }}
               transition={{ delay: 0.2, duration: 0.6 }}
             >
               {destination.city}
             </motion.h2>
             
             <motion.p
               className={`text-xl mb-2 transition-colors duration-500 ${
                 dayNight === 'day' ? 'text-slate-900/90' : 'text-slate-200'
               }`}
               initial={{ opacity: 0, x: -30 }}
               animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -30 }}
               transition={{ delay: 0.4, duration: 0.6 }}
             >
               {destination.headline}
             </motion.p>

             <motion.p
               className={`text-lg mb-8 transition-colors duration-500 ${
                 dayNight === 'day' ? 'text-slate-600' : 'text-slate-400'
               }`}
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
                     <div key={index} className={`text-center p-4 rounded-lg transition-colors duration-500 ${
                       dayNight === 'day' 
                         ? 'bg-white border border-slate-200 shadow-sm' 
                         : 'bg-slate-800 border border-slate-700'
                     }`}>
                       <div className={`text-3xl transition-colors duration-500 ${
                         dayNight === 'day' ? 'text-slate-900/90' : 'text-slate-200'
                       }`}>
                         {metric.prefix || ''}{metric.value}{metric.suffix || ''}
                       </div>
                       <div className={`text-sm transition-colors duration-500 ${
                         dayNight === 'day' ? 'text-slate-600' : 'text-slate-400'
                       }`}>{metric.label}</div>
                     </div>
                   ))}
                 </div>
               )}

               {/* Tech Stack */}
               {destination.stack && (
                 <div className="mb-6">
                   <h4 className={`text-lg mb-3 transition-colors duration-500 ${
                     dayNight === 'day' ? 'text-slate-900/90' : 'text-slate-200'
                   }`}>Tech Stack</h4>
                   <div className="flex flex-wrap gap-2">
                     {(destination.stack as string[]).map((tech) => (
                       <span key={tech} className={`px-3 py-1 rounded-full text-sm transition-colors duration-500 ${
                         dayNight === 'day' 
                           ? 'bg-white border border-slate-200 text-slate-700' 
                           : 'bg-slate-800 border border-slate-700 text-slate-300'
                       }`}>
                         {tech}
                       </span>
                     ))}
                   </div>
                 </div>
               )}

                             {/* Overview */}
              <div className="mb-6">
                <p className={`leading-relaxed transition-colors duration-500 ${
                  dayNight === 'day' ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  {destination.overview}
                </p>
              </div>

              {/* Build Notes */}
              {destination.buildNotes && (destination.buildNotes as string[]).length > 0 && (
                <div className="mb-6">
                  <h4 className={`text-lg mb-3 transition-colors duration-500 ${
                    dayNight === 'day' ? 'text-slate-900/90' : 'text-slate-200'
                  }`}>Technical Implementation</h4>
                  <div className="space-y-2">
                    {(destination.buildNotes as string[]).map((note, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className={`text-sm transition-colors duration-500 ${
                          dayNight === 'day' ? 'text-slate-700' : 'text-slate-300'
                        }`}>{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Artifacts */}
              {destination.artifacts && (destination.artifacts as Artifact[]).length > 0 && (
                <div className="mb-6">
                  <h4 className={`text-lg mb-3 transition-colors duration-500 ${
                    dayNight === 'day' ? 'text-slate-900/90' : 'text-slate-200'
                  }`}>Project Artifacts</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(destination.artifacts as Artifact[]).map((artifact, index) => (
                      <a
                        key={index}
                        href={artifact.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                          dayNight === 'day' 
                            ? 'bg-white/80 backdrop-blur-md border border-slate-200 hover:bg-slate-100' 
                            : 'bg-slate-800/80 backdrop-blur-md border border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          {artifact.type === 'video' && <span className="text-sm">🎥</span>}
                          {artifact.type === 'document' && <span className="text-sm">📄</span>}
                          {artifact.type === 'demo' && <span className="text-sm">🚀</span>}
                          {artifact.type === 'image' && <span className="text-sm">🖼️</span>}
                          {artifact.type === 'link' && <span className="text-sm">🔗</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm transition-colors duration-300 ${
                            dayNight === 'day' 
                              ? 'text-slate-900/90 group-hover:text-sky-700' 
                              : 'text-slate-200 group-hover:text-sky-400'
                          }`}>
                            {artifact.title}
                          </p>
                          {artifact.description && (
                            <p className={`text-xs mt-1 truncate transition-colors duration-500 ${
                              dayNight === 'day' ? 'text-slate-600' : 'text-slate-400'
                            }`}>
                              {artifact.description}
                            </p>
                          )}
                        </div>
                        <div className={`transition-colors duration-300 ${
                          dayNight === 'day' 
                            ? 'text-slate-600 group-hover:text-slate-800' 
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}>
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
                  <h4 className={`text-lg mb-3 transition-colors duration-500 ${
                    dayNight === 'day' ? 'text-slate-900/90' : 'text-slate-200'
                  }`}>Project Links</h4>
                  <div className="flex flex-wrap gap-3">
                    {(destination.links as Link[]).map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm group ${
                          dayNight === 'day' 
                            ? 'bg-white/95 border border-slate-200 text-slate-800 shadow hover:bg-slate-100' 
                            : 'bg-slate-800/95 border border-slate-700 text-slate-200 shadow hover:bg-slate-700'
                        }`}
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
                    <h3 className={`font-semibold text-lg mb-2 transition-colors duration-500 ${
                      dayNight === 'day' ? 'text-slate-900/90' : 'text-slate-200'
                    }`}>{visuals.title}</h3>
                    <p className={`text-sm px-4 transition-colors duration-500 ${
                      dayNight === 'day' ? 'text-slate-700' : 'text-slate-300'
                    }`}>Project showcase image coming soon</p>
                  </div>
                  
                  {/* Bottom Gradient Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
                </>
              )}
              
              {/* Corner Badge */}
              <div className={`absolute top-4 right-4 backdrop-blur-sm rounded-full px-3 py-1 z-30 transition-colors duration-500 ${
                dayNight === 'day' 
                  ? 'bg-white/80 border border-slate-200' 
                  : 'bg-slate-800/80 border border-slate-700'
              }`}>
                <span className={`text-xs font-medium transition-colors duration-500 ${
                  dayNight === 'day' ? 'text-slate-900/90' : 'text-slate-200'
                }`}>{destination.city}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Gradient continuation overlay - extends the gradient beyond the section */}
      <div className={`absolute bottom-0 left-0 right-0 h-32 pointer-events-none transition-colors duration-500 ${
        dayNight === 'day'
          ? 'bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50'
          : 'bg-gradient-to-b from-transparent via-slate-800/50 to-slate-800'
      }`} />
      
      {/* Top gradient overlay for smooth entry */}
      <div className={`absolute top-0 left-0 right-0 h-32 pointer-events-none transition-colors duration-500 ${
        dayNight === 'day'
          ? 'bg-gradient-to-b from-slate-50 via-slate-50/50 to-transparent'
          : 'bg-gradient-to-b from-slate-800 via-slate-800/50 to-transparent'
      }`} />
    </motion.div>
  );
}

export function DestinationPanels() {
  // Helper: compute a sortable recency score from a timeframe string
  const getRecencyScore = (timeframe: string): number => {
    if (!timeframe) return 0;

    const lower = timeframe.toLowerCase();
    const monthMap: Record<string, number> = {
      january: 1, jan: 1,
      february: 2, feb: 2,
      march: 3, mar: 3,
      april: 4, apr: 4,
      may: 5,
      june: 6, jun: 6,
      july: 7, jul: 7,
      august: 8, aug: 8,
      september: 9, sep: 9, sept: 9,
      october: 10, oct: 10,
      november: 11, nov: 11,
      december: 12, dec: 12,
      spring: 4,
      summer: 7,
      fall: 10, autumn: 10,
      winter: 1
    };

    // Extract all year numbers
    const years = Array.from(lower.matchAll(/(20\d{2})/g)).map(m => parseInt(m[1], 10));
    if (years.length === 0) return 0;
    const latestYear = Math.max(...years);

    // Find a month/season token closest to the latest year occurrence
    let monthRank = 12; // default to end of year if unspecified (treat as latest)

    // Tokenize by spaces and punctuation, keep order
    const tokens = lower.split(/[^a-z0-9]+/).filter(Boolean);
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === String(latestYear)) {
        // Look around the year token for month/season words
        const neighbors = [tokens[i - 2], tokens[i - 1], tokens[i + 1], tokens[i + 2]];
        for (const t of neighbors) {
          if (t && monthMap[t] != null) {
            monthRank = monthMap[t];
            break;
          }
        }
        break;
      }
    }

    // Return a composite score where higher means more recent
    return latestYear * 100 + monthRank;
  };

  // Sort by recency descending (most recent first)
  const sortedDestinations = [...allDestinations].sort((a, b) => {
    const scoreA = getRecencyScore(a.timeframe || '');
    const scoreB = getRecencyScore(b.timeframe || '');
    if (scoreA !== scoreB) return scoreB - scoreA;
    // Stable tiebreaker by city name
    return (a.city || '').localeCompare(b.city || '');
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