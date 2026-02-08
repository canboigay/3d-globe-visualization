// =============================================================================
// useGlobe — Shared globe lifecycle management hook
// =============================================================================

import { useRef, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';
import Globe from 'globe.gl';
import type { GlobeInstance } from 'globe.gl';
import type { GlobePoint, GlobeTexture, ColorScheme } from '../types';
import { LEVEL_COLORS, TEXTURE_URLS, ATMOSPHERE_COLORS, EMISSIVE_SETTINGS, GEOJSON_URL } from '../constants';
import { loadCountryBorders, createTooltipHtml, getLevelColor } from '../utils';

interface UseGlobeOptions {
  containerRef: React.RefObject<HTMLElement | null>;
  data: GlobePoint[];
  texture: GlobeTexture;
  colors?: Partial<ColorScheme>;
  showAtmosphere?: boolean;
  showBorders?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  initialPosition?: { lat: number; lng: number; altitude: number };
  homeLocation?: { lat: number; lng: number; label?: string };
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

export function useGlobe(options: UseGlobeOptions): UseGlobeReturn {
  const globeRef = useRef<GlobeInstance | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [altitude, setAltitude] = useState(options.initialPosition?.altitude ?? 2.2);
  const altitudeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const borderArcsRef = useRef<Array<{ startLat: number; startLng: number; endLat: number; endLng: number }>>([]);
  const destroyedRef = useRef(false);

  // Track altitude for planet visibility
  useEffect(() => {
    altitudeTimerRef.current = setInterval(() => {
      if (globeRef.current && !destroyedRef.current) {
        try {
          const pov = globeRef.current.pointOfView();
          setAltitude(pov.altitude);
        } catch {
          // Globe not ready yet
        }
      }
    }, 100);

    return () => {
      if (altitudeTimerRef.current) clearInterval(altitudeTimerRef.current);
    };
  }, []);

  // Initialize globe
  useEffect(() => {
    const container = options.containerRef.current;
    if (!container) return;
    destroyedRef.current = false;

    const mergedColors = { ...LEVEL_COLORS, ...(options.colors || {}) };

    const init = () => {
      try {
        if (destroyedRef.current) return;

        const textureConfig = TEXTURE_URLS[options.texture];
        const atmosphereColor = ATMOSPHERE_COLORS[options.texture];
        const { color: emissiveColor, intensity: emissiveIntensity } = EMISSIVE_SETTINGS[options.texture];

        const globe = Globe()
          .globeImageUrl(textureConfig.globe)
          .backgroundColor('rgba(0,0,0,0)')
          .showAtmosphere(options.showAtmosphere !== false)
          .atmosphereColor(atmosphereColor)
          .atmosphereAltitude(0.15)
          .onGlobeReady(() => {
            if (destroyedRef.current) return;
            try {
              const mat = globe.globeMaterial();
              mat.emissive = new THREE.Color(emissiveColor);
              mat.emissiveIntensity = emissiveIntensity;
            } catch { /* THREE not available */ }
            setIsReady(true);
          })
          .hexBinPointsData(options.data)
          .hexBinPointWeight('count')
          .hexAltitude((d) => d.sumWeight * (options.hexAltitudeMultiplier ?? 0.002))
          .hexTopColor((d) =>
            getLevelColor((d.points[0] as GlobePoint).level, mergedColors)
          )
          .hexSideColor((d) =>
            getLevelColor((d.points[0] as GlobePoint).level, mergedColors) + '66'
          )
          .hexBinResolution(options.clusterResolution ?? 4)
          .hexLabel((d) =>
            createTooltipHtml(d.points[0] as GlobePoint, d.sumWeight, mergedColors)
          )
          .arcsData([])
          .arcColor(() => '#00ffff')
          .arcStroke(0.5);

        if (textureConfig.bump) {
          globe.bumpImageUrl(textureConfig.bump);
        }

        // Mount
        globe(container as HTMLElement);

        // Set initial POV
        const pos = options.initialPosition ?? { lat: 30, lng: 0, altitude: 2.2 };
        globe.pointOfView(pos);

        // Controls
        const controls = globe.controls();
        if (controls) {
          controls.autoRotate = options.autoRotate !== false;
          controls.autoRotateSpeed = options.autoRotateSpeed ?? 0.3;
          controls.enableZoom = true;
          controls.minDistance = 120;
          controls.maxDistance = 2000;
        }

        // Load borders if requested
        if (options.showBorders || options.texture === 'borders') {
          loadCountryBorders(GEOJSON_URL).then((arcs) => {
            if (destroyedRef.current) return;
            borderArcsRef.current = arcs;
            if (options.texture === 'borders') {
              globe
                .arcsData(arcs)
                .arcColor(() => '#00ffff')
                .arcStroke(0.8)
                .arcAltitude(0)
                .arcAltitudeAutoScale(0.01);
            }
          });
        }

        globeRef.current = globe;

        // Initial resize
        requestAnimationFrame(() => {
          if (container && globe && !destroyedRef.current) {
            globe.width(container.clientWidth).height(container.clientHeight);
          }
        });
      } catch (err) {
        console.error('useGlobe: Failed to initialize', err);
      }
    };

    init();

    // Resize handler
    const handleResize = () => {
      if (container && globeRef.current && !destroyedRef.current) {
        globeRef.current.width(container.clientWidth).height(container.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      destroyedRef.current = true;
      window.removeEventListener('resize', handleResize);

      // Proper disposal — the critical memory leak fix
      if (globeRef.current) {
        const g = globeRef.current;

        // Dispose Three.js resources
        try {
          const renderer = g.renderer();
          if (renderer) {
            renderer.dispose();
            renderer.forceContextLoss();
          }
        } catch { /* renderer not available */ }

        try {
          const scene = g.scene();
          if (scene) {
            scene.traverse((obj: THREE.Object3D) => {
              const mesh = obj as THREE.Mesh;
              if (mesh.geometry) mesh.geometry.dispose();
              if (mesh.material) {
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                materials.forEach((mat: THREE.Material & { map?: THREE.Texture }) => {
                  if (mat.map) mat.map.dispose();
                  mat.dispose();
                });
              }
            });
          }
        } catch { /* scene traversal failed */ }

        // Remove DOM elements
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }

        globeRef.current = null;
      }
    };
  }, []); // Initialize once

  // Update data when it changes
  useEffect(() => {
    if (globeRef.current && !destroyedRef.current) {
      globeRef.current.hexBinPointsData(options.data);
    }
  }, [options.data]);

  // Fly to location
  const flyTo = useCallback((lat: number, lng: number, alt: number = 1.5) => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat, lng, altitude: alt }, 1500);
    }
  }, []);

  // Change texture without destroying globe
  const setTexture = useCallback((texture: GlobeTexture) => {
    if (!globeRef.current || destroyedRef.current) return;
    const g = globeRef.current;
    const config = TEXTURE_URLS[texture];

    g.globeImageUrl(config.globe);
    g.atmosphereColor(ATMOSPHERE_COLORS[texture]);

    // Update emissive
    try {
      const mat = g.globeMaterial();
      const { color, intensity } = EMISSIVE_SETTINGS[texture];
      mat.emissive = new THREE.Color(color);
      mat.emissiveIntensity = intensity;
    } catch { /* Material not ready */ }

    // Toggle borders
    if (texture === 'borders' && borderArcsRef.current.length > 0) {
      g.arcsData(borderArcsRef.current)
        .arcColor(() => '#00ffff')
        .arcStroke(0.8);
    } else {
      g.arcsData([]);
    }
  }, []);

  return {
    globe: globeRef.current,
    isReady,
    altitude,
    flyTo,
    setTexture,
  };
}
