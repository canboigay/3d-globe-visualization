// =============================================================================
// SearchFilter — Filter panel for threat data
// =============================================================================

import { useState, useMemo, useCallback } from 'react';
import type { SearchFilterProps, ThreatLevel } from '../types';
import { LEVEL_COLORS } from '../constants';
import { escapeHtml, getLevelColor } from '../utils';

const ALL_LEVELS: ThreatLevel[] = ['critical', 'high', 'medium', 'low', 'info'];

export function SearchFilter({
  filters,
  onChange,
  availableCountries = [],
  availableCities = [],
}: SearchFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleLevel = useCallback((level: ThreatLevel) => {
    const current = filters.levels || [];
    const next = current.includes(level)
      ? current.filter((l) => l !== level)
      : [...current, level];
    onChange({ ...filters, levels: next.length > 0 ? next : undefined });
  }, [filters, onChange]);

  const setSearch = useCallback((search: string) => {
    onChange({ ...filters, search: search || undefined });
  }, [filters, onChange]);

  const setCountry = useCallback((country: string) => {
    if (!country) {
      const { countries, ...rest } = filters;
      onChange(rest);
      return;
    }
    onChange({ ...filters, countries: [country] });
  }, [filters, onChange]);

  const clearAll = useCallback(() => {
    onChange({});
  }, [onChange]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.levels?.length) count++;
    if (filters.countries?.length) count++;
    if (filters.search) count++;
    if (filters.minCount !== undefined) count++;
    return count;
  }, [filters]);

  const btnStyle = (active: boolean, color: string): React.CSSProperties => ({
    padding: '5px 10px',
    borderRadius: 5,
    border: `1px solid ${active ? color : 'rgba(255,255,255,0.15)'}`,
    background: active ? color + '25' : 'rgba(255,255,255,0.03)',
    color: active ? color : '#9ca3af',
    fontSize: 11,
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    transition: 'all 0.15s',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    fontFamily: 'inherit',
  });

  return (
    <div style={{
      background: 'rgba(10,14,26,0.95)',
      borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.12)',
      backdropFilter: 'blur(12px)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: '#e8eaed', fontWeight: 600, letterSpacing: 0.5 }}>
            FILTERS
          </span>
          {activeFilterCount > 0 && (
            <span style={{
              background: 'rgba(59,130,246,0.3)',
              color: '#3b82f6',
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 10,
            }}>
              {activeFilterCount}
            </span>
          )}
        </div>
        <span style={{ color: '#6b7280', fontSize: 12, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : '' }}>
          \u25BC
        </span>
      </div>

      {isExpanded && (
        <div style={{ padding: '0 14px 14px' }}>
          {/* Search */}
          <input
            type="text"
            placeholder="Search cities, countries..."
            value={filters.search || ''}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)',
              color: '#e8eaed',
              fontSize: 12,
              outline: 'none',
              marginBottom: 12,
              fontFamily: 'inherit',
            }}
            aria-label="Search threats"
          />

          {/* Level toggles */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>
              Severity
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {ALL_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => toggleLevel(level)}
                  style={btnStyle(
                    filters.levels?.includes(level) ?? false,
                    getLevelColor(level)
                  )}
                  aria-pressed={filters.levels?.includes(level) ?? false}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Country filter */}
          {availableCountries.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>
                Country
              </div>
              <select
                value={filters.countries?.[0] || ''}
                onChange={(e) => setCountry(e.target.value)}
                style={{
                  width: '100%', padding: '6px 10px', borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.05)', color: '#e8eaed',
                  fontSize: 12, outline: 'none', fontFamily: 'inherit',
                }}
                aria-label="Filter by country"
              >
                <option value="">All Countries</option>
                {availableCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {/* Clear */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              style={{
                width: '100%', padding: '7px', borderRadius: 6,
                border: '1px solid rgba(239,68,68,0.3)',
                background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: 0.5,
                fontFamily: 'inherit',
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchFilter;
