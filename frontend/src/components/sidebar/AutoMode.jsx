import React from 'react';
import { Search } from 'lucide-react';

export default function AutoMode({ target, setTarget }) {
  return (
    <div className="fade-in-text">
      {/* TARGET INPUT with Suggestions */}
      <div className="input-group">
        <label className="input-label">TARGET PROTEIN (PDB ID)</label>
        <div className="input-wrapper">
          <Search size={16} color="#888" className="input-icon" />
          <input className="cyber-input" placeholder="Ex: 6LU7" value={target} onChange={(e) => setTarget(e.target.value)} />
        </div>

        {/* ✅ SUGGESTIONS ADDED BACK */}
        <div className="suggestions-box" style={{ pointerEvents: 'auto', flexWrap: 'wrap' }}>
          <span>Try:</span>
          <span className="suggestion-text" onClick={() => setTarget('6LU7')}>Covid-19</span>
        </div>
      </div>

      {/* ✅ FILTERS ADDED BACK */}
      <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '15px' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Database Filters</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div><label className="input-label" style={{ fontSize: '9px' }}>MIN WEIGHT</label><input className="cyber-input" style={{ height: '30px', fontSize: '11px' }} placeholder="100" /></div>
          <div><label className="input-label" style={{ fontSize: '9px' }}>MAX WEIGHT</label><input className="cyber-input" style={{ height: '30px', fontSize: '11px' }} placeholder="600" /></div>
          
          <div><label className="input-label" style={{ fontSize: '9px' }}>MAX LOGP</label><input className="cyber-input" style={{ height: '30px', fontSize: '11px' }} placeholder="5.0" /></div>
          <div><label className="input-label" style={{ fontSize: '9px' }}>MIN H-BOND</label><input className="cyber-input" style={{ height: '30px', fontSize: '11px' }} placeholder="2" /></div>
          
          <div><label className="input-label" style={{ fontSize: '9px' }}>ROT. BONDS</label><input className="cyber-input" style={{ height: '30px', fontSize: '11px' }} placeholder="< 10" /></div>
          <div><label className="input-label" style={{ fontSize: '9px' }}>TPSA</label><input className="cyber-input" style={{ height: '30px', fontSize: '11px' }} placeholder="< 140" /></div>
        </div>
        
        <div style={{ fontSize: '10px', color: 'var(--text-disabled)', marginTop: '10px' }}>Searching Internal Library (6000+ Drugs)...</div>
      </div>
    </div>
  );
}