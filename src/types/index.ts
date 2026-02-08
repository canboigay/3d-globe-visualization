// =============================================================================
// @shadowguard/globe — Centralized Type Definitions
// =============================================================================

/** Threat severity level */
export type ThreatLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

/** A single point on the globe representing a threat or event */
export interface GlobePoint {
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
export type GlobeTexture =
  | 'war-ops'
  | 'night-vision'
  | 'thermal'
  | 'tactical'
  | 'satellite'
  | 'dark-ops'
  | 'borders'
  | 'classic';

/** Color scheme configuration */
export interface ColorScheme {
  critical: string;
  high: string;
  medium: string;
  low: string;
  info: string;
}

/** Real-time data source configuration */
export interface DataSourceConfig {
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
export interface ShadowGuardConfig {
  apiUrl: string;
  apiKey: string;
  tenantId: string;
  /** Auto-refresh interval in ms (default: 30000) */
  refreshInterval?: number;
}

/** Time range for time-series filtering */
export interface TimeRange {
  start: Date;
  end: Date;
}

/** Search/filter criteria */
export interface FilterCriteria {
  levels?: ThreatLevel[];
  countries?: string[];
  cities?: string[];
  search?: string;
  timeRange?: TimeRange;
  minCount?: number;
}

/** Export format options */
export type ExportFormat = 'png' | 'svg' | 'json' | 'csv';

/** Camera position on the globe */
export interface CameraPosition {
  lat: number;
  lng: number;
  altitude: number;
}

/** Globe component props — shared between Enhanced and WarGame */
export interface GlobeBaseProps {
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
  homeLocation?: { lat: number; lng: number; label?: string };
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
export interface Globe3DEnhancedProps extends GlobeBaseProps {
  /** Show city labels on the globe */
  showCityLabels?: boolean;
  /** Show arc connections between threats */
  showArcs?: boolean;
  /** Hex bin altitude multiplier */
  hexAltitudeMultiplier?: number;
}

/** WarGame globe-specific props */
export interface Globe3DWarGameProps extends GlobeBaseProps {
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
export interface StarfieldProps {
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
export interface TimelineSliderProps {
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
export interface SearchFilterProps {
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
export interface ExportButtonProps {
  /** Globe container ref for screenshot capture */
  containerRef: React.RefObject<HTMLElement>;
  /** Current data for JSON/CSV export */
  data: GlobePoint[];
  /** Supported formats */
  formats?: ExportFormat[];
}
