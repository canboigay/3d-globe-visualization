"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ATMOSPHERE_COLORS: () => ATMOSPHERE_COLORS,
  DEFAULT_CAMERA: () => DEFAULT_CAMERA,
  DEMO_THREATS: () => DEMO_THREATS,
  EMISSIVE_SETTINGS: () => EMISSIVE_SETTINGS,
  ExportButton: () => ExportButton,
  GEOJSON_URL: () => GEOJSON_URL,
  Globe3DEnhanced: () => Globe3DEnhanced,
  Globe3DWarGame: () => Globe3DWarGame,
  LEVEL_COLORS: () => LEVEL_COLORS,
  LEVEL_COLORS_DARK: () => LEVEL_COLORS_DARK,
  LEVEL_COLORS_GLOW: () => LEVEL_COLORS_GLOW,
  PLANETS: () => PLANETS,
  SearchFilter: () => SearchFilter,
  Starfield: () => Starfield,
  TEXTURE_URLS: () => TEXTURE_URLS,
  TimelineSlider: () => TimelineSlider,
  captureScreenshot: () => captureScreenshot,
  clusterPoints: () => clusterPoints,
  createTooltipHtml: () => createTooltipHtml,
  debounce: () => debounce,
  downloadFile: () => downloadFile,
  escapeHtml: () => escapeHtml,
  filterPoints: () => filterPoints,
  getLevelColor: () => getLevelColor,
  haversineDistance: () => haversineDistance,
  hexToRgba: () => hexToRgba,
  latLngToMercator: () => latLngToMercator,
  loadCountryBorders: () => loadCountryBorders,
  pointsToCsv: () => pointsToCsv,
  throttle: () => throttle,
  useGlobe: () => useGlobe
});
module.exports = __toCommonJS(index_exports);

// src/components/Globe3DEnhanced.tsx
var import_react = require("react");
var THREE = __toESM(require("three"));
var import_globe = __toESM(require("globe.gl"));

// src/constants/index.ts
var LEVEL_COLORS = {
  critical: "#ff0040",
  high: "#ff6600",
  medium: "#ffcc00",
  low: "#00ff88",
  info: "#3b82f6"
};
var LEVEL_COLORS_DARK = {
  critical: "#dc2626",
  high: "#ea580c",
  medium: "#d97706",
  low: "#16a34a",
  info: "#2563eb"
};
var LEVEL_COLORS_GLOW = {
  critical: "#ff003c",
  high: "#ff7700",
  medium: "#ffd000",
  low: "#00ffa3",
  info: "#4d9fff"
};
var TEXTURE_URLS = {
  "war-ops": {
    globe: "https://unpkg.com/three-globe/example/img/earth-topology.png",
    bump: "https://unpkg.com/three-globe/example/img/earth-topology.png"
  },
  "night-vision": {
    globe: "https://unpkg.com/three-globe/example/img/earth-dark.jpg"
  },
  "thermal": {
    globe: "https://unpkg.com/three-globe/example/img/earth-water.png"
  },
  "tactical": {
    globe: "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
    bump: "https://unpkg.com/three-globe/example/img/earth-topology.png"
  },
  "satellite": {
    globe: "https://unpkg.com/three-globe/example/img/earth-day.jpg",
    bump: "https://unpkg.com/three-globe/example/img/earth-topology.png"
  },
  "dark-ops": {
    globe: "https://unpkg.com/three-globe/example/img/earth-night.jpg"
  },
  "borders": {
    globe: "https://unpkg.com/three-globe/example/img/earth-dark.jpg"
  },
  "classic": {
    globe: "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
    bump: "https://unpkg.com/three-globe/example/img/earth-topology.png"
  }
};
var ATMOSPHERE_COLORS = {
  "war-ops": "#3b82f6",
  "night-vision": "#10b981",
  "thermal": "#f97316",
  "tactical": "#3b82f6",
  "satellite": "#60a5fa",
  "dark-ops": "#ffa500",
  "borders": "#00ffff",
  "classic": "#3b82f6"
};
var EMISSIVE_SETTINGS = {
  "war-ops": { color: 0, intensity: 0 },
  "night-vision": { color: 65348, intensity: 0.1 },
  "thermal": { color: 16737792, intensity: 0.15 },
  "tactical": { color: 0, intensity: 0 },
  "satellite": { color: 0, intensity: 0 },
  "dark-ops": { color: 16755200, intensity: 0.3 },
  "borders": { color: 65535, intensity: 0.1 },
  "classic": { color: 0, intensity: 0 }
};
var PLANETS = [
  { name: "Mercury", baseX: 0.15, baseY: 0.2, size: 8, color: "#8c7853", speed: 0.02, orbitRadius: 180, hasRing: false },
  { name: "Venus", baseX: 0.25, baseY: 0.6, size: 18, color: "#ffc649", speed: 0.015, orbitRadius: 260, hasRing: false },
  { name: "Mars", baseX: 0.7, baseY: 0.3, size: 12, color: "#cd5c5c", speed: 0.01, orbitRadius: 340, hasRing: false },
  { name: "Jupiter", baseX: 0.8, baseY: 0.7, size: 45, color: "#c88b3a", speed: 5e-3, orbitRadius: 500, hasRing: false },
  { name: "Saturn", baseX: 0.2, baseY: 0.8, size: 38, color: "#fad5a5", speed: 4e-3, orbitRadius: 580, hasRing: true },
  { name: "Neptune", baseX: 0.55, baseY: 0.45, size: 15, color: "#4169e1", speed: 2e-3, orbitRadius: 660, hasRing: false }
];
var GEOJSON_URL = "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/datasets/ne_110m_admin_0_countries.geojson";
var DEFAULT_CAMERA = {
  lat: 30,
  lng: 0,
  altitude: 2.2,
  minDistance: 120,
  maxDistance: 2e3
};
var DEMO_THREATS = [
  { id: "t1", lat: 55.7558, lng: 37.6173, city: "Moscow", country: "Russia", level: "critical", count: 250, timestamp: "2026-02-07T08:30:00Z" },
  { id: "t2", lat: 39.9042, lng: 116.4074, city: "Beijing", country: "China", level: "high", count: 180, timestamp: "2026-02-07T09:15:00Z" },
  { id: "t3", lat: 25.2048, lng: 55.2708, city: "Dubai", country: "UAE", level: "medium", count: 95, timestamp: "2026-02-07T07:45:00Z" },
  { id: "t4", lat: 51.5074, lng: -0.1278, city: "London", country: "UK", level: "high", count: 140, timestamp: "2026-02-07T10:00:00Z" },
  { id: "t5", lat: 40.7128, lng: -74.006, city: "New York", country: "USA", level: "critical", count: 300, timestamp: "2026-02-07T06:20:00Z" },
  { id: "t6", lat: 35.6762, lng: 139.6503, city: "Tokyo", country: "Japan", level: "medium", count: 75, timestamp: "2026-02-07T11:30:00Z" },
  { id: "t7", lat: -33.8688, lng: 151.2093, city: "Sydney", country: "Australia", level: "low", count: 45, timestamp: "2026-02-07T12:00:00Z" },
  { id: "t8", lat: 48.8566, lng: 2.3522, city: "Paris", country: "France", level: "high", count: 120, timestamp: "2026-02-07T08:00:00Z" },
  { id: "t9", lat: 37.5665, lng: 126.978, city: "Seoul", country: "South Korea", level: "medium", count: 88, timestamp: "2026-02-07T13:15:00Z" },
  { id: "t10", lat: -23.5505, lng: -46.6333, city: "Sao Paulo", country: "Brazil", level: "high", count: 160, timestamp: "2026-02-07T05:45:00Z" },
  { id: "t11", lat: 28.6139, lng: 77.209, city: "New Delhi", country: "India", level: "critical", count: 210, timestamp: "2026-02-07T14:30:00Z" },
  { id: "t12", lat: 1.3521, lng: 103.8198, city: "Singapore", country: "Singapore", level: "low", count: 35, timestamp: "2026-02-07T15:00:00Z" },
  { id: "t13", lat: 52.52, lng: 13.405, city: "Berlin", country: "Germany", level: "medium", count: 105, timestamp: "2026-02-07T09:45:00Z" },
  { id: "t14", lat: 59.3293, lng: 18.0686, city: "Stockholm", country: "Sweden", level: "low", count: 28, timestamp: "2026-02-07T10:30:00Z" },
  { id: "t15", lat: 41.0082, lng: 28.9784, city: "Istanbul", country: "Turkey", level: "high", count: 135, timestamp: "2026-02-07T11:00:00Z" },
  { id: "t16", lat: 30.0444, lng: 31.2357, city: "Cairo", country: "Egypt", level: "medium", count: 72, timestamp: "2026-02-07T08:15:00Z" },
  { id: "t17", lat: -1.2921, lng: 36.8219, city: "Nairobi", country: "Kenya", level: "low", count: 42, timestamp: "2026-02-07T07:00:00Z" },
  { id: "t18", lat: 19.4326, lng: -99.1332, city: "Mexico City", country: "Mexico", level: "high", count: 155, timestamp: "2026-02-07T04:30:00Z" }
];

// src/utils/index.ts
function latLngToMercator(lat, lng, width, height) {
  const x = (lng + 180) / 360 * width;
  const latRad = lat * Math.PI / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = height / 2 - width * mercN / (2 * Math.PI);
  return { x, y };
}
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
var LEVEL_SEVERITY = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  info: 0
};
function clusterPoints(points, thresholdKm = 500) {
  const clusters = [];
  const used = /* @__PURE__ */ new Set();
  const sorted = [...points].sort(
    (a, b) => LEVEL_SEVERITY[b.level] - LEVEL_SEVERITY[a.level]
  );
  for (const point of sorted) {
    if (used.has(point.id)) continue;
    const cluster = {
      lat: point.lat,
      lng: point.lng,
      points: [point],
      totalCount: point.count,
      maxLevel: point.level
    };
    used.add(point.id);
    for (const other of sorted) {
      if (used.has(other.id)) continue;
      const dist = haversineDistance(point.lat, point.lng, other.lat, other.lng);
      if (dist < thresholdKm) {
        cluster.points.push(other);
        cluster.totalCount += other.count;
        if (LEVEL_SEVERITY[other.level] > LEVEL_SEVERITY[cluster.maxLevel]) {
          cluster.maxLevel = other.level;
        }
        used.add(other.id);
      }
    }
    if (cluster.points.length > 1) {
      cluster.lat = cluster.points.reduce((s, p) => s + p.lat, 0) / cluster.points.length;
      cluster.lng = cluster.points.reduce((s, p) => s + p.lng, 0) / cluster.points.length;
    }
    clusters.push(cluster);
  }
  return clusters;
}
function filterPoints(points, criteria) {
  return points.filter((p) => {
    if (criteria.levels?.length && !criteria.levels.includes(p.level)) return false;
    if (criteria.countries?.length && p.country && !criteria.countries.includes(p.country)) return false;
    if (criteria.cities?.length && p.city && !criteria.cities.includes(p.city)) return false;
    if (criteria.minCount !== void 0 && p.count < criteria.minCount) return false;
    if (criteria.search) {
      const q = criteria.search.toLowerCase();
      const searchable = [p.city, p.country, p.label, p.id].filter(Boolean).join(" ").toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    if (criteria.timeRange && p.timestamp) {
      const t = new Date(p.timestamp).getTime();
      if (t < criteria.timeRange.start.getTime() || t > criteria.timeRange.end.getTime()) return false;
    }
    return true;
  });
}
function getLevelColor(level, scheme = {}) {
  const merged = { ...LEVEL_COLORS, ...scheme };
  return merged[level] || merged.info;
}
function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function throttle(fn, delay) {
  let lastCall = 0;
  let timer = null;
  return (...args) => {
    const now = Date.now();
    const remaining = delay - (now - lastCall);
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastCall = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastCall = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  };
}
function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
function escapeHtml(str) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return str.replace(/[&<>"']/g, (c) => map[c] || c);
}
function createTooltipHtml(point, totalCount, colors = {}) {
  const color = getLevelColor(point.level, colors);
  const city = escapeHtml(point.label || point.city || "Unknown");
  const country = escapeHtml(point.country || "");
  const level = escapeHtml(point.level.toUpperCase());
  return `<div style="
    background:rgba(10,14,26,0.98);
    padding:14px 18px;
    border-radius:10px;
    border:1px solid ${color};
    color:#e8eaed;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    font-size:13px;
    backdrop-filter:blur(12px);
    box-shadow:0 8px 32px rgba(0,0,0,0.5);
    min-width:160px;
  ">
    <div style="color:${color};font-weight:700;font-size:15px;margin-bottom:6px;letter-spacing:0.5px;">
      ${city}
    </div>
    <div style="color:#9ca3af;font-size:12px;">${country}</div>
    <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.1);">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
        <span style="color:#9ca3af;">Level</span>
        <span style="color:${color};font-weight:600;">${level}</span>
      </div>
      <div style="display:flex;justify-content:space-between;">
        <span style="color:#9ca3af;">Incidents</span>
        <span style="color:#e8eaed;font-weight:600;">${totalCount.toLocaleString()}</span>
      </div>
    </div>
  </div>`;
}
function pointsToCsv(points) {
  const headers = ["id", "lat", "lng", "city", "country", "level", "count", "timestamp"];
  const rows = points.map(
    (p) => [p.id, p.lat, p.lng, p.city || "", p.country || "", p.level, p.count, p.timestamp || ""].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}
function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
async function captureScreenshot(element) {
  const canvas = element.querySelector("canvas");
  if (canvas) {
    return canvas.toDataURL("image/png");
  }
  throw new Error("No canvas found in container. Include html2canvas for DOM screenshots.");
}
var cachedBorders = null;
var borderPromise = null;
function loadCountryBorders(url) {
  if (cachedBorders) return Promise.resolve(cachedBorders);
  if (borderPromise) return borderPromise;
  borderPromise = fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Failed to load borders: ${res.status}`);
    return res.json();
  }).then((data) => {
    const arcs = [];
    for (const feature of data.features) {
      const { type, coordinates } = feature.geometry;
      const rings = type === "Polygon" ? coordinates : type === "MultiPolygon" ? coordinates.flat() : [];
      for (const ring of rings) {
        for (let i = 0; i < ring.length - 1; i++) {
          arcs.push({
            startLat: ring[i][1],
            startLng: ring[i][0],
            endLat: ring[i + 1][1],
            endLng: ring[i + 1][0]
          });
        }
      }
    }
    cachedBorders = arcs;
    return arcs;
  }).catch((err) => {
    console.error("Border loading failed:", err);
    borderPromise = null;
    return [];
  });
  return borderPromise;
}

// src/components/Globe3DEnhanced.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Globe3DEnhanced({
  data,
  texture = "war-ops",
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
  hexAltitudeMultiplier = 2e-3,
  width = "100%",
  height = "100%",
  className = ""
}) {
  const containerRef = (0, import_react.useRef)(null);
  const globeRef = (0, import_react.useRef)(null);
  const [isReady, setIsReady] = (0, import_react.useState)(false);
  const [altitude, setAltitude] = (0, import_react.useState)(initialPosition?.altitude ?? DEFAULT_CAMERA.altitude);
  const [currentTexture, setCurrentTexture] = (0, import_react.useState)(texture);
  const altitudeTimerRef = (0, import_react.useRef)(null);
  const borderArcsRef = (0, import_react.useRef)([]);
  const destroyedRef = (0, import_react.useRef)(false);
  const mergedColors = (0, import_react.useMemo)(() => ({ ...LEVEL_COLORS, ...colors }), [colors]);
  (0, import_react.useEffect)(() => {
    const container = containerRef.current;
    if (!container) return;
    destroyedRef.current = false;
    const init = () => {
      try {
        if (destroyedRef.current) return;
        const textureConfig = TEXTURE_URLS[currentTexture];
        const atmosphereColor = ATMOSPHERE_COLORS[currentTexture];
        const globe = (0, import_globe.default)().globeImageUrl(textureConfig.globe).backgroundColor("rgba(0,0,0,0)").showAtmosphere(showAtmosphere).atmosphereColor(atmosphereColor).atmosphereAltitude(0.15).onGlobeReady(() => {
          if (destroyedRef.current) return;
          try {
            const mat = globe.globeMaterial();
            const { color, intensity } = EMISSIVE_SETTINGS[currentTexture];
            mat.emissive = new THREE.Color(color);
            mat.emissiveIntensity = intensity;
          } catch {
          }
          setIsReady(true);
        }).hexBinPointsData(data).hexBinPointWeight("count").hexAltitude((d) => d.sumWeight * hexAltitudeMultiplier).hexTopColor((d) => getLevelColor(d.points[0].level, mergedColors)).hexSideColor((d) => getLevelColor(d.points[0].level, mergedColors) + "66").hexBinResolution(clusterResolution).hexLabel(
          (d) => createTooltipHtml(d.points[0], d.sumWeight, mergedColors)
        ).onHexClick((d) => {
          if (onPointClick && d.points[0]) onPointClick(d.points[0]);
        }).onHexHover((d) => {
          if (onPointHover) onPointHover(d?.points?.[0] ?? null);
        }).arcsData([]).arcColor(() => "#00ffff").arcStroke(0.5).arcAltitude(5e-3).arcAltitudeAutoScale(0.3);
        if (textureConfig.bump) {
          globe.bumpImageUrl(textureConfig.bump);
        }
        if (showCityLabels) {
          globe.labelsData(data.filter((d) => d.city));
        }
        globe(container);
        const pos = initialPosition ?? { lat: DEFAULT_CAMERA.lat, lng: DEFAULT_CAMERA.lng, altitude: DEFAULT_CAMERA.altitude };
        globe.pointOfView(pos);
        const controls = globe.controls();
        if (controls) {
          controls.autoRotate = autoRotate;
          controls.autoRotateSpeed = autoRotateSpeed;
          controls.enableZoom = true;
          controls.minDistance = DEFAULT_CAMERA.minDistance;
          controls.maxDistance = DEFAULT_CAMERA.maxDistance;
        }
        if (homeLocation) {
          globe.pointsData([homeLocation]).pointColor(() => "#00ff88").pointAltitude(0.01).pointRadius(0.5);
        }
        loadCountryBorders(GEOJSON_URL).then((arcs) => {
          if (destroyedRef.current) return;
          borderArcsRef.current = arcs;
          if ((showBorders || currentTexture === "borders") && globe) {
            globe.arcsData(arcs).arcColor(() => "#00ffff").arcStroke(0.8).arcAltitude(0).arcAltitudeAutoScale(0.01);
          }
        });
        globeRef.current = globe;
        requestAnimationFrame(() => {
          if (container && globe && !destroyedRef.current) {
            globe.width(container.clientWidth).height(container.clientHeight);
          }
        });
      } catch (err) {
        console.error("Globe3DEnhanced: Failed to initialize", err);
      }
    };
    init();
    const handleResize = throttle(() => {
      if (container && globeRef.current && !destroyedRef.current) {
        globeRef.current.width(container.clientWidth).height(container.clientHeight);
      }
    }, 100);
    window.addEventListener("resize", handleResize);
    const altTimer = setInterval(() => {
      if (globeRef.current && !destroyedRef.current) {
        try {
          const pov = globeRef.current.pointOfView();
          setAltitude(pov.altitude);
        } catch {
        }
      }
    }, 150);
    altitudeTimerRef.current = altTimer;
    return () => {
      destroyedRef.current = true;
      window.removeEventListener("resize", handleResize);
      if (altitudeTimerRef.current) clearInterval(altitudeTimerRef.current);
      if (globeRef.current) {
        const g = globeRef.current;
        try {
          const renderer = g.renderer();
          if (renderer) {
            renderer.dispose();
            renderer.forceContextLoss();
            const canvas = renderer.domElement;
            canvas?.parentNode?.removeChild(canvas);
          }
        } catch {
        }
        try {
          const scene = g.scene();
          if (scene) {
            scene.traverse((obj) => {
              const mesh = obj;
              if (mesh.geometry) mesh.geometry.dispose();
              if (mesh.material) {
                const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                mats.forEach((mat) => {
                  if (mat.map) mat.map.dispose();
                  mat.dispose();
                });
              }
            });
          }
        } catch {
        }
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        globeRef.current = null;
      }
    };
  }, []);
  (0, import_react.useEffect)(() => {
    if (globeRef.current && !destroyedRef.current) {
      globeRef.current.hexBinPointsData(data);
    }
  }, [data]);
  (0, import_react.useEffect)(() => {
    if (!globeRef.current || destroyedRef.current || currentTexture === texture) return;
    setCurrentTexture(texture);
    const g = globeRef.current;
    const config = TEXTURE_URLS[texture];
    g.globeImageUrl(config.globe);
    g.atmosphereColor(ATMOSPHERE_COLORS[texture]);
    try {
      const mat = g.globeMaterial();
      const { color, intensity } = EMISSIVE_SETTINGS[texture];
      mat.emissive = new THREE.Color(color);
      mat.emissiveIntensity = intensity;
    } catch {
    }
    if (texture === "borders" && borderArcsRef.current.length > 0) {
      g.arcsData(borderArcsRef.current).arcColor(() => "#00ffff").arcStroke(0.8).arcAltitude(0).arcAltitudeAutoScale(0.01);
    } else if (showBorders && borderArcsRef.current.length > 0) {
      g.arcsData(borderArcsRef.current);
    } else {
      g.arcsData([]);
    }
  }, [texture]);
  const flyTo = (0, import_react.useCallback)((lat, lng, alt = 1.5) => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat, lng, altitude: alt }, 1500);
    }
  }, []);
  (0, import_react.useEffect)(() => {
    const el = containerRef.current;
    if (el) {
      el.flyTo = flyTo;
      el.getAltitude = () => altitude;
    }
  }, [flyTo, altitude]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      style: {
        position: "relative",
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height
      },
      className,
      role: "img",
      "aria-label": "3D threat intelligence globe visualization",
      children: [
        loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
          position: "absolute",
          inset: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.8)"
        }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { textAlign: "center", color: "#9ca3af" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
            width: 48,
            height: 48,
            margin: "0 auto 16px",
            border: "3px solid rgba(255,255,255,0.1)",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          } }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Loading globe..." })
        ] }) }),
        error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
          position: "absolute",
          inset: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.9)"
        }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
          textAlign: "center",
          color: "#ef4444",
          padding: "24px",
          borderRadius: "12px",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          maxWidth: 400
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 18, fontWeight: 600, marginBottom: 8 }, children: "Failed to load" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, color: "#9ca3af" }, children: error })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            ref: containerRef,
            style: {
              position: "absolute",
              inset: 0,
              zIndex: 5,
              transition: "opacity 0.5s ease",
              opacity: isReady ? 1 : 0
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes spin { to { transform: rotate(360deg) } }` })
      ]
    }
  );
}

// src/components/Globe3DWarGame.tsx
var import_react2 = require("react");
var THREE2 = __toESM(require("three"));
var import_globe2 = __toESM(require("globe.gl"));
var import_jsx_runtime2 = require("react/jsx-runtime");
var TEXTURE_LABELS = {
  "war-ops": "WAR-OPS",
  "night-vision": "NIGHT VISION",
  "thermal": "THERMAL",
  "tactical": "TACTICAL",
  "satellite": "SATELLITE",
  "dark-ops": "DARK-OPS",
  "borders": "BORDERS",
  "classic": "CLASSIC"
};
function Globe3DWarGame({
  data,
  texture = "war-ops",
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
  width = "100%",
  height = "100%",
  className = ""
}) {
  const containerRef = (0, import_react2.useRef)(null);
  const globeContainerRef = (0, import_react2.useRef)(null);
  const globeRef = (0, import_react2.useRef)(null);
  const [isReady, setIsReady] = (0, import_react2.useState)(false);
  const [currentTexture, setCurrentTexture] = (0, import_react2.useState)(texture);
  const [hoveredTexture, setHoveredTexture] = (0, import_react2.useState)(null);
  const borderArcsRef = (0, import_react2.useRef)([]);
  const destroyedRef = (0, import_react2.useRef)(false);
  const mergedColors = (0, import_react2.useMemo)(() => ({ ...LEVEL_COLORS, ...colors }), [colors]);
  (0, import_react2.useEffect)(() => {
    const container = globeContainerRef.current;
    if (!container) return;
    destroyedRef.current = false;
    const init = () => {
      try {
        if (destroyedRef.current) return;
        const textureConfig = TEXTURE_URLS[currentTexture];
        const globe = (0, import_globe2.default)().globeImageUrl(textureConfig.globe).backgroundColor("rgba(0,0,0,0)").showAtmosphere(showAtmosphere).atmosphereColor(ATMOSPHERE_COLORS[currentTexture]).atmosphereAltitude(0.15).onGlobeReady(() => {
          if (destroyedRef.current) return;
          try {
            const mat = globe.globeMaterial();
            const { color, intensity } = EMISSIVE_SETTINGS[currentTexture];
            mat.emissive = new THREE2.Color(color);
            mat.emissiveIntensity = intensity;
          } catch {
          }
          setIsReady(true);
        }).hexBinPointsData(data).hexBinPointWeight("count").hexAltitude((d) => d.sumWeight * 2e-3).hexTopColor((d) => getLevelColor(d.points[0].level, mergedColors)).hexSideColor((d) => getLevelColor(d.points[0].level, mergedColors) + "66").hexBinResolution(clusterResolution).hexLabel(
          (d) => createTooltipHtml(d.points[0], d.sumWeight, mergedColors)
        ).onHexClick((d) => {
          if (onPointClick && d.points[0]) onPointClick(d.points[0]);
        }).arcsData([]).arcColor(() => "#00ffff").arcStroke(0.5);
        if (textureConfig.bump) {
          globe.bumpImageUrl(textureConfig.bump);
        }
        globe(container);
        const pos = initialPosition ?? { lat: DEFAULT_CAMERA.lat, lng: DEFAULT_CAMERA.lng, altitude: DEFAULT_CAMERA.altitude };
        globe.pointOfView(pos);
        const controls = globe.controls();
        if (controls) {
          controls.autoRotate = autoRotate;
          controls.autoRotateSpeed = autoRotateSpeed;
          controls.enableZoom = true;
          controls.minDistance = DEFAULT_CAMERA.minDistance;
          controls.maxDistance = DEFAULT_CAMERA.maxDistance;
        }
        loadCountryBorders(GEOJSON_URL).then((arcs) => {
          if (destroyedRef.current) return;
          borderArcsRef.current = arcs;
          if (currentTexture === "borders") {
            globe.arcsData(arcs).arcColor(() => "#00ffff").arcStroke(0.8).arcAltitude(0).arcAltitudeAutoScale(0.01);
          }
        });
        globeRef.current = globe;
        requestAnimationFrame(() => {
          if (container && globe && !destroyedRef.current) {
            globe.width(container.clientWidth).height(container.clientHeight);
          }
        });
      } catch (err) {
        console.error("Globe3DWarGame: Failed to initialize", err);
      }
    };
    init();
    const handleResize = throttle(() => {
      if (globeContainerRef.current && globeRef.current && !destroyedRef.current) {
        globeRef.current.width(globeContainerRef.current.clientWidth).height(globeContainerRef.current.clientHeight);
      }
    }, 100);
    window.addEventListener("resize", handleResize);
    return () => {
      destroyedRef.current = true;
      window.removeEventListener("resize", handleResize);
      if (globeRef.current) {
        const g = globeRef.current;
        try {
          const renderer = g.renderer();
          if (renderer) {
            renderer.dispose();
            renderer.forceContextLoss();
          }
        } catch {
        }
        try {
          const scene = g.scene();
          if (scene) {
            scene.traverse((obj) => {
              const mesh = obj;
              if (mesh.geometry) mesh.geometry.dispose();
              if (mesh.material) {
                const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                mats.forEach((mat) => {
                  if (mat.map) mat.map.dispose();
                  mat.dispose();
                });
              }
            });
          }
        } catch {
        }
        while (container.firstChild) container.removeChild(container.firstChild);
        globeRef.current = null;
      }
    };
  }, []);
  (0, import_react2.useEffect)(() => {
    if (globeRef.current && !destroyedRef.current) {
      globeRef.current.hexBinPointsData(data);
    }
  }, [data]);
  const switchTexture = (0, import_react2.useCallback)((newTexture) => {
    if (!globeRef.current || destroyedRef.current) return;
    setCurrentTexture(newTexture);
    const g = globeRef.current;
    const config = TEXTURE_URLS[newTexture];
    g.globeImageUrl(config.globe);
    g.atmosphereColor(ATMOSPHERE_COLORS[newTexture]);
    try {
      const mat = g.globeMaterial();
      const { color, intensity } = EMISSIVE_SETTINGS[newTexture];
      mat.emissive = new THREE2.Color(color);
      mat.emissiveIntensity = intensity;
    } catch {
    }
    if (newTexture === "borders" && borderArcsRef.current.length > 0) {
      g.arcsData(borderArcsRef.current).arcColor(() => "#00ffff").arcStroke(0.8).arcAltitude(0);
    } else {
      g.arcsData([]);
    }
  }, []);
  (0, import_react2.useEffect)(() => {
    if (texture !== currentTexture) switchTexture(texture);
  }, [texture]);
  const flyTo = (0, import_react2.useCallback)((lat, lng, alt = 1.5) => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat, lng, altitude: alt }, 1500);
    }
  }, []);
  const criticalCount = (0, import_react2.useMemo)(() => data.filter((d) => d.level === "critical").length, [data]);
  const highCount = (0, import_react2.useMemo)(() => data.filter((d) => d.level === "high").length, [data]);
  const allTextures = ["war-ops", "night-vision", "thermal", "tactical", "satellite", "dark-ops", "borders", "classic"];
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "div",
    {
      ref: containerRef,
      style: {
        position: "relative",
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        background: "#000",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        overflow: "hidden"
      },
      className,
      role: "img",
      "aria-label": "3D tactical threat intelligence globe",
      children: [
        loading && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
          position: "absolute",
          inset: 0,
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.9)"
        }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { textAlign: "center", color: "#9ca3af" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
            width: 48,
            height: 48,
            margin: "0 auto 16px",
            border: "3px solid rgba(255,255,255,0.1)",
            borderTopColor: "#ef4444",
            borderRadius: "50%",
            animation: "wg-spin 1s linear infinite"
          } }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { letterSpacing: 2, textTransform: "uppercase", fontSize: 13 }, children: "INITIALIZING..." })
        ] }) }),
        error && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
          position: "absolute",
          inset: 0,
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.95)"
        }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
          textAlign: "center",
          color: "#ef4444",
          padding: 24,
          borderRadius: 12,
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          maxWidth: 400
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 16, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }, children: "SYSTEM ERROR" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 13, color: "#9ca3af" }, children: error })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          zIndex: 50,
          background: "linear-gradient(180deg, rgba(10,14,26,0.95) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 20, fontWeight: 700, letterSpacing: 3, color: "#e8eaed" }, children: "THREAT INTELLIGENCE" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 13, color: "#9ca3af", letterSpacing: 1 }, children: [
            "THREATS: ",
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: "#e8eaed", fontWeight: 600 }, children: data.length }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { margin: "0 12px", opacity: 0.3 }, children: "|" }),
            "MODE: ",
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: "#e8eaed", fontWeight: 600 }, children: TEXTURE_LABELS[currentTexture] })
          ] })
        ] }),
        criticalCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
          position: "absolute",
          top: 75,
          left: 20,
          zIndex: 50,
          background: "rgba(239,68,68,0.15)",
          border: "1px solid rgba(239,68,68,0.4)",
          color: "#ef4444",
          padding: "10px 16px",
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 600,
          animation: "wg-blink 2s infinite",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          backdropFilter: "blur(10px)"
        }, children: [
          criticalCount,
          " CRITICAL THREATS DETECTED"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "div",
          {
            ref: globeContainerRef,
            style: {
              position: "absolute",
              inset: 0,
              zIndex: 5,
              transition: "opacity 0.5s ease",
              opacity: isReady ? 1 : 0
            }
          }
        ),
        showScanLine && isReady && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
          position: "absolute",
          inset: 0,
          zIndex: 10,
          pointerEvents: "none",
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)",
          animation: "wg-scanline 8s linear infinite"
        } }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
          background: "rgba(10,14,26,0.9)",
          padding: "12px 16px",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          maxWidth: "90%"
        }, children: allTextures.map((t) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            onClick: () => switchTexture(t),
            onMouseEnter: () => setHoveredTexture(t),
            onMouseLeave: () => setHoveredTexture(null),
            style: {
              background: currentTexture === t ? "rgba(59,130,246,0.8)" : hoveredTexture === t ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${currentTexture === t ? "rgba(59,130,246,1)" : "rgba(255,255,255,0.2)"}`,
              color: currentTexture === t ? "#fff" : "#e8eaed",
              padding: "8px 14px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              transition: "all 0.2s",
              fontFamily: "inherit"
            },
            "aria-label": `Switch to ${TEXTURE_LABELS[t]} texture`,
            "aria-pressed": currentTexture === t,
            children: TEXTURE_LABELS[t]
          },
          t
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("style", { children: `
        @keyframes wg-spin { to { transform: rotate(360deg) } }
        @keyframes wg-blink { 0%,100% { opacity: 1 } 50% { opacity: 0.6 } }
        @keyframes wg-scanline { 0% { background-position: 0 0 } 100% { background-position: 0 100vh } }
      ` })
      ]
    }
  );
}

// src/components/Starfield.tsx
var import_react3 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
function Starfield({
  starCount = 300,
  enabled = true,
  showPlanets = true,
  parallaxSpeed = 1,
  className = ""
}) {
  const canvasRef = (0, import_react3.useRef)(null);
  const starsRef = (0, import_react3.useRef)([]);
  const animationRef = (0, import_react3.useRef)(0);
  const timeRef = (0, import_react3.useRef)(0);
  const planetOpacityRef = (0, import_react3.useRef)(0);
  const isVisibleRef = (0, import_react3.useRef)(true);
  const initStars = (0, import_react3.useCallback)((width, height) => {
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 4 + 0.5,
        size: Math.random() * 2 + 0.3,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 5e-3,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
    starsRef.current = stars;
  }, [starCount]);
  const drawPlanet = (0, import_react3.useCallback)((ctx, x, y, size, color, hasRing, name, opacity) => {
    ctx.globalAlpha = opacity;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 2.5);
    glow.addColorStop(0, color + "60");
    glow.addColorStop(0.4, color + "20");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
    ctx.fill();
    const bodyGrad = ctx.createRadialGradient(
      x - size * 0.3,
      y - size * 0.3,
      size * 0.1,
      x,
      y,
      size
    );
    bodyGrad.addColorStop(0, "#ffffff40");
    bodyGrad.addColorStop(0.3, color);
    bodyGrad.addColorStop(1, color + "66");
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    if (hasRing) {
      ctx.strokeStyle = color + "50";
      ctx.lineWidth = Math.max(4, size * 0.15);
      ctx.beginPath();
      ctx.ellipse(x, y, size * 1.8, size * 0.5, -0.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = color + "30";
      ctx.lineWidth = Math.max(2, size * 0.08);
      ctx.beginPath();
      ctx.ellipse(x, y, size * 1.5, size * 0.4, -0.2, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (opacity > 0.6) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(opacity, 0.7)})`;
      ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = "center";
      ctx.fillText(name, x, y + size + 18);
    }
    ctx.globalAlpha = 1;
  }, []);
  const animate = (0, import_react3.useCallback)(() => {
    if (!enabled || !isVisibleRef.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    timeRef.current += 1e-3;
    const t = timeRef.current;
    const pOpacity = planetOpacityRef.current;
    if (pOpacity > 0 && showPlanets) {
      const cx = width / 2;
      const cy = height / 2;
      const solarGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.4);
      solarGlow.addColorStop(0, `rgba(255, 200, 100, ${pOpacity * 0.12})`);
      solarGlow.addColorStop(0.3, `rgba(255, 150, 50, ${pOpacity * 0.06})`);
      solarGlow.addColorStop(0.6, `rgba(100, 50, 200, ${pOpacity * 0.02})`);
      solarGlow.addColorStop(1, "transparent");
      ctx.fillStyle = solarGlow;
      ctx.fillRect(0, 0, width, height);
    }
    for (const star of starsRef.current) {
      star.twinklePhase += star.twinkleSpeed;
      const twinkle = Math.sin(star.twinklePhase) * 0.15;
      const currentOpacity = Math.max(0.15, Math.min(0.95, star.opacity + twinkle));
      star.x += star.z * 0.015 * parallaxSpeed;
      star.y += star.z * 8e-3 * parallaxSpeed;
      if (star.x > width) star.x = 0;
      if (star.y > height) star.y = 0;
      const grad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 1.5);
      grad.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
      grad.addColorStop(0.4, `rgba(200, 220, 255, ${currentOpacity * 0.4})`);
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    if (pOpacity > 0 && showPlanets) {
      const cx = width / 2;
      const cy = height / 2;
      for (let i = 0; i < PLANETS.length; i++) {
        const planet = PLANETS[i];
        const angle = t * planet.speed + i * (Math.PI / 3);
        const scale = Math.min(width, height) / 1e3;
        const orbitX = planet.orbitRadius * scale;
        const orbitY = planet.orbitRadius * scale * 0.6;
        const x = cx + Math.cos(angle) * orbitX;
        const y = cy + Math.sin(angle) * orbitY;
        drawPlanet(ctx, x, y, planet.size * scale, planet.color, !!planet.hasRing, planet.name, pOpacity);
      }
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [enabled, showPlanets, parallaxSpeed, drawPlanet]);
  (0, import_react3.useEffect)(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.setPlanetOpacity = (v) => {
        planetOpacityRef.current = v;
      };
    }
  }, []);
  (0, import_react3.useEffect)(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      initStars(rect.width, rect.height);
    };
    resize();
    window.addEventListener("resize", resize);
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, [initStars, animate]);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "canvas",
    {
      ref: canvasRef,
      className,
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none"
      },
      "aria-hidden": "true"
    }
  );
}

// src/components/TimelineSlider.tsx
var import_react4 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
function TimelineSlider({
  data,
  timeRange,
  onChange,
  playbackSpeed = 1,
  stepInterval = 1e3
}) {
  const [isPlaying, setIsPlaying] = (0, import_react4.useState)(false);
  const playbackRef = (0, import_react4.useRef)(null);
  const containerRef = (0, import_react4.useRef)(null);
  const timeRangeRef = (0, import_react4.useRef)(timeRange);
  timeRangeRef.current = timeRange;
  const timeBounds = (0, import_react4.useMemo)(() => {
    const timestamps = data.filter((d) => d.timestamp).map((d) => new Date(d.timestamp).getTime());
    if (timestamps.length === 0) return { min: Date.now() - 864e5, max: Date.now() };
    return { min: Math.min(...timestamps), max: Math.max(...timestamps) };
  }, [data]);
  const currentPercent = (0, import_react4.useMemo)(() => {
    const range = timeBounds.max - timeBounds.min;
    if (range === 0) return 100;
    return (timeRange.end.getTime() - timeBounds.min) / range * 100;
  }, [timeRange, timeBounds]);
  const histogram = (0, import_react4.useMemo)(() => {
    const buckets = 60;
    const range = timeBounds.max - timeBounds.min;
    if (range === 0) return Array(buckets).fill(0);
    const counts = Array(buckets).fill(0);
    const withTs = data.filter((d) => d.timestamp);
    for (const d of withTs) {
      const t = new Date(d.timestamp).getTime();
      const bucket = Math.min(Math.floor((t - timeBounds.min) / range * buckets), buckets - 1);
      counts[bucket] += d.count;
    }
    return counts;
  }, [data, timeBounds]);
  const maxHistogram = (0, import_react4.useMemo)(() => Math.max(1, ...histogram), [histogram]);
  const togglePlayback = (0, import_react4.useCallback)(() => {
    if (isPlaying) {
      if (playbackRef.current) clearInterval(playbackRef.current);
      playbackRef.current = null;
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const step = (timeBounds.max - timeBounds.min) / 100 * playbackSpeed;
      playbackRef.current = setInterval(() => {
        const current = timeRangeRef.current;
        const newEnd = new Date(current.end.getTime() + step);
        if (newEnd.getTime() >= timeBounds.max) {
          if (playbackRef.current) clearInterval(playbackRef.current);
          playbackRef.current = null;
          setIsPlaying(false);
          onChange({ start: current.start, end: new Date(timeBounds.max) });
          return;
        }
        onChange({ start: current.start, end: newEnd });
      }, stepInterval / playbackSpeed);
    }
  }, [isPlaying, timeBounds, playbackSpeed, stepInterval, onChange]);
  (0, import_react4.useEffect)(() => {
    return () => {
      if (playbackRef.current) clearInterval(playbackRef.current);
    };
  }, []);
  const handleSliderClick = (0, import_react4.useCallback)((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100));
    const range = timeBounds.max - timeBounds.min;
    const newEnd = new Date(timeBounds.min + percent / 100 * range);
    onChange({ start: timeRange.start, end: newEnd });
  }, [timeBounds, timeRange, onChange]);
  const formatTime = (date) => {
    return date.toLocaleString(void 0, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "div",
    {
      ref: containerRef,
      style: {
        background: "rgba(10,14,26,0.95)",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.12)",
        padding: "12px 16px",
        backdropFilter: "blur(12px)",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        userSelect: "none"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { fontSize: 11, color: "#9ca3af", letterSpacing: 0.5 }, children: formatTime(new Date(timeBounds.min)) }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { fontSize: 12, color: "#e8eaed", fontWeight: 600, letterSpacing: 0.5 }, children: formatTime(timeRange.end) }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { fontSize: 11, color: "#9ca3af", letterSpacing: 0.5 }, children: formatTime(new Date(timeBounds.max)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          "div",
          {
            style: { position: "relative", height: 40, cursor: "pointer", marginBottom: 8 },
            onClick: handleSliderClick,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { display: "flex", alignItems: "flex-end", height: 32, gap: 1 }, children: histogram.map((count, i) => {
                const h = Math.max(2, count / maxHistogram * 32);
                const isActive = i / histogram.length * 100 <= currentPercent;
                return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                  "div",
                  {
                    style: {
                      flex: 1,
                      height: h,
                      background: isActive ? "rgba(59,130,246,0.6)" : "rgba(255,255,255,0.08)",
                      borderRadius: 1,
                      transition: "background 0.15s"
                    }
                  },
                  i
                );
              }) }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: `${currentPercent}%`,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: "#3b82f6",
                    boxShadow: "0 0 8px rgba(59,130,246,0.6)",
                    transform: "translateX(-50%)"
                  }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "button",
            {
              onClick: togglePlayback,
              style: {
                width: 32,
                height: 32,
                background: isPlaying ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.2)",
                border: `1px solid ${isPlaying ? "rgba(239,68,68,0.4)" : "rgba(59,130,246,0.4)"}`,
                borderRadius: 6,
                color: isPlaying ? "#ef4444" : "#3b82f6",
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              },
              "aria-label": isPlaying ? "Pause playback" : "Start playback",
              children: isPlaying ? "\u23F8" : "\u25B6"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { style: { fontSize: 11, color: "#6b7280", letterSpacing: 0.5 }, children: [
            data.filter((d) => {
              if (!d.timestamp) return false;
              const t = new Date(d.timestamp).getTime();
              return t >= timeRange.start.getTime() && t <= timeRange.end.getTime();
            }).length,
            " / ",
            data.length,
            " threats in range"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { style: { fontSize: 11, color: "#6b7280", marginLeft: "auto" }, children: [
            playbackSpeed,
            "x"
          ] })
        ] })
      ]
    }
  );
}

// src/components/SearchFilter.tsx
var import_react5 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var ALL_LEVELS = ["critical", "high", "medium", "low", "info"];
function SearchFilter({
  filters,
  onChange,
  availableCountries = [],
  availableCities = []
}) {
  const [isExpanded, setIsExpanded] = (0, import_react5.useState)(false);
  const toggleLevel = (0, import_react5.useCallback)((level) => {
    const current = filters.levels || [];
    const next = current.includes(level) ? current.filter((l) => l !== level) : [...current, level];
    onChange({ ...filters, levels: next.length > 0 ? next : void 0 });
  }, [filters, onChange]);
  const setSearch = (0, import_react5.useCallback)((search) => {
    onChange({ ...filters, search: search || void 0 });
  }, [filters, onChange]);
  const setCountry = (0, import_react5.useCallback)((country) => {
    if (!country) {
      const { countries, ...rest } = filters;
      onChange(rest);
      return;
    }
    onChange({ ...filters, countries: [country] });
  }, [filters, onChange]);
  const clearAll = (0, import_react5.useCallback)(() => {
    onChange({});
  }, [onChange]);
  const activeFilterCount = (0, import_react5.useMemo)(() => {
    let count = 0;
    if (filters.levels?.length) count++;
    if (filters.countries?.length) count++;
    if (filters.search) count++;
    if (filters.minCount !== void 0) count++;
    return count;
  }, [filters]);
  const btnStyle = (active, color) => ({
    padding: "5px 10px",
    borderRadius: 5,
    border: `1px solid ${active ? color : "rgba(255,255,255,0.15)"}`,
    background: active ? color + "25" : "rgba(255,255,255,0.03)",
    color: active ? color : "#9ca3af",
    fontSize: 11,
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    transition: "all 0.15s",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "inherit"
  });
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: {
    background: "rgba(10,14,26,0.95)",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          cursor: "pointer"
        },
        onClick: () => setIsExpanded(!isExpanded),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { fontSize: 13, color: "#e8eaed", fontWeight: 600, letterSpacing: 0.5 }, children: "FILTERS" }),
            activeFilterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: {
              background: "rgba(59,130,246,0.3)",
              color: "#3b82f6",
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: 10
            }, children: activeFilterCount })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { color: "#6b7280", fontSize: 12, transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "" }, children: "\\u25BC" })
        ]
      }
    ),
    isExpanded && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { padding: "0 14px 14px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "input",
        {
          type: "text",
          placeholder: "Search cities, countries...",
          value: filters.search || "",
          onChange: (e) => setSearch(e.target.value),
          style: {
            width: "100%",
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
            color: "#e8eaed",
            fontSize: 12,
            outline: "none",
            marginBottom: 12,
            fontFamily: "inherit"
          },
          "aria-label": "Search threats"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { fontSize: 10, color: "#6b7280", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }, children: "Severity" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: ALL_LEVELS.map((level) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "button",
          {
            onClick: () => toggleLevel(level),
            style: btnStyle(
              filters.levels?.includes(level) ?? false,
              getLevelColor(level)
            ),
            "aria-pressed": filters.levels?.includes(level) ?? false,
            children: level
          },
          level
        )) })
      ] }),
      availableCountries.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { fontSize: 10, color: "#6b7280", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }, children: "Country" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          "select",
          {
            value: filters.countries?.[0] || "",
            onChange: (e) => setCountry(e.target.value),
            style: {
              width: "100%",
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
              color: "#e8eaed",
              fontSize: 12,
              outline: "none",
              fontFamily: "inherit"
            },
            "aria-label": "Filter by country",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "", children: "All Countries" }),
              availableCountries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: c, children: c }, c))
            ]
          }
        )
      ] }),
      activeFilterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "button",
        {
          onClick: clearAll,
          style: {
            width: "100%",
            padding: "7px",
            borderRadius: 6,
            border: "1px solid rgba(239,68,68,0.3)",
            background: "rgba(239,68,68,0.1)",
            color: "#ef4444",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            fontFamily: "inherit"
          },
          children: "Clear All Filters"
        }
      )
    ] })
  ] });
}

// src/components/ExportButton.tsx
var import_react6 = require("react");
var import_jsx_runtime6 = require("react/jsx-runtime");
function ExportButton({
  containerRef,
  data,
  formats = ["png", "json", "csv"]
}) {
  const [isOpen, setIsOpen] = (0, import_react6.useState)(false);
  const [exporting, setExporting] = (0, import_react6.useState)(null);
  const handleExport = (0, import_react6.useCallback)(async (format) => {
    setExporting(format);
    try {
      switch (format) {
        case "png": {
          if (!containerRef.current) break;
          const canvas = containerRef.current.querySelector("canvas");
          if (canvas) {
            const dataUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `globe-export-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          break;
        }
        case "json": {
          const json = JSON.stringify(data, null, 2);
          downloadFile(json, `threats-${Date.now()}.json`, "application/json");
          break;
        }
        case "csv": {
          const csv = pointsToCsv(data);
          downloadFile(csv, `threats-${Date.now()}.csv`, "text/csv");
          break;
        }
        case "svg":
          console.warn("SVG export not yet supported for WebGL globe");
          break;
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(null);
      setIsOpen(false);
    }
  }, [containerRef, data]);
  const formatLabels = {
    png: "Screenshot (PNG)",
    svg: "Vector (SVG)",
    json: "Data (JSON)",
    csv: "Spreadsheet (CSV)"
  };
  const formatIcons = {
    png: "\u{1F5BC}",
    svg: "\u{1F4C4}",
    json: "\u{1F4C1}",
    csv: "\u{1F4CA}"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { position: "relative" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        style: {
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#e8eaed",
          padding: "8px 14px",
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 500,
          cursor: "pointer",
          letterSpacing: 0.5,
          textTransform: "uppercase",
          backdropFilter: "blur(10px)",
          transition: "all 0.15s",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        },
        "aria-label": "Export visualization",
        "aria-expanded": isOpen,
        children: "EXPORT"
      }
    ),
    isOpen && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: {
      position: "absolute",
      bottom: "100%",
      right: 0,
      marginBottom: 8,
      background: "rgba(10,14,26,0.98)",
      borderRadius: 8,
      border: "1px solid rgba(255,255,255,0.15)",
      backdropFilter: "blur(12px)",
      overflow: "hidden",
      minWidth: 180,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
    }, children: formats.filter((f) => f !== "svg").map((format) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
      "button",
      {
        onClick: () => handleExport(format),
        disabled: exporting !== null,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          padding: "10px 14px",
          background: exporting === format ? "rgba(59,130,246,0.15)" : "transparent",
          border: "none",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          color: "#e8eaed",
          fontSize: 12,
          cursor: exporting ? "wait" : "pointer",
          textAlign: "left",
          transition: "background 0.15s",
          fontFamily: "inherit"
        },
        onMouseEnter: (e) => {
          if (!exporting) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        },
        onMouseLeave: (e) => {
          if (!exporting) e.currentTarget.style.background = "transparent";
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: formatIcons[format] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: formatLabels[format] }),
          exporting === format && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: {
            marginLeft: "auto",
            width: 14,
            height: 14,
            border: "2px solid rgba(255,255,255,0.1)",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "exp-spin 0.8s linear infinite",
            display: "inline-block"
          } })
        ]
      },
      format
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("style", { children: `@keyframes exp-spin { to { transform: rotate(360deg) } }` })
  ] });
}

// src/hooks/useGlobe.ts
var import_react7 = require("react");
var THREE3 = __toESM(require("three"));
var import_globe3 = __toESM(require("globe.gl"));
function useGlobe(options) {
  const globeRef = (0, import_react7.useRef)(null);
  const [isReady, setIsReady] = (0, import_react7.useState)(false);
  const [altitude, setAltitude] = (0, import_react7.useState)(options.initialPosition?.altitude ?? 2.2);
  const altitudeTimerRef = (0, import_react7.useRef)(null);
  const borderArcsRef = (0, import_react7.useRef)([]);
  const destroyedRef = (0, import_react7.useRef)(false);
  (0, import_react7.useEffect)(() => {
    altitudeTimerRef.current = setInterval(() => {
      if (globeRef.current && !destroyedRef.current) {
        try {
          const pov = globeRef.current.pointOfView();
          setAltitude(pov.altitude);
        } catch {
        }
      }
    }, 100);
    return () => {
      if (altitudeTimerRef.current) clearInterval(altitudeTimerRef.current);
    };
  }, []);
  (0, import_react7.useEffect)(() => {
    const container = options.containerRef.current;
    if (!container) return;
    destroyedRef.current = false;
    const mergedColors = { ...LEVEL_COLORS, ...options.colors || {} };
    const init = () => {
      try {
        if (destroyedRef.current) return;
        const textureConfig = TEXTURE_URLS[options.texture];
        const atmosphereColor = ATMOSPHERE_COLORS[options.texture];
        const { color: emissiveColor, intensity: emissiveIntensity } = EMISSIVE_SETTINGS[options.texture];
        const globe = (0, import_globe3.default)().globeImageUrl(textureConfig.globe).backgroundColor("rgba(0,0,0,0)").showAtmosphere(options.showAtmosphere !== false).atmosphereColor(atmosphereColor).atmosphereAltitude(0.15).onGlobeReady(() => {
          if (destroyedRef.current) return;
          try {
            const mat = globe.globeMaterial();
            mat.emissive = new THREE3.Color(emissiveColor);
            mat.emissiveIntensity = emissiveIntensity;
          } catch {
          }
          setIsReady(true);
        }).hexBinPointsData(options.data).hexBinPointWeight("count").hexAltitude((d) => d.sumWeight * (options.hexAltitudeMultiplier ?? 2e-3)).hexTopColor(
          (d) => getLevelColor(d.points[0].level, mergedColors)
        ).hexSideColor(
          (d) => getLevelColor(d.points[0].level, mergedColors) + "66"
        ).hexBinResolution(options.clusterResolution ?? 4).hexLabel(
          (d) => createTooltipHtml(d.points[0], d.sumWeight, mergedColors)
        ).arcsData([]).arcColor(() => "#00ffff").arcStroke(0.5);
        if (textureConfig.bump) {
          globe.bumpImageUrl(textureConfig.bump);
        }
        globe(container);
        const pos = options.initialPosition ?? { lat: 30, lng: 0, altitude: 2.2 };
        globe.pointOfView(pos);
        const controls = globe.controls();
        if (controls) {
          controls.autoRotate = options.autoRotate !== false;
          controls.autoRotateSpeed = options.autoRotateSpeed ?? 0.3;
          controls.enableZoom = true;
          controls.minDistance = 120;
          controls.maxDistance = 2e3;
        }
        if (options.showBorders || options.texture === "borders") {
          loadCountryBorders(GEOJSON_URL).then((arcs) => {
            if (destroyedRef.current) return;
            borderArcsRef.current = arcs;
            if (options.texture === "borders") {
              globe.arcsData(arcs).arcColor(() => "#00ffff").arcStroke(0.8).arcAltitude(0).arcAltitudeAutoScale(0.01);
            }
          });
        }
        globeRef.current = globe;
        requestAnimationFrame(() => {
          if (container && globe && !destroyedRef.current) {
            globe.width(container.clientWidth).height(container.clientHeight);
          }
        });
      } catch (err) {
        console.error("useGlobe: Failed to initialize", err);
      }
    };
    init();
    const handleResize = () => {
      if (container && globeRef.current && !destroyedRef.current) {
        globeRef.current.width(container.clientWidth).height(container.clientHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      destroyedRef.current = true;
      window.removeEventListener("resize", handleResize);
      if (globeRef.current) {
        const g = globeRef.current;
        try {
          const renderer = g.renderer();
          if (renderer) {
            renderer.dispose();
            renderer.forceContextLoss();
          }
        } catch {
        }
        try {
          const scene = g.scene();
          if (scene) {
            scene.traverse((obj) => {
              const mesh = obj;
              if (mesh.geometry) mesh.geometry.dispose();
              if (mesh.material) {
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                materials.forEach((mat) => {
                  if (mat.map) mat.map.dispose();
                  mat.dispose();
                });
              }
            });
          }
        } catch {
        }
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        globeRef.current = null;
      }
    };
  }, []);
  (0, import_react7.useEffect)(() => {
    if (globeRef.current && !destroyedRef.current) {
      globeRef.current.hexBinPointsData(options.data);
    }
  }, [options.data]);
  const flyTo = (0, import_react7.useCallback)((lat, lng, alt = 1.5) => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat, lng, altitude: alt }, 1500);
    }
  }, []);
  const setTexture = (0, import_react7.useCallback)((texture) => {
    if (!globeRef.current || destroyedRef.current) return;
    const g = globeRef.current;
    const config = TEXTURE_URLS[texture];
    g.globeImageUrl(config.globe);
    g.atmosphereColor(ATMOSPHERE_COLORS[texture]);
    try {
      const mat = g.globeMaterial();
      const { color, intensity } = EMISSIVE_SETTINGS[texture];
      mat.emissive = new THREE3.Color(color);
      mat.emissiveIntensity = intensity;
    } catch {
    }
    if (texture === "borders" && borderArcsRef.current.length > 0) {
      g.arcsData(borderArcsRef.current).arcColor(() => "#00ffff").arcStroke(0.8);
    } else {
      g.arcsData([]);
    }
  }, []);
  return {
    globe: globeRef.current,
    isReady,
    altitude,
    flyTo,
    setTexture
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ATMOSPHERE_COLORS,
  DEFAULT_CAMERA,
  DEMO_THREATS,
  EMISSIVE_SETTINGS,
  ExportButton,
  GEOJSON_URL,
  Globe3DEnhanced,
  Globe3DWarGame,
  LEVEL_COLORS,
  LEVEL_COLORS_DARK,
  LEVEL_COLORS_GLOW,
  PLANETS,
  SearchFilter,
  Starfield,
  TEXTURE_URLS,
  TimelineSlider,
  captureScreenshot,
  clusterPoints,
  createTooltipHtml,
  debounce,
  downloadFile,
  escapeHtml,
  filterPoints,
  getLevelColor,
  haversineDistance,
  hexToRgba,
  latLngToMercator,
  loadCountryBorders,
  pointsToCsv,
  throttle,
  useGlobe
});
