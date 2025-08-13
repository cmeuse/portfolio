"use client";

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CITIES, GLOBE_RADIUS } from '@/utils/coordinates';
import type { CitySlug } from '@/types';

// Mini City Pin Component
function MiniCityPin({ 
  city, 
  position, 
  isActive, 
  isHovered, 
  onHover, 
  onClick 
}: {
  city: string;
  position: [number, number, number];
  isActive: boolean;
  isHovered: boolean;
  onHover: (hover: boolean) => void;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = isActive ? 1.8 : isHovered ? 1.4 : 1;
      const targetScale = scale * (1 + Math.sin(state.clock.elapsedTime * 3) * 0.15);
      meshRef.current.scale.setScalar(targetScale);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      onClick={onClick}
    >
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial 
        color={isActive ? "#3b82f6" : isHovered ? "#60a5fa" : "#94a3b8"} 
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// Mini Globe Component
function MiniGlobeScene({ 
  activeCity, 
  onCitySelect, 
  onCityHover 
}: {
  activeCity: CitySlug | null;
  onCitySelect: (city: CitySlug) => void;
  onCityHover: (city: CitySlug | null) => void;
}) {
  const globeRef = useRef<THREE.Mesh>(null);
  const [hoveredCity, setHoveredCity] = useState<CitySlug | null>(null);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.005; // Slow rotation
    }
  });

  const handleCityHover = (city: CitySlug | null, hover: boolean) => {
    if (hover) {
      setHoveredCity(city);
      onCityHover(city);
    } else {
      setHoveredCity(null);
      onCityHover(null);
    }
  };

  return (
    <>
      {/* Mini Globe */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[GLOBE_RADIUS * 0.7, 32, 32]} />
        <meshBasicMaterial 
          color="#1e293b" 
          transparent 
          opacity={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 0.71, 16, 16]} />
        <meshBasicMaterial 
          color="#475569" 
          transparent 
          opacity={0.3}
          wireframe={true}
        />
      </mesh>

      {/* City Pins */}
      {Object.values(CITIES).map((city) => {
        // Scale down the positions for the mini globe
        const scaledPosition: [number, number, number] = [
          city.position[0] * 0.7,
          city.position[1] * 0.7,
          city.position[2] * 0.7,
        ];

        return (
          <MiniCityPin
            key={city.slug}
            city={city.name}
            position={scaledPosition}
            isActive={activeCity === city.slug}
            isHovered={hoveredCity === city.slug}
            onHover={(hover) => handleCityHover(city.slug, hover)}
            onClick={() => onCitySelect(city.slug)}
          />
        );
      })}
    </>
  );
}

interface MiniGlobe3DProps {
  activeCity: CitySlug | null;
  onSelect: (city: CitySlug) => void;
  onHover?: (city: CitySlug | null) => void;
}

export default function MiniGlobe3D({ activeCity, onSelect, onHover }: MiniGlobe3DProps) {
  return (
    <div className="w-16 h-16 cursor-pointer">
      <Canvas
        camera={{ 
          position: [0, 0, 6], 
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "low-power" // Performance optimization
        }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        frameloop="always"
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.4} />
        
        <MiniGlobeScene
          activeCity={activeCity}
          onCitySelect={onSelect}
          onCityHover={onHover || (() => {})}
        />
      </Canvas>
    </div>
  );
}
