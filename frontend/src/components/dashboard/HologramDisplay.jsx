import React from 'react';
import { Dna, ChevronRight } from 'lucide-react';

export default function HologramDisplay({ loading, progress, progressDetail, activeTab }) {
  return (
    <div className="hologram-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%' }}>
      <div className="grid-overlay" style={{ pointerEvents: 'none' }}></div>

      <div className="hologram-inner" style={{ pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5 }}>

        {/* Glowing Base */}
        {loading && <div className="hologram-base"></div>}

        {/* Particles */}
        {loading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="data-particle" style={{ left: `${20 + i * 15}%`, animationDelay: `${i * 0.5}s` }}></div>
        ))}

        {/* Icon */}
        <div className="dna-spinner">
          <Dna size={80} strokeWidth={1.5} />
          {loading && <div className="laser-scanner"></div>}
        </div>

        {/* State Text */}
        {!loading ? (
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              BioGraph AI Engine
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
               Configure your analysis dashboard<br />to begin the discovery process
            </div>
          </div>
        ) : (
          <div style={{ width: '320px', marginTop: '20px', textAlign: 'center' }}>
            <div className="loading-text" style={{ marginBottom: '4px', fontSize: '14px', fontWeight: 600, letterSpacing: '0.02em', color: 'var(--text-primary)' }}>
              {progressDetail?.status || (activeTab === 'auto' ? 'Scanning Database...' : 'Processing Molecule...')}
            </div>
            
            {progressDetail && progressDetail.total > 0 && (
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '16px', letterSpacing: '0.1em', fontWeight: 500 }}>
                {progressDetail.current.toLocaleString()} / {progressDetail.total.toLocaleString()} MOLECULES SCANNED
              </div>
            )}

            <div className="progress-track" style={{ width: '100%', marginTop: '12px' }}>
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            
            <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
              Completion: {progress}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}