import React from 'react';
import { Search, FileText, X, Download, AlertCircle } from 'lucide-react';

export default function UploadMode({ target, setTarget, fileInputRef, handleFileSelect, selectedFile, setSelectedFile }) {
  
  const downloadSample = (e) => {
    e.stopPropagation();
    const csvContent = "data:text/csv;charset=utf-8,name,smiles\nAspirin,CC(=O)OC1=CC=CC=C1C(=O)O\nParacetamol,CC(=O)NC1=CC=C(O)C=C1";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_drugs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fade-in-text">
      {/* Target Input */}
      <div className="input-group">
        <label className="input-label">Target Protein (PDB ID)</label>
        <div className="input-wrapper">
          <Search size={14} className="input-icon" />
          <input className="cyber-input" placeholder="Ex: 6LU7" value={target} onChange={(e) => setTarget(e.target.value)} />
        </div>
        <div className="suggestions-box" style={{ pointerEvents: 'auto', flexWrap: 'wrap' }}>
          <span>Try:</span>
          <span className="suggestion-text" onClick={() => setTarget('6LU7')}>Covid-19</span>
          <span className="suggestion-text" onClick={() => setTarget('3PP0')}>Cancer</span>
          <span className="suggestion-text" onClick={() => setTarget('1Z00')}>Diabetes</span>
          <span className="suggestion-text" onClick={() => setTarget('1J3I')}>Malaria</span>
          <span className="suggestion-text" onClick={() => setTarget('5DI3')}>Alzheimer</span>
        </div>
      </div>

      <label className="input-label">Batch File</label>

      {/* File Upload Dropzone */}
      <div
        className="custom-file-upload"
        onClick={() => fileInputRef.current.click()}
        style={{
          border: '1.5px dashed var(--border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '28px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          background: 'var(--bg-primary)',
          transition: 'all var(--transition-fast)',
          marginBottom: '16px'
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'var(--bg-primary)'; }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          style={{ display: 'none' }} 
          accept=".csv,.txt"
        />
        <FileText size={32} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
        
        {selectedFile ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px' }}>{selectedFile.name}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = ''; 
              }}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: '50%', 
                width: '22px', height: '22px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'var(--transition-fast)'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              title="Remove File"
            >
              <X size={12} color="var(--text-secondary)" />
            </button>
          </div>
        ) : (
          <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px' }}>Click to Upload File</div>
        )}

        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '5px' }}>
          Supports: .CSV, .TXT (Tab Separated)
        </div>
      </div>

      {/* Requirements Box */}
      <div style={{ 
        background: 'var(--bg-tertiary)',
        padding: '14px', 
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        borderLeft: '2px solid var(--border-strong)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <AlertCircle size={13} /> File Requirements
        </div>
        <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-muted)', fontSize: '11px', lineHeight: '1.7' }}>
          <li>Format: <b style={{ color: 'var(--text-primary)' }}>CSV</b> (Comma) or <b style={{ color: 'var(--text-primary)' }}>TXT</b> (Tab).</li>
          <li>Must contain a column named <b style={{ color: 'var(--text-primary)' }}>"smiles"</b>.</li>
          <li>Optional column: <b style={{ color: 'var(--text-primary)' }}>"name"</b>.</li>
        </ul>
        
        <button 
          onClick={downloadSample}
          style={{
            marginTop: '10px',
            background: 'transparent',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            width: '100%', justifyContent: 'center',
            fontFamily: 'inherit',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
        >
          <Download size={12} /> Download Sample CSV
        </button>
      </div>
    </div>
  );
}