import React from 'react';
import { Database, Upload, FlaskConical, ChevronsLeft, ChevronsRight, Zap } from 'lucide-react';
import ManualMode from './ManualMode';
import AutoMode from './AutoMode';
import UploadMode from './UploadMode';

export default function Sidebar({
  activeTab, setActiveTab, target, setTarget, smiles, setSmiles, 
  selectedFile, setSelectedFile, fileInputRef, handleFileSelect, 
  handleScan, loading, isSidebarOpen, setIsSidebarOpen
}) {
  
  // -- COLLAPSED VIEW --
  if (!isSidebarOpen) {
    return (
      <div className="glass-panel panel-left collapsed" style={{ zIndex: 50 }}>
        <div className="sidebar-toggle-btn" onClick={() => setIsSidebarOpen(true)}><ChevronsRight size={24} /></div>
        <div className={`sidebar-icon-btn ${activeTab === 'manual' ? 'active' : ''}`} onClick={() => { setActiveTab('manual'); setIsSidebarOpen(true); }}><FlaskConical size={24} /></div>
        <div className={`sidebar-icon-btn ${activeTab === 'auto' ? 'active' : ''}`} onClick={() => { setActiveTab('auto'); setIsSidebarOpen(true); }}><Database size={24} /></div>
        <div className={`sidebar-icon-btn ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => { setActiveTab('upload'); setIsSidebarOpen(true); }}><Upload size={24} /></div>
      </div>
    );
  }

  // -- EXPANDED VIEW --
  return (
    <div className="glass-panel panel-left" style={{ zIndex: 50 }}>
      <div className="panel-header" style={{ justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Database size={20} color="#00f3ff" />
          <h3 className="panel-title">INPUT CONFIG</h3>
        </div>
        <div className="mobile-hide" onClick={() => setIsSidebarOpen(false)} style={{ cursor: 'pointer', padding: '5px' }}><ChevronsLeft size={20} color="#666" /></div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px', minHeight: 0 }}>
        {/* TABS */}
        <div className="tab-group" style={{ position: 'relative', zIndex: 51 }}>
          <button className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`} onClick={() => setActiveTab('manual')}>MANUAL</button>
          <button className={`tab-btn ${activeTab === 'auto' ? 'active' : ''}`} onClick={() => setActiveTab('auto')}>AUTO DB</button>
          <button className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>UPLOAD</button>
        </div>

        {/* MODE CONTENT - Clean Switch Logic */}
        {activeTab === 'manual' && <ManualMode target={target} setTarget={setTarget} smiles={smiles} setSmiles={setSmiles} />}
        {activeTab === 'auto' && <AutoMode target={target} setTarget={setTarget} />}
        {activeTab === 'upload' && <UploadMode target={target} setTarget={setTarget} fileInputRef={fileInputRef} handleFileSelect={handleFileSelect} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />}
      
      </div>

      {/* FOOTER BUTTON */}
      <div style={{ marginTop: 'auto', flexShrink: 0, paddingTop: '15px' }}>
        <button className="cyber-btn" onClick={handleScan} disabled={loading} style={{ pointerEvents: 'auto', zIndex: 52 }}>
          <div className="btn-content">
            {loading ? <span className="animate-spin" style={{ display: 'inline-block' }}><Zap size={20} /></span> : <Zap size={20} />}
            {loading ? "PROCESSING..." : (activeTab === 'manual' ? "INITIATE ANALYSIS" : "START PROCESS")}
          </div>
        </button>
      </div>

    </div>
  );
}