"use client";

import { useAppStore } from "@/store/useAppStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { CITIES } from "@/utils/coordinates";
import type { CitySlug } from "@/types";

// Dynamically import the 3D globe to avoid SSR issues
const MiniGlobe3D = dynamic(() => import("./MiniGlobe3D"), { 
  ssr: false,
  loading: () => (
    <div className="w-16 h-16 bg-slate-200 rounded-full animate-pulse" />
  )
});

// 2D fallback for reduced motion
function MiniGlobeFlat({ 
  activeCity 
}: { 
  activeCity: CitySlug | null; 
}) {
  const cityPositions = {
    'new-york': { x: 20, y: 32 },
    'washington-dc': { x: 22, y: 35 },
    'mountain-view': { x: 8, y: 38 },
    'los-angeles': { x: 12, y: 40 },
    'tokyo': { x: 50, y: 30 },
    'copenhagen': { x: 32, y: 20 },
  };

  return (
    <div className="w-16 h-16 relative">
      <svg 
        width="64" 
        height="64" 
        viewBox="0 0 64 64" 
        className="w-full h-full"
        role="img" 
        aria-label="Interactive map"
      >
        {/* Globe outline */}
        <circle 
          cx="32" 
          cy="32" 
          r="28" 
          fill="none" 
          stroke="#475569" 
          strokeWidth="1.5" 
          opacity="0.6" 
        />
        
        {/* Grid lines */}
        <circle cx="32" cy="32" r="20" fill="none" stroke="#475569" strokeWidth="0.5" opacity="0.3" />
        <circle cx="32" cy="32" r="14" fill="none" stroke="#475569" strokeWidth="0.5" opacity="0.3" />
        <line x1="32" y1="4" x2="32" y2="60" stroke="#475569" strokeWidth="0.5" opacity="0.3" />
        <line x1="4" y1="32" x2="60" y2="32" stroke="#475569" strokeWidth="0.5" opacity="0.3" />
        
        {/* City dots */}
        {Object.entries(cityPositions).map(([slug, pos]) => (
          <circle
            key={slug}
            cx={pos.x}
            cy={pos.y}
            r={activeCity === slug ? "3" : "2"}
            fill={activeCity === slug ? "#3b82f6" : "#94a3b8"}
            className="transition-all duration-200"
          />
        ))}
      </svg>
    </div>
  );
}

export default function GlobeDock() {
  const { activeCity, dayNight, setCity } = useAppStore();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hoveredCity, setHoveredCity] = useState<CitySlug | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCityList, setShowCityList] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleCitySelect = (city: CitySlug) => {
    setCity(city);
    setShowCityList(false); // Close the city list when a city is selected
    
    // Navigate to the specific city's destination panel
    const cityPanel = document.getElementById(`destination-${city}`);
    if (cityPanel) {
      cityPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback: navigate to destinations section
      const destinationsSection = document.getElementById('destinations');
      if (destinationsSection) {
        destinationsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleGlobeClick = () => {
    setShowCityList(!showCityList);
  };

  const cityList = [
    { slug: 'new-york' as CitySlug, name: 'New York', flag: '🇺🇸' },
    { slug: 'washington-dc' as CitySlug, name: 'Washington DC', flag: '🇺🇸' },
    { slug: 'mountain-view' as CitySlug, name: 'Mountain View', flag: '🇺🇸' },
    { slug: 'los-angeles' as CitySlug, name: 'Los Angeles', flag: '🇺🇸' },
    { slug: 'tokyo' as CitySlug, name: 'Tokyo', flag: '🇯🇵' },
    { slug: 'copenhagen' as CitySlug, name: 'Copenhagen', flag: '🇩🇰' },
  ];

  const currentCityName = activeCity ? CITIES[activeCity]?.name : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        // Don't auto-close city list on mouse leave - let user decide
      }}
    >
      {/* Expandable City List */}
      <AnimatePresence>
        {showCityList && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`rounded-2xl shadow-2xl overflow-hidden transition-colors duration-500 ${
              dayNight === 'day' 
                ? 'bg-white/80 backdrop-blur-md border border-slate-200' 
                : 'bg-slate-800/80 backdrop-blur-md border border-slate-700'
            }`}
          >
            <div className="p-3">
              <div className={`text-xs font-medium mb-3 px-1 transition-colors duration-500 ${
                dayNight === 'day' ? 'text-slate-600' : 'text-slate-400'
              }`}>Choose a destination</div>
              <div className="space-y-1">
                {cityList.map((city) => (
                  <motion.button
                    key={city.slug}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCitySelect(city.slug)}
                    className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                      activeCity === city.slug
                        ? "bg-primary-600/90 text-white shadow-lg"
                        : dayNight === 'day'
                          ? "hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                          : "hover:bg-slate-700 text-slate-300 hover:text-slate-100"
                    }`}
                  >
                    <span className="text-lg">{city.flag}</span>
                    <span className="font-medium text-sm">{city.name}</span>
                    {activeCity === city.slug && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* City name tooltip */}
      <AnimatePresence>
        {(hoveredCity || (isExpanded && activeCity && !showCityList)) && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className={`px-3 py-2 rounded-lg text-sm font-medium shadow-lg transition-colors duration-500 ${
              dayNight === 'day' 
                ? 'bg-white/80 backdrop-blur-md border border-slate-200 text-slate-800' 
                : 'bg-slate-800/80 backdrop-blur-md border border-slate-700 text-slate-200'
            }`}
          >
            {hoveredCity ? CITIES[hoveredCity]?.name : currentCityName}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-3">
        {/* Mini Globe Container */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group cursor-pointer"
          onClick={handleGlobeClick}
        >
          <div className={`rounded-2xl p-3 shadow-2xl border transition-all duration-300 ${
            dayNight === 'day' 
              ? 'bg-white/80 backdrop-blur-md' 
              : 'bg-slate-800/80 backdrop-blur-md'
          } ${
            showCityList 
              ? "border-primary-500/70 shadow-primary-500/20" 
              : dayNight === 'day'
                ? "border-slate-300 hover:border-slate-400"
                : "border-slate-700 hover:border-slate-600"
          }`}>
            {reducedMotion ? (
              <MiniGlobeFlat activeCity={activeCity} />
            ) : (
              <MiniGlobe3D 
                activeCity={activeCity} 
                onSelect={() => {}} // Disable direct city selection on globe
                onHover={setHoveredCity}
              />
            )}
          </div>

          {/* Active indicator */}
          {activeCity && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full shadow-lg"
            />
          )}

          {/* Click indicator */}
          {!showCityList && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-500 ${
                dayNight === 'day' 
                  ? 'bg-white border border-slate-200 shadow-sm' 
                  : 'bg-slate-800 border border-slate-700'
              }`}
            >
              <span className={`text-xs transition-colors duration-500 ${
                dayNight === 'day' ? 'text-slate-900/90' : 'text-slate-200'
              }`}>+</span>
            </motion.div>
          )}
        </motion.div>

        {/* Control button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (showCityList) {
              setShowCityList(false);
            } else if (activeCity) {
              setCity(null);
            } else {
              document.getElementById('globe')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all duration-300 ${
            dayNight === 'day' 
              ? 'bg-white/95 border border-slate-200 text-slate-800 shadow' 
              : 'bg-slate-800/95 border border-slate-700 text-slate-200 shadow'
          }`}
          aria-label={showCityList ? "Close city list" : activeCity ? `Currently at ${currentCityName}. Click to return to globe view` : "Explore the map"}
        >
          {showCityList ? (
            "Close"
          ) : activeCity ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              {currentCityName}
            </span>
          ) : (
            "Explore"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
