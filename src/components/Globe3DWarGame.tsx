// =============================================================================
// Globe3DWarGame — Military-themed 3D globe with tactical effects
// Fixes: memory leaks, texture switching without reload, animation safety
// =============================================================================

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import Globe from 'globe.gl';
import type { GlobeInstance } from 'globe.gl';
import type { Globe3DWarGameProps, GlobePoint, GlobeTexture } from '../types';
import { LEVEL_COLORS, TEXTURE_URLS, ATMOSPHERE_COLORS, EMISSIVE_SETTINGS, GEOJSON_URL, DEFAULT_CAMERA } from '../constants';
import { createTooltipHtml, getLevelColor, loadCountryBorders, throttle } from '../utils';

/** Texture display names */
const TEXTURE_LABELS: Record<GlobeTexture, string> = {
  'war-ops': 'WAR-OPS',
  'night-vision': 'NIGHT VISION',
  'thermal': 'THERMAL',
  'tactical': 'TACTICAL',
  'satellite': 'SATELLITE',
  'dark-ops': 'DARK-OPS',
  'borders': 'BORDERS',
  'classic': 'CLASSIC',
};

export function Globe3DWarGame({
  data,
  texture = 'war-ops',
  colors = {},
  showAtmosphere = true,
  showBorders = false,
  autoRotate = true,
  autoRotateSpeed = 0.3,
  initialPosition,
  homeLocation,
  onPointClick,
  onPointHover,
  loading = false,
  error = null,
  enableClustering = true,
  clusterResolution = 4,
  showMissileTrails = false,
  showRadarPulse = false,
  showScanLine = false,
  tacticalTint,
  width = '100%',
  height = '100%',
  className = '',
}: Globe3DWarGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTexture, setCurrentTexture] = useState<GlobeTexture>(texture);
  const [hoveredTexture, setHoveredTexture] = useState<GlobeTexture | null>(null);
  const borderArcsRef = useRef<Array<{ startLat: number; startLng: number; endLat: number; endLng: number }>>([]);
  const destroyedRef = useRef(false);

  const mergedColors = useMemo(() => ({ ...LEVEL_COLORS, ...colors }), [colors]);

  // ── Initialize globe ──────────────────────────────────────────────────
  useEffect(() => {
    const container = globeContainerRef.current;
    if (!container) return;
    destroyedRef.current = false;

    const init = () => {
      try {
        if (destroyedRef.current) return;

        const textureConfig = TEXTURE_URLS[currentTexture];

        const globe = Globe()
          .globeImageUrl(textureConfig.globe)
          .backgroundColor('rgba(0,0,0,0)')
          .showAtmosphere(showAtmosphere)
          .atmosphereColor(ATMOSPHERE_COLORS[currentTexture])
          .atmosphereAltitude(0.15)
          .onGlobeReady(() => {
            if (destroyedRef.current) return;
            try {
              const mat = globe.globeMaterial();
              const { color, intensity } = EMISSIVE_SETTINGS[currentTexture];
              mat.emissive = new THREE.Color(color);
              mat.emissiveIntensity = intensity;
            } catch { /* */ }
            setIsReady(true);
          })
          .hexBinPointsData(data)
          .hexBinPointWeight('count')
          .hexAltitude((d) => d.sumWeight * 0.002)
          .hexTopColor((d) => getLevelColor((d.points[0] as GlobePoint).level, mergedColors))
          .hexSideColor((d) => getLevelColor((d.points[0] as GlobePoint).level, mergedColors) + '66')
          .hexBinResolution(clusterResolution)
          .hexLabel((d) =>
            createTooltipHtml(d.points[0] as GlobePoint, d.sumWeight, mergedColors)
          )
          .onHexClick((d) => {
            if (onPointClick && d.points[0]) onPointClick(d.points[0] as GlobePoint);
          })
          .arcsData([])
          .arcColor(() => '#00ffff')
          .arcStroke(0.5);

        if (textureConfig.bump) {
          globe.bumpImageUrl(textureConfig.bump);
        }

        // Mount to DOM
        globe(container);

        // Set initial position
        const pos = initialPosition ?? { lat: DEFAULT_CAMERA.lat, lng: DEFAULT_CAMERA.lng, altitude: DEFAULT_CAMERA.altitude };
        globe.pointOfView(pos);

        // Controls
        const controls = globe.controls();
        if (controls) {
          controls.autoRotate = autoRotate;
          controls.autoRotateSpeed = autoRotateSpeed;
          controls.enableZoom = true;
          controls.minDistance = DEFAULT_CAMERA.minDistance;
          controls.maxDistance = DEFAULT_CAMERA.maxDistance;
        }

        // Borders
        loadCountryBorders(GEOJSON_URL).then((arcs) => {
          if (destroyedRef.current) return;
          borderArcsRef.current = arcs;
          if (currentTexture === 'borders') {
            globe
              .arcsData(arcs)
              .arcColor(() => '#00ffff')
              .arcStroke(0.8)
              .arcAltitude(0)
              .arcAltitudeAutoScale(0.01);
          }
        });

        globeRef.current = globe;

        // Initial resize
        requestAnimationFrame(() => {
          if (container && globe && !destroyedRef.current) {
            globe.width(container.clientWidth).height(container.clientHeight);
          }
        });

      } catch (err) {
        console.error('Globe3DWarGame: Failed to initialize', err);
      }
    };

    init();

    // Resize handler (throttled)
    const handleResize = throttle(() => {
      if (globeContainerRef.current && globeRef.current && !destroyedRef.current) {
        globeRef.current
          .width(globeContainerRef.current.clientWidth)
          .height(globeContainerRef.current.clientHeight);
      }
    }, 100);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      destroyedRef.current = true;
      window.removeEventListener('resize', handleResize);

      if (globeRef.current) {
        const g = globeRef.current;

        // Dispose renderer
        try {
          const renderer = g.renderer();
          if (renderer) {
            renderer.dispose();
            renderer.forceContextLoss();
          }
        } catch { /* */ }

        // Dispose scene
        try {
          const scene = g.scene();
          if (scene) {
            scene.traverse((obj: THREE.Object3D) => {
              const mesh = obj as THREE.Mesh;
              if (mesh.geometry) mesh.geometry.dispose();
              if (mesh.material) {
                const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                mats.forEach((mat: THREE.Material & { map?: THREE.Texture }) => {
                  if (mat.map) mat.map.dispose();
                  mat.dispose();
                });
              }
            });
          }
        } catch { /* */ }

        while (container.firstChild) container.removeChild(container.firstChild);
        globeRef.current = null;
      }
    };
  }, []);

  // ── Update data ───────────────────────────────────────────────────────
  useEffect(() => {
    if (globeRef.current && !destroyedRef.current) {
      globeRef.current.hexBinPointsData(data);
    }
  }, [data]);

  // ── Texture switching (no reload!) ────────────────────────────────────
  const switchTexture = useCallback((newTexture: GlobeTexture) => {
    if (!globeRef.current || destroyedRef.current) return;
    setCurrentTexture(newTexture);

    const g = globeRef.current;
    const config = TEXTURE_URLS[newTexture];

    g.globeImageUrl(config.globe);
    g.atmosphereColor(ATMOSPHERE_COLORS[newTexture]);

    try {
      const mat = g.globeMaterial();
      const { color, intensity } = EMISSIVE_SETTINGS[newTexture];
      mat.emissive = new THREE.Color(color);
      mat.emissiveIntensity = intensity;
    } catch { /* */ }

    if (newTexture === 'borders' && borderArcsRef.current.length > 0) {
      g.arcsData(borderArcsRef.current)
        .arcColor(() => '#00ffff')
        .arcStroke(0.8)
        .arcAltitude(0);
    } else {
      g.arcsData([]);
    }
  }, []);

  // Sync with prop changes
  useEffect(() => {
    if (texture !== currentTexture) switchTexture(texture);
  }, [texture]);

  const flyTo = useCallback((lat: number, lng: number, alt: number = 1.5) => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat, lng, altitude: alt }, 1500);
    }
  }, []);

  // ── HUD Stats ─────────────────────────────────────────────────────────
  const criticalCount = useMemo(() => data.filter(d => d.level === 'critical').length, [data]);
  const highCount = useMemo(() => data.filter(d => d.level === 'high').length, [data]);

  // ── Render ────────────────────────────────────────────────────────────
  const allTextures: GlobeTexture[] = ['war-ops', 'night-vision', 'thermal', 'tactical', 'satellite', 'dark-ops', 'borders', 'classic'];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        background: '#000',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        overflow: 'hidden',
      }}
      className={className}
      role="img"
      aria-label="3D tactical threat intelligence globe"
    >
      {/* Loading */}
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.9)',
        }}>
          <div style={{ textAlign: 'center', color: '#9ca3af' }}>
            <div style={{
              width: 48, height: 48, margin: '0 auto 16px',
              border: '3px solid rgba(255,255,255,0.1)',
              borderTopColor: '#ef4444',
              borderRadius: '50%',
              animation: 'wg-spin 1s linear infinite',
            }} />
            <div style={{ letterSpacing: 2, textTransform: 'uppercase', fontSize: 13 }}>INITIALIZING...</div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.95)',
        }}>
          <div style={{
            textAlign: 'center', color: '#ef4444', padding: 24,
            borderRadius: 12, background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)', maxWidth: 400,
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>SYSTEM ERROR</div>
            <div style={{ fontSize: 13, color: '#9ca3af' }}>{error}</div>
          </div>
        </div>
      )}

      {/* Top HUD */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 60, zIndex: 50,
        background: 'linear-gradient(180deg, rgba(10,14,26,0.95) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 30px',
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 3, color: '#e8eaed' }}>
          THREAT INTELLIGENCE
        </div>
        <div style={{ fontSize: 13, color: '#9ca3af', letterSpacing: 1 }}>
          THREATS: <span style={{ color: '#e8eaed', fontWeight: 600 }}>{data.length}</span>
          <span style={{ margin: '0 12px', opacity: 0.3 }}>|</span>
          MODE: <span style={{ color: '#e8eaed', fontWeight: 600 }}>{TEXTURE_LABELS[currentTexture]}</span>
        </div>
      </div>

      {/* Critical alert */}
      {criticalCount > 0 && (
        <div style={{
          position: 'absolute', top: 75, left: 20, zIndex: 50,
          background: 'rgba(239,68,68,0.15)',
          border: '1px solid rgba(239,68,68,0.4)',
          color: '#ef4444', padding: '10px 16px', borderRadius: 6,
          fontSize: 13, fontWeight: 600,
          animation: 'wg-blink 2s infinite',
          textTransform: 'uppercase', letterSpacing: 0.5,
          backdropFilter: 'blur(10px)',
        }}>
          {criticalCount} CRITICAL THREATS DETECTED
        </div>
      )}

      {/* Globe mount */}
      <div
        ref={globeContainerRef}
        style={{
          position: 'absolute', inset: 0, zIndex: 5,
          transition: 'opacity 0.5s ease',
          opacity: isReady ? 1 : 0,
        }}
      />

      {/* Scan line overlay */}
      {showScanLine && isReady && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)',
          animation: 'wg-scanline 8s linear infinite',
        }} />
      )}

      {/* Texture controls */}
      <div style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 50, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center',
        background: 'rgba(10,14,26,0.9)', padding: '12px 16px',
        borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
        backdropFilter: 'blur(10px)', maxWidth: '90%',
      }}>
        {allTextures.map((t) => (
          <button
            key={t}
            onClick={() => switchTexture(t)}
            onMouseEnter={() => setHoveredTexture(t)}
            onMouseLeave={() => setHoveredTexture(null)}
            style={{
              background: currentTexture === t
                ? 'rgba(59,130,246,0.8)'
                : hoveredTexture === t
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(255,255,255,0.05)',
              border: `1px solid ${currentTexture === t ? 'rgba(59,130,246,1)' : 'rgba(255,255,255,0.2)'}`,
              color: currentTexture === t ? '#fff' : '#e8eaed',
              padding: '8px 14px', borderRadius: 6,
              fontSize: 11, fontWeight: 500, cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: 0.5,
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
            aria-label={`Switch to ${TEXTURE_LABELS[t]} texture`}
            aria-pressed={currentTexture === t}
          >
            {TEXTURE_LABELS[t]}
          </button>
        ))}
      </div>

      {/* CSS */}
      <style>{`
        @keyframes wg-spin { to { transform: rotate(360deg) } }
        @keyframes wg-blink { 0%,100% { opacity: 1 } 50% { opacity: 0.6 } }
        @keyframes wg-scanline { 0% { background-position: 0 0 } 100% { background-position: 0 100vh } }
      `}</style>
    </div>
  );
}

export default Globe3DWarGame;
