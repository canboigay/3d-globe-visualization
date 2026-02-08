import React, { useState } from 'react';
import { Globe3DWarGame, GlobePoint, GlobeTexture, WarGameConfig } from './Globe3DWarGame';
import { Starfield } from './Starfield';

/**
 * Example 1: Night Vision Mode
 * Classic green night vision tactical display
 */
export function NightVisionExample() {
  const threats: GlobePoint[] = [
    { id: '1', lat: 55.7558, lng: 37.6173, city: 'Moscow', country: 'Russia', level: 'critical', count: 250 },
    { id: '2', lat: 39.9042, lng: 116.4074, city: 'Beijing', country: 'China', level: 'high', count: 180 },
    { id: '3', lat: 25.2048, lng: 55.2708, city: 'Dubai', country: 'UAE', level: 'medium', count: 95 },
  ];

  const config: WarGameConfig = {
    texture: 'night-vision',
    showMissileTrails: true,
    showScanLines: true,
    showRadarPulse: true,
    showTargetReticles: true,
    militaryGrid: true,
    warningAlerts: true,
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0a', position: 'relative' }}>
      <Starfield />
      <Globe3DWarGame points={threats} config={config} onPointClick={(point) => console.log('Target:', point)} />
    </div>
  );
}

/**
 * Example 2: Thermal Imaging Mode
 * Heat signature style threat detection
 */
export function ThermalExample() {
  const threats: GlobePoint[] = [
    { id: '1', lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK', level: 'high', count: 150 },
    { id: '2', lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France', level: 'medium', count: 89 },
    { id: '3', lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan', level: 'critical', count: 200 },
  ];

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      <Globe3DWarGame
        points={threats}
        config={{
          texture: 'thermal',
          showMissileTrails: true,
          showCoordinates: true,
          militaryGrid: false,
        }}
      />
    </div>
  );
}

/**
 * Example 3: Texture Switcher
 * Live texture switching with all 8 styles
 */
export function TextureSwitcherExample() {
  const [currentTexture, setCurrentTexture] = useState<GlobeTexture>('war-ops');

  const textures: GlobeTexture[] = [
    'war-ops',
    'night-vision',
    'thermal',
    'tactical',
    'satellite',
    'dark-ops',
    'neon-cyber',
    'classic',
  ];

  const threats: GlobePoint[] = [
    { id: '1', lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA', level: 'high', count: 120 },
    { id: '2', lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'Australia', level: 'medium', count: 65 },
    { id: '3', lat: 55.7558, lng: 37.6173, city: 'Moscow', country: 'Russia', level: 'critical', count: 300 },
  ];

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      <Starfield />
      
      {/* Texture selector */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        gap: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '15px 20px',
        borderRadius: '8px',
        border: '2px solid #00ff00',
      }}>
        {textures.map((texture) => (
          <button
            key={texture}
            onClick={() => {
              setCurrentTexture(texture);
              // Force reload by unmounting and remounting
              window.location.reload();
            }}
            style={{
              background: currentTexture === texture ? '#00ff00' : 'transparent',
              border: '1px solid #00ff00',
              color: currentTexture === texture ? '#000' : '#00ff00',
              padding: '8px 16px',
              borderRadius: '4px',
              fontFamily: 'Courier New, monospace',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'all 0.3s',
            }}
          >
            {texture}
          </button>
        ))}
      </div>

      <Globe3DWarGame
        points={threats}
        config={{
          texture: currentTexture,
          showMissileTrails: true,
          showScanLines: true,
          militaryGrid: true,
        }}
      />
    </div>
  );
}

/**
 * Example 4: Full War Room Experience
 * Complete tactical operations center with all features
 */
export function WarRoomExample() {
  const [threats, setThreats] = useState<GlobePoint[]>([
    { id: '1', lat: 55.7558, lng: 37.6173, city: 'Moscow', country: 'Russia', level: 'critical', count: 250 },
    { id: '2', lat: 39.9042, lng: 116.4074, city: 'Beijing', country: 'China', level: 'high', count: 180 },
    { id: '3', lat: 25.2048, lng: 55.2708, city: 'Dubai', country: 'UAE', level: 'medium', count: 95 },
    { id: '4', lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'Germany', level: 'high', count: 140 },
  ]);

  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  const handlePointClick = (point: GlobePoint) => {
    console.log('🎯 TARGET LOCKED:', point);
    alert(`TARGET: ${point.city}\nTHREAT LEVEL: ${point.level.toUpperCase()}\nINCIDENTS: ${point.count}`);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      {/* Animated starfield background */}
      <Starfield />

      {/* Top HUD */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, transparent 100%)',
        borderBottom: '1px solid #00ff00',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
        zIndex: 50,
      }}>
        <div style={{
          fontFamily: 'Courier New, monospace',
          color: '#00ff00',
          fontSize: '20px',
          fontWeight: 'bold',
          letterSpacing: '3px',
        }}>
          TACTICAL OPERATIONS CENTER
        </div>
        <div style={{
          fontFamily: 'Courier New, monospace',
          color: '#00ff00',
          fontSize: '14px',
        }}>
          {new Date().toLocaleTimeString()} UTC | THREATS: {threats.length} | MODE: {viewMode.toUpperCase()}
        </div>
      </div>

      {/* Threat counter sidebar */}
      <div style={{
        position: 'absolute',
        left: '20px',
        top: '100px',
        bottom: '20px',
        width: '280px',
        background: 'rgba(0, 0, 0, 0.8)',
        border: '2px solid #00ff00',
        borderRadius: '8px',
        padding: '20px',
        zIndex: 100,
        overflowY: 'auto',
      }}>
        <div style={{
          fontFamily: 'Courier New, monospace',
          color: '#00ff00',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '15px',
          borderBottom: '1px solid #00ff00',
          paddingBottom: '10px',
        }}>
          ACTIVE THREATS
        </div>
        {threats.map((threat) => (
          <div
            key={threat.id}
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              border: `1px solid ${LEVEL_COLORS[threat.level]}`,
              borderRadius: '4px',
              padding: '12px',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
            onClick={() => handlePointClick(threat)}
          >
            <div style={{
              color: LEVEL_COLORS[threat.level],
              fontFamily: 'Courier New, monospace',
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '4px',
            }}>
              {threat.level.toUpperCase()}
            </div>
            <div style={{
              color: '#00ff00',
              fontFamily: 'Courier New, monospace',
              fontSize: '11px',
            }}>
              {threat.city}, {threat.country}
            </div>
            <div style={{
              color: '#666',
              fontFamily: 'Courier New, monospace',
              fontSize: '10px',
              marginTop: '4px',
            }}>
              INCIDENTS: {threat.count}
            </div>
          </div>
        ))}
      </div>

      {/* Main globe display */}
      <Globe3DWarGame
        points={threats}
        config={{
          texture: 'war-ops',
          showMissileTrails: true,
          showScanLines: true,
          showRadarPulse: true,
          showTargetReticles: true,
          militaryGrid: true,
          showCoordinates: true,
          warningAlerts: true,
          enableExplosions: true,
        }}
        onPointClick={handlePointClick}
        onViewModeChange={setViewMode}
      />
    </div>
  );
}

const LEVEL_COLORS = {
  critical: '#ff0000',
  high: '#ff6600',
  medium: '#ffcc00',
  low: '#00ff00',
};

// Export all examples
export default function WarGameExamples() {
  return <WarRoomExample />;
}
