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
          color="#1e293b"
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
  
  // Create real Earth texture using accurate geography
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Base ocean color (covers entire globe initially)
    if (dayNight === 'day') {
      ctx.fillStyle = '#0f4c75'; // Deep ocean blue
    } else {
      ctx.fillStyle = '#0a1929'; // Dark night ocean
    }
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Real continent shapes with accurate positions (equirectangular projection)
    const realContinents = [
      // North America
      {
        name: 'North America',
        path: 'M200,220 Q250,200 320,210 L380,230 Q420,250 450,280 L480,320 Q490,360 480,400 L460,440 Q440,460 400,470 L350,480 Q300,470 260,450 L220,420 Q200,380 190,340 L185,300 Q190,260 200,220',
        fillDay: '#2d5016', // Forest green
        fillNight: '#1a2e05'
      },
      // South America  
      {
        name: 'South America',
        path: 'M420,480 Q450,490 480,520 L500,580 Q510,640 500,700 L490,760 Q480,800 460,820 L440,840 Q420,850 400,845 L380,840 Q360,830 350,810 L340,780 Q330,740 335,700 L340,660 Q345,620 360,580 L380,540 Q400,500 420,480',
        fillDay: '#22c55e',
        fillNight: '#164e31'
      },
      // Europe
      {
        name: 'Europe',
        path: 'M950,200 Q980,190 1020,200 L1060,220 Q1080,240 1090,260 L1100,280 Q1095,300 1080,320 L1060,340 Q1040,350 1020,355 L1000,360 Q980,355 965,345 L950,330 Q940,310 945,290 L948,270 Q950,250 950,200',
        fillDay: '#16a34a',
        fillNight: '#0f5132'
      },
      // Africa
      {
        name: 'Africa',
        path: 'M980,360 Q1020,350 1060,370 L1100,400 Q1120,450 1130,500 L1140,550 Q1135,600 1120,650 L1100,700 Q1080,740 1050,760 L1020,780 Q990,785 960,780 L930,775 Q910,765 900,745 L895,720 Q890,690 895,660 L900,630 Q905,600 915,570 L925,540 Q935,510 945,480 L955,450 Q965,420 975,390 L980,360',
        fillDay: '#ca8a04',
        fillNight: '#92400e'
      },
      // Asia
      {
        name: 'Asia',
        path: 'M1100,150 Q1200,140 1300,160 L1400,180 Q1500,200 1580,230 L1650,260 Q1700,290 1720,330 L1740,370 Q1735,410 1720,450 L1700,490 Q1680,520 1650,540 L1620,560 Q1590,570 1560,575 L1530,580 Q1500,575 1470,565 L1440,555 Q1410,540 1380,520 L1350,500 Q1320,480 1300,450 L1280,420 Q1265,390 1260,360 L1255,330 Q1260,300 1270,270 L1280,240 Q1290,210 1300,180 L1310,160 Q1320,150 1340,145 L1360,142 Q1380,140 1400,142 L1420,145 Q1440,148 1460,152 L1480,156 Q1500,160 1520,165 L1540,170 Q1560,175 1580,180 L1600,185 Q1620,190 1640,195 L1660,200 Q1680,205 1700,210 L1720,215 Q1740,220 1760,225 L1780,230 Q1800,235 1820,240 L1840,245 Q1860,250 1880,255 L1900,260 Q1920,265 1940,270 L1960,275 Q1980,280 2000,285 L2020,290 Q2040,295 2048,300 L2048,0 Q2020,5 2000,10 L1980,15 Q1960,20 1940,25 L1920,30 Q1900,35 1880,40 L1860,45 Q1840,50 1820,55 L1800,60 Q1780,65 1760,70 L1740,75 Q1720,80 1700,85 L1680,90 Q1660,95 1640,100 L1620,105 Q1600,110 1580,115 L1560,120 Q1540,125 1520,130 L1500,135 Q1480,140 1460,142 L1440,144 Q1420,146 1400,147 L1380,148 Q1360,149 1340,149 L1320,149 Q1300,149 1280,148 L1260,147 Q1240,146 1220,144 L1200,142 Q1180,140 1160,137 L1140,134 Q1120,131 1100,150',
        fillDay: '#15803d',
        fillNight: '#14532d'
      },
      // Australia
      {
        name: 'Australia',
        path: 'M1600,700 Q1650,690 1700,700 L1750,720 Q1780,740 1790,770 L1800,800 Q1795,830 1780,850 L1760,870 Q1740,880 1720,885 L1700,890 Q1680,885 1665,875 L1650,865 Q1635,850 1630,830 L1625,810 Q1620,790 1625,770 L1630,750 Q1635,730 1645,715 L1655,705 Q1665,700 1675,698 L1685,697 Q1695,696 1705,697 L1715,698 Q1725,700 1735,702 L1745,705 Q1755,708 1765,712 L1775,716 Q1785,720 1795,725 L1805,730 Q1815,735 1825,740 L1835,745 Q1845,750 1855,755 L1865,760 Q1875,765 1885,770 L1895,775 Q1905,780 1915,785 L1925,790 Q1935,795 1945,800 L1955,805 Q1965,810 1975,815 L1985,820 Q1995,825 2005,830 L2015,835 Q2025,840 2035,845 L2045,850 Q2048,852 2048,700 L1600,700',
        fillDay: '#eab308',
        fillNight: '#a16207'
      },
      // Antarctica
      {
        name: 'Antarctica',
        path: 'M0,950 L2048,950 L2048,1024 L0,1024 Z',
        fillDay: '#f8fafc',
        fillNight: '#475569'
      }
    ];
    
    // Draw each continent
    realContinents.forEach(continent => {
      ctx.fillStyle = dayNight === 'day' ? continent.fillDay : continent.fillNight;
      
      if (continent.name === 'Antarctica') {
        // Simple rectangle for Antarctica
        ctx.fillRect(0, 950, 2048, 74);
      } else {
        // Use simplified rectangular approximations for major continents
        let x: number, y: number, width: number, height: number;
        
        switch (continent.name) {
          case 'North America':
            // Covers NYC (-74°W, 40.7°N), Washington DC (-77°W, 38.9°N), 
            // Mountain View (-122°W, 37.4°N), LA (-118°W, 34.1°N), Toronto (-79.4°W, 43.7°N)
            x = 400; y = 200; width = 450; height = 300;
            break;
          case 'South America':
            x = 450; y = 500; width = 200; height = 350;
            break;
          case 'Europe':
            // Covers Copenhagen (12.6°E, 55.7°N)
            x = 1120; y = 140; width = 200; height = 200;
            break;
          case 'Africa':
            x = 1080; y = 340; width = 240; height = 450;
            break;
          case 'Asia':
            // Covers Tokyo (139.7°E, 35.7°N)
            x = 1320; y = 200; width = 700; height = 400;
            break;
          case 'Australia':
            x = 1650; y = 700; width = 250; height = 120;
            break;
          default:
            x = 0; y = 0; width = 100; height = 100;
            break;
        }
        
        // Draw continent with some organic variation
        ctx.beginPath();
        const points = 12;
        for (let i = 0; i < points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const radiusX = width / 2 * (0.8 + Math.sin(angle * 3) * 0.2);
          const radiusY = height / 2 * (0.8 + Math.cos(angle * 2) * 0.2);
          const px = x + width/2 + Math.cos(angle) * radiusX;
          const py = y + height/2 + Math.sin(angle) * radiusY;
          
          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.closePath();
        ctx.fill();
        
        // Add terrain variation within continents
        if (dayNight === 'day') {
          // Add mountain ranges, deserts, forests
          for (let j = 0; j < 8; j++) {
            const terrainX = x + Math.random() * width;
            const terrainY = y + Math.random() * height;
            const terrainSize = Math.random() * 30 + 10;
            
            // Different terrain colors
            const terrainType = Math.random();
            if (terrainType < 0.3) {
              ctx.fillStyle = '#a16207'; // Mountains/deserts
            } else if (terrainType < 0.6) {
              ctx.fillStyle = '#166534'; // Dense forests
            } else {
              ctx.fillStyle = '#15803d'; // Plains/grasslands
            }
            
            ctx.beginPath();
            ctx.arc(terrainX, terrainY, terrainSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    });
    
    // Add accurate island and geographic details
    const islands = [
      // Major islands positioned using real coordinates
      { x: 1820, y: 310, size: 12 }, // Japan (around 35°N, 139°E)
      { x: 1124, y: 220, size: 8 },  // UK (around 54°N, 2°W)
      { x: 1750, y: 650, size: 15 }, // Indonesia (around 6°S, 120°E)
      { x: 1880, y: 580, size: 10 }, // Philippines (around 14°N, 125°E)
      { x: 1020, y: 380, size: 6 },  // Madagascar (around 19°S, 47°E)
      { x: 1200, y: 480, size: 8 },  // Sri Lanka (around 7°N, 81°E)
      { x: 650, y: 500, size: 5 },   // Caribbean islands
    ];
    
    islands.forEach(island => {
      ctx.fillStyle = dayNight === 'day' ? '#16a34a' : '#14532d';
      ctx.beginPath();
      ctx.arc(island.x, island.y, island.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    return new THREE.CanvasTexture(canvas);
  }, [dayNight]);

  // Create a simple normal map for surface detail
  const normalMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Create a height map for bumps
    const imageData = ctx.createImageData(1024, 512);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % 1024;
      const y = Math.floor((i / 4) / 1024);
      
      // Create some noise for surface detail
      const noise = Math.random() * 50 + 100;
      
      // Make oceans smooth, lands bumpy based on real geography (scaled for 1024x512)
      const isLand = (
        // North America
        (x > 200 && x < 425 && y > 100 && y < 250) ||
        // South America  
        (x > 225 && x < 325 && y > 250 && y < 425) ||
        // Europe
        (x > 560 && x < 660 && y > 70 && y < 170) ||
        // Africa
        (x > 540 && x < 660 && y > 170 && y < 395) ||
        // Asia
        (x > 660 && x < 1010 && y > 100 && y < 300) ||
        // Australia
        (x > 825 && x < 950 && y > 350 && y < 410)
      );
      
      const landMask = isLand ? 1 : 0.1;
      const bump = noise * landMask;
      
      data[i] = bump;     // R
      data[i + 1] = bump; // G  
      data[i + 2] = 255;  // B (normal Z component)
      data[i + 3] = 255;  // A
    }
    
    ctx.putImageData(imageData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  }, [dayNight]);

  useFrame(() => {
    if (meshRef.current) {
      // Slow rotation
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      {/* Main Earth sphere */}
    <Sphere ref={meshRef} args={[GLOBE_RADIUS, 64, 64]}>
                <meshStandardMaterial 
          map={texture} 
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.3, 0.3)}
          roughness={dayNight === 'day' ? 0.8 : 0.6}
          metalness={0.1}
          transparent
          opacity={0.98}
        />
      </Sphere>
      
      {/* Atmospheric glow */}
      <Sphere args={[GLOBE_RADIUS * 1.05, 32, 32]}>
        <meshBasicMaterial 
          color={dayNight === 'day' ? '#87ceeb' : '#1e3a8a'}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Cloud layer */}
      {dayNight === 'day' && (
        <Sphere args={[GLOBE_RADIUS * 1.02, 32, 32]}>
          <meshBasicMaterial 
            color="#ffffff"
            transparent
            opacity={0.2}
            alphaTest={0.1}
          />
        </Sphere>
      )}
      
      {/* Outer atmosphere */}
      <Sphere args={[GLOBE_RADIUS * 1.1, 32, 32]}>
        <meshBasicMaterial 
          color={dayNight === 'day' ? '#e0f2fe' : '#1e40af'}
        transparent
          opacity={0.05}
          side={THREE.BackSide}
      />
    </Sphere>
    </group>
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
  const controlsRef = useRef<any>(null);

  // Disable scroll wheel zoom to allow page scrolling
  useEffect(() => {
    if (controlsRef.current) {
      const canvas = controlsRef.current.domElement;
      const preventWheelZoom = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      canvas.addEventListener('wheel', preventWheelZoom, { passive: false });
      return () => canvas.removeEventListener('wheel', preventWheelZoom);
    }
  }, [controlsRef.current]);

  const handleCityHover = (citySlug: CitySlug, isHovered: boolean) => {
    setHoveredCity(isHovered ? citySlug : null);
    onCityHover?.(isHovered ? citySlug : null);
  };

  const handleCityClick = (citySlug: CitySlug) => {
    onCitySelect?.(citySlug);
  };

  return (
    <>
      {/* Realistic Lighting */}
      <ambientLight intensity={dayNight === 'day' ? 0.4 : 0.2} />
      
      {/* Main sun light */}
      <directionalLight 
        position={dayNight === 'day' ? [10, 5, 5] : [-10, -5, -5]} 
        intensity={dayNight === 'day' ? 1.2 : 0.3}
        color={dayNight === 'day' ? '#ffffff' : '#4a90e2'}
        castShadow
      />
      
      {/* Fill light from opposite side */}
      <directionalLight 
        position={dayNight === 'day' ? [-5, 2, -3] : [5, -2, 3]} 
        intensity={dayNight === 'day' ? 0.3 : 0.6}
        color={dayNight === 'day' ? '#e0f2fe' : '#1e293b'}
      />
      
      {/* Rim light for atmosphere */}
      <pointLight 
        position={[0, 0, 8]} 
        intensity={dayNight === 'day' ? 0.5 : 0.8}
        color={dayNight === 'day' ? '#87ceeb' : '#0ea5e9'}
        distance={15}
        decay={2}
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
        ref={controlsRef}
        enabled={tourMode === 'manual' && !useAppStore.getState().cameraFlying}
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        enableDamping
        dampingFactor={0.05}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY, // Keep middle mouse for zoom
          RIGHT: THREE.MOUSE.ROTATE,
        }}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN, // Keep pinch-to-zoom on touch
        }}
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
        style={{ background: 'linear-gradient(to bottom, #f8fafc, #e0f2fe, #f8fafc)' }}
      >
        <GlobeScene {...props} />
      </Canvas>
    </div>
  );
}