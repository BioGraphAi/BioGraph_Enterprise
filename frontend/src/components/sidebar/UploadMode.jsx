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
      {/* Target Input with Suggestions */}
      <div className="input-group">
         <label className="input-label">TARGET PROTEIN (PDB ID)</label>
         <div className="input-wrapper">
           <Search size={16} color="#888" className="input-icon" />
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

      <label className="input-label">BATCH FILE</label>

      {/* File Upload Box */}
      <div 
        className="custom-file-upload"
        onClick={() => fileInputRef.current.click()}
        style={{
          border: '2px dashed rgba(0, 243, 255, 0.3)',
          borderRadius: '15px',
          padding: '30px',
          textAlign: 'center',
          cursor: 'pointer',
          background: 'rgba(0, 243, 255, 0.05)',
          transition: 'all 0.3s ease',
          marginBottom: '20px'
        }}
        onMouseOver={(e) => e.currentTarget.style.borderColor = '#00f3ff'}
        onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(0, 243, 255, 0.3)'}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          style={{ display: 'none' }} 
          accept=".csv,.txt"
        />
        <FileText size={40} color="#00f3ff" style={{ marginBottom: '10px' }} />
        
        {selectedFile ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>{selectedFile.name}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = ''; 
              }}
              style={{
                background: 'rgba(255, 0, 85, 0.2)', 
                border: 'none', 
                borderRadius: '50%', 
                width: '24px', height: '24px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: '0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 0, 85, 0.5)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 0, 85, 0.2)'}
              title="Remove File"
            >
              <X size={14} color="#ff0055" />
            </button>
          </div>
        ) : (
          <div style={{ color: '#fff', fontWeight: 'bold' }}>Click to Upload File</div>
        )}

        <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
          Supports: .CSV, .TXT (Tab Separated)
        </div>
      </div>

      {/* ✅ RESTORED OLD REQUIREMENTS SECTION */}
      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        padding: '15px', 
        borderRadius: '10px',
        borderLeft: '3px solid #00f3ff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#00f3ff', fontWeight: 'bold', fontSize: '12px' }}>
          <AlertCircle size={14} /> FILE REQUIREMENTS
        </div>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#ccc', fontSize: '11px', lineHeight: '1.6' }}>
          <li>Format: <b>CSV</b> (Comma) or <b>TXT</b> (Tab).</li>
          <li>Must contain a column named <b>"smiles"</b>.</li>
          <li>Optional column: <b>"name"</b>.</li>
        </ul>
        
        <button 
          onClick={downloadSample}
          style={{
            marginTop: '12px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            width: '100%', justifyContent: 'center'
          }}
          onMouseOver={(e) => {e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = '#fff';}}
          onMouseOut={(e) => {e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';}}
        >
          <Download size={12} /> Download Sample CSV
        </button>
      </div>
    </div>
  );
}