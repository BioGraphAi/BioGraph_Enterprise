import React, { useState } from 'react';
import { History, ChevronDown, Trash2, Clock, Search } from 'lucide-react';
import { useHistory } from '../hooks/useHistory'; // ✅ Hook Logic

export default function HistoryDropdown({ onSelectResult }) {
  const [isOpen, setIsOpen] = useState(false);
  const { history, clearHistory } = useHistory();

  const handleSelect = (item) => {
    onSelectResult(item);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', zIndex: 100 }}>
      {/* Toggle Button */}
      <div 
        className="nav-link" 
        onClick={() => setIsOpen(!isOpen)}
        title="Recent Scans"
        style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
      >
        <History size={18} />
        <ChevronDown size={12} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close on click outside */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setIsOpen(false)}></div>
          
          <div className="glass-panel" style={{
             position: 'absolute', top: '45px', right: 0, width: '280px', maxHeight: '400px',
             background: 'rgba(10, 12, 16, 0.95)', border: '1px solid #333', borderRadius: '12px',
             display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 100,
             boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
          }}>
            
            {/* Header */}
            <div style={{ padding: '12px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111' }}>
              <span style={{ fontSize: '11px', color: '#888', fontWeight: 'bold', letterSpacing: '1px' }}>RECENT ACTIVITY</span>
              {history.length > 0 && (
                <button onClick={clearHistory} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '4px' }} title="Clear History">
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ overflowY: 'auto', padding: '5px' }}>
              {history.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#555', fontSize: '12px' }}>
                  <History size={24} style={{ marginBottom: '8px', opacity: 0.3 }} />
                  <div>No recent scans</div>
                </div>
              ) : (
                history.map((item, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleSelect(item)}
                    style={{
                      padding: '10px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px',
                      display: 'flex', alignItems: 'center', gap: '10px', transition: '0.2s',
                      background: 'rgba(255,255,255,0.02)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  >
                    <div style={{ 
                      width: '30px', height: '30px', borderRadius: '6px', 
                      background: item.color === '#00f3ff' ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255, 0, 85, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${item.color}40`, flexShrink: 0
                    }}>
                       {item.status === 'ACTIVE' ? <Search size={14} color={item.color} /> : <Clock size={14} color={item.color} />}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                      <div style={{ color: '#666', fontSize: '10px', display: 'flex', gap: '8px' }}>
                         <span>Score: {item.score}</span>
                         <span style={{ color: item.color }}>{item.status}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}