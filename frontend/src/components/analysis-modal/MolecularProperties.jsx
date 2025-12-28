import React from 'react';
import { Atom } from 'lucide-react';

export default function MolecularProperties({ admet }) {
  return (
    <div>
      <div className="section-title" style={{ color: '#00f3ff', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '1px' }}>
        <Atom size={16} /> MOLECULAR PROPERTIES
      </div>
      
      <div className="stat-row"><span>Molecular Weight</span> <b>{admet.mw} g/mol</b></div>
      <div className="stat-row"><span>LogP (Solubility)</span> <b>{admet.logp}</b></div>
      <div className="stat-row"><span>TPSA (Surface)</span> <b>{admet.tpsa} Å²</b></div>
      <div className="stat-row"><span>Rotatable Bonds</span> <b>{admet.rotatable_bonds}</b></div>

      <style>{`
        .stat-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed rgba(255,255,255,0.1); font-size: 13px; color: #aaa; }
        .stat-row b { color: #fff; }
      `}</style>
    </div>
  );
}