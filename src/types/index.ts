export type CitySlug = 'new-york' | 'tokyo' | 'washington-dc' | 'los-angeles' | 'copenhagen' | 'mountain-view';

export type SceneType = 'welcome' | 'globe-intro' | 'route' | 'destinations';

export type TourMode = 'manual' | 'auto';

export type DayNight = 'day' | 'night';

export interface CityCoordinates {
  lat: number;
  lng: number;
}

export interface CityPin {
  slug: CitySlug;
  name: string;
  coordinates: CityCoordinates;
  position: [number, number, number]; // 3D position on sphere
}

export interface Metric {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

export interface Artifact {
  title: string;
  url: string;
  type: 'video' | 'image' | 'link' | 'document' | 'demo';
  description?: string;
}

export interface Link {
  label: string;
  url: string;
  type?: 'github' | 'demo' | 'press' | 'external';
}

export interface DestinationContent {
  slug: CitySlug;
  city: string;
  country: string;
  headline: string;
  role: string;
  timeframe: string;
  soundtrackPlaylistId?: string;
  coordinates: CityCoordinates;
  metrics?: Metric[];
  stack?: string[];
  overview: string;
  buildNotes?: string[];
  artifacts?: Artifact[];
  links?: Link[];
  url: string;
}

export interface SpotifyTrack {
  title: string;
  artist: string;
  spotifyUrl?: string;
  previewUrl?: string;
  image?: string;
}

export interface PlaylistPreview {
  tracks: SpotifyTrack[];
}

export interface OCRResult {
  text: string;
  lines?: string[];
}

export interface NormalizedArtists {
  artists: { name: string; confidence: number }[];
  rejected?: string[];
}

export interface AppState {
  // Scene Management
  activeScene: SceneType;
  activeCity: CitySlug | null;
  tourMode: TourMode;
  
  // Visual Settings
  dayNight: DayNight;
  audioEnabled: boolean;
  reducedMotion: boolean;
  
  // Globe State
  globeReady: boolean;
  cameraFlying: boolean;
  
  // Actions
  setScene: (scene: SceneType) => void;
  setCity: (city: CitySlug | null) => void;
  setTourMode: (mode: TourMode) => void;
  setDayNight: (mode: DayNight) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setGlobeReady: (ready: boolean) => void;
  setCameraFlying: (flying: boolean) => void;
}

export interface GlobeProps {
  activeCity: CitySlug | null;
  dayNight: DayNight;
  tourMode: TourMode;
  onCityHover?: (city: CitySlug | null) => void;
  onCitySelect?: (city: CitySlug) => void;
}

export interface DestinationPanelProps {
  slug: CitySlug;
  content: DestinationContent;
  onNext?: () => void;
}

export interface MiniPlayerProps {
  playlistId?: string;
  previewTracks?: SpotifyTrack[];
  isMuted: boolean;
  onToggleMute: () => void;
}