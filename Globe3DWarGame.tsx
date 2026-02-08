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

export type GlobeTexture = 
  | 'war-ops'        // Military tactical style
  | 'night-vision'   // Green night vision
  | 'thermal'        // Heat signature style
  | 'tactical'       // NATO style topographic
  | 'satellite'      // Realistic satellite imagery
  | 'dark-ops'       // Black ops stealth style
  | 'neon-cyber'     // Cyberpunk neon style
  | 'classic';       // Standard blue marble

export type ViewMode = '3d' | '2d';

export interface WarGameConfig {
  homeLocation?: { lat: number; lng: number; label?: string };
  texture?: GlobeTexture;
  viewMode?: ViewMode;
  showMissileTrails?: boolean;
  showScanLines?: boolean;
  showRadarPulse?: boolean;
  showTargetReticles?: boolean;
  showThreatLevel?: boolean;
  enableExplosions?: boolean;
  militaryGrid?: boolean;
  showCoordinates?: boolean;
  warningAlerts?: boolean;
}

interface Globe3DWarGameProps {
  points: GlobePoint[];
  config?: WarGameConfig;
  className?: string;
  onPointClick?: (point: GlobePoint) => void;
  onViewModeChange?: (mode: ViewMode) => void;
}

const LEVEL_COLORS = {
  critical: '#ff0000',
  high: '#ff6600',
  medium: '#ffcc00',
  low: '#00ff00',
};

const TEXTURE_URLS: Record<GlobeTexture, { globe: string; bump?: string }> = {
  'war-ops': {
    globe: '//unpkg.com/three-globe/example/img/earth-dark.jpg',
    bump: '//unpkg.com/three-globe/example/img/earth-topology.png'
  },
  'night-vision': {
    globe: '//unpkg.com/three-globe/example/img/earth-night.jpg',
  },
  'thermal': {
    globe: '//unpkg.com/three-globe/example/img/earth-topology.png',
  },
  'tactical': {
    globe: '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    bump: '//unpkg.com/three-globe/example/img/earth-topology.png'
  },
  'satellite': {
    globe: '//unpkg.com/three-globe/example/img/earth-day.jpg',
    bump: '//unpkg.com/three-globe/example/img/earth-topology.png'
  },
  'dark-ops': {
    globe: '//unpkg.com/three-globe/example/img/earth-dark.jpg',
  },
  'neon-cyber': {
    globe: '//unpkg.com/three-globe/example/img/earth-night.jpg',
  },
  'classic': {
    globe: '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    bump: '//unpkg.com/three-globe/example/img/earth-topology.png'
  },
};

const DEFAULT_HOME = { lat: 49.2827, lng: -123.1207, label: 'COMMAND CENTER' };

export function Globe3DWarGame({
  points,
  config = {},
  className = '',
  onPointClick,
  onViewModeChange,
}: Globe3DWarGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(config.viewMode || '3d');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    homeLocation = DEFAULT_HOME,
    texture = 'war-ops',
    showMissileTrails = true,
    showScanLines = true,
    showRadarPulse = true,
    showTargetReticles = true,
    showThreatLevel = true,
    enableExplosions = false,
    militaryGrid = true,
    showCoordinates = true,
    warningAlerts = true,
  } = config;

  const toggleViewMode = () => {
    setIsTransitioning(true);
    const newMode: ViewMode = viewMode === '3d' ? '2d' : '3d';
    
    if (globeRef.current) {
      // Animate transformation
      const currentPOV = globeRef.current.pointOfView();
      
      if (newMode === '2d') {
        // Flatten to Mercator projection
        globeRef.current
          .pointOfView({ lat: 0, lng: 0, altitude: 4 }, 1500)
          .then(() => {
            setViewMode('2d');
            setIsTransitioning(false);
            onViewModeChange?.(newMode);
          });
      } else {
        // Return to 3D globe
        globeRef.current
          .pointOfView({ lat: 30, lng: 0, altitude: 2.2 }, 1500)
          .then(() => {
            setViewMode('3d');
            setIsTransitioning(false);
            onViewModeChange?.(newMode);
          });
      }
    }
  };

  useEffect(() => {
    if (!containerRef.current || globeRef.current) return;

    const textureConfig = TEXTURE_URLS[texture];
    const globe = new Globe(containerRef.current)
      .globeImageUrl(textureConfig.globe)
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(true)
      .atmosphereColor(texture === 'night-vision' ? '#00ff00' : texture === 'neon-cyber' ? '#ff00ff' : '#ff0000')
      .atmosphereAltitude(0.15);

    if (textureConfig.bump) {
      globe.bumpImageUrl(textureConfig.bump);
    }

    // Apply texture-specific styling
    if (texture === 'night-vision') {
      globe.atmosphereColor('#00ff00');
    } else if (texture === 'thermal') {
      globe.atmosphereColor('#ff6600');
    } else if (texture === 'neon-cyber') {
      globe.atmosphereColor('#00ffff');
    }

    // War game style threat markers (glowing hex pillars with military styling)
    globe
      .hexBinPointsData([])
      .hexBinPointWeight('count')
      .hexAltitude((d: any) => d.sumWeight * 0.002)
      .hexTopColor((d: any) => {
        const level = d.points[0]?.level || 'low';
        return LEVEL_COLORS[level as keyof typeof LEVEL_COLORS];
      })
      .hexSideColor((d: any) => {
        const level = d.points[0]?.level || 'low';
        const color = LEVEL_COLORS[level as keyof typeof LEVEL_COLORS];
        return color + '66';
      })
      .hexBinResolution(4)
      .hexLabel((d: any) => {
        const point = d.points[0];
        return `
          <div style="
            background: rgba(0, 0, 0, 0.95);
            padding: 12px 16px;
            border-radius: 4px;
            border: 2px solid ${LEVEL_COLORS[point.level as keyof typeof LEVEL_COLORS]};
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            box-shadow: 0 0 20px ${LEVEL_COLORS[point.level as keyof typeof LEVEL_COLORS]}aa;
            text-transform: uppercase;
          ">
            <div style="color: ${LEVEL_COLORS[point.level as keyof typeof LEVEL_COLORS]}; font-weight: bold; margin-bottom: 4px;">
              ⚠ THREAT DETECTED ⚠
            </div>
            <div style="color: #00ff00;">TARGET: ${point.label || point.city || 'UNKNOWN'}</div>
            ${point.country ? `<div style="color: #888;">REGION: ${point.country}</div>` : ''}
            <div style="color: #888;">LEVEL: <span style="color: ${LEVEL_COLORS[point.level as keyof typeof LEVEL_COLORS]}; font-weight: bold;">${point.level.toUpperCase()}</span></div>
            <div style="color: #888;">INCIDENTS: <span style="color: #ff0000; font-weight: bold;">${d.sumWeight}</span></div>
            ${showCoordinates ? `<div style="color: #666; font-size: 10px; margin-top: 4px;">LAT: ${point.lat.toFixed(4)} LNG: ${point.lng.toFixed(4)}</div>` : ''}
          </div>
        `;
      })
      .onHexClick((hex: any) => {
        if (onPointClick && hex.points[0]) {
          onPointClick(hex.points[0]);
          if (enableExplosions) {
            // Trigger explosion animation
            console.log('💥 IMPACT AT:', hex.points[0].city);
          }
        }
      });

    // Missile trail arcs (enhanced military style)
    if (showMissileTrails) {
      globe
        .arcsData([])
        .arcStartLat((d: any) => d.startLat)
        .arcStartLng((d: any) => d.startLng)
        .arcEndLat((d: any) => d.endLat)
        .arcEndLng((d: any) => d.endLng)
        .arcColor((d: any) => {
          const color = LEVEL_COLORS[d.level as keyof typeof LEVEL_COLORS];
          return [color + '22', color + 'ff'];
        })
        .arcDashLength(0.3)
        .arcDashGap(0.1)
        .arcDashAnimateTime(1500)
        .arcStroke(1)
        .arcAltitude(0.4)
        .arcAltitudeAutoScale(0.3);
    }

    // Command center marker
    globe
      .htmlElementsData([{ ...homeLocation, type: 'command' }])
      .htmlElement((d: any) => {
        if (d.type === 'command') {
          const el = document.createElement('div');
          el.innerHTML = `
            <div style="position: relative; width: 40px; height: 40px;">
              ${showRadarPulse ? `
                <div style="
                  position: absolute;
                  width: 60px;
                  height: 60px;
                  left: -10px;
                  top: -10px;
                  border: 2px solid #00ff00;
                  border-radius: 50%;
                  animation: radarPulse 2s ease-out infinite;
                "></div>
              ` : ''}
              ${showTargetReticles ? `
                <div style="
                  position: absolute;
                  width: 40px;
                  height: 40px;
                  border: 2px solid #00ff00;
                  border-radius: 50%;
                ">
                  <div style="position: absolute; width: 100%; height: 2px; background: #00ff00; top: 50%; transform: translateY(-50%);"></div>
                  <div style="position: absolute; height: 100%; width: 2px; background: #00ff00; left: 50%; transform: translateX(-50%);"></div>
                </div>
              ` : ''}
              <div style="
                position: absolute;
                width: 20px;
                height: 20px;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                background: radial-gradient(circle, #00ff00, #00ff00 40%, transparent 70%);
                border: 3px solid #00ff00;
                border-radius: 50%;
                box-shadow: 0 0 30px #00ff00, 0 0 60px #00ff00aa;
                animation: commandPulse 1.5s ease-in-out infinite;
              "></div>
              ${d.label ? `
                <div style="
                  position: absolute;
                  top: 50px;
                  left: 50%;
                  transform: translateX(-50%);
                  background: rgba(0, 255, 0, 0.9);
                  color: black;
                  padding: 4px 10px;
                  border-radius: 3px;
                  font-size: 10px;
                  font-weight: bold;
                  white-space: nowrap;
                  font-family: 'Courier New', monospace;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  border: 1px solid #00ff00;
                  box-shadow: 0 0 10px #00ff00;
                ">${d.label}</div>
              ` : ''}
              <style>
                @keyframes radarPulse {
                  0% { transform: scale(0.5); opacity: 1; }
                  100% { transform: scale(2); opacity: 0; }
                }
                @keyframes commandPulse {
                  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
                }
              </style>
            </div>
          `;
          return el;
        }
        return document.createElement('div');
      });

    // Military grid overlay
    if (militaryGrid) {
      // Add graticule lines (lat/long grid)
      fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_graticules_5.geojson')
        .then(res => res.json())
        .then(graticules => {
          globe
            .pathsData(graticules.features)
            .pathColor(() => 'rgba(0, 255, 0, 0.15)')
            .pathStroke(0.3)
            .pathDashLength(0.3)
            .pathDashGap(0.1);
        })
        .catch(() => console.log('Grid overlay unavailable'));
    }

    // Camera setup
    globe.pointOfView({ lat: 30, lng: 0, altitude: 2.2 }, 0);
    
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.3;
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
  }, [texture]);

  // Update points and arcs
  useEffect(() => {
    if (globeRef.current && points) {
      globeRef.current.hexBinPointsData(points);
      
      if (showMissileTrails && homeLocation) {
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
  }, [points, showMissileTrails, homeLocation]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Scan lines overlay */}
      {showScanLines && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)',
          pointerEvents: 'none',
          zIndex: 10,
        }} />
      )}

      {/* View mode toggle button */}
      <button
        onClick={toggleViewMode}
        disabled={isTransitioning}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 100,
          background: 'rgba(0, 255, 0, 0.2)',
          border: '2px solid #00ff00',
          color: '#00ff00',
          padding: '12px 24px',
          borderRadius: '4px',
          fontFamily: 'Courier New, monospace',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: isTransitioning ? 'not-allowed' : 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
          transition: 'all 0.3s',
          opacity: isTransitioning ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isTransitioning) {
            e.currentTarget.style.background = 'rgba(0, 255, 0, 0.4)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.8)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 255, 0, 0.2)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
        }}
      >
        {isTransitioning ? '◆ TRANSITIONING...' : viewMode === '3d' ? '▣ FLATTEN MAP' : '● GLOBE VIEW'}
      </button>

      {/* Warning alerts */}
      {warningAlerts && points.filter(p => p.level === 'critical').length > 0 && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 100,
          background: 'rgba(255, 0, 0, 0.2)',
          border: '2px solid #ff0000',
          color: '#ff0000',
          padding: '12px 20px',
          borderRadius: '4px',
          fontFamily: 'Courier New, monospace',
          fontSize: '14px',
          fontWeight: 'bold',
          animation: 'alertBlink 1s infinite',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          ⚠ {points.filter(p => p.level === 'critical').length} CRITICAL THREATS DETECTED
        </div>
      )}

      {/* Globe container */}
      <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }} />

      {/* Global styles */}
      <style>{`
        @keyframes alertBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
