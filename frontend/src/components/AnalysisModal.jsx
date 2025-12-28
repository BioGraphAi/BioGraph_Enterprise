import React from 'react';
import { X } from 'lucide-react';

// ✅ MODULAR IMPORTS
import MolecularProperties from './analysis-modal/MolecularProperties';
import SafetyAnalysis from './analysis-modal/SafetyAnalysis';
import SafetyVerdict from './analysis-modal/SafetyVerdict';

export default function AnalysisModal({ result, onClose }) {
  if (!result || !result.admet) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
      animation: 'fadeIn 0.3s ease'
    }}>
      
      {/* Glass Modal Box */}
      <div style={{
        width: '650px', maxWidth: '95%', 
        background: 'rgba(10, 15, 20, 0.95)',
        border: `1px solid ${result.color}`, 
        borderRadius: '20px',
        padding: '30px', 
        position: 'relative',
        boxShadow: `0 0 60px ${result.color}30`
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#888', letterSpacing: '2px' }}>DETAILED ANALYSIS</div>
            <h2 style={{ margin: 0, fontSize: '22px', color: '#fff', letterSpacing: '1px' }}>{result.name}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }} className="hover-text-white">
            <X size={28} />
          </button>
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          {/* Section 1: Physical Properties */}
          <MolecularProperties admet={result.admet} />

          {/* Section 2: Safety & Rules */}
          <SafetyAnalysis admet={result.admet} />

        </div>

        {/* Final Verdict Box */}
        <SafetyVerdict admet={result.admet} />

      </div>
      <style>{`
        .hover-text-white:hover { color: #fff !important; }
        @keyframes fadeIn { from{opacity:0; transform:scale(0.95);} to{opacity:1; transform:scale(1);} }
      `}</style>
    </div>
  );
}