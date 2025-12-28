import React from 'react';
import { Hexagon } from 'lucide-react';

export default function BrandLogo({ onClick }) {
  return (
    <div className="brand-identity" onClick={onClick} style={{ gap: '10px', cursor: 'pointer' }}>
      <div className="glass-logo-container" style={{ padding: '6px' }}>
        <Hexagon size={22} color="#00f3ff" fill="rgba(0, 243, 255, 0.3)" strokeWidth={2} />
      </div>
      <div className="brand-text" style={{ fontSize: '16px' }}>
        BioGraph <span style={{ color: '#00f3ff' }}>AI</span>
      </div>
    </div>
  );
}