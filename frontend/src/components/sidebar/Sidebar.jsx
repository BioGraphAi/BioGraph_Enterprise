import React from 'react';
import { 
  Database, Upload, FlaskConical, PanelLeftClose, PanelLeftOpen, 
  Dna, Info, Settings, LayoutDashboard, History 
} from 'lucide-react';
import ManualMode from './ManualMode';
import AutoMode from './AutoMode';
import UploadMode from './UploadMode';

export default function Sidebar({
  activeTab, setActiveTab, 
  isSidebarOpen, setIsSidebarOpen,
  showAbout, setShowAbout,
  onHistorySelect, onOpenSettings
}) {
  const isOpen = isSidebarOpen;

  const navItems = [
    { key: 'manual', label: 'Manual Discovery', icon: FlaskConical },
    { key: 'auto',   label: 'Auto Discovery',   icon: Database },
    { key: 'upload', label: 'Bulk Upload',      icon: Upload },
  ];

  return (
    <div className={`glass-panel panel-left${isOpen ? '' : ' collapsed'}`} style={{ zIndex: 110 }}>

      {/* ── Sidebar Header ── */}
      <div className="sidebar-header" style={{ padding: isOpen ? '16px' : '12px 0' }}>
        {isOpen ? (
          <>
            <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', width: '100%' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Dna size={18} color="var(--accent)" strokeWidth={2} />
              </div>
              <span className="sidebar-brand-name" style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px', margin: 0, padding: 0 }}>BioGraph</span>
            </div>
            <button
              className="sidebar-toggle-btn"
              onClick={() => setIsSidebarOpen(false)}
              title="Collapse"
            >
              <PanelLeftClose size={17} />
            </button>
          </>
        ) : (
          <button
            className="sidebar-toggle-btn"
            onClick={() => setIsSidebarOpen(true)}
            title="Expand"
            style={{ margin: '0 auto' }}
          >
            <PanelLeftOpen size={17} />
          </button>
        )}
      </div>

      {/* ── Main Navigation ── */}
      <div className="sidebar-content" style={{ padding: isOpen ? '16px' : '10px 0' }}>
        {isOpen && <span className="sidebar-title">Discovery</span>}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: isOpen ? '8px' : '0' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key && !showAbout;
            
            return (
              <button
                key={item.key}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                   setActiveTab(item.key);
                   setShowAbout(false);
                }}
                title={!isOpen ? item.label : ''}
                style={{ 
                  justifyContent: isOpen ? 'flex-start' : 'center',
                  padding: isOpen ? '10px 14px' : '10px 0',
                  width: isOpen ? '100%' : '44px',
                  margin: isOpen ? '0' : '0 auto'
                }}
              >
                <Icon size={18} />
                {isOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {isOpen ? (
          <div className="sidebar-nav-extra" style={{ marginTop: '24px' }}>
            <span className="sidebar-title">Platform</span>
            
            <button 
              className={`sidebar-nav-item ${showAbout ? 'active' : ''}`}
              onClick={() => setShowAbout(true)}
              style={{ padding: '10px 14px', marginTop: '8px', width: '100%', border: 'none', background: 'transparent' }}
            >
              <Info size={17} />
              <span>About BioGraph</span>
            </button>

            <button 
              className={`sidebar-nav-item ${activeTab === 'history' && !showAbout ? 'active' : ''}`}
              onClick={() => { setActiveTab('history'); setShowAbout(false); }}
              style={{ padding: '10px 14px', width: '100%', border: 'none', background: 'transparent' }}
            >
              <History size={17} />
              <span>History</span>
            </button>

            <button 
              className="sidebar-nav-item" 
              onClick={onOpenSettings}
              style={{ padding: '10px 14px', width: '100%', border: 'none', background: 'transparent' }}
            >
              <Settings size={17} />
              <span>Settings</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', marginTop: '20px', borderTop: '1px solid var(--sidebar-border)', paddingTop: '16px' }}>
            <button className="sidebar-icon-btn" onClick={() => setShowAbout(true)} title="About">
              <Info size={17} />
            </button>
            <button className="sidebar-icon-btn" onClick={() => { setActiveTab('history'); setShowAbout(false); }} title="History">
              <History size={17} />
            </button>
            <button className="sidebar-icon-btn" onClick={onOpenSettings} title="Settings">
              <Settings size={17} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}