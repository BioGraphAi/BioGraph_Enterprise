import React from 'react';
import { Atom } from 'lucide-react';

export default function MolecularProperties({ admet }) {
  return (
    <div>
      <div className="section-title" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11px', fontWeight: 600, marginBottom: '14px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        <Atom size={14} /> Molecular Properties
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