import React from 'react';
import { Activity, List } from 'lucide-react';
import ActionButtons from '../result-card/ActionButtons'; // ✅ Import

export default function HeaderStatus({ 
  loading, aiThreshold, result, activeTab, onBack,
  onView, on3D, onDownload, downloading // ✅ New Props
}) {
  return (
    <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
       
       {/* Left: Status Badge */}
       <div className="header-badge" style={{ margin: 0, padding: '12px 15px' }}>
          <div className="status-desktop">
            <Activity size={14} color="#00f3ff" className={loading ? "animate-pulse" : ""} />
            <span className="badge-text" style={{ marginLeft: '8px' }}>
              SYSTEM: <span style={{ color: loading ? '#00f3ff' : '#fff' }}>{loading ? "BUSY" : "IDLE"}</span>
            </span>
            <span style={{ marginLeft: '15px', color: '#666', fontSize: '10px' }}>
              SENSITIVITY: {aiThreshold.toFixed(1)}
            </span>
          </div>
       </div>

       {/* Right: Actions */}
       <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
         
         {/* ✅ Buttons: Agar result hai toh yahan show honge */}
         {result && (
           <ActionButtons 
             result={result} 
             onView={onView} 
             on3D={on3D} 
             onDownload={onDownload} 
             downloading={downloading}
             layout="row" // ✅ Row layout
           />
         )}

         {/* Back Button (Only for Manual mode history or Batch mode details) */}
         {result && activeTab !== 'manual' && (
            <button onClick={onBack} className="nav-link" style={{ marginLeft: '10px' }}>
              <List size={16} /> Back
            </button>
         )}
       </div>
    </div>
  );
}