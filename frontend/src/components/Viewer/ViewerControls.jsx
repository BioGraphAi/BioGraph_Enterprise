import React from 'react';
import { X, Box, Layers, Activity, Eye, RotateCw, Camera, Image } from 'lucide-react';

export default function ViewerControls({ pdbId, viewMode, setViewMode, applyView, toggleSpin, isSpinning, resetView, capture, onClose }) {
  
  const Btn = ({ children, active, danger, onClick }) => (
    <button 
      className={`viewer-btn ${active ? 'active' : ''} ${danger ? 'danger' : ''}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );

  return (
    <div className="viewer-panel">
      <div className="viewer-title"><Box size={14} /> {pdbId.toUpperCase()}</div>

      <Btn active={viewMode === 'surface'} onClick={() => { setViewMode('surface'); applyView('surface'); }}>
        <Activity size={16} /> Glass Surface
      </Btn>

      <Btn active={viewMode === 'cartoon'} onClick={() => { setViewMode('cartoon'); applyView('cartoon'); }}>
        <Layers size={16} /> Ribbon
      </Btn>

      <Btn active={viewMode === 'ligand'} onClick={() => { setViewMode('ligand'); applyView('ligand'); }}>
        <Eye size={16} /> Active Site
      </Btn>

      <div style={{height:'1px', background:'#333', margin:'5px 0'}}></div>

      <Btn onClick={toggleSpin}><RotateCw size={16} /> {isSpinning ? 'Stop' : 'Rotate'}</Btn>
      <Btn onClick={resetView}><Camera size={16} /> Reset View</Btn>
      <Btn onClick={capture}><Image size={16} /> Screenshot</Btn>

      <div style={{ flex: 1 }} />

      <Btn danger onClick={onClose}><X size={16} /> Close</Btn>
    </div>
  );
}