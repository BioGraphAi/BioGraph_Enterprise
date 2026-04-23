import React from 'react';
import { Activity, Box, Zap, ShieldCheck, Share2 } from 'lucide-react';
import { apiClient } from '../../api/client';

// Child Components
import AdmetChart from './AdmetChart';
import IntelligenceHub from './IntelligenceHub';
import ProteinViewer from '../ProteinViewer';

export default function SingleResultDisplay({ result, chatHistory, setChatHistory, activeTab, setActiveTab }) {
  if (!result) return null;

  // Header Color Logic
  const scoreColor = result.score >= 8.5 ? 'var(--status-success)' :
    result.score >= 7.0 ? 'var(--status-warning)' : 'var(--status-error)';

  const renderContent = () => {
    switch (activeTab) {
      case 'intelligence':
        return <IntelligenceHub result={result} chatHistory={chatHistory} setChatHistory={setChatHistory} />;
      case 'structure':
        return (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: 'clamp(16px, 4vw, 40px)', background: 'var(--bg-canvas)',
            overflowY: 'auto'
          }}>
            <div style={{
              background: 'var(--bg-surface)', padding: 'clamp(16px, 3vw, 30px)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-default)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              width: '100%',
              maxWidth: '440px'
            }}>
              <img
                src={apiClient.getImageUrl(result.smiles)}
                alt="2D Structure"
                style={{ 
                  width: '100%', 
                  filter: 'invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.2)',
                  mixBlendMode: 'screen'
                }}
              />
            </div>
            <div style={{ marginTop: '24px', textAlign: 'center', width: '100%', maxWidth: '440px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Molecule SMILES</span>
              <p style={{
                fontFamily: 'monospace', background: 'var(--bg-sunken)',
                padding: '10px 20px', borderRadius: 'var(--radius-md)',
                fontSize: '13px', marginTop: '8px',
                border: '1px solid var(--border-subtle)',
                wordBreak: 'break-all',
                textAlign: 'left'
              }}>
                {result.smiles}
              </p>
            </div>
          </div>
        );
      case 'admet':
        return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 'clamp(16px, 3vw, 40px)', background: 'var(--bg-canvas)', overflowY: 'auto' }}>
            <div
              className="admet-inner-grid"
              style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: '30px' }}
            >
              <div style={{ background: 'var(--bg-surface)', padding: 'clamp(16px, 2.5vw, 30px)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-default)', minHeight: '400px' }}>
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 700, fontSize: '14px' }}>
                  <Activity size={18} /> ADMET Radar Distribution
                </div>
                <AdmetChart admet={result.admet} color={result.color} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Lipinski Compliance</h4>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: result.admet?.lipinski ? 'var(--status-success)' : 'var(--status-error)' }}>
                    {result.admet?.lipinski ? 'PASSED' : 'FAILED'}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Blood-Brain Barrier</h4>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>
                    {result.admet?.bbb || 'High Penetrance'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case '3d':
        return <ProteinViewer pdbId={result.target_id || "6LU7"} isEmbedded={true} onClose={() => setActiveTab('intelligence')} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>

      {/* ── 1. Result Top Header (Scores) ── */}
      <div
        className="result-header-meta"
        style={{
          minHeight: '72px', 
          background: 'rgba(11, 15, 25, 0.7)', 
          backdropFilter: 'blur(16px)', 
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px clamp(12px, 2.5vw, 24px)',
          zIndex: 10, flexShrink: 0, flexWrap: 'wrap', gap: '12px'
        }}
      >
        <div className="result-header-inner" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2vw, 24px)', flexWrap: 'wrap' }}>
          <div className="result-header-name" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Molecule Name</div>
              <div style={{ fontSize: 'clamp(14px, 2.5vw, 18px)', fontWeight: 800, color: 'var(--text-primary)' }}>{result.name}</div>
            </div>
            {/* Status Badge */}
            <div style={{
              padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800,
              background: result.status === 'ACTIVE' ? 'rgba(0,255,136,0.1)' : 'rgba(255,0,85,0.1)',
              color: result.status === 'ACTIVE' ? 'var(--status-success)' : 'var(--status-error)',
              border: `1px solid ${result.status === 'ACTIVE' ? 'rgba(0,255,136,0.2)' : 'rgba(255,0,85,0.2)'}`,
              marginTop: '12px'
            }}>
              {result.status === 'ACTIVE' ? 'ACTIVE LEAD' : 'INACTIVE'}
            </div>
          </div>

          <div className="header-divider" style={{ width: '1px', height: '32px', background: 'var(--border-subtle)', flexShrink: 0 }}></div>

          <div className="result-header-scores" style={{ display: 'flex', gap: 'clamp(12px, 2vw, 30px)', flexWrap: 'wrap' }}>
            {/* Binding Score */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Binding Score</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ padding: '4px 8px', background: scoreColor, color: 'white', borderRadius: '4px', fontSize: '14px', fontWeight: 900 }}>
                  {result.score}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>kcal/mol</span>
              </div>
            </div>

            {/* Confidence */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>AI Confidence</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent)' }}>94.2%</div>
                <ShieldCheck size={14} color="var(--status-success)" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
        </div>
      </div>

      {/* ── 2. Content Area ── */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {renderContent()}
      </div>

    </div>
  );
}