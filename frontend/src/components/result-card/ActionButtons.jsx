import React from 'react';
import { Download, Loader } from 'lucide-react';

export default function ActionButtons({ onDownload, downloading }) {

  const buttonStyle = {
    background: 'var(--bg-sunken)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-secondary)',
    padding: '8px 16px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: 600,
    transition: 'all var(--transition-fast)',
    fontFamily: 'inherit'
  };

  const hoverIn  = e => { 
    e.currentTarget.style.background = 'var(--text-primary)'; 
    e.currentTarget.style.color = 'var(--bg-canvas)'; 
  };
  const hoverOut = e => { 
    e.currentTarget.style.background = 'var(--bg-sunken)'; 
    e.currentTarget.style.color = 'var(--text-secondary)'; 
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {/* PDF Download Button */}
      <button
        onClick={onDownload}
        disabled={downloading}
        title="Download Lab Report"
        style={{ ...buttonStyle, opacity: downloading ? 0.6 : 1 }}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
      >
        {downloading ? <Loader size={15} className="animate-spin" /> : <Download size={15} />}
        {downloading ? 'Generating...' : 'Download Report'}
      </button>
    </div>
  );
}