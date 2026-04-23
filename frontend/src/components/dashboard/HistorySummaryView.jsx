import React from 'react';
import { X, Activity, Search, Clock } from 'lucide-react';

export default function HistorySummaryView({ data, onClose, onOpenDetails }) {
  if (!data) return null;

  const isActive = data.status === 'ACTIVE';
  const statusColor = isActive ? 'var(--status-success)' : 'var(--status-error)';
  const Icon = isActive ? Search : Clock;

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px'
    }}>
      <div 
        style={{
          background: 'none',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          width: '100%', maxWidth: '600px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div style={{ position: 'relative', padding: '32px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-sunken)' }}>
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
            title="Go Back"
          >
            <X size={24} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              width: '64px', height: '64px', borderRadius: '16px', background: `${statusColor}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${statusColor}30`
            }}>
              <Icon size={32} color={statusColor} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Analysis Summary</div>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{data.name}</h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
            {/* Score Card */}
            <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Score</span>
              <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{data.score}</span>
            </div>
            
            {/* Status Card */}
            <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Prediction</span>
              <span style={{ 
                fontSize: '18px', fontWeight: 800, color: statusColor, 
                background: `${statusColor}15`, padding: '6px 20px', borderRadius: '99px', letterSpacing: '1px'
              }}>
                {data.status}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>SMILES Structure</div>
            <div style={{ 
              fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-secondary)', 
              background: 'var(--bg-canvas)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)',
              wordBreak: 'break-all', maxHeight: '100px', overflowY: 'auto'
            }}>
              {data.smiles || "N/A"}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-default)', background: 'var(--bg-sunken)', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
          <button 
            onClick={onClose}
            style={{
              padding: '12px 24px', borderRadius: '10px', cursor: 'pointer',
              background: 'transparent', border: '1px solid var(--border-strong)', color: 'var(--text-primary)',
              fontSize: '14px', fontWeight: 600, transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Cancel
          </button>
          <button 
            className="primary-btn"
            onClick={onOpenDetails}
            style={{ padding: '12px 28px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
          >
            <Activity size={18} /> View Full Details
          </button>
        </div>
      </div>
    </div>
  );
}
