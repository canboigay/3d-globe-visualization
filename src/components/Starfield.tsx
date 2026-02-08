// =============================================================================
// Starfield — Animated canvas starfield with optional orbiting planets
// =============================================================================

import { useRef, useEffect, useCallback } from 'react';
import type { StarfieldProps } from '../types';
import { PLANETS } from '../constants';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export function Starfield({
  starCount = 300,
  enabled = true,
  showPlanets = true,
  parallaxSpeed = 1,
  className = '',
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const planetOpacityRef = useRef(0);
  const isVisibleRef = useRef(true);

  // Initialize stars
  const initStars = useCallback((width: number, height: number) => {
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 4 + 0.5,
        size: Math.random() * 2 + 0.3,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = stars;
  }, [starCount]);

  // Draw a single planet with glow and optional ring
  const drawPlanet = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    size: number, color: string,
    hasRing: boolean, name: string,
    opacity: number
  ) => {
    ctx.globalAlpha = opacity;

    // Outer glow
    const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 2.5);
    glow.addColorStop(0, color + '60');
    glow.addColorStop(0.4, color + '20');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Planet body with 3D shading
    const bodyGrad = ctx.createRadialGradient(
      x - size * 0.3, y - size * 0.3, size * 0.1,
      x, y, size
    );
    bodyGrad.addColorStop(0, '#ffffff40');
    bodyGrad.addColorStop(0.3, color);
    bodyGrad.addColorStop(1, color + '66');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    // Saturn ring
    if (hasRing) {
      ctx.strokeStyle = color + '50';
      ctx.lineWidth = Math.max(4, size * 0.15);
      ctx.beginPath();
      ctx.ellipse(x, y, size * 1.8, size * 0.5, -0.2, 0, Math.PI * 2);
      ctx.stroke();

      // Inner ring highlight
      ctx.strokeStyle = color + '30';
      ctx.lineWidth = Math.max(2, size * 0.08);
      ctx.beginPath();
      ctx.ellipse(x, y, size * 1.5, size * 0.4, -0.2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Label
    if (opacity > 0.6) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(opacity, 0.7)})`;
      ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(name, x, y + size + 18);
    }

    ctx.globalAlpha = 1;
  }, []);

  // Main animation loop
  const animate = useCallback(() => {
    if (!enabled || !isVisibleRef.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;

    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    timeRef.current += 0.001;
    const t = timeRef.current;

    // Solar glow when planets visible
    const pOpacity = planetOpacityRef.current;
    if (pOpacity > 0 && showPlanets) {
      const cx = width / 2;
      const cy = height / 2;
      const solarGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.4);
      solarGlow.addColorStop(0, `rgba(255, 200, 100, ${pOpacity * 0.12})`);
      solarGlow.addColorStop(0.3, `rgba(255, 150, 50, ${pOpacity * 0.06})`);
      solarGlow.addColorStop(0.6, `rgba(100, 50, 200, ${pOpacity * 0.02})`);
      solarGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = solarGlow;
      ctx.fillRect(0, 0, width, height);
    }

    // Stars
    for (const star of starsRef.current) {
      // Twinkle
      star.twinklePhase += star.twinkleSpeed;
      const twinkle = Math.sin(star.twinklePhase) * 0.15;
      const currentOpacity = Math.max(0.15, Math.min(0.95, star.opacity + twinkle));

      // Parallax drift
      star.x += star.z * 0.015 * parallaxSpeed;
      star.y += star.z * 0.008 * parallaxSpeed;
      if (star.x > width) star.x = 0;
      if (star.y > height) star.y = 0;

      // Star with glow
      const grad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 1.5);
      grad.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
      grad.addColorStop(0.4, `rgba(200, 220, 255, ${currentOpacity * 0.4})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Planets
    if (pOpacity > 0 && showPlanets) {
      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < PLANETS.length; i++) {
        const planet = PLANETS[i];
        const angle = t * planet.speed + i * (Math.PI / 3);
        const scale = Math.min(width, height) / 1000;
        const orbitX = planet.orbitRadius * scale;
        const orbitY = planet.orbitRadius * scale * 0.6;

        const x = cx + Math.cos(angle) * orbitX;
        const y = cy + Math.sin(angle) * orbitY;

        drawPlanet(ctx, x, y, planet.size * scale, planet.color, !!planet.hasRing, planet.name, pOpacity);
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [enabled, showPlanets, parallaxSpeed, drawPlanet]);

  // Set planet opacity from outside (driven by globe altitude)
  useEffect(() => {
    // Expose setter on the canvas element for the parent component
    const canvas = canvasRef.current;
    if (canvas) {
      (canvas as unknown as { setPlanetOpacity: (v: number) => void }).setPlanetOpacity = (v: number) => {
        planetOpacityRef.current = v;
      };
    }
  }, []);

  // Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      // Keep CSS size
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      initStars(rect.width, rect.height);
    };

    resize();
    window.addEventListener('resize', resize);

    // Visibility detection — pause when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, [initStars, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}

export default Starfield;
