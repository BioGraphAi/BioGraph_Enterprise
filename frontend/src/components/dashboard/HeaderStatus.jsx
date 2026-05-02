import React from 'react';
import { Activity, List, Menu } from 'lucide-react';
import ActionButtons from '../result-card/ActionButtons';

export default function HeaderStatus({
  loading, aiThreshold, result, activeTab, onBack,
  onView, on3D, onDownload, downloading, onToggleSidebar
}) {
  return (
    <div style={{
      height: '54px',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 18px',
      borderBottom: '1px solid var(--border-subtle)',
      flexShrink: 0,
      gap: '8px'
    }}>

      {/* Left: Mobile hamburger + Status Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

        {/* Hamburger — only visible on mobile via CSS */}
        <button
          id="mobile-sidebar-toggle"
          className="mobile-sidebar-trigger"
          onClick={onToggleSidebar}
          title="Toggle Sidebar"
          aria-label="Toggle Sidebar"
        >
          <Menu size={18} />
        </button>

        <div className="header-badge" style={{ margin: 0 }}>
          <div className="status-desktop">
            <Activity
              size={13}
              color={loading ? 'var(--status-success)' : 'var(--text-muted)'}
              className={loading ? 'animate-pulse' : ''}
            />
            <span className="badge-text" style={{ marginLeft: '7px' }}>
              {loading ? 'Processing' : 'Idle'}
            </span>
            <span style={{ marginLeft: '12px', color: 'var(--text-disabled)', fontSize: '10px' }}>
              Threshold {aiThreshold.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {result && (
          <ActionButtons
            result={result}
            onView={onView}
            on3D={on3D}
            onDownload={onDownload}
            downloading={downloading}
            layout="row"
          />
        )}
        {result && activeTab !== 'manual' && (
          <button
            onClick={onBack}
            className="nav-link"
            style={{ marginLeft: '4px', fontSize: '12px' }}
          >
            <List size={14} /> Back
          </button>
        )}
      </div>
    </div>
  );
}