// =============================================================================
// @canboigay/3d-globe-visualization — Main Entry Point
// =============================================================================

// Components
export { Globe3DEnhanced } from './components/Globe3DEnhanced';
export { Globe3DWarGame } from './components/Globe3DWarGame';
export { Starfield } from './components/Starfield';
export { TimelineSlider } from './components/TimelineSlider';
export { SearchFilter } from './components/SearchFilter';
export { ExportButton } from './components/ExportButton';

// Hooks
export { useGlobe } from './hooks/useGlobe';

// Types
export type {
  GlobePoint,
  ThreatLevel,
  GlobeTexture,
  ColorScheme,
  DataSourceConfig,
  ShadowGuardConfig,
  TimeRange,
  FilterCriteria,
  ExportFormat,
  CameraPosition,
  GlobeBaseProps,
  Globe3DEnhancedProps,
  Globe3DWarGameProps,
  StarfieldProps,
  TimelineSliderProps,
  SearchFilterProps,
  ExportButtonProps,
} from './types';

// Constants
export {
  LEVEL_COLORS,
  LEVEL_COLORS_DARK,
  LEVEL_COLORS_GLOW,
  TEXTURE_URLS,
  ATMOSPHERE_COLORS,
  EMISSIVE_SETTINGS,
  PLANETS,
  GEOJSON_URL,
  DEFAULT_CAMERA,
  DEMO_THREATS,
} from './constants';

// Utilities
export {
  latLngToMercator,
  haversineDistance,
  clusterPoints,
  filterPoints,
  getLevelColor,
  hexToRgba,
  throttle,
  debounce,
  escapeHtml,
  createTooltipHtml,
  pointsToCsv,
  downloadFile,
  captureScreenshot,
  loadCountryBorders,
} from './utils';
