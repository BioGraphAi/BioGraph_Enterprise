import React from 'react';
import { History, Search, Clock, Trash2, Activity, ArrowRight } from 'lucide-react';
import { useHistory } from '../../hooks/useHistory';

export default function HistoryPage({ onSelectHistoryItem }) {
  const { history, clearHistory } = useHistory();

  const getStatusColor = (item) => {
    if (item.status === 'ACTIVE') return 'var(--status-success)';
    return 'var(--status-error)';
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      padding: '40px',
      overflowY: 'auto'
    }}>
      <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ padding: '10px', background: 'var(--bg-sunken)', borderRadius: '10px', color: 'var(--accent)', border: '1px solid var(--border-default)' }}>
                <History size={24} />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Analysis History</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>Review your past molecular predictions and scans.</p>
          </div>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              style={{
                background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444',
                cursor: 'pointer', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px',
                borderRadius: '8px', fontSize: '12px', fontWeight: 600, transition: 'all 0.2s',
                marginTop: '8px'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'; }}
            >
              <Trash2 size={16} /> Clear All History
            </button>
          )}
        </div>

        {/* Content Area */}
        {history.length === 0 ? (
          <div style={{ 
            marginTop: '60px', display: 'flex', flexDirection: 'column', 
            alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' 
          }}>
            <Activity size={64} strokeWidth={1} style={{ opacity: 0.15, marginBottom: '24px' }} />
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-secondary)' }}>No history available</p>
            <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.8 }}>Run a discovery scan to see your results here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {history.map((item, index) => {
              const statusColor = getStatusColor(item);
              const isActive = item.status === 'ACTIVE';
              return (
                <div 
                  key={index}
                  onClick={() => onSelectHistoryItem(item)}
                  style={{
                    background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                    padding: '20px 24px', borderRadius: '12px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px',
                    transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden'
                  }}
                  onMouseEnter={e => { 
                    e.currentTarget.style.borderColor = 'var(--accent)'; 
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={e => { 
                    e.currentTarget.style.borderColor = 'var(--border-default)'; 
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ 
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
                    background: statusColor
                  }} />
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                    <div style={{ 
                      width: '48px', height: '48px', borderRadius: '12px',
                      background: `${statusColor}15`, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', border: `1px solid ${statusColor}30`, flexShrink: 0
                    }}>
                      {isActive ? <Search size={24} color={statusColor} /> : <Clock size={24} color={statusColor} />}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
                        {item.name}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'monospace' }}>
                        {item.smiles || 'No SMILES mapped'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                       <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>AI Score</span>
                       <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{item.score}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                       <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Prediction</span>
                       <span style={{ 
                         color: statusColor, fontSize: '12px', fontWeight: 700, 
                         background: `${statusColor}15`, padding: '4px 12px', borderRadius: '12px'
                       }}>
                         {item.status}
                       </span>
                    </div>

                    <div style={{ color: 'var(--text-muted)', opacity: 0.5, marginLeft: '8px' }}>
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
