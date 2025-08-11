"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { CITIES } from "@/utils/coordinates";
import { useAppStore } from "@/store/useAppStore";
import type { CitySlug } from "@/types";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function RealisticGlobe() {
  const ref = useRef<any>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const dayNight = useAppStore((state) => state.dayNight);
  const globeSelectedCity = useAppStore((state) => state.globeSelectedCity);
  const setGlobeSelectedCity = useAppStore((state) => state.setGlobeSelectedCity);

  // Convert cities data to points for the globe with custom icons
  const getCityIcon = (citySlug: string) => {
    const icons = {
      'new-york': '🗽', // Statue of Liberty
      'washington-dc': '🏛️', // Capitol building
      'mountain-view': '🌉', // Golden Gate Bridge
      'los-angeles': '🎬', // Clapperboard for Hollywood
      'tokyo': '🇯🇵', // Japan flag
      'copenhagen': '🇩🇰', // Denmark flag
      'toronto': '🇨🇦', // Canada flag
    };
    return icons[citySlug as keyof typeof icons] || '📍';
  };

  const cityPoints = Object.values(CITIES).map(city => ({
    lat: city.coordinates.lat,
    lng: city.coordinates.lng,
    name: city.name,
    slug: city.slug,
    icon: getCityIcon(city.slug),
    size: 1.2,
    color: dayNight === 'day' ? '#f59e0b' : '#fbbf24'
  }));

  useEffect(() => {
    if (!ref.current) return;
    
    // Set initial camera position
    ref.current.pointOfView({ lat: 20, lng: 0, altitude: 2.2 }, 1000);
    
    // Configure controls
    const controls = ref.current.controls();
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    
    // CRITICAL: Allow page scrolling by disabling zoom
    controls.enableZoom = false;
    controls.enablePan = false;
    
    // Allow rotation but don't capture all mouse events
    controls.mouseButtons = {
      LEFT: 0, // MOUSE.ROTATE  
      MIDDLE: -1, // Disable middle mouse
      RIGHT: -1   // Disable right mouse
    };
    
    // For touch: only allow rotation, not zoom
    controls.touches = {
      ONE: 2, // TOUCH.ROTATE
      TWO: -1 // Disable pinch zoom to allow page scroll
    };
    
  }, []);

  const handleCityHover = (point: any) => {
    setHoveredCity(point ? point.name : null);
    if (ref.current) {
      ref.current.controls().autoRotate = !point; // Pause rotation on hover
    }
    
    // Show preview for hovered city, or fall back to clicked city
    const cityToShow = point ? point.slug as CitySlug : globeSelectedCity;
    setGlobeSelectedCity(cityToShow);
  };

  const handleCityClick = (point: any) => {
    if (point && ref.current) {
      // Zoom to city
      ref.current.pointOfView({ 
        lat: point.lat, 
        lng: point.lng, 
        altitude: 1.5 
      }, 1000);
      
      // Set selected city to make preview stick
      setGlobeSelectedCity(point.slug as CitySlug);
      
      console.log(`Clicked on ${point.name}`);
    }
  };

  return (
    <div style={{ 
      width: "100%", 
      height: "80vh",
      position: "relative"
    }}>
      {/* Globe container - centered 50% */}
      <div style={{
        position: "absolute",
        left: "25%",
        top: "0",
        width: "50%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{
          width: "100%",
          height: "100%",
          position: "relative"
        }}>
          <Globe
        ref={ref}
        // Main earth texture
        globeImageUrl="/textures/earth_albedo_8k.jpg"
        
        // Reduce interaction interference
        rendererConfig={{ 
          antialias: true,
          alpha: true
        }}
        
        // Atmosphere
        showAtmosphere
        atmosphereAltitude={0.18}
        atmosphereColor={dayNight === 'day' ? "#0ea5e9" : "#60a5fa"}
        
        // Background transparent to show container gradient
        backgroundColor={'rgba(0,0,0,0)'}
        
        // Disable any default labels/points
        labelsData={[]}
        pointsData={[]}
        
        // HTML elements for emoji pins with proper font support
        htmlElementsData={cityPoints}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.01}
        htmlElement={(point: any) => {
          const el = document.createElement('div');
          el.innerHTML = point.icon;
          const isHovered = point.name === hoveredCity;
          
          // Set font properties that support emoji
          el.style.fontFamily = 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Arial, sans-serif';
          el.style.fontSize = isHovered ? '28px' : '22px';
          el.style.transition = 'all 0.3s ease';
          el.style.cursor = 'pointer';
          el.style.userSelect = 'none';
          el.style.pointerEvents = 'auto';
          el.style.textAlign = 'center';
          el.style.lineHeight = '1';
          el.style.filter = isHovered ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';
          el.style.transform = isHovered ? 'scale(1.1)' : 'scale(1)';
          el.style.zIndex = isHovered ? '1000' : '999';
          
          // Add hover tooltip
          el.title = point.name;
          
          // Add event listeners
          el.addEventListener('mouseenter', () => handleCityHover(point));
          el.addEventListener('mouseleave', () => handleCityHover(null));
          el.addEventListener('click', (e) => {
            e.stopPropagation();
            handleCityClick(point);
          });
          
          return el;
        }}
        
        // Globe click handler
        onGlobeClick={() => {
          // Clear selection when clicking on empty space
          setGlobeSelectedCity(null);
        }}
      />
      
              {/* Instructions overlay - positioned within globe container */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          background: dayNight === 'day' 
            ? 'rgba(255,255,255,0.9)' 
            : 'rgba(15,23,42,0.9)',
          color: dayNight === 'day' ? '#1e293b' : '#f1f5f9',
          padding: '14px 18px',
          borderRadius: '10px',
          fontSize: '13px',
          fontFamily: 'system-ui',
          fontWeight: '500',
          boxShadow: dayNight === 'day' 
            ? '0 4px 20px rgba(0,0,0,0.1)' 
            : '0 4px 20px rgba(0,0,0,0.3)',
          border: dayNight === 'day' 
            ? '1px solid rgba(0,0,0,0.1)' 
            : '1px solid rgba(59,130,246,0.2)',
          pointerEvents: 'none' // Don't block page interactions
        }}>
          <div>🖱️ Drag to rotate</div>
          <div>📍 Click pins to explore</div>
        </div>
        </div>
      </div>
    </div>
  );
}