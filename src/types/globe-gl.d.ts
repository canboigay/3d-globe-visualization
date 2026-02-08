// =============================================================================
// Globe.gl type declarations
// globe.gl doesn't ship full TypeScript types, so we declare what we need
// =============================================================================

declare module 'globe.gl' {
  import type { Scene, WebGLRenderer, Camera, MeshPhongMaterial } from 'three';

  export interface GlobeInstance {
    (element: HTMLElement): GlobeInstance;

    // Globe config
    globeImageUrl(url: string): GlobeInstance;
    bumpImageUrl(url: string): GlobeInstance;
    backgroundColor(color: string): GlobeInstance;
    showAtmosphere(show: boolean): GlobeInstance;
    atmosphereColor(color: string): GlobeInstance;
    atmosphereAltitude(alt: number): GlobeInstance;
    onGlobeReady(cb: () => void): GlobeInstance;
    globeMaterial(): MeshPhongMaterial;

    // Hex bins
    hexBinPointsData(data: unknown[]): GlobeInstance;
    hexBinPointWeight(field: string): GlobeInstance;
    hexAltitude(fn: ((d: { sumWeight: number }) => number) | number): GlobeInstance;
    hexTopColor(fn: ((d: { points: unknown[] }) => string) | string): GlobeInstance;
    hexSideColor(fn: ((d: { points: unknown[] }) => string) | string): GlobeInstance;
    hexBinResolution(res: number): GlobeInstance;
    hexLabel(fn: ((d: { points: unknown[]; sumWeight: number }) => string) | string): GlobeInstance;
    onHexClick(fn: (d: { points: unknown[] }) => void): GlobeInstance;
    onHexHover(fn: (d: { points: unknown[] } | null) => void): GlobeInstance;

    // Arcs
    arcsData(data: unknown[]): GlobeInstance;
    arcColor(fn: (() => string) | string): GlobeInstance;
    arcStroke(width: number): GlobeInstance;
    arcAltitude(alt: number): GlobeInstance;
    arcAltitudeAutoScale(scale: number): GlobeInstance;
    arcDashLength(len: number): GlobeInstance;
    arcDashGap(gap: number): GlobeInstance;
    arcDashAnimateTime(ms: number): GlobeInstance;

    // Points
    pointsData(data: unknown[]): GlobeInstance;
    pointLat(fn: ((d: unknown) => number)): GlobeInstance;
    pointLng(fn: ((d: unknown) => number)): GlobeInstance;
    pointColor(fn: (() => string) | string): GlobeInstance;
    pointAltitude(alt: number): GlobeInstance;
    pointRadius(r: number): GlobeInstance;

    // Labels
    labelsData(data: unknown[]): GlobeInstance;
    labelLat(fn: ((d: unknown) => number)): GlobeInstance;
    labelLng(fn: ((d: unknown) => number)): GlobeInstance;
    labelText(fn: ((d: unknown) => string)): GlobeInstance;
    labelSize(fn: ((d: unknown) => number)): GlobeInstance;
    labelColor(fn: ((d: unknown) => string)): GlobeInstance;
    labelResolution(n: number): GlobeInstance;

    // Camera — overloaded for getter/setter
    pointOfView(): { lat: number; lng: number; altitude: number };
    pointOfView(pov: { lat?: number; lng?: number; altitude?: number }, transitionMs?: number): GlobeInstance;

    // Sizing — overloaded for getter/setter
    width(): number;
    width(w: number): GlobeInstance;
    height(): number;
    height(h: number): GlobeInstance;

    // Three.js access
    scene(): Scene;
    renderer(): WebGLRenderer;
    camera(): Camera;
    controls(): {
      autoRotate: boolean;
      autoRotateSpeed: number;
      enableZoom: boolean;
      minDistance: number;
      maxDistance: number;
    };
  }

  function Globe(): GlobeInstance;
  export default Globe;
}
