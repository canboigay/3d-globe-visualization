// =============================================================================
// ExportButton — Export globe visualization as PNG, JSON, or CSV
// =============================================================================

import { useState, useCallback } from 'react';
import type { ExportButtonProps, ExportFormat } from '../types';
import { pointsToCsv, downloadFile, captureScreenshot } from '../utils';

export function ExportButton({
  containerRef,
  data,
  formats = ['png', 'json', 'csv'],
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const handleExport = useCallback(async (format: ExportFormat) => {
    setExporting(format);

    try {
      switch (format) {
        case 'png': {
          if (!containerRef.current) break;
          // Find the WebGL canvas inside the container
          const canvas = containerRef.current.querySelector('canvas');
          if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `globe-export-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          break;
        }
        case 'json': {
          const json = JSON.stringify(data, null, 2);
          downloadFile(json, `threats-${Date.now()}.json`, 'application/json');
          break;
        }
        case 'csv': {
          const csv = pointsToCsv(data);
          downloadFile(csv, `threats-${Date.now()}.csv`, 'text/csv');
          break;
        }
        case 'svg':
          // SVG export would require a different rendering approach
          console.warn('SVG export not yet supported for WebGL globe');
          break;
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(null);
      setIsOpen(false);
    }
  }, [containerRef, data]);

  const formatLabels: Record<ExportFormat, string> = {
    png: 'Screenshot (PNG)',
    svg: 'Vector (SVG)',
    json: 'Data (JSON)',
    csv: 'Spreadsheet (CSV)',
  };

  const formatIcons: Record<ExportFormat, string> = {
    png: '\uD83D\uDDBC',
    svg: '\uD83D\uDCC4',
    json: '\uD83D\uDCC1',
    csv: '\uD83D\uDCCA',
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#e8eaed',
          padding: '8px 14px',
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 500,
          cursor: 'pointer',
          letterSpacing: 0.5,
          textTransform: 'uppercase' as const,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.15s',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
        aria-label="Export visualization"
        aria-expanded={isOpen}
      >
        EXPORT
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          right: 0,
          marginBottom: 8,
          background: 'rgba(10,14,26,0.98)',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(12px)',
          overflow: 'hidden',
          minWidth: 180,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {formats.filter(f => f !== 'svg').map((format) => (
            <button
              key={format}
              onClick={() => handleExport(format)}
              disabled={exporting !== null}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '10px 14px',
                background: exporting === format ? 'rgba(59,130,246,0.15)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                color: '#e8eaed',
                fontSize: 12,
                cursor: exporting ? 'wait' : 'pointer',
                textAlign: 'left' as const,
                transition: 'background 0.15s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { if (!exporting) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={(e) => { if (!exporting) e.currentTarget.style.background = 'transparent'; }}
            >
              <span>{formatIcons[format]}</span>
              <span>{formatLabels[format]}</span>
              {exporting === format && (
                <span style={{
                  marginLeft: 'auto',
                  width: 14, height: 14,
                  border: '2px solid rgba(255,255,255,0.1)',
                  borderTopColor: '#3b82f6',
                  borderRadius: '50%',
                  animation: 'exp-spin 0.8s linear infinite',
                  display: 'inline-block',
                }} />
              )}
            </button>
          ))}
        </div>
      )}

      <style>{`@keyframes exp-spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

export default ExportButton;
