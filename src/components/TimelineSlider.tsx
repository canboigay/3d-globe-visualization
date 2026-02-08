// =============================================================================
// TimelineSlider — Time-series playback control for threat data
// =============================================================================

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { TimelineSliderProps, TimeRange } from '../types';

export function TimelineSlider({
  data,
  timeRange,
  onChange,
  playbackSpeed = 1,
  stepInterval = 1000,
}: TimelineSliderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeRangeRef = useRef<TimeRange>(timeRange);

  // Keep ref in sync with latest prop value
  timeRangeRef.current = timeRange;

  // Compute data time bounds
  const timeBounds = useMemo(() => {
    const timestamps = data
      .filter((d) => d.timestamp)
      .map((d) => new Date(d.timestamp!).getTime());
    if (timestamps.length === 0) return { min: Date.now() - 86400000, max: Date.now() };
    return { min: Math.min(...timestamps), max: Math.max(...timestamps) };
  }, [data]);

  // Current position as percentage
  const currentPercent = useMemo(() => {
    const range = timeBounds.max - timeBounds.min;
    if (range === 0) return 100;
    return ((timeRange.end.getTime() - timeBounds.min) / range) * 100;
  }, [timeRange, timeBounds]);

  // Threat distribution histogram
  const histogram = useMemo(() => {
    const buckets = 60;
    const range = timeBounds.max - timeBounds.min;
    if (range === 0) return Array(buckets).fill(0) as number[];
    const counts = Array(buckets).fill(0) as number[];
    const withTs = data.filter((d) => d.timestamp);
    for (const d of withTs) {
      const t = new Date(d.timestamp!).getTime();
      const bucket = Math.min(Math.floor(((t - timeBounds.min) / range) * buckets), buckets - 1);
      counts[bucket] += d.count;
    }
    return counts;
  }, [data, timeBounds]);

  const maxHistogram = useMemo(() => Math.max(1, ...histogram), [histogram]);

  // Playback control
  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      if (playbackRef.current) clearInterval(playbackRef.current);
      playbackRef.current = null;
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const step = ((timeBounds.max - timeBounds.min) / 100) * playbackSpeed;
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

  // Cleanup
  useEffect(() => {
    return () => {
      if (playbackRef.current) clearInterval(playbackRef.current);
    };
  }, []);

  // Handle slider drag
  const handleSliderClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const range = timeBounds.max - timeBounds.min;
    const newEnd = new Date(timeBounds.min + (percent / 100) * range);
    onChange({ start: timeRange.start, end: newEnd });
  }, [timeBounds, timeRange, onChange]);

  const formatTime = (date: Date) => {
    return date.toLocaleString(undefined, {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        background: 'rgba(10,14,26,0.95)',
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.12)',
        padding: '12px 16px',
        backdropFilter: 'blur(12px)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        userSelect: 'none',
      }}
    >
      {/* Time labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: '#9ca3af', letterSpacing: 0.5 }}>
          {formatTime(new Date(timeBounds.min))}
        </span>
        <span style={{ fontSize: 12, color: '#e8eaed', fontWeight: 600, letterSpacing: 0.5 }}>
          {formatTime(timeRange.end)}
        </span>
        <span style={{ fontSize: 11, color: '#9ca3af', letterSpacing: 0.5 }}>
          {formatTime(new Date(timeBounds.max))}
        </span>
      </div>

      {/* Histogram + slider */}
      <div
        style={{ position: 'relative', height: 40, cursor: 'pointer', marginBottom: 8 }}
        onClick={handleSliderClick}
      >
        {/* Histogram bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', height: 32, gap: 1 }}>
          {histogram.map((count, i) => {
            const h = Math.max(2, (count / maxHistogram) * 32);
            const isActive = (i / histogram.length) * 100 <= currentPercent;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: h,
                  background: isActive
                    ? 'rgba(59,130,246,0.6)'
                    : 'rgba(255,255,255,0.08)',
                  borderRadius: 1,
                  transition: 'background 0.15s',
                }}
              />
            );
          })}
        </div>

        {/* Playhead */}
        <div
          style={{
            position: 'absolute',
            left: `${currentPercent}%`,
            top: 0,
            bottom: 0,
            width: 2,
            background: '#3b82f6',
            boxShadow: '0 0 8px rgba(59,130,246,0.6)',
            transform: 'translateX(-50%)',
          }}
        />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={togglePlayback}
          style={{
            width: 32, height: 32,
            background: isPlaying ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)',
            border: `1px solid ${isPlaying ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.4)'}`,
            borderRadius: 6,
            color: isPlaying ? '#ef4444' : '#3b82f6',
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={isPlaying ? 'Pause playback' : 'Start playback'}
        >
          {isPlaying ? '\u23F8' : '\u25B6'}
        </button>
        <span style={{ fontSize: 11, color: '#6b7280', letterSpacing: 0.5 }}>
          {data.filter(d => {
            if (!d.timestamp) return false;
            const t = new Date(d.timestamp).getTime();
            return t >= timeRange.start.getTime() && t <= timeRange.end.getTime();
          }).length} / {data.length} threats in range
        </span>
        <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 'auto' }}>
          {playbackSpeed}x
        </span>
      </div>
    </div>
  );
}

export default TimelineSlider;
