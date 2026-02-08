// =============================================================================
// @canboigay/3d-globe-visualization — Utility Functions
// =============================================================================

import type { GlobePoint, FilterCriteria, ThreatLevel, ColorScheme } from '../types';
import { LEVEL_COLORS } from '../constants';

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

/** Convert lat/lng to Mercator projection pixel coordinates */
export function latLngToMercator(
  lat: number,
  lng: number,
  width: number,
  height: number
): { x: number; y: number } {
  const x = ((lng + 180) / 360) * width;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = height / 2 - (width * mercN) / (2 * Math.PI);
  return { x, y };
}

/** Haversine distance between two lat/lng points in km */
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ---------------------------------------------------------------------------
// Data Clustering
// ---------------------------------------------------------------------------

interface Cluster {
  lat: number;
  lng: number;
  points: GlobePoint[];
  totalCount: number;
  maxLevel: ThreatLevel;
}

const LEVEL_SEVERITY: Record<ThreatLevel, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  info: 0,
};

/** Cluster nearby points based on a distance threshold in km */
export function clusterPoints(
  points: GlobePoint[],
  thresholdKm: number = 500
): Cluster[] {
  const clusters: Cluster[] = [];
  const used = new Set<string>();

  const sorted = [...points].sort(
    (a, b) => LEVEL_SEVERITY[b.level] - LEVEL_SEVERITY[a.level]
  );

  for (const point of sorted) {
    if (used.has(point.id)) continue;

    const cluster: Cluster = {
      lat: point.lat,
      lng: point.lng,
      points: [point],
      totalCount: point.count,
      maxLevel: point.level,
    };
    used.add(point.id);

    for (const other of sorted) {
      if (used.has(other.id)) continue;
      const dist = haversineDistance(point.lat, point.lng, other.lat, other.lng);
      if (dist < thresholdKm) {
        cluster.points.push(other);
        cluster.totalCount += other.count;
        if (LEVEL_SEVERITY[other.level] > LEVEL_SEVERITY[cluster.maxLevel]) {
          cluster.maxLevel = other.level;
        }
        used.add(other.id);
      }
    }

    // Re-center cluster to centroid
    if (cluster.points.length > 1) {
      cluster.lat = cluster.points.reduce((s, p) => s + p.lat, 0) / cluster.points.length;
      cluster.lng = cluster.points.reduce((s, p) => s + p.lng, 0) / cluster.points.length;
    }

    clusters.push(cluster);
  }

  return clusters;
}

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

/** Apply filter criteria to a set of GlobePoints */
export function filterPoints(
  points: GlobePoint[],
  criteria: FilterCriteria
): GlobePoint[] {
  return points.filter((p) => {
    if (criteria.levels?.length && !criteria.levels.includes(p.level)) return false;
    if (criteria.countries?.length && p.country && !criteria.countries.includes(p.country)) return false;
    if (criteria.cities?.length && p.city && !criteria.cities.includes(p.city)) return false;
    if (criteria.minCount !== undefined && p.count < criteria.minCount) return false;
    if (criteria.search) {
      const q = criteria.search.toLowerCase();
      const searchable = [p.city, p.country, p.label, p.id].filter(Boolean).join(' ').toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    if (criteria.timeRange && p.timestamp) {
      const t = new Date(p.timestamp).getTime();
      if (t < criteria.timeRange.start.getTime() || t > criteria.timeRange.end.getTime()) return false;
    }
    return true;
  });
}

// ---------------------------------------------------------------------------
// Color Helpers
// ---------------------------------------------------------------------------

/** Get color for a threat level */
export function getLevelColor(level: ThreatLevel, scheme: Partial<ColorScheme> = {}): string {
  const merged = { ...LEVEL_COLORS, ...scheme };
  return merged[level] || merged.info;
}

/** Parse hex color to rgba string */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ---------------------------------------------------------------------------
// Performance
// ---------------------------------------------------------------------------

/** Throttle a function to at most once per `delay` ms */
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = delay - (now - lastCall);
    if (remaining <= 0) {
      if (timer) { clearTimeout(timer); timer = null; }
      lastCall = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastCall = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  };
}

/** Debounce a function */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ---------------------------------------------------------------------------
// Safe DOM Helpers (XSS prevention)
// ---------------------------------------------------------------------------

/** Escape HTML entities to prevent XSS */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return str.replace(/[&<>"']/g, (c) => map[c] || c);
}

/** Create a safe tooltip HTML string with all dynamic values escaped */
export function createTooltipHtml(
  point: GlobePoint,
  totalCount: number,
  colors: Partial<ColorScheme> = {}
): string {
  const color = getLevelColor(point.level, colors);
  const city = escapeHtml(point.label || point.city || 'Unknown');
  const country = escapeHtml(point.country || '');
  const level = escapeHtml(point.level.toUpperCase());

  return `<div style="
    background:rgba(10,14,26,0.98);
    padding:14px 18px;
    border-radius:10px;
    border:1px solid ${color};
    color:#e8eaed;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    font-size:13px;
    backdrop-filter:blur(12px);
    box-shadow:0 8px 32px rgba(0,0,0,0.5);
    min-width:160px;
  ">
    <div style="color:${color};font-weight:700;font-size:15px;margin-bottom:6px;letter-spacing:0.5px;">
      ${city}
    </div>
    <div style="color:#9ca3af;font-size:12px;">${country}</div>
    <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.1);">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
        <span style="color:#9ca3af;">Level</span>
        <span style="color:${color};font-weight:600;">${level}</span>
      </div>
      <div style="display:flex;justify-content:space-between;">
        <span style="color:#9ca3af;">Incidents</span>
        <span style="color:#e8eaed;font-weight:600;">${totalCount.toLocaleString()}</span>
      </div>
    </div>
  </div>`;
}

// ---------------------------------------------------------------------------
// Export Utilities
// ---------------------------------------------------------------------------

/** Export data as CSV string */
export function pointsToCsv(points: GlobePoint[]): string {
  const headers = ['id', 'lat', 'lng', 'city', 'country', 'level', 'count', 'timestamp'];
  const rows = points.map((p) =>
    [p.id, p.lat, p.lng, p.city || '', p.country || '', p.level, p.count, p.timestamp || '']
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

/** Trigger file download in browser */
export function downloadFile(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Capture a canvas/DOM element as PNG data URL */
export async function captureScreenshot(element: HTMLElement): Promise<string> {
  // Find canvas elements within the container
  const canvas = element.querySelector('canvas');
  if (canvas) {
    return canvas.toDataURL('image/png');
  }
  // Fallback: use html2canvas if available
  throw new Error('No canvas found in container. Include html2canvas for DOM screenshots.');
}

// ---------------------------------------------------------------------------
// Country Borders Loader
// ---------------------------------------------------------------------------

interface BorderArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

let cachedBorders: BorderArc[] | null = null;
let borderPromise: Promise<BorderArc[]> | null = null;

/** Load and cache country border arcs from GeoJSON */
export function loadCountryBorders(url: string): Promise<BorderArc[]> {
  if (cachedBorders) return Promise.resolve(cachedBorders);
  if (borderPromise) return borderPromise;

  borderPromise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load borders: ${res.status}`);
      return res.json();
    })
    .then((data: { features: Array<{ geometry: { type: string; coordinates: number[][][] | number[][][][] } }> }) => {
      const arcs: BorderArc[] = [];
      for (const feature of data.features) {
        const { type, coordinates } = feature.geometry;
        const rings: number[][][] =
          type === 'Polygon'
            ? (coordinates as number[][][])
            : type === 'MultiPolygon'
            ? (coordinates as number[][][][]).flat()
            : [];

        for (const ring of rings) {
          for (let i = 0; i < ring.length - 1; i++) {
            arcs.push({
              startLat: ring[i][1],
              startLng: ring[i][0],
              endLat: ring[i + 1][1],
              endLng: ring[i + 1][0],
            });
          }
        }
      }
      cachedBorders = arcs;
      return arcs;
    })
    .catch((err) => {
      console.error('Border loading failed:', err);
      borderPromise = null;
      return [];
    });

  return borderPromise;
}
