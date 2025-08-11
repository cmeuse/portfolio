import * as THREE from 'three';
import type { CityPin, CityCoordinates, CitySlug } from '@/types';

// Globe radius for 3D calculations
export const GLOBE_RADIUS = 2;

/**
 * Convert latitude/longitude to 3D position on sphere
 */
export function latLngToVector3(lat: number, lng: number, radius: number = GLOBE_RADIUS): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

/**
 * Calculate camera position for viewing a specific point on the globe
 */
export function getCameraPositionForCity(lat: number, lng: number, distance: number = 4.2): THREE.Vector3 {
  const position = latLngToVector3(lat, lng, distance);
  return position;
}

/**
 * City data with coordinates and metadata
 */
export const CITIES: Record<CitySlug, CityPin> = {
  'new-york': {
    slug: 'new-york',
    name: 'New York',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    position: [0, 0, 0], // Will be calculated
  },
  'tokyo': {
    slug: 'tokyo',
    name: 'Tokyo',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    position: [0, 0, 0],
  },
  'washington-dc': {
    slug: 'washington-dc',
    name: 'Washington DC',
    coordinates: { lat: 38.9072, lng: -77.0369 },
    position: [0, 0, 0],
  },
  'mountain-view': {
    slug: 'mountain-view',
    name: 'Mountain View',
    coordinates: { lat: 37.4162, lng: -122.0758 },
    position: [0, 0, 0],
  },
  'los-angeles': {
    slug: 'los-angeles',
    name: 'Los Angeles',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    position: [0, 0, 0],
  },
  'copenhagen': {
    slug: 'copenhagen',
    name: 'Copenhagen',
    coordinates: { lat: 55.6761, lng: 12.5683 },
    position: [0, 0, 0],
  },
};

// Calculate 3D positions for all cities
Object.values(CITIES).forEach(city => {
  const pos = latLngToVector3(city.coordinates.lat, city.coordinates.lng);
  city.position = [pos.x, pos.y, pos.z];
});

/**
 * Get city data by slug
 */
export function getCityBySlug(slug: CitySlug): CityPin {
  return CITIES[slug];
}

/**
 * Get all cities as an array
 */
export function getAllCities(): CityPin[] {
  return Object.values(CITIES);
}

/**
 * Get the next city in the tour sequence
 */
export function getNextCity(currentSlug: CitySlug): CitySlug | null {
  const sequence: CitySlug[] = ['new-york', 'washington-dc', 'mountain-view', 'los-angeles', 'tokyo', 'copenhagen'];
  const currentIndex = sequence.indexOf(currentSlug);
  
  if (currentIndex === -1 || currentIndex === sequence.length - 1) {
    return null;
  }
  
  return sequence[currentIndex + 1];
}

/**
 * Get the previous city in the tour sequence
 */
export function getPreviousCity(currentSlug: CitySlug): CitySlug | null {
  const sequence: CitySlug[] = ['new-york', 'washington-dc', 'mountain-view', 'los-angeles', 'tokyo', 'copenhagen'];
  const currentIndex = sequence.indexOf(currentSlug);
  
  if (currentIndex <= 0) {
    return null;
  }
  
  return sequence[currentIndex - 1];
}

/**
 * Smooth interpolation between two angles (handles wrapping)
 */
export function lerpAngle(start: number, end: number, factor: number): number {
  const difference = ((end - start + Math.PI) % (2 * Math.PI)) - Math.PI;
  return start + difference * factor;
}

/**
 * Easing functions for smooth animations
 */
export const easing = {
  easeInOut: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOut: (t: number): number => t * (2 - t),
  easeIn: (t: number): number => t * t,
  easeInOutCubic: (t: number): number => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
};