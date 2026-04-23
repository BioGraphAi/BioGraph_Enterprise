import React from 'react';
import { X, ExternalLink, Activity, Search, Clock } from 'lucide-react';

export default function HistorySummaryModal({ data, onClose, onOpenDetails }) {
  if (!data) return null;

  const isActive = data.status === 'ACTIVE';
  const statusColor = isActive ? 'var(--status-success)' : 'var(--status-error)';
  const Icon = isActive ? Search : Clock;

  return (
    <>
      {/* Backdrop (Lightly blurred to focus on modal) */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(2px)',
          zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        {/* Modal Window */}
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            width: '400px', maxWidth: '90vw',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {/* Header */}
          <div style={{ position: 'relative', padding: '24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-sunken)' }}>
            <button 
              onClick={onClose}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '56px', height: '56px', borderRadius: '12px', background: `${statusColor}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${statusColor}30`
              }}>
                <Icon size={28} color={statusColor} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Analysis Summary</div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{data.name}</h2>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              {/* Score Card */}
              <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '8px' }}>AI Score</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>{data.score}</span>
              </div>
              
              {/* Status Card */}
              <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '8px' }}>Prediction</span>
                <span style={{ 
                  fontSize: '14px', fontWeight: 700, color: statusColor, 
                  background: `${statusColor}15`, padding: '4px 12px', borderRadius: '99px'
                }}>
                  {data.status}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>SMILES Structure</div>
              <div style={{ 
                fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-secondary)', 
                background: 'var(--bg-canvas)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)',
                wordBreak: 'break-all', maxHeight: '60px', overflowY: 'auto'
              }}>
                {data.smiles || "N/A"}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-default)', background: 'var(--bg-sunken)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button 
              onClick={onClose}
              style={{
                padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
                background: 'transparent', border: '1px solid var(--border-strong)', color: 'var(--text-primary)',
                fontSize: '13px', fontWeight: 600, transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Close
            </button>
            <button 
              className="primary-btn"
              onClick={onOpenDetails}
              style={{ padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
            >
              <Activity size={16} /> View Full Details
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
