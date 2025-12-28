import React from 'react';
import { Dna } from 'lucide-react';

export default function HologramDisplay({ loading, progress, activeTab }) {
  return (
    <div className="hologram-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%' }}>
        <div className="hologram-inner" style={{ pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* 3D Rings & Spinner */}
            <div className="dna-spinner"><Dna size={120} color="#00f3ff" strokeWidth={1.5} /></div>
            <div className="ring-1"></div>
            <div className="ring-2"></div>
            <div className="core-glow"></div>
            
            {/* Loading Status */}
            {loading && (
            <div style={{ width: '300px', marginTop: '30px', textAlign: 'center' }}>
                <div className="loading-text" style={{color: '#00f3ff'}}>
                    {activeTab === 'auto' ? `SCANNING (${progress}%)` : "PROCESSING..."}
                </div>
                {activeTab !== 'manual' && (
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: '#00f3ff', transition: 'width 0.3s' }}></div>
                </div>
                )}
            </div>
            )}
        </div>
        
        {/* Background Grid */}
        <div className="grid-overlay" style={{ pointerEvents: 'none' }}></div>
    </div>
  );
}