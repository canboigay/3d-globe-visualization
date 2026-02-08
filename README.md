# 3D Globe Visualization

Interactive 3D globe for threat intelligence, geospatial monitoring, and real-time data visualization. Built on [globe.gl](https://github.com/vasturiano/globe.gl) and Three.js.

## Features

**Visualization Modes**
- 3D rotating globe with 8 texture themes (War-Ops, Night Vision, Thermal, Tactical, Satellite, Dark-Ops, Borders, Classic)
- 2D Mercator flat map with animated 3D flip transition
- Animated starfield with orbiting planets visible at zoom-out

**Threat Intelligence**
- Hex-binned threat pillars with 5-level severity coloring (critical, high, medium, low, info)
- Rich tooltips with city, country, severity, incident count
- Data clustering for large datasets (10,000+ points)
- STIX 2.1 compatible data model

**Interactive Controls**
- Search and filter by severity, country, keyword
- Timeline slider with histogram and playback
- Export to PNG screenshot, JSON, or CSV
- Pan, zoom, fly-to animations

**Production Quality**
- Zero memory leaks (proper Three.js disposal on unmount)
- XSS-safe tooltips (all dynamic content escaped)
- Throttled event handlers for 60fps performance
- IntersectionObserver pauses off-screen animations
- HiDPI/Retina canvas rendering
- ARIA labels and keyboard navigation

## Quick Start

### Standalone HTML (no build step)

Open `index.html` in a browser. Everything runs from CDN.

### React Component

```bash
npm install 3d-globe-visualization globe.gl three react react-dom
```

```tsx
import { Globe3DEnhanced, Starfield, DEMO_THREATS } from '3d-globe-visualization';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Starfield starCount={300} showPlanets />
      <Globe3DEnhanced
        data={DEMO_THREATS}
        texture="war-ops"
        autoRotate
        onPointClick={(point) => console.log('Clicked:', point)}
      />
    </div>
  );
}
```

### War Game Theme

```tsx
import { Globe3DWarGame, DEMO_THREATS } from '3d-globe-visualization';

<Globe3DWarGame
  data={DEMO_THREATS}
  texture="night-vision"
  showScanLine
  showRadarPulse
  onPointClick={(point) => console.log('Target:', point)}
/>
```

### With Filters and Timeline

```tsx
import {
  Globe3DEnhanced, SearchFilter, TimelineSlider,
  ExportButton, filterPoints, DEMO_THREATS
} from '3d-globe-visualization';
import { useState, useRef } from 'react';

function Dashboard() {
  const containerRef = useRef(null);
  const [filters, setFilters] = useState({});
  const [timeRange, setTimeRange] = useState({
    start: new Date('2026-02-07T00:00:00Z'),
    end: new Date('2026-02-08T00:00:00Z'),
  });

  const filtered = filterPoints(DEMO_THREATS, { ...filters, timeRange });
  const countries = [...new Set(DEMO_THREATS.map(d => d.country).filter(Boolean))];

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Globe3DEnhanced data={filtered} texture="dark-ops" />

      <div style={{ position: 'absolute', top: 20, right: 20, width: 260 }}>
        <SearchFilter
          filters={filters}
          onChange={setFilters}
          availableCountries={countries}
        />
      </div>

      <div style={{ position: 'absolute', bottom: 80, left: 20, right: 20, maxWidth: 500 }}>
        <TimelineSlider
          data={DEMO_THREATS}
          timeRange={timeRange}
          onChange={setTimeRange}
        />
      </div>

      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <ExportButton containerRef={containerRef} data={filtered} />
      </div>
    </div>
  );
}
```

## Data Format

```typescript
interface GlobePoint {
  id: string;
  lat: number;
  lng: number;
  city?: string;
  country?: string;
  label?: string;
  level: 'critical' | 'high' | 'medium' | 'low' | 'info';
  count: number;
  timestamp?: string; // ISO 8601
  meta?: Record<string, string | number | boolean>;
}
```

## Components

| Component | Description |
|-----------|-------------|
| `Globe3DEnhanced` | Production globe with hex bins, tooltips, borders |
| `Globe3DWarGame` | Military-themed globe with tactical HUD and scan effects |
| `Starfield` | Animated canvas starfield with orbiting planets |
| `TimelineSlider` | Time-series scrubber with histogram and playback |
| `SearchFilter` | Collapsible filter panel with severity/country/search |
| `ExportButton` | PNG/JSON/CSV export dropdown |

## Hooks

| Hook | Description |
|------|-------------|
| `useGlobe` | Low-level hook for custom globe management |

## Utilities

| Function | Description |
|----------|-------------|
| `filterPoints` | Apply FilterCriteria to GlobePoint array |
| `clusterPoints` | Distance-based clustering for large datasets |
| `latLngToMercator` | Lat/lng to pixel coordinate conversion |
| `createTooltipHtml` | XSS-safe tooltip HTML generator |
| `pointsToCsv` | Convert GlobePoint array to CSV string |
| `loadCountryBorders` | Cached GeoJSON border loader |

## Textures

| Texture | Atmosphere | Emissive | Best For |
|---------|-----------|----------|----------|
| `war-ops` | Blue | None | Default, general purpose |
| `night-vision` | Green | Green 0.1 | Tactical operations |
| `thermal` | Orange | Orange 0.15 | Heat-map style |
| `tactical` | Blue | None | Military planning |
| `satellite` | Light blue | None | Geographic context |
| `dark-ops` | Orange | Orange 0.3 | Covert operations |
| `borders` | Cyan | Cyan 0.1 | Political boundaries |
| `classic` | Blue | None | Clean presentation |

## Architecture

```
src/
  components/     Globe3DEnhanced, Globe3DWarGame, Starfield, controls
  hooks/          useGlobe (lifecycle, disposal, resize)
  types/          Full TypeScript interfaces
  constants/      Colors, textures, planets, demo data
  utils/          Geometry, clustering, filtering, XSS safety, export
```

## Performance

- **Memory**: Proper Three.js disposal prevents WebGL context leaks
- **Rendering**: Throttled resize, IntersectionObserver for off-screen pause
- **Data**: Hex-bin clustering handles 10,000+ points at 60fps
- **Network**: Country borders fetched once and cached

## Latest Commit

```
 Piggy Benissy says: Globe globe globe is the piggest benisest

        _._ _..._ .-',     _.._(``))
       '-. `     '  /-._.-'    ',/
          )         \            '.
         / _    _    |             \
        |  a    a    /              |
        \   .-.                     ;
         '-('' ).-'       ,'       ;
            '-;           |      .'
               \           \    /
               | 7  .__  _.-\   \
               | |  |  ``    |    |
              /,_|  |   /,_/    /
                 /,_/      '----'

 - @SimeonGarratt
```

## License

MIT
