// =============================================================================
// @canboigay/3d-globe-visualization — Shared Constants
// =============================================================================

import type { ColorScheme, GlobeTexture } from '../types';

/** Default threat level color palette */
export const LEVEL_COLORS: ColorScheme = {
  critical: '#ff0040',
  high: '#ff6600',
  medium: '#ffcc00',
  low: '#00ff88',
  info: '#3b82f6',
};

/** Dark theme variant */
export const LEVEL_COLORS_DARK: ColorScheme = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#d97706',
  low: '#16a34a',
  info: '#2563eb',
};

/** Glow-enhanced variant for dark backgrounds */
export const LEVEL_COLORS_GLOW: ColorScheme = {
  critical: '#ff003c',
  high: '#ff7700',
  medium: '#ffd000',
  low: '#00ffa3',
  info: '#4d9fff',
};

/** High-resolution globe texture URLs */
export const TEXTURE_URLS: Record<GlobeTexture, { globe: string; bump?: string; specular?: string }> = {
  'war-ops': {
    globe: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
    bump: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
  },
  'night-vision': {
    globe: 'https://unpkg.com/three-globe/example/img/earth-dark.jpg',
  },
  'thermal': {
    globe: 'https://unpkg.com/three-globe/example/img/earth-water.png',
  },
  'tactical': {
    globe: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    bump: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
  },
  'satellite': {
    globe: 'https://unpkg.com/three-globe/example/img/earth-day.jpg',
    bump: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
  },
  'dark-ops': {
    globe: 'https://unpkg.com/three-globe/example/img/earth-night.jpg',
  },
  'borders': {
    globe: 'https://unpkg.com/three-globe/example/img/earth-dark.jpg',
  },
  'classic': {
    globe: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    bump: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
  },
};

/** Atmosphere color per texture */
export const ATMOSPHERE_COLORS: Record<GlobeTexture, string> = {
  'war-ops': '#3b82f6',
  'night-vision': '#10b981',
  'thermal': '#f97316',
  'tactical': '#3b82f6',
  'satellite': '#60a5fa',
  'dark-ops': '#ffa500',
  'borders': '#00ffff',
  'classic': '#3b82f6',
};

/** Emissive glow settings per texture */
export const EMISSIVE_SETTINGS: Record<GlobeTexture, { color: number; intensity: number }> = {
  'war-ops': { color: 0x000000, intensity: 0 },
  'night-vision': { color: 0x00ff44, intensity: 0.1 },
  'thermal': { color: 0xff6600, intensity: 0.15 },
  'tactical': { color: 0x000000, intensity: 0 },
  'satellite': { color: 0x000000, intensity: 0 },
  'dark-ops': { color: 0xffaa00, intensity: 0.3 },
  'borders': { color: 0x00ffff, intensity: 0.1 },
  'classic': { color: 0x000000, intensity: 0 },
};

/** Planet definition for starfield background */
export interface PlanetConfig {
  name: string;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  speed: number;
  orbitRadius: number;
  hasRing: boolean;
}

/** Planet data for starfield background */
export const PLANETS: readonly PlanetConfig[] = [
  { name: 'Mercury', baseX: 0.15, baseY: 0.2, size: 8, color: '#8c7853', speed: 0.02, orbitRadius: 180, hasRing: false },
  { name: 'Venus', baseX: 0.25, baseY: 0.6, size: 18, color: '#ffc649', speed: 0.015, orbitRadius: 260, hasRing: false },
  { name: 'Mars', baseX: 0.7, baseY: 0.3, size: 12, color: '#cd5c5c', speed: 0.01, orbitRadius: 340, hasRing: false },
  { name: 'Jupiter', baseX: 0.8, baseY: 0.7, size: 45, color: '#c88b3a', speed: 0.005, orbitRadius: 500, hasRing: false },
  { name: 'Saturn', baseX: 0.2, baseY: 0.8, size: 38, color: '#fad5a5', speed: 0.004, orbitRadius: 580, hasRing: true },
  { name: 'Neptune', baseX: 0.55, baseY: 0.45, size: 15, color: '#4169e1', speed: 0.002, orbitRadius: 660, hasRing: false },
];

/** Country borders GeoJSON source */
export const GEOJSON_URL = 'https://raw.githubusercontent.com/vasturiano/three-globe/master/example/datasets/ne_110m_admin_0_countries.geojson';

/** Default camera settings */
export const DEFAULT_CAMERA = {
  lat: 30,
  lng: 0,
  altitude: 2.2,
  minDistance: 120,
  maxDistance: 2000,
} as const;

/** Demo threat data for examples */
export const DEMO_THREATS = [
  { id: 't1', lat: 55.7558, lng: 37.6173, city: 'Moscow', country: 'Russia', level: 'critical' as const, count: 250, timestamp: '2026-02-07T08:30:00Z' },
  { id: 't2', lat: 39.9042, lng: 116.4074, city: 'Beijing', country: 'China', level: 'high' as const, count: 180, timestamp: '2026-02-07T09:15:00Z' },
  { id: 't3', lat: 25.2048, lng: 55.2708, city: 'Dubai', country: 'UAE', level: 'medium' as const, count: 95, timestamp: '2026-02-07T07:45:00Z' },
  { id: 't4', lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK', level: 'high' as const, count: 140, timestamp: '2026-02-07T10:00:00Z' },
  { id: 't5', lat: 40.7128, lng: -74.006, city: 'New York', country: 'USA', level: 'critical' as const, count: 300, timestamp: '2026-02-07T06:20:00Z' },
  { id: 't6', lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan', level: 'medium' as const, count: 75, timestamp: '2026-02-07T11:30:00Z' },
  { id: 't7', lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'Australia', level: 'low' as const, count: 45, timestamp: '2026-02-07T12:00:00Z' },
  { id: 't8', lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France', level: 'high' as const, count: 120, timestamp: '2026-02-07T08:00:00Z' },
  { id: 't9', lat: 37.5665, lng: 126.978, city: 'Seoul', country: 'South Korea', level: 'medium' as const, count: 88, timestamp: '2026-02-07T13:15:00Z' },
  { id: 't10', lat: -23.5505, lng: -46.6333, city: 'Sao Paulo', country: 'Brazil', level: 'high' as const, count: 160, timestamp: '2026-02-07T05:45:00Z' },
  { id: 't11', lat: 28.6139, lng: 77.209, city: 'New Delhi', country: 'India', level: 'critical' as const, count: 210, timestamp: '2026-02-07T14:30:00Z' },
  { id: 't12', lat: 1.3521, lng: 103.8198, city: 'Singapore', country: 'Singapore', level: 'low' as const, count: 35, timestamp: '2026-02-07T15:00:00Z' },
  { id: 't13', lat: 52.52, lng: 13.405, city: 'Berlin', country: 'Germany', level: 'medium' as const, count: 105, timestamp: '2026-02-07T09:45:00Z' },
  { id: 't14', lat: 59.3293, lng: 18.0686, city: 'Stockholm', country: 'Sweden', level: 'low' as const, count: 28, timestamp: '2026-02-07T10:30:00Z' },
  { id: 't15', lat: 41.0082, lng: 28.9784, city: 'Istanbul', country: 'Turkey', level: 'high' as const, count: 135, timestamp: '2026-02-07T11:00:00Z' },
  { id: 't16', lat: 30.0444, lng: 31.2357, city: 'Cairo', country: 'Egypt', level: 'medium' as const, count: 72, timestamp: '2026-02-07T08:15:00Z' },
  { id: 't17', lat: -1.2921, lng: 36.8219, city: 'Nairobi', country: 'Kenya', level: 'low' as const, count: 42, timestamp: '2026-02-07T07:00:00Z' },
  { id: 't18', lat: 19.4326, lng: -99.1332, city: 'Mexico City', country: 'Mexico', level: 'high' as const, count: 155, timestamp: '2026-02-07T04:30:00Z' },
];
