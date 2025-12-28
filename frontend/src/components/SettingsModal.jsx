import React, { useState, useEffect } from 'react';
import { X, Save, Sliders } from 'lucide-react';
import '../styles/components/settings.css'; // ✅ Import CSS

// Modular Components
import AISettings from './settings/AISettings';
import VisualSettings from './settings/VisualSettings';
import DataSettings from './settings/DataSettings';

export default function SettingsModal({ onClose }) {
  const [settings, setSettings] = useState({
    threshold: 7.0, defaultView: 'surface', graphicsQuality: 'high', historyLimit: 20
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('biograph_settings');
    if (stored) setSettings(JSON.parse(stored));
  }, []);

  const handleSave = () => {
    localStorage.setItem('biograph_settings', JSON.stringify(settings));
    window.dispatchEvent(new Event('settingsUpdated'));
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        
        {/* Header */}
        <div className="settings-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={20} color="#00f3ff" />
            <h3 style={{ margin: 0, color: '#fff', letterSpacing: '1px' }}>SYSTEM CONFIGURATION</h3>
          </div>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="settings-body">
          <AISettings settings={settings} setSettings={setSettings} />
          <VisualSettings settings={settings} setSettings={setSettings} />
          <DataSettings settings={settings} setSettings={setSettings} />
        </div>

        {/* Footer */}
        <div className="settings-footer">
          <button onClick={handleSave} className="save-btn">
            {saved ? "SETTINGS SAVED!" : <><Save size={18} /> SAVE CHANGES</>}
          </button>
        </div>

      </div>
    </div>
  );
}