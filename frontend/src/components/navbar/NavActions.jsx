import React from 'react';
import { Home, Info, Settings } from 'lucide-react';
import HistoryDropdown from '../HistoryDropdown'; // Path adjusted

export default function NavActions({ showAbout, setShowAbout, onHistorySelect, onOpenSettings }) {
  return (
    <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      
      {/* History Dropdown */}
      <HistoryDropdown onSelectResult={onHistorySelect} />

      {/* Divider */}
      <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.2)', margin: '0 8px' }}></div>

      {/* Home Button */}
      <div 
        className={`nav-link ${!showAbout ? 'active-btn' : ''}`} 
        onClick={() => setShowAbout(false)}
        title="Dashboard"
        style={{ padding: '8px' }} 
      >
        <Home size={18} />
      </div>

      {/* About Button */}
      <div 
        className={`nav-link ${showAbout ? 'active-btn' : ''}`} 
        onClick={() => setShowAbout(true)}
        title="About"
        style={{ padding: '8px' }}
      >
        <Info size={18} />
      </div>

      {/* Settings Button */}
      <div 
        className="nav-link"
        onClick={onOpenSettings} 
        title="System Settings"
        style={{ padding: '8px' }}
      >
        <Settings size={18} />
      </div>

    </div>
  );
}