import React, { useState } from 'react';
import { History, ChevronDown, Trash2, Clock, Search } from 'lucide-react';
import { useHistory } from '../hooks/useHistory';

export default function HistoryDropdown({ onSelectResult }) {
  const [isOpen, setIsOpen] = useState(false);
  const { history, clearHistory } = useHistory();

  const handleSelect = (item) => {
    onSelectResult(item);
    setIsOpen(false);
  };

  const getStatusColor = (item) => {
    if (item.status === 'ACTIVE') return 'var(--status-success)';
    return 'var(--status-error)';
  };

  return (
    <div style={{ position: 'relative', zIndex: 120 }}>
      {/* Toggle Button - Styled for Sidebar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        title="Recent Activity"
        style={{ 
          padding: '8px 0', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px', 
          cursor: 'pointer',
          color: 'var(--sidebar-muted)',
          transition: 'color 0.15s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--sidebar-text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--sidebar-muted)'}
      >
        <History size={16} />
        <ChevronDown size={11} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />
      </div>

      {/* Dropdown - Shifted right/up to fit sidebar sidebar workflow */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setIsOpen(false)}></div>
          
          <div style={{
            position: 'absolute', bottom: '100%', left: '0', width: '260px', maxHeight: '400px',
            background: 'var(--sidebar-surface)', border: '1px solid var(--sidebar-border)',
            borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column',
            overflow: 'hidden', zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            marginBottom: '10px'
          }}>
            
            {/* Header */}
            <div style={{
              padding: '12px 14px', borderBottom: '1px solid var(--sidebar-border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'rgba(255,255,255,0.03)'
            }}>
              <span style={{ fontSize: '11px', color: 'var(--sidebar-muted)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Recent Activity
              </span>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  style={{
                    background: 'transparent', border: 'none', color: 'var(--sidebar-muted)',
                    cursor: 'pointer', padding: '3px', display: 'flex', borderRadius: '4px',
                    transition: 'color 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--status-error)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--sidebar-muted)'}
                  title="Clear History"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ overflowY: 'auto', padding: '6px' }}>
              {history.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--sidebar-muted)', fontSize: '12px' }}>
                  <History size={20} style={{ marginBottom: '8px', opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
                  No recent activity
                </div>
              ) : (
                history.map((item, index) => {
                  const statusColor = getStatusColor(item);
                  return (
                    <div 
                      key={index}
                      onClick={() => handleSelect(item)}
                      style={{
                        padding: '10px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                        marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '10px',
                        transition: 'background 0.15s ease', background: 'transparent'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ 
                        width: '30px', height: '30px', borderRadius: '6px',
                        background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', border: '1px solid var(--sidebar-border)', flexShrink: 0
                      }}>
                        {item.status === 'ACTIVE'
                          ? <Search size={14} color={statusColor} />
                          : <Clock size={14}  color={statusColor} />
                        }
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ color: 'var(--sidebar-text)', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </div>
                        <div style={{ color: 'var(--sidebar-muted)', fontSize: '10px', display: 'flex', gap: '8px', marginTop: '1px' }}>
                          <span>Score: {item.score}</span>
                          <span style={{ color: statusColor }}>{item.status}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}