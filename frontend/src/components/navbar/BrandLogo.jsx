import React from 'react';
import { Dna } from 'lucide-react';

export default function BrandLogo({ onClick }) {
  return (
    <div className="brand-identity" onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', position: 'relative', zIndex: 50 }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        width: '26px',
        height: '26px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Dna size={15} color="var(--accent)" strokeWidth={2.5} />
      </div>
      <span className="brand-text" style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.3px', margin: 0, padding: 0 }}>BioGraph</span>
    </div>
  );
}