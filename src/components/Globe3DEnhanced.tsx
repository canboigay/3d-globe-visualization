// =============================================================================
// Globe3DEnhanced — Production-ready 3D globe with threat visualization
// Fixes: memory leaks, XSS, clustering, perf, error handling, accessibility
// =============================================================================

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import Globe from 'globe.gl';
import type { GlobeInstance } from 'globe.gl';
import type { Globe3DEnhancedProps, GlobePoint, GlobeTexture } from '../types';
import { LEVEL_COLORS, TEXTURE_URLS, ATMOSPHERE_COLORS, EMISSIVE_SETTINGS, GEOJSON_URL, DEFAULT_CAMERA } from '../constants';
import { createTooltipHtml, getLevelColor, loadCountryBorders, throttle } from '../utils';

export function Globe3DEnhanced({
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
  showCityLabels = false,
  showArcs = false,
  hexAltitudeMultiplier = 0.002,
  width = '100%',
  height = '100%',
  className = '',
}: Globe3DEnhancedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [altitude, setAltitude] = useState(initialPosition?.altitude ?? DEFAULT_CAMERA.altitude);
  const [currentTexture, setCurrentTexture] = useState<GlobeTexture>(texture);
  const altitudeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const borderArcsRef = useRef<Array<{ startLat: number; startLng: number; endLat: number; endLng: number }>>([]);
  const destroyedRef = useRef(false);

  // Merged color scheme
  const mergedColors = useMemo(() => ({ ...LEVEL_COLORS, ...colors }), [colors]);

  // ── Initialize globe ──────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    destroyedRef.current = false;

    const init = () => {
      try {
        if (destroyedRef.current) return;

        const textureConfig = TEXTURE_URLS[currentTexture];
        const atmosphereColor = ATMOSPHERE_COLORS[currentTexture];

        const globe = Globe()
          .globeImageUrl(textureConfig.globe)
          .backgroundColor('rgba(0,0,0,0)')
          .showAtmosphere(showAtmosphere)
          .atmosphereColor(atmosphereColor)
          .atmosphereAltitude(0.15)
          .onGlobeReady(() => {
            if (destroyedRef.current) return;
            try {
              const mat = globe.globeMaterial();
              const { color, intensity } = EMISSIVE_SETTINGS[currentTexture];
              mat.emissive = new THREE.Color(color);
              mat.emissiveIntensity = intensity;
            } catch { /* THREE not loaded yet */ }
            setIsReady(true);
          })
          .hexBinPointsData(data)
          .hexBinPointWeight('count')
          .hexAltitude((d) => d.sumWeight * hexAltitudeMultiplier)
          .hexTopColor((d) => getLevelColor((d.points[0] as GlobePoint).level, mergedColors))
          .hexSideColor((d) => getLevelColor((d.points[0] as GlobePoint).level, mergedColors) + '66')
          .hexBinResolution(clusterResolution)
          .hexLabel((d) =>
            createTooltipHtml(d.points[0] as GlobePoint, d.sumWeight, mergedColors)
          )
          .onHexClick((d) => {
            if (onPointClick && d.points[0]) onPointClick(d.points[0] as GlobePoint);
          })
          .onHexHover((d) => {
            if (onPointHover) onPointHover((d?.points?.[0] as GlobePoint) ?? null);
          })
          .arcsData([])
          .arcColor(() => '#00ffff')
          .arcStroke(0.5)
          .arcAltitude(0.005)
          .arcAltitudeAutoScale(0.3);

        if (textureConfig.bump) {
          globe.bumpImageUrl(textureConfig.bump);
        }

        if (showCityLabels) {
          globe.labelsData(data.filter(d => d.city));
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

        // Home location marker
        if (homeLocation) {
          globe
            .pointsData([homeLocation])
            .pointColor(() => '#00ff88')
            .pointAltitude(0.01)
            .pointRadius(0.5);
        }

        // Load borders
        loadCountryBorders(GEOJSON_URL).then((arcs) => {
          if (destroyedRef.current) return;
          borderArcsRef.current = arcs;
          if ((showBorders || currentTexture === 'borders') && globe) {
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
        console.error('Globe3DEnhanced: Failed to initialize', err);
      }
    };

    init();

    // Resize handler (throttled)
    const handleResize = throttle(() => {
      if (container && globeRef.current && !destroyedRef.current) {
        globeRef.current.width(container.clientWidth).height(container.clientHeight);
      }
    }, 100);
    window.addEventListener('resize', handleResize);

    // Altitude tracker for starfield planet visibility
    const altTimer = setInterval(() => {
      if (globeRef.current && !destroyedRef.current) {
        try {
          const pov = globeRef.current.pointOfView();
          setAltitude(pov.altitude);
        } catch { /* not ready */ }
      }
    }, 150);
    altitudeTimerRef.current = altTimer;

    // ── CLEANUP (memory leak fix) ──────────────────────────────────────
    return () => {
      destroyedRef.current = true;
      window.removeEventListener('resize', handleResize);
      if (altitudeTimerRef.current) clearInterval(altitudeTimerRef.current);

      if (globeRef.current) {
        const g = globeRef.current;

        // Dispose Three.js renderer
        try {
          const renderer = g.renderer();
          if (renderer) {
            renderer.dispose();
            renderer.forceContextLoss();
            const canvas = renderer.domElement;
            canvas?.parentNode?.removeChild(canvas);
          }
        } catch { /* no renderer */ }

        // Dispose scene textures and geometries
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
        } catch { /* no scene */ }

        // Remove all DOM children
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }

        globeRef.current = null;
      }
    };
  }, []); // Mount once

  // ── Update data reactively ────────────────────────────────────────────
  useEffect(() => {
    if (globeRef.current && !destroyedRef.current) {
      globeRef.current.hexBinPointsData(data);
    }
  }, [data]);

  // ── Texture switching (without destroying globe) ──────────────────────
  useEffect(() => {
    if (!globeRef.current || destroyedRef.current || currentTexture === texture) return;
    setCurrentTexture(texture);

    const g = globeRef.current;
    const config = TEXTURE_URLS[texture];

    g.globeImageUrl(config.globe);
    g.atmosphereColor(ATMOSPHERE_COLORS[texture]);

    // Emissive
    try {
      const mat = g.globeMaterial();
      const { color, intensity } = EMISSIVE_SETTINGS[texture];
      mat.emissive = new THREE.Color(color);
      mat.emissiveIntensity = intensity;
    } catch { /* */ }

    // Borders toggle
    if (texture === 'borders' && borderArcsRef.current.length > 0) {
      g.arcsData(borderArcsRef.current)
        .arcColor(() => '#00ffff')
        .arcStroke(0.8)
        .arcAltitude(0)
        .arcAltitudeAutoScale(0.01);
    } else if (showBorders && borderArcsRef.current.length > 0) {
      g.arcsData(borderArcsRef.current);
    } else {
      g.arcsData([]);
    }
  }, [texture]);

  // ── Expose flyTo for parent components ────────────────────────────────
  const flyTo = useCallback((lat: number, lng: number, alt: number = 1.5) => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat, lng, altitude: alt }, 1500);
    }
  }, []);

  // Expose via imperative handle pattern (attach to container)
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      (el as unknown as { flyTo: typeof flyTo; getAltitude: () => number }).flyTo = flyTo;
      (el as unknown as { flyTo: typeof flyTo; getAltitude: () => number }).getAltitude = () => altitude;
    }
  }, [flyTo, altitude]);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: 'relative',
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      className={className}
      role="img"
      aria-label="3D threat intelligence globe visualization"
    >
      {/* Loading skeleton */}
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.8)',
        }}>
          <div style={{ textAlign: 'center', color: '#9ca3af' }}>
            <div style={{
              width: 48, height: 48, margin: '0 auto 16px',
              border: '3px solid rgba(255,255,255,0.1)',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <div>Loading globe...</div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.9)',
        }}>
          <div style={{
            textAlign: 'center', color: '#ef4444',
            padding: '24px', borderRadius: '12px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            maxWidth: 400,
          }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Failed to load</div>
            <div style={{ fontSize: 14, color: '#9ca3af' }}>{error}</div>
          </div>
        </div>
      )}

      {/* Globe mount point */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          transition: 'opacity 0.5s ease',
          opacity: isReady ? 1 : 0,
        }}
      />

      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

export default Globe3DEnhanced;
