import { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';

export interface GlobePoint {
  id: string;
  lat: number;
  lng: number;
  level: 'critical' | 'high' | 'medium' | 'low';
  count: number;
  city?: string;
  country?: string;
  label?: string;
}

export interface GlobeConfig {
  homeLocation?: { lat: number; lng: number; label?: string };
  showCountryBorders?: boolean;
  showCityLabels?: boolean;
  showAtmosphere?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  backgroundStyle?: 'space' | 'solid' | 'gradient';
  pointStyle?: 'hex' | 'sphere' | 'custom';
  showArcs?: boolean;
  theme?: 'dark' | 'light' | 'custom';
}

interface Globe3DEnhancedProps {
  points: GlobePoint[];
  config?: GlobeConfig;
  className?: string;
  centerLat?: number;
  centerLng?: number;
  onPointClick?: (point: GlobePoint) => void;
}

const LEVEL_COLORS = {
  critical: '#dc2626',
  high: '#f97316',
  medium: '#facc15',
  low: '#22c55e',
};

const DEFAULT_HOME = { lat: 49.2827, lng: -123.1207, label: 'Home Base' };

// Major world cities for labels
const WORLD_CITIES = [
  { name: 'New York', lat: 40.7128, lng: -74.0060, population: 8336817 },
  { name: 'London', lat: 51.5074, lng: -0.1278, population: 8982000 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, population: 13960000 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, population: 2161000 },
  { name: 'Moscow', lat: 55.7558, lng: 37.6173, population: 11920000 },
  { name: 'Beijing', lat: 39.9042, lng: 116.4074, population: 21540000 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, population: 3331000 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, population: 5686000 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, population: 5312000 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, population: 3979000 },
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333, population: 12330000 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, population: 20411000 },
  { name: 'Shanghai', lat: 31.2304, lng: 121.4737, population: 27060000 },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, population: 20900000 },
  { name: 'Lagos', lat: 6.5244, lng: 3.3792, population: 14368000 },
];

export function Globe3DEnhanced({
  points,
  config = {},
  className = '',
  centerLat = 30,
  centerLng = 0,
  onPointClick,
}: Globe3DEnhancedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [hoveredPoint, setHoveredPoint] = useState<GlobePoint | null>(null);

  const {
    homeLocation = DEFAULT_HOME,
    showCountryBorders = false,
    showCityLabels = true,
    showAtmosphere = true,
    autoRotate = true,
    autoRotateSpeed = 0.4,
    backgroundStyle = 'space',
    pointStyle = 'hex',
    showArcs = true,
    theme = 'dark',
  } = config;

  useEffect(() => {
    if (!containerRef.current || globeRef.current) return;

    const globe = new Globe(containerRef.current)
      // Base globe configuration
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(showAtmosphere)
      .atmosphereColor(theme === 'dark' ? '#6366f1' : '#3b82f6')
      .atmosphereAltitude(0.15);

    // Threat point visualization (hex bins for glowing pillars)
    if (pointStyle === 'hex') {
      globe
        .hexBinPointsData([])
        .hexBinPointWeight('count')
        .hexAltitude((d: any) => d.sumWeight * 0.0015)
        .hexTopColor((d: any) => {
          const level = d.points[0]?.level || 'low';
          return LEVEL_COLORS[level as keyof typeof LEVEL_COLORS];
        })
        .hexSideColor((d: any) => {
          const level = d.points[0]?.level || 'low';
          const color = LEVEL_COLORS[level as keyof typeof LEVEL_COLORS];
          return color + '44';
        })
        .hexBinResolution(3)
        .hexLabel((d: any) => {
          const point = d.points[0];
          return `
            <div style="
              background: rgba(18, 18, 26, 0.95);
              padding: 12px 16px;
              border-radius: 8px;
              border: 1px solid rgba(99, 102, 241, 0.3);
              color: white;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 13px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            ">
              <div style="font-weight: 600; margin-bottom: 6px; font-size: 14px;">${point.label || point.city || 'Unknown'}</div>
              ${point.country ? `<div style="color: #9ca3af; margin-bottom: 6px;">${point.country}</div>` : ''}
              <div style="color: #9ca3af; margin-bottom: 4px;">Level: <span style="color: ${LEVEL_COLORS[point.level as keyof typeof LEVEL_COLORS]}; font-weight: 600;">${point.level}</span></div>
              <div style="color: #9ca3af;">Threats: <span style="color: white; font-weight: 600;">${d.sumWeight}</span></div>
            </div>
          `;
        })
        .onHexClick((hex: any) => {
          if (onPointClick && hex.points[0]) {
            onPointClick(hex.points[0]);
          }
        });
    }

    // Connection arcs
    if (showArcs) {
      globe
        .arcsData([])
        .arcStartLat((d: any) => d.startLat)
        .arcStartLng((d: any) => d.startLng)
        .arcEndLat((d: any) => d.endLat)
        .arcEndLng((d: any) => d.endLng)
        .arcColor((d: any) => {
          const color = LEVEL_COLORS[d.level as keyof typeof LEVEL_COLORS];
          return [color + '44', color + 'aa'];
        })
        .arcDashLength(0.4)
        .arcDashGap(0.2)
        .arcDashAnimateTime(2000)
        .arcStroke(0.5)
        .arcAltitude(0.3)
        .arcAltitudeAutoScale(0.5);
    }

    // Home location marker
    globe
      .htmlElementsData([{ ...homeLocation, type: 'home' }])
      .htmlElement((d: any) => {
        if (d.type === 'home') {
          const el = document.createElement('div');
          el.innerHTML = `
            <div style="
              position: relative;
              width: 24px;
              height: 24px;
            ">
              <div style="
                position: absolute;
                width: 24px;
                height: 24px;
                background: radial-gradient(circle, #6366f1, #6366f1 30%, transparent 70%);
                border: 3px solid #6366f1;
                border-radius: 50%;
                box-shadow: 0 0 30px #6366f1, 0 0 60px #6366f1aa, 0 0 90px #6366f144;
                animation: homePulse 2s ease-in-out infinite;
              "></div>
              ${d.label ? `
                <div style="
                  position: absolute;
                  top: 30px;
                  left: 50%;
                  transform: translateX(-50%);
                  background: rgba(99, 102, 241, 0.9);
                  color: white;
                  padding: 4px 8px;
                  border-radius: 4px;
                  font-size: 10px;
                  font-weight: 600;
                  white-space: nowrap;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                ">${d.label}</div>
              ` : ''}
              <style>
                @keyframes homePulse {
                  0%, 100% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.3); opacity: 0.7; }
                }
              </style>
            </div>
          `;
          return el;
        }
        return document.createElement('div');
      });

    // City labels (if enabled)
    if (showCityLabels) {
      globe
        .labelsData(WORLD_CITIES)
        .labelLat((d: any) => d.lat)
        .labelLng((d: any) => d.lng)
        .labelText((d: any) => d.name)
        .labelSize(0.5)
        .labelDotRadius(0.4)
        .labelColor(() => theme === 'dark' ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)')
        .labelResolution(2);
    }

    // Country borders (if enabled)
    if (showCountryBorders) {
      fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
        .then(res => res.json())
        .then(countries => {
          globe
            .hexPolygonsData(countries.features)
            .hexPolygonResolution(3)
            .hexPolygonMargin(0.3)
            .hexPolygonColor(() => 'rgba(255,255,255,0.05)')
            .hexPolygonLabel(({ properties }: any) => `
              <div style="
                background: rgba(18, 18, 26, 0.95);
                padding: 8px 12px;
                border-radius: 6px;
                border: 1px solid rgba(99, 102, 241, 0.3);
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 12px;
              ">
                <b>${properties.NAME}</b>
                ${properties.POP_EST ? `<br/>Pop: ${(properties.POP_EST / 1e6).toFixed(1)}M` : ''}
              </div>
            `);
        });
    }

    // Camera and controls
    globe.pointOfView({ lat: centerLat, lng: centerLng, altitude: 2.2 }, 0);
    
    globe.controls().autoRotate = autoRotate;
    globe.controls().autoRotateSpeed = autoRotateSpeed;
    globe.controls().enableZoom = true;
    globe.controls().minDistance = 180;
    globe.controls().maxDistance = 800;

    globeRef.current = globe;

    // Resize handling
    const initialResize = () => {
      if (containerRef.current && globeRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        if (width > 0 && height > 0) {
          globeRef.current.width(width);
          globeRef.current.height(height);
        }
      }
    };
    
    setTimeout(initialResize, 0);
    setTimeout(initialResize, 100);

    const handleResize = () => {
      if (containerRef.current && globeRef.current) {
        globeRef.current.width(containerRef.current.offsetWidth);
        globeRef.current.height(containerRef.current.offsetHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (globeRef.current) {
        globeRef.current = null;
      }
    };
  }, []);

  // Update points and arcs when data changes
  useEffect(() => {
    if (globeRef.current && points) {
      globeRef.current.hexBinPointsData(points);
      
      if (showArcs && homeLocation) {
        const arcs = points.map(point => ({
          startLat: point.lat,
          startLng: point.lng,
          endLat: homeLocation.lat,
          endLng: homeLocation.lng,
          level: point.level,
        }));
        globeRef.current.arcsData(arcs);
      }
    }
  }, [points, showArcs, homeLocation]);

  return (
    <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }} />
  );
}
