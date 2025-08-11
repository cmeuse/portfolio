"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { CITIES } from "@/utils/coordinates";
import type { CitySlug } from "@/types";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function RealisticGlobe() {
  const ref = useRef<any>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  // Convert cities data to points for the globe
  const cityPoints = Object.values(CITIES).map(city => ({
    lat: city.coordinates.lat,
    lng: city.coordinates.lng,
    name: city.name,
    slug: city.slug,
    size: 0.5,
    color: '#f59e0b' // amber color for pins
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
    
    // Disable scroll wheel zoom and enable pinch zoom
    controls.enableZoom = true;
    controls.enablePan = false;
    
    // For touch devices: enable pinch-to-zoom
    controls.touches = {
      ONE: 2, // TOUCH.ROTATE
      TWO: 1  // TOUCH.DOLLY_PAN (pinch zoom)
    };
    
    // Disable mouse wheel zoom
    controls.mouseButtons = {
      LEFT: 0, // MOUSE.ROTATE  
      MIDDLE: 1, // MOUSE.DOLLY
      RIGHT: 0   // MOUSE.ROTATE
    };
    
  }, []);

  const handleCityHover = (point: any) => {
    setHoveredCity(point ? point.name : null);
    if (ref.current) {
      ref.current.controls().autoRotate = !point; // Pause rotation on hover
    }
  };

  const handleCityClick = (point: any) => {
    if (point && ref.current) {
      // Zoom to city
      ref.current.pointOfView({ 
        lat: point.lat, 
        lng: point.lng, 
        altitude: 1.5 
      }, 1000);
      
      console.log(`Clicked on ${point.name}`);
      // You can add navigation logic here
    }
  };

  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <Globe
        ref={ref}
        // Main earth texture
        globeImageUrl="/textures/earth_albedo_8k.jpg"
        
        // Atmosphere
        showAtmosphere
        atmosphereAltitude={0.18}
        atmosphereColor="#4a90e2"
        
        // Background - space gradient instead of black
        backgroundColor="rgba(10, 25, 47, 0.95)"
        
        // City points
        pointsData={cityPoints}
        pointLat="lat"
        pointLng="lng"
        pointColor={(point: any) => point === hoveredCity ? '#ef4444' : point.color}
        pointAltitude={0.01}
        pointRadius={(point: any) => point === hoveredCity ? 0.8 : 0.5}
        pointResolution={16}
        
        // City labels  
        pointLabel={(point: any) => `
          <div style="
            background: rgba(0,0,0,0.8); 
            padding: 8px 12px; 
            border-radius: 6px; 
            color: white; 
            font-family: system-ui;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          ">
            ${point.name}
          </div>
        `}
        
        // Interaction handlers
        onPointHover={handleCityHover}
        onPointClick={handleCityClick}
      />
      
      {/* Instructions overlay */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'system-ui'
      }}>
        <div>🖱️ Drag to rotate</div>
        <div>🤏 Pinch to zoom</div>
        <div>📍 Click pins to explore</div>
      </div>
    </div>
  );
}