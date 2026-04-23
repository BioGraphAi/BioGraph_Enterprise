import React, { useState } from 'react';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import SettingsModal from './components/SettingsModal';
import BackgroundEffects from './components/layout/BackgroundEffects';
import "./styles/main.css";

function App() {
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState(null);
  const [historySelection, setHistorySelection] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  return (
    <div className="app-container">
      {/* Global UI Elements */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* Background Elements */}
      <BackgroundEffects />

      {/* Dashboard with internal navigation */}
      <Dashboard 
        showToast={showToast} 
        historyLoadData={historySelection}
        showAbout={showAbout}
        setShowAbout={setShowAbout}
        onHistorySelect={setHistorySelection}
        onOpenSettings={() => setShowSettings(true)}
      />
    </div>
  );
}

export default App;
