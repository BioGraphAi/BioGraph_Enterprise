import React from 'react';
import { FileText, Box, Download, Loader } from 'lucide-react';

export default function ActionButtons({ result, onView, on3D, onDownload, downloading }) {
  
  // Internal Style Helper
  const buttonStyle = (color) => ({
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${color}`,
    color: color,
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '11px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    transition: '0.3s',
    minWidth: '95px' 
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            
      {/* VIEW Button */}
      {result.admet && (
        <button 
          onClick={onView}
          title="VIEW FULL REPORT" 
          className="hover-glow"
          style={buttonStyle(result.color)}
        >
          <FileText size={14} /> VIEW
        </button>
      )}

      {/* 3D Button */}
      <button 
        onClick={on3D} 
        title="VIEW 3D STRUCTURE" 
        className="hover-glow"
        style={buttonStyle('#bc13fe')} 
      >
        <Box size={14} /> 3D VIEW
      </button>

      {/* PDF Button */}
      <button 
        onClick={onDownload}
        disabled={downloading}
        title="DOWNLOAD LAB REPORT" 
        className="hover-glow"
        style={buttonStyle(result.color)}
      >
        {downloading ? <Loader size={14} className="spin" /> : <Download size={14} />} 
        PDF
      </button>

      <style>{`
        .hover-glow:hover { filter: brightness(1.2); box-shadow: 0 0 15px currentColor; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

    </div>
  );
}