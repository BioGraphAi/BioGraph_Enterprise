import React from 'react';
import { History, X, Trash2, Search, Clock, Activity } from 'lucide-react';
import { useHistory } from '../../hooks/useHistory';

export default function HistorySidebar({ isOpen, onClose, onSelectResult }) {
  const { history, clearHistory } = useHistory();

  const getStatusColor = (item) => {
    if (item.status === 'ACTIVE') return 'var(--status-success)';
    return 'var(--status-error)';
  };

  const handleSelect = (item) => {
    onSelectResult(item);
    onClose();
  };

  return (
    <>
      {/* Backdrop (Invisible but catches clicks to close) */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'transparent',
          zIndex: 900,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />

      {/* Right Drawer Panel */}
      <div 
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: '280px', maxWidth: '85vw',
          background: 'var(--sidebar-bg)',
          borderLeft: '1px solid var(--sidebar-border)',
          boxShadow: '-12px 0 40px rgba(0,0,0,0.15)',
          zIndex: 901,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          display: 'flex', flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px', borderBottom: '1px solid var(--sidebar-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'var(--accent-soft)', padding: '10px', borderRadius: '10px' }}>
              <History size={20} color="var(--accent)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>Activity History</h3>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--sidebar-muted)' }}>Your recent AI computations</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ 
              background: 'transparent', border: 'none', color: 'var(--sidebar-muted)', 
              cursor: 'pointer', padding: '6px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--sidebar-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--sidebar-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        {history.length > 0 && (
          <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--sidebar-border)', display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.1)' }}>
            <button
              onClick={clearHistory}
              style={{
                background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444',
                cursor: 'pointer', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px',
                borderRadius: '6px', fontSize: '11px', fontWeight: 600, transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.5px'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'; }}
            >
              <Trash2 size={13} /> Clear History
            </button>
          </div>
        )}

        {/* List Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {history.length === 0 ? (
            <div style={{ 
              height: '100%', display: 'flex', flexDirection: 'column', 
              alignItems: 'center', justifyContent: 'center', color: 'var(--sidebar-muted)' 
            }}>
              <Activity size={56} strokeWidth={1} style={{ opacity: 0.15, marginBottom: '20px' }} />
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, letterSpacing: '0.3px', color: 'var(--text-secondary)' }}>No recent activity</p>
              <p style={{ margin: '6px 0 0', fontSize: '12px', opacity: 0.7 }}>Scans and analysis will appear here</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {history.map((item, index) => {
                const statusColor = getStatusColor(item);
                return (
                  <div 
                    key={index}
                    onClick={() => handleSelect(item)}
                    style={{
                      background: 'var(--bg-canvas)', border: '1px solid var(--sidebar-border)',
                      padding: '16px', borderRadius: '12px', cursor: 'pointer',
                      display: 'flex', alignItems: 'flex-start', gap: '14px',
                      transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden'
                    }}
                    onMouseEnter={e => { 
                      e.currentTarget.style.borderColor = 'var(--accent)'; 
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={e => { 
                      e.currentTarget.style.borderColor = 'var(--sidebar-border)'; 
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ 
                      position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
                      background: statusColor
                    }} />
                    
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', border: '1px solid var(--sidebar-border)', flexShrink: 0
                    }}>
                      {item.status === 'ACTIVE' ? <Search size={18} color={statusColor} /> : <Clock size={18} color={statusColor} />}
                    </div>
                    
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                      <div style={{ 
                        color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600, 
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        marginBottom: '6px'
                      }}>
                        {item.name}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--sidebar-muted)', fontSize: '11px', fontWeight: 500 }}>
                          AI Score: <strong style={{ color: 'var(--text-secondary)' }}>{item.score}</strong>
                        </span>
                        <span style={{ 
                          color: statusColor, fontSize: '10px', fontWeight: 700, 
                          background: `${statusColor}15`, padding: '3px 8px', borderRadius: '12px',
                          letterSpacing: '0.4px'
                        }}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
