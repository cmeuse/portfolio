'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { CITIES, getCameraPositionForCity, GLOBE_RADIUS, easing } from '@/utils/coordinates';
import type { CitySlug, GlobeProps } from '@/types';

// City Pin Component
function CityPin({ 
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
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle pulsing animation
      const scale = isActive ? 1.5 : isHovered ? 1.2 : 1;
      const targetScale = scale * (1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
      meshRef.current.scale.setScalar(targetScale);
    }

    if (textRef.current && isHovered) {
      // Make text always face camera
      textRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <group position={position}>
      {/* Pin */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => onHover(true)}
        onPointerLeave={() => onHover(false)}
        onClick={onClick}
      >
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial 
          color={isActive ? '#f59e0b' : isHovered ? '#0ea5e9' : '#64748b'}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial 
          color={isActive ? '#f59e0b' : '#0ea5e9'}
          transparent
          opacity={isHovered || isActive ? 0.3 : 0.1}
        />
      </mesh>

      {/* City label */}
      {isHovered && (
        <Text
          ref={textRef}
          position={[0, 0.1, 0]}
          fontSize={0.05}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {city}
        </Text>
      )}
    </group>
  );
}

// Globe mesh component
function GlobeMesh({ dayNight }: { dayNight: 'day' | 'night' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create globe texture (for now, we'll use a simple gradient)
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Create a simple earth-like texture
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    if (dayNight === 'day') {
      gradient.addColorStop(0, '#87ceeb'); // Sky blue
      gradient.addColorStop(0.3, '#4a90e2'); // Ocean blue
      gradient.addColorStop(0.7, '#228b22'); // Forest green
      gradient.addColorStop(1, '#8b4513'); // Brown
    } else {
      gradient.addColorStop(0, '#191970'); // Midnight blue
      gradient.addColorStop(0.3, '#1e3a8a'); // Dark blue
      gradient.addColorStop(0.7, '#1f2937'); // Dark gray
      gradient.addColorStop(1, '#374151'); // Gray
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);
    
    // Add some noise for continents
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const size = Math.random() * 3 + 1;
      ctx.fillStyle = dayNight === 'day' ? 
        `rgba(34, 139, 34, ${Math.random() * 0.5})` : 
        `rgba(75, 85, 99, ${Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, [dayNight]);

  useFrame(() => {
    if (meshRef.current) {
      // Slow rotation
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <Sphere ref={meshRef} args={[GLOBE_RADIUS, 64, 64]}>
      <meshPhongMaterial 
        map={texture} 
        transparent
        opacity={0.9}
      />
    </Sphere>
  );
}

// Camera controller for smooth transitions
function CameraController({ activeCity, tourMode }: { activeCity: CitySlug | null, tourMode: 'manual' | 'auto' }) {
  const { camera } = useThree();
  const setCameraFlying = useAppStore((state) => state.setCameraFlying);
  const reducedMotion = useAppStore((state) => state.reducedMotion);
  
  const animationRef = useRef<{
    startTime: number;
    duration: number;
    startPosition: THREE.Vector3;
    endPosition: THREE.Vector3;
    startTarget: THREE.Vector3;
    endTarget: THREE.Vector3;
  } | null>(null);

  useEffect(() => {
    if (!activeCity) return;

    const city = CITIES[activeCity];
    const targetPosition = getCameraPositionForCity(city.coordinates.lat, city.coordinates.lng);
    const targetLookAt = new THREE.Vector3(...city.position);

    // Set up animation
    setCameraFlying(true);
    animationRef.current = {
      startTime: Date.now(),
      duration: reducedMotion ? 500 : 1200, // Shorter animation if reduced motion
      startPosition: camera.position.clone(),
      endPosition: targetPosition,
      startTarget: new THREE.Vector3(0, 0, 0), // Look at center initially
      endTarget: targetLookAt,
    };

    // Set timeout to mark flying as complete
    setTimeout(() => {
      setCameraFlying(false);
    }, reducedMotion ? 500 : 1200);
  }, [activeCity, camera, setCameraFlying, reducedMotion]);

  useFrame(() => {
    if (!animationRef.current) return;

    const { startTime, duration, startPosition, endPosition, startTarget, endTarget } = animationRef.current;
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing.easeInOutCubic(progress);

    // Interpolate camera position
    camera.position.lerpVectors(startPosition, endPosition, easedProgress);
    
    // Interpolate look-at target
    const currentTarget = new THREE.Vector3().lerpVectors(startTarget, endTarget, easedProgress);
    camera.lookAt(currentTarget);

    // Clean up when animation is complete
    if (progress >= 1) {
      animationRef.current = null;
    }
  });

  return null;
}

// Main Globe Scene
function GlobeScene({ activeCity, dayNight, tourMode, onCityHover, onCitySelect }: GlobeProps) {
  const [hoveredCity, setHoveredCity] = useState<CitySlug | null>(null);

  const handleCityHover = (citySlug: CitySlug, isHovered: boolean) => {
    setHoveredCity(isHovered ? citySlug : null);
    onCityHover?.(isHovered ? citySlug : null);
  };

  const handleCityClick = (citySlug: CitySlug) => {
    onCitySelect?.(citySlug);
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={dayNight === 'day' ? 0.6 : 0.3} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={dayNight === 'day' ? 1 : 0.5}
        color={dayNight === 'day' ? '#ffffff' : '#b3d9ff'}
      />

      {/* Globe */}
      <GlobeMesh dayNight={dayNight} />

      {/* City Pins */}
      {Object.entries(CITIES).map(([slug, city]) => (
        <CityPin
          key={slug}
          city={city.name}
          position={city.position}
          isActive={activeCity === slug}
          isHovered={hoveredCity === slug}
          onHover={(hover) => handleCityHover(slug as CitySlug, hover)}
          onClick={() => handleCityClick(slug as CitySlug)}
        />
      ))}

      {/* Camera Controller */}
      <CameraController activeCity={activeCity} tourMode={tourMode} />

      {/* Orbit Controls (disabled during auto tour) */}
      <OrbitControls
        enabled={tourMode === 'manual' && !useAppStore.getState().cameraFlying}
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

// Main Globe Component
export function Globe(props: GlobeProps) {
  const setGlobeReady = useAppStore((state) => state.setGlobeReady);

  useEffect(() => {
    setGlobeReady(true);
    return () => setGlobeReady(false);
  }, [setGlobeReady]);

  return (
    <div className="w-full h-full globe-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <GlobeScene {...props} />
      </Canvas>
    </div>
  );
}