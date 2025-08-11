import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { AppState, SceneType, CitySlug, TourMode, DayNight } from '@/types';

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    activeScene: 'welcome',
    activeCity: null,
    globeSelectedCity: null,
    tourMode: 'manual',
    dayNight: 'day',
    audioEnabled: false,
    reducedMotion: false,
    globeReady: false,
    cameraFlying: false,

    // Actions
    setScene: (scene: SceneType) => {
      set({ activeScene: scene });
    },

    setCity: (city: CitySlug | null) => {
      set({ activeCity: city });
      
      // Auto-update scene when a city is selected
      if (city && get().activeScene !== 'destinations') {
        set({ activeScene: 'destinations' });
      }
    },

    setGlobeSelectedCity: (city: CitySlug | null) => {
      set({ globeSelectedCity: city });
    },

    setTourMode: (mode: TourMode) => {
      set({ tourMode: mode });
    },

    setDayNight: (mode: DayNight) => {
      set({ dayNight: mode });
    },

    setAudioEnabled: (enabled: boolean) => {
      set({ audioEnabled: enabled });
      
      // Store preference in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('audioEnabled', String(enabled));
      }
    },

    setReducedMotion: (reduced: boolean) => {
      set({ reducedMotion: reduced });
    },

    setGlobeReady: (ready: boolean) => {
      set({ globeReady: ready });
    },

    setCameraFlying: (flying: boolean) => {
      set({ cameraFlying: flying });
    },
  }))
);

// Initialize from localStorage and system preferences
if (typeof window !== 'undefined') {
  // Audio preference
  const savedAudioPref = localStorage.getItem('audioEnabled');
  if (savedAudioPref) {
    useAppStore.getState().setAudioEnabled(savedAudioPref === 'true');
  }

  // Reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useAppStore.getState().setReducedMotion(prefersReducedMotion);

  // Listen for changes to reduced motion preference
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    useAppStore.getState().setReducedMotion(e.matches);
  });
}

// Selectors for common use cases
export const useActiveScene = () => useAppStore((state) => state.activeScene);
export const useActiveCity = () => useAppStore((state) => state.activeCity);
export const useTourMode = () => useAppStore((state) => state.tourMode);
export const useDayNight = () => useAppStore((state) => state.dayNight);
export const useAudioEnabled = () => useAppStore((state) => state.audioEnabled);
export const useReducedMotion = () => useAppStore((state) => state.reducedMotion);
export const useGlobeReady = () => useAppStore((state) => state.globeReady);
export const useCameraFlying = () => useAppStore((state) => state.cameraFlying);