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
              {/* Radar Chart */}
              <div style={{ flex: '1.2', minWidth: '320px', background: 'var(--bg-surface)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-default)', minHeight: '420px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: 700, fontSize: '14px' }}>
                  <Activity size={18} color="var(--accent)" /> ADMET Pharmacokinetics Radar
                </div>
                <div style={{ flex: 1, minHeight: '300px' }}>
                  <AdmetChart admet={result.admet} color={result.color} />
                </div>
              </div>
              
              {/* ADMET Detail Cards */}
              <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Lipinski Compliance */}
                <div style={{ background: 'var(--bg-surface)', padding: '20px 24px', borderRadius: '20px', border: '1px solid var(--border-default)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: result.admet?.lipinski ? 'var(--status-success)' : 'var(--status-error)' }} />
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lipinski Compliance</h4>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: result.admet?.lipinski ? 'var(--status-success)' : 'var(--status-error)', letterSpacing: '1px' }}>
                    {result.admet?.lipinski ? 'PASSED' : 'FAILED'}
                  </div>
                  <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>Rule of 5 — {result.admet?.violations || 0} violation(s)</p>
                </div>

                {/* Absorption */}
                <div style={{ background: 'var(--bg-surface)', padding: '20px 24px', borderRadius: '20px', border: '1px solid var(--border-default)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: result.admet?.caco2_permeability === 'High' ? '#10b981' : result.admet?.caco2_permeability === 'Moderate' ? '#f59e0b' : '#ef4444' }} />
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10px', background: 'rgba(99,102,241,0.15)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>A</span>
                    Absorption
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Caco-2 Permeability</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{result.admet?.caco2_permeability || '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Intestinal Absorption</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{result.admet?.intestinal_absorption || '—'}</div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Oral Bioavailability</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: result.admet?.oral_bioavailability === 'Good' ? '#10b981' : '#ef4444' }}>{result.admet?.oral_bioavailability || '—'}</div>
                    </div>
                  </div>
                </div>

                {/* Distribution */}
                <div style={{ background: 'var(--bg-surface)', padding: '20px 24px', borderRadius: '20px', border: '1px solid var(--border-default)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: result.admet?.bbb === 'High Penetrance' ? '#6366f1' : result.admet?.bbb === 'Moderate Penetrance' ? '#f59e0b' : '#ef4444' }} />
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10px', background: 'rgba(99,102,241,0.15)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>D</span>
                    Distribution
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>BBB Penetration</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{result.admet?.bbb || '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Plasma Protein Binding</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{result.admet?.ppb || '—'}</div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Volume of Distribution</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{result.admet?.vd_estimate || '—'}</div>
                    </div>
                  </div>
                </div>

                {/* Metabolism */}
                <div style={{ background: 'var(--bg-surface)', padding: '20px 24px', borderRadius: '20px', border: '1px solid var(--border-default)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: result.admet?.metabolism_stability === 'High' ? '#10b981' : result.admet?.metabolism_stability === 'Moderate' ? '#f59e0b' : '#ef4444' }} />
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10px', background: 'rgba(99,102,241,0.15)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>M</span>
                    Metabolism
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>CYP450 Substrate</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{result.admet?.cyp_substrate || '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Metabolic Stability</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: result.admet?.metabolism_stability === 'High' ? '#10b981' : result.admet?.metabolism_stability === 'Moderate' ? '#f59e0b' : '#ef4444' }}>{result.admet?.metabolism_stability || '—'}</div>
                    </div>
                  </div>
                </div>

                {/* Excretion */}
                <div style={{ background: 'var(--bg-surface)', padding: '20px 24px', borderRadius: '20px', border: '1px solid var(--border-default)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#8b5cf6' }} />
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10px', background: 'rgba(99,102,241,0.15)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>E</span>
                    Excretion
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Clearance Route</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{result.admet?.clearance_route || '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Half-life</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{result.admet?.half_life || '—'}</div>
                    </div>
                  </div>
                </div>

                {/* Toxicity */}
                <div style={{ background: 'var(--bg-surface)', padding: '20px 24px', borderRadius: '20px', border: '1px solid var(--border-default)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: result.admet?.herg_risk === 'Low Risk' ? '#10b981' : result.admet?.herg_risk === 'Moderate Risk' ? '#f59e0b' : '#ef4444' }} />
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>T</span>
                    Toxicity
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>hERG Cardiotoxicity</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: result.admet?.herg_risk === 'Low Risk' ? '#10b981' : result.admet?.herg_risk === 'Moderate Risk' ? '#f59e0b' : '#ef4444' }}>{result.admet?.herg_risk || '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Hepatotoxicity (DILI)</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: result.admet?.hepatotoxicity === 'Low Risk' ? '#10b981' : result.admet?.hepatotoxicity === 'Moderate Risk' ? '#f59e0b' : '#ef4444' }}>{result.admet?.hepatotoxicity || '—'}</div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>AMES Mutagenicity</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: result.admet?.ames_mutagenicity === 'Low Risk' ? '#10b981' : '#f59e0b' }}>{result.admet?.ames_mutagenicity || '—'}</div>
                    </div>
                  </div>
                </div>

                {/* Molecular Fingerprints (Scikit-learn) */}
                {result.fingerprints && (
                  <div style={{ background: 'var(--bg-surface)', padding: '20px 24px', borderRadius: '20px', border: '1px solid var(--border-default)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#06b6d4' }} />
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Zap size={12} color="#06b6d4" />
                      Molecular Fingerprints
                      <span style={{ fontSize: '9px', background: 'rgba(6,182,212,0.15)', color: '#06b6d4', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Scikit-learn</span>
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Type</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{result.fingerprints.fingerprint_type}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Morgan Bits Set</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{result.fingerprints.morgan_bits_set} / {result.fingerprints.morgan_total_bits}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Morgan Density</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{(result.fingerprints.morgan_density * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>MACCS Density</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{(result.fingerprints.maccs_density * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                )}
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