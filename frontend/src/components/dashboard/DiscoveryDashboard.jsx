import React from 'react';
import ManualMode from '../sidebar/ManualMode';
import AutoMode from '../sidebar/AutoMode';
import UploadMode from '../sidebar/UploadMode';
import ProteinViewer from '../ProteinViewer';
import { Zap, FlaskConical, Database, Upload } from 'lucide-react';

export default function DiscoveryDashboard({
  activeTab, target, setTarget, smiles, setSmiles,
  selectedFile, setSelectedFile, fileInputRef, handleFileSelect,
  handleScan, loading
}) {
  
  const titles = {
    manual: { icon: FlaskConical, text: 'Manual Molecule Analysis', desc: 'Input specific PDB Target and Drug SMILES for AI-driven binding prediction.' },
    auto:   { icon: Database,     text: 'Automated Database Search', desc: 'Screen entire drug databases against a target protein to find high-affinity candidates.' },
    upload: { icon: Upload,       text: 'Batch Processing (CSV/SDF)', desc: 'Upload a list of molecules for simultaneous safety and efficacy screening.' }
  };

  const current = titles[activeTab] || titles.manual;

  return (
    <div 
      className="discovery-dashboard-wrapper"
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div 
        className="discovery-dashboard"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '44px 40px',
          maxWidth: '1200px',
          animation: 'fadeIn 0.3s ease',
          boxSizing: 'border-box',
        }}
      >
      
      {/* Header Info */}
      <div style={{ marginBottom: '32px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <div style={{ padding: '10px', background: 'var(--bg-sunken)', borderRadius: '10px', color: 'var(--accent)', border: '1px solid var(--border-default)', flexShrink: 0 }}>
            <current.icon size={24} />
          </div>
          <h1 style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{current.text}</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px', margin: 0 }}>{current.desc}</p>
      </div>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'stretch' }}>
        {/* Main Control Area */}
        <div style={{
          flex: '1 1 min(100%, 400px)',
          background: 'var(--bg-surface)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          border: 'var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(16px, 3vw, 32px)',
          boxShadow: 'var(--glass-shadow)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          flexShrink: 0,
        }}>
          
          <div 
            className="manual-mode-grid"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: activeTab === 'manual' ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr', 
              gap: '24px' 
            }}
          >
            {activeTab === 'manual' && <ManualMode target={target} setTarget={setTarget} smiles={smiles} setSmiles={setSmiles} />}
            {activeTab === 'auto'   && <AutoMode target={target} setTarget={setTarget} />}
            {activeTab === 'upload' && (
              <UploadMode 
                target={target} setTarget={setTarget} 
                fileInputRef={fileInputRef} handleFileSelect={handleFileSelect} 
                selectedFile={selectedFile} setSelectedFile={setSelectedFile} 
              />
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
            <button 
              className="primary-btn" 
              onClick={handleScan} 
              disabled={loading}
              style={{ minWidth: '200px' }}
            >
              {loading ? (
                <><span className="spin-loader" style={{ display: 'flex' }}><Zap size={18} /></span> Processing...</>
              ) : (
                <><Zap size={18} /> Run Analysis Engine</>
              )}
            </button>
          </div>
        </div>

        {/* 3D Visualizer Area */}
        <div style={{
          flex: '1 1 min(100%, 400px)',
          minHeight: '400px',
          background: 'var(--bg-surface)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          border: 'var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--glass-shadow)',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, background: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
            Target Preview: {target || '6LU7'}
          </div>
          <ProteinViewer pdbId={target || "6LU7"} isEmbedded={true} />
        </div>
      </div>

      {/* ── Beautiful Scientific Footer ── */}
      <div style={{ 
        marginTop: '60px', 
        padding: '30px 0', 
        borderTop: '1px solid var(--border-subtle)', 
        width: '100%', 
        textAlign: 'center',
        opacity: 0.8
      }}>
        <p style={{ 
          fontSize: '15px', 
          fontWeight: 400, 
          color: 'var(--text-muted)', 
          letterSpacing: '1px',
          fontStyle: 'italic',
          background: 'linear-gradient(90deg, var(--text-muted), var(--accent), var(--text-muted))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'shimmer 3s infinite linear',
          margin: '0'
        }}>
          "Advancing the frontiers of medicine through the power of Graph Intelligence."
        </p>
        <div style={{ fontSize: '12px', color: 'var(--text-disabled)', marginTop: '8px' }}>
          © 2026 BioGraph AI Enterprise. All Rights Reserved.
        </div>
      </div>

      </div>
    </div>
  );
}
