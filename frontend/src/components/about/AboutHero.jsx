import React from 'react';
import { Hexagon } from 'lucide-react';

export default function AboutHero() {
  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      
      {/* ✅ FIX: Added margin auto to center the fixed-width hologram */}
      <div className="hologram-inner" style={{ 
        height: '150px', 
        marginBottom: '30px', 
        marginLeft: 'auto', 
        marginRight: 'auto' 
      }}>
        <div className="dna-spinner">
          <Hexagon size={80} color="#00f3ff" fill="rgba(0, 243, 255, 0.3)" strokeWidth={2} />
        </div>
      </div>

      <div className="brand-text">BioGraph <span style={{ color: '#00f3ff' }}>AI</span></div>
      <div><br /></div>
      <div className="about-hero-subtitle">🔬The Universal Drug Repurposing Engine🚀</div>
    </div>
  );
}