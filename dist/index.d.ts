import * as react_jsx_runtime from 'react/jsx-runtime';
import { GlobeInstance } from 'globe.gl';

/** Threat severity level */
type ThreatLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';
/** A single point on the globe representing a threat or event */
interface GlobePoint {
    id: string;
    lat: number;
    lng: number;
    city?: string;
    country?: string;
    label?: string;
    level: ThreatLevel;
    count: number;
    /** ISO timestamp for time-series support */
    timestamp?: string;
    /** Additional metadata for tooltip display */
    meta?: Record<string, string | number | boolean>;
}
/** Globe texture themes */
type GlobeTexture = 'war-ops' | 'night-vision' | 'thermal' | 'tactical' | 'satellite' | 'dark-ops' | 'borders' | 'classic';
/** Color scheme configuration */
interface ColorScheme {
    critical: string;
    high: string;
    medium: string;
    low: string;
    info: string;
}
/** Real-time data source configuration */
interface DataSourceConfig {
    type: 'static' | 'websocket' | 'sse' | 'polling';
    url?: string;
    /** Polling interval in ms (only for type: 'polling') */
    interval?: number;
    /** Custom headers for auth */
    headers?: Record<string, string>;
    /** Transform incoming data to GlobePoint[] */
    transform?: (data: unknown) => GlobePoint[];
}
/** ShadowGuard API integration config */
interface ShadowGuardConfig {
    apiUrl: string;
    apiKey: string;
    tenantId: string;
    /** Auto-refresh interval in ms (default: 30000) */
    refreshInterval?: number;
}
/** Time range for time-series filtering */
interface TimeRange {
    start: Date;
    end: Date;
}
/** Search/filter criteria */
interface FilterCriteria {
    levels?: ThreatLevel[];
    countries?: string[];
    cities?: string[];
    search?: string;
    timeRange?: TimeRange;
    minCount?: number;
}
/** Export format options */
type ExportFormat = 'png' | 'svg' | 'json' | 'csv';
/** Camera position on the globe */
interface CameraPosition {
    lat: number;
    lng: number;
    altitude: number;
}
/** Globe component props — shared between Enhanced and WarGame */
interface GlobeBaseProps {
    /** Threat data points */
    data: GlobePoint[];
    /** Initial texture theme */
    texture?: GlobeTexture;
    /** Color scheme override */
    colors?: Partial<ColorScheme>;
    /** Show atmosphere glow */
    showAtmosphere?: boolean;
    /** Show country borders as arcs */
    showBorders?: boolean;
    /** Enable auto-rotation */
    autoRotate?: boolean;
    /** Auto-rotation speed (default: 0.3) */
    autoRotateSpeed?: number;
    /** Initial camera position */
    initialPosition?: CameraPosition;
    /** Home location marker */
    homeLocation?: {
        lat: number;
        lng: number;
        label?: string;
    };
    /** Callback when a point is clicked */
    onPointClick?: (point: GlobePoint) => void;
    /** Callback when a point is hovered */
    onPointHover?: (point: GlobePoint | null) => void;
    /** Show loading skeleton */
    loading?: boolean;
    /** Error state */
    error?: string | null;
    /** Enable data clustering for large datasets */
    enableClustering?: boolean;
    /** Clustering resolution (1-6, default: 4) */
    clusterResolution?: number;
    /** Real-time data source */
    dataSource?: DataSourceConfig;
    /** ShadowGuard integration */
    shadowGuard?: ShadowGuardConfig;
    /** Container width (default: '100%') */
    width?: string | number;
    /** Container height (default: '100%') */
    height?: string | number;
    /** CSS class name */
    className?: string;
}
/** Enhanced globe-specific props */
interface Globe3DEnhancedProps extends GlobeBaseProps {
    /** Show city labels on the globe */
    showCityLabels?: boolean;
    /** Show arc connections between threats */
    showArcs?: boolean;
    /** Hex bin altitude multiplier */
    hexAltitudeMultiplier?: number;
}
/** WarGame globe-specific props */
interface Globe3DWarGameProps extends GlobeBaseProps {
    /** Show missile trail animations */
    showMissileTrails?: boolean;
    /** Show radar pulse effects */
    showRadarPulse?: boolean;
    /** Show scanning line effect */
    showScanLine?: boolean;
    /** Tactical color tint */
    tacticalTint?: string;
}
/** Starfield props */
interface StarfieldProps {
    /** Number of stars (default: 200) */
    starCount?: number;
    /** Enable/disable animation */
    enabled?: boolean;
    /** Show orbiting planets */
    showPlanets?: boolean;
    /** Parallax speed multiplier */
    parallaxSpeed?: number;
    /** CSS class name */
    className?: string;
}
/** Timeline slider props */
interface TimelineSliderProps {
    /** Full data range */
    data: GlobePoint[];
    /** Current time range */
    timeRange: TimeRange;
    /** Callback when range changes */
    onChange: (range: TimeRange) => void;
    /** Playback speed multiplier */
    playbackSpeed?: number;
    /** Step interval in ms for playback */
    stepInterval?: number;
}
/** Search filter panel props */
interface SearchFilterProps {
    /** Current filter criteria */
    filters: FilterCriteria;
    /** Callback when filters change */
    onChange: (filters: FilterCriteria) => void;
    /** Available countries from data */
    availableCountries?: string[];
    /** Available cities from data */
    availableCities?: string[];
}
/** Export button props */
interface ExportButtonProps {
    /** Globe container ref for screenshot capture */
    containerRef: React.RefObject<HTMLElement>;
    /** Current data for JSON/CSV export */
    data: GlobePoint[];
    /** Supported formats */
    formats?: ExportFormat[];
}

declare function Globe3DEnhanced({ data, texture, colors, showAtmosphere, showBorders, autoRotate, autoRotateSpeed, initialPosition, homeLocation, onPointClick, onPointHover, loading, error, enableClustering, clusterResolution, showCityLabels, showArcs, hexAltitudeMultiplier, width, height, className, }: Globe3DEnhancedProps): react_jsx_runtime.JSX.Element;

declare function Globe3DWarGame({ data, texture, colors, showAtmosphere, showBorders, autoRotate, autoRotateSpeed, initialPosition, homeLocation, onPointClick, onPointHover, loading, error, enableClustering, clusterResolution, showMissileTrails, showRadarPulse, showScanLine, tacticalTint, width, height, className, }: Globe3DWarGameProps): react_jsx_runtime.JSX.Element;

declare function Starfield({ starCount, enabled, showPlanets, parallaxSpeed, className, }: StarfieldProps): react_jsx_runtime.JSX.Element;

declare function TimelineSlider({ data, timeRange, onChange, playbackSpeed, stepInterval, }: TimelineSliderProps): react_jsx_runtime.JSX.Element;

declare function SearchFilter({ filters, onChange, availableCountries, availableCities, }: SearchFilterProps): react_jsx_runtime.JSX.Element;

declare function ExportButton({ containerRef, data, formats, }: ExportButtonProps): react_jsx_runtime.JSX.Element;

interface UseGlobeOptions {
    containerRef: React.RefObject<HTMLElement | null>;
    data: GlobePoint[];
    texture: GlobeTexture;
    colors?: Partial<ColorScheme>;
    showAtmosphere?: boolean;
    showBorders?: boolean;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
    initialPosition?: {
        lat: number;
        lng: number;
        altitude: number;
    };
    homeLocation?: {
        lat: number;
        lng: number;
        label?: string;
    };
    onPointClick?: (point: GlobePoint) => void;
    onPointHover?: (point: GlobePoint | null) => void;
    enableClustering?: boolean;
    clusterResolution?: number;
    hexAltitudeMultiplier?: number;
}
interface UseGlobeReturn {
    globe: GlobeInstance | null;
    isReady: boolean;
    altitude: number;
    flyTo: (lat: number, lng: number, altitude?: number) => void;
    setTexture: (texture: GlobeTexture) => void;
}
declare function useGlobe(options: UseGlobeOptions): UseGlobeReturn;

/** Default threat level color palette */
declare const LEVEL_COLORS: ColorScheme;
/** Dark theme variant */
declare const LEVEL_COLORS_DARK: ColorScheme;
/** Glow-enhanced variant for dark backgrounds */
declare const LEVEL_COLORS_GLOW: ColorScheme;
/** High-resolution globe texture URLs */
declare const TEXTURE_URLS: Record<GlobeTexture, {
    globe: string;
    bump?: string;
    specular?: string;
}>;
/** Atmosphere color per texture */
declare const ATMOSPHERE_COLORS: Record<GlobeTexture, string>;
/** Emissive glow settings per texture */
declare const EMISSIVE_SETTINGS: Record<GlobeTexture, {
    color: number;
    intensity: number;
}>;
/** Planet definition for starfield background */
interface PlanetConfig {
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
declare const PLANETS: readonly PlanetConfig[];
/** Country borders GeoJSON source */
declare const GEOJSON_URL = "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/datasets/ne_110m_admin_0_countries.geojson";
/** Default camera settings */
declare const DEFAULT_CAMERA: {
    readonly lat: 30;
    readonly lng: 0;
    readonly altitude: 2.2;
    readonly minDistance: 120;
    readonly maxDistance: 2000;
};
/** Demo threat data for examples */
declare const DEMO_THREATS: ({
    id: string;
    lat: number;
    lng: number;
    city: string;
    country: string;
    level: "critical";
    count: number;
    timestamp: string;
} | {
    id: string;
    lat: number;
    lng: number;
    city: string;
    country: string;
    level: "high";
    count: number;
    timestamp: string;
} | {
    id: string;
    lat: number;
    lng: number;
    city: string;
    country: string;
    level: "medium";
    count: number;
    timestamp: string;
} | {
    id: string;
    lat: number;
    lng: number;
    city: string;
    country: string;
    level: "low";
    count: number;
    timestamp: string;
})[];

/** Convert lat/lng to Mercator projection pixel coordinates */
declare function latLngToMercator(lat: number, lng: number, width: number, height: number): {
    x: number;
    y: number;
};
/** Haversine distance between two lat/lng points in km */
declare function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number;
interface Cluster {
    lat: number;
    lng: number;
    points: GlobePoint[];
    totalCount: number;
    maxLevel: ThreatLevel;
}
/** Cluster nearby points based on a distance threshold in km */
declare function clusterPoints(points: GlobePoint[], thresholdKm?: number): Cluster[];
/** Apply filter criteria to a set of GlobePoints */
declare function filterPoints(points: GlobePoint[], criteria: FilterCriteria): GlobePoint[];
/** Get color for a threat level */
declare function getLevelColor(level: ThreatLevel, scheme?: Partial<ColorScheme>): string;
/** Parse hex color to rgba string */
declare function hexToRgba(hex: string, alpha?: number): string;
/** Throttle a function to at most once per `delay` ms */
declare function throttle<T extends (...args: unknown[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void;
/** Debounce a function */
declare function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void;
/** Escape HTML entities to prevent XSS */
declare function escapeHtml(str: string): string;
/** Create a safe tooltip HTML string with all dynamic values escaped */
declare function createTooltipHtml(point: GlobePoint, totalCount: number, colors?: Partial<ColorScheme>): string;
/** Export data as CSV string */
declare function pointsToCsv(points: GlobePoint[]): string;
/** Trigger file download in browser */
declare function downloadFile(content: string, filename: string, mime: string): void;
/** Capture a canvas/DOM element as PNG data URL */
declare function captureScreenshot(element: HTMLElement): Promise<string>;
interface BorderArc {
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
}
/** Load and cache country border arcs from GeoJSON */
declare function loadCountryBorders(url: string): Promise<BorderArc[]>;

export { ATMOSPHERE_COLORS, type CameraPosition, type ColorScheme, DEFAULT_CAMERA, DEMO_THREATS, type DataSourceConfig, EMISSIVE_SETTINGS, ExportButton, type ExportButtonProps, type ExportFormat, type FilterCriteria, GEOJSON_URL, Globe3DEnhanced, type Globe3DEnhancedProps, Globe3DWarGame, type Globe3DWarGameProps, type GlobeBaseProps, type GlobePoint, type GlobeTexture, LEVEL_COLORS, LEVEL_COLORS_DARK, LEVEL_COLORS_GLOW, PLANETS, SearchFilter, type SearchFilterProps, type ShadowGuardConfig, Starfield, type StarfieldProps, TEXTURE_URLS, type ThreatLevel, type TimeRange, TimelineSlider, type TimelineSliderProps, captureScreenshot, clusterPoints, createTooltipHtml, debounce, downloadFile, escapeHtml, filterPoints, getLevelColor, haversineDistance, hexToRgba, latLngToMercator, loadCountryBorders, pointsToCsv, throttle, useGlobe };
