import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function SafetyAnalysis({ admet }) {
  return (
    <div>
      <div className="section-title" style={{ color: '#bc13fe', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '1px' }}>
        <ShieldCheck size={16} /> SAFETY & RULES
      </div>

      <div className="stat-row">
        <span>Lipinski Violations</span> 
        <b style={{ color: admet.violations > 1 ? '#ff0055' : '#00ff66' }}>
          {admet.violations} / 4
        </b>
      </div>

      <div className="stat-row">
        <span>QED (Quality)</span> 
        <b>{admet.qed} / 1.0</b>
      </div>

       <div className="stat-row"><span>H-Bond Donors</span> <b>{admet.hbd}</b></div>
       <div className="stat-row"><span>H-Bond Acceptors</span> <b>{admet.hba}</b></div>
       
       <style>{`
        .stat-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed rgba(255,255,255,0.1); font-size: 13px; color: #aaa; }
        .stat-row b { color: #fff; }
      `}</style>
    </div>
  );
}