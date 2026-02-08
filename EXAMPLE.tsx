import React, { useState, useEffect } from 'react';
import { Globe3DEnhanced, GlobePoint, GlobeConfig } from './Globe3DEnhanced';
import { Starfield } from './Starfield';

/**
 * Example 1: Basic Usage
 * Minimal setup with sample threat data
 */
export function BasicExample() {
  const sampleThreats: GlobePoint[] = [
    {
      id: '1',
      lat: 40.7128,
      lng: -74.0060,
      city: 'New York',
      country: 'USA',
      level: 'critical',
      count: 150,
    },
    {
      id: '2',
      lat: 51.5074,
      lng: -0.1278,
      city: 'London',
      country: 'UK',
      level: 'high',
      count: 89,
    },
    {
      id: '3',
      lat: 35.6762,
      lng: 139.6503,
      city: 'Tokyo',
      country: 'Japan',
      level: 'medium',
      count: 45,
    },
  ];

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      <Starfield />
      <Globe3DEnhanced points={sampleThreats} />
    </div>
  );
}

/**
 * Example 2: Full Configuration
 * All features enabled with custom config
 */
export function AdvancedExample() {
  const config: GlobeConfig = {
    homeLocation: { lat: 37.7749, lng: -122.4194, label: 'San Francisco HQ' },
    showCountryBorders: true,
    showCityLabels: true,
    showAtmosphere: true,
    autoRotate: true,
    autoRotateSpeed: 0.3,
    theme: 'dark',
    showArcs: true,
    pointStyle: 'hex',
  };

  const threats: GlobePoint[] = [
    { id: '1', lat: 55.7558, lng: 37.6173, city: 'Moscow', country: 'Russia', level: 'critical', count: 250 },
    { id: '2', lat: 39.9042, lng: 116.4074, city: 'Beijing', country: 'China', level: 'high', count: 180 },
    { id: '3', lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'Germany', level: 'medium', count: 95 },
    { id: '4', lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'Australia', level: 'low', count: 30 },
  ];

  const handlePointClick = (point: GlobePoint) => {
    alert(`Threat Level: ${point.level}\nLocation: ${point.city}, ${point.country}\nEvents: ${point.count}`);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      <Starfield />
      <Globe3DEnhanced
        points={threats}
        config={config}
        centerLat={30}
        centerLng={0}
        onPointClick={handlePointClick}
      />
    </div>
  );
}

/**
 * Example 3: Real-Time Updates
 * Simulates live threat data updates
 */
export function LiveUpdateExample() {
  const [threats, setThreats] = useState<GlobePoint[]>([]);

  useEffect(() => {
    // Simulate initial threats
    const initialThreats: GlobePoint[] = [
      { id: '1', lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA', level: 'high', count: 50 },
    ];
    setThreats(initialThreats);

    // Simulate new threats appearing every 5 seconds
    const interval = setInterval(() => {
      const cities = [
        { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK' },
        { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan' },
        { name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France' },
        { name: 'Dubai', lat: 25.2048, lng: 55.2708, country: 'UAE' },
      ];

      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const levels: Array<'critical' | 'high' | 'medium' | 'low'> = ['critical', 'high', 'medium', 'low'];
      const randomLevel = levels[Math.floor(Math.random() * levels.length)];

      const newThreat: GlobePoint = {
        id: Date.now().toString(),
        lat: randomCity.lat,
        lng: randomCity.lng,
        city: randomCity.name,
        country: randomCity.country,
        level: randomLevel,
        count: Math.floor(Math.random() * 100) + 1,
      };

      setThreats((prev) => [...prev, newThreat].slice(-10)); // Keep last 10 threats
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      <Starfield />
      <Globe3DEnhanced
        points={threats}
        config={{
          autoRotate: true,
          showCityLabels: true,
          showArcs: true,
        }}
      />
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.8)',
        padding: '15px',
        borderRadius: '8px',
        color: 'white',
        fontFamily: 'monospace',
      }}>
        <div>Active Threats: {threats.length}</div>
        <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>Updates every 5s</div>
      </div>
    </div>
  );
}

/**
 * Example 4: Dashboard Integration
 * Shows how to integrate with a larger dashboard
 */
export function DashboardExample() {
  const [selectedThreat, setSelectedThreat] = useState<GlobePoint | null>(null);

  const threats: GlobePoint[] = [
    { id: '1', lat: 55.7558, lng: 37.6173, city: 'Moscow', country: 'Russia', level: 'critical', count: 250 },
    { id: '2', lat: 39.9042, lng: 116.4074, city: 'Beijing', country: 'China', level: 'high', count: 180 },
    { id: '3', lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'Germany', level: 'medium', count: 95 },
  ];

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0a', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{
        width: '300px',
        background: '#1a1a1a',
        padding: '20px',
        overflowY: 'auto',
        borderRight: '1px solid #333',
      }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>Threat Intelligence</h2>
        {threats.map((threat) => (
          <div
            key={threat.id}
            onClick={() => setSelectedThreat(threat)}
            style={{
              padding: '12px',
              background: selectedThreat?.id === threat.id ? '#333' : '#222',
              marginBottom: '10px',
              borderRadius: '6px',
              cursor: 'pointer',
              color: 'white',
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{threat.city}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              Level: {threat.level} • Count: {threat.count}
            </div>
          </div>
        ))}
      </div>

      {/* Globe */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Starfield />
        <Globe3DEnhanced
          points={threats}
          config={{
            showCityLabels: true,
            showArcs: true,
            autoRotate: !selectedThreat, // Stop rotation when threat selected
          }}
          onPointClick={setSelectedThreat}
        />
      </div>
    </div>
  );
}

// Default export for easy importing
export default function Examples() {
  return (
    <>
      <h1>Choose an example:</h1>
      <BasicExample />
      {/* <AdvancedExample /> */}
      {/* <LiveUpdateExample /> */}
      {/* <DashboardExample /> */}
    </>
  );
}
