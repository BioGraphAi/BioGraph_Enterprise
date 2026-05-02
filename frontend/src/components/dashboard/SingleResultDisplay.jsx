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
            alignItems: 'center', justifyContent: 'flex-start',
            padding: '24px', height: '100%', width: '100%', boxSizing: 'border-box',
            background: 'var(--bg-canvas)',
            overflowY: 'auto'
          }}>
            {/* Unified Drug Identity Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '28px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              width: '95%',
              maxWidth: '520px',
              margin: '20px 0 40px 0',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              {/* Top: Molecule Visualization Area */}
              <div style={{
                width: '100%',
                aspectRatio: '1.2 / 1',
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '30px',
                boxSizing: 'border-box',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                position: 'relative'
              }}>
                <img
                  src={apiClient.getImageUrl(result.smiles)}
                  alt="2D Structure"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%',
                    objectFit: 'contain',
                    filter: 'invert(1) hue-rotate(180deg) brightness(1.5) contrast(1.1)',
                    mixBlendMode: 'screen'
                  }}
                />
                <div style={{ display: 'none', flexDirection: 'column', alignItems: 'center', gap: '10px', color: 'var(--text-disabled)' }}>
                  <Box size={40} opacity={0.3} />
                  <span style={{ fontSize: '12px' }}>Structure Rendering...</span>
                </div>
                <div style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '9px', fontWeight: 700, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Structure Analysis
                </div>
              </div>

              {/* Bottom: Scientific Metadata Area */}
              <div style={{ padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
                    Chemical Name
                  </div>
                  <div style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.5px', marginBottom: '12px' }}>
                    {result.name || "Experimental Compound"}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                      Formula
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {result.admet?.formula || "Calculating..."}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                      Weight
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {result.admet?.mw || "—"} <span style={{ fontSize: '10px', opacity: 0.6 }}>g/mol</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                    Canonical SMILES
                  </div>
                  <div style={{
                    fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)',
                    padding: '10px 14px', borderRadius: '10px',
                    fontSize: '11px', color: 'var(--text-secondary)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    wordBreak: 'break-all',
                    lineHeight: '1.4'
                  }}>
                    {result.smiles}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'admet':
        return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 'clamp(16px, 3vw, 32px)', paddingBottom: '32px', background: 'var(--bg-canvas)', overflowY: 'auto', width: '100%', boxSizing: 'border-box' }}>
            <div
              className="admet-inner-grid"
              style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', width: '100%', justifyContent: 'center' }}
            >
              <div style={{ flex: '1.2', minWidth: '320px', background: 'var(--bg-surface)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-default)', minHeight: '420px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: 700, fontSize: '14px' }}>
                  <Activity size={18} color="var(--accent)" /> ADMET Pharmacokinetics Radar
                </div>
                <div style={{ flex: 1, minHeight: '300px' }}>
                  <AdmetChart admet={result.admet} color={result.color} />
                </div>
              </div>
              
              <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-default)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: result.admet?.lipinski ? 'var(--status-success)' : 'var(--status-error)' }} />
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lipinski Compliance</h4>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: result.admet?.lipinski ? 'var(--status-success)' : 'var(--status-error)', letterSpacing: '1px' }}>
                    {result.admet?.lipinski ? 'PASSED' : 'FAILED'}
                  </div>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>Rules for drug-likeness & oral bioavailability</p>
                </div>
                
                <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-default)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent)' }} />
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Blood-Brain Barrier (BBB)</h4>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '1px' }}>
                    {result.admet?.bbb || 'High Penetrance'}
                  </div>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>Central Nervous System permeability index</p>
                </div>
              </div>
            </div>
          </div>
        );
      case '3d':
        return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 32px', paddingBottom: '40px', background: 'var(--bg-canvas)', boxSizing: 'border-box' }}>
             <ProteinViewer pdbId={result.target_id || "6LU7"} isEmbedded={true} onClose={() => setActiveTab('intelligence')} />
          </div>
        );
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
          width: '100%',
          boxSizing: 'border-box',
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
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>pKd</span>
              </div>
            </div>

            {/* Repurposing Score */}
            {result.repurposing_score !== undefined && (
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Repurposing Score</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: result.repurposing_score >= 70 ? '#00ff88' : result.repurposing_score >= 50 ? '#ffd700' : '#ff4b4b' }}>
                    {result.repurposing_score}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/100</span>
                </div>
              </div>
            )}

            {/* Confidence */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>AI Confidence</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent)' }}>{result.confidence || '—'}</div>
                <ShieldCheck size={14} color="var(--status-success)" />
              </div>
            </div>
          </div>
        </div>

        {/* Safety Verdict Badge */}
        <div style={{ display: 'flex', gap: '12px', flexShrink: 0, alignItems: 'center' }}>
          {result.admet && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 800,
              background: result.admet.is_safe ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
              color: result.admet.is_safe ? '#10b981' : '#ef4444',
              border: `1px solid ${result.admet.is_safe ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              boxShadow: result.admet.is_safe ? '0 0 12px rgba(16,185,129,0.15)' : '0 0 12px rgba(239,68,68,0.15)'
            }}>
              {result.admet.is_safe ? '✅ SAFE' : '⚠️ CAUTION'}
            </div>
          )}
        </div>
      </div>

      {/* ── 2. Content Area ── */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {renderContent()}
        </div>

        {/* ── 3. Common Professional Footer ── */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(11, 15, 25, 0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          zIndex: 5
        }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px' }}>
            BIOGRAPH ENTERPRISE <span style={{ opacity: 0.5, marginLeft: '8px' }}>v2.0.4 - RESEARCH EDITION</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>
            © 2024 AI-DRIVEN DRUG DISCOVERY PIPELINE
          </div>
        </div>
      </div>

    </div>
  );
}