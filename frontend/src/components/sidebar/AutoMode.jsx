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
          <span className="suggestion-text" onClick={() => setTarget('3PP0')}>Cancer</span>
          <span className="suggestion-text" onClick={() => setTarget('1Z00')}>Diabetes</span>
          <span className="suggestion-text" onClick={() => setTarget('1J3I')}>Malaria</span>
          <span className="suggestion-text" onClick={() => setTarget('5DI3')}>Alzheimer</span>
        </div>
      </div>

      {/* ✅ FILTERS ADDED BACK */}
      <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '15px' }}>
        <div style={{ color: '#00f3ff', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>DATABASE FILTERS</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div><label className="input-label" style={{ fontSize: '9px' }}>MIN WEIGHT</label><input className="cyber-input" style={{ height: '30px', fontSize: '11px' }} placeholder="100" /></div>
          <div><label className="input-label" style={{ fontSize: '9px' }}>MAX WEIGHT</label><input className="cyber-input" style={{ height: '30px', fontSize: '11px' }} placeholder="600" /></div>
          
          <div><label className="input-label" style={{ fontSize: '9px' }}>MAX LOGP</label><input className="cyber-input" style={{ height: '30px', fontSize: '11px' }} placeholder="5.0" /></div>
          <div><label className="input-label" style={{ fontSize: '9px' }}>MIN H-BOND</label><input className="cyber-input" style={{ height: '30px', fontSize: '11px' }} placeholder="2" /></div>
          
          <div><label className="input-label" style={{ fontSize: '9px' }}>ROT. BONDS</label><input className="cyber-input" style={{ height: '30px', fontSize: '11px' }} placeholder="< 10" /></div>
          <div><label className="input-label" style={{ fontSize: '9px' }}>TPSA</label><input className="cyber-input" style={{ height: '30px', fontSize: '11px' }} placeholder="< 140" /></div>
        </div>
        
        <div style={{ fontSize: '10px', color: '#666', marginTop: '10px' }}>Searching Internal Library (6000+ Drugs)...</div>
      </div>
    </div>
  );
}