import React from 'react';
import { 
  Sparkles, Box, Activity, Zap, 
  PanelRightClose, PanelRightOpen 
} from 'lucide-react';

export default function ResultSidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const navItems = [
    { id: 'intelligence', label: 'Intelligence', icon: Sparkles, desc: 'AI Analysis & Insights' },
    { id: 'structure',    label: 'Structure',    icon: Box,      desc: '2D Molecular View' },
    { id: 'admet',        label: 'Safety',       icon: Activity, desc: 'ADMET Radar Analysis' },
    { id: '3d',           label: '3D Viewer',    icon: Zap,      desc: 'Protein Interaction' },
  ];

  return (
    <div 
      className={`glass-panel result-sidebar ${!isOpen ? 'collapsed' : ''}`}
      style={{
        width: isOpen ? '240px' : '64px',
        height: '100vh',
        background: 'var(--sidebar-bg)',
        borderLeft: '1px solid var(--sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'var(--sidebar-transition)',
        zIndex: 100,
        position: 'relative',
        flexShrink: 0
      }}
    >
      {/* ── Sidebar Header (Matched with Left Sidebar) ── */}
      <div className="sidebar-header" style={{ 
        padding: isOpen ? '16px' : '12px 0', 
        justifyContent: isOpen ? 'space-between' : 'center',
        flexDirection: 'row'
      }}>
        {isOpen ? (
          <>
            <div className="sidebar-title" style={{ margin: 0 }}>Research</div>
            <button
              className="sidebar-toggle-btn"
              onClick={() => setIsOpen(false)}
              title="Collapse"
            >
              <PanelRightClose size={17} />
            </button>
          </>
        ) : (
          <button
            className="sidebar-toggle-btn"
            onClick={() => setIsOpen(true)}
            title="Expand"
            style={{ margin: '0 auto' }}
          >
            <PanelRightOpen size={17} />
          </button>
        )}
      </div>

      {/* ── Nav Items ── */}
      <div className="sidebar-content" style={{ padding: isOpen ? '16px 8px' : '10px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={!isOpen ? item.label : ''}
                style={{
                  justifyContent: isOpen ? 'flex-start' : 'center',
                  padding: isOpen ? '12px' : '10px 0',
                  width: isOpen ? '100%' : '44px',
                  margin: isOpen ? '0' : '0 auto',
                  background: isActive ? 'var(--accent-soft)' : 'transparent',
                  color: isActive ? 'var(--sidebar-text)' : 'var(--sidebar-muted)'
                }}
              >
                <Icon size={18} style={{ flexShrink: 0, color: isActive ? 'var(--accent)' : 'inherit' }} />
                {isOpen && (
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontSize: '10px', opacity: 0.6, fontWeight: 400 }}>{item.desc}</div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ padding: '20px 16px', borderTop: '1px solid var(--sidebar-border)', opacity: 0.4, fontSize: '9px', color: 'var(--sidebar-muted)', textAlign: isOpen ? 'left' : 'center' }}>
        {isOpen ? '© 2024 BioGraph Research' : '©'}
      </div>
    </div>
  );
}
