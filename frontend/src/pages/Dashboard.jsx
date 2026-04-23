import React, { useState } from 'react'; 
import { useDashboardLogic } from '../hooks/useDashboardLogic';
import { Menu } from 'lucide-react';

// Components
import Sidebar from '../components/sidebar/Sidebar';
import HeaderStatus from '../components/dashboard/HeaderStatus';
import DiscoveryDashboard from '../components/dashboard/DiscoveryDashboard';
import SingleResultDisplay from '../components/dashboard/SingleResultDisplay';
import BatchResultList from '../components/dashboard/BatchResultList';
import HologramDisplay from '../components/dashboard/HologramDisplay';
import ResultSidebar from '../components/sidebar/ResultSidebar'; 
import HistorySummaryView from '../components/dashboard/HistorySummaryView';
import HistoryPage from '../components/dashboard/HistoryPage';
import KnowledgeGraph from '../components/dashboard/KnowledgeGraph';

// Modals
import About from './About';

const Dashboard = ({ 
  showToast, historyLoadData, 
  showAbout, setShowAbout, 
  onHistorySelect, onOpenSettings,
  summaryItem, setSummaryItem
}) => {
  const {
    activeTab, setActiveTab,
    target, setTarget,
    smiles, setSmiles,
    loading, progress, progressDetail,
    result, setResult,
    batchResults,
    isSidebarOpen, setIsSidebarOpen,
    selectedFile, setSelectedFile,
    aiThreshold,
    fileInputRef,
    handleFileSelect,
    handleScan,
    handleDrugClick,
    chatHistory, setChatHistory,
    resultActiveTab, setResultActiveTab,
    isResultSidebarOpen, setIsResultSidebarOpen,
    viewMode, setViewMode
  } = useDashboardLogic(showToast, historyLoadData);

  // Local UI State
  const [downloading, setDownloading] = useState(false);
  
  // Download Logic
  const downloadReport = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${BASE_URL}/download_report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.name,
          smiles: result.smiles,
          score: result.score,
          target_id: target || "6LU7", 
          admet: result.admet
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BioGraph_Report_${result.name}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast("Report Downloaded!", "success");
      } else {
        showToast("Failed to generate report.", "error");
      }
    } catch (error) {
      console.error("Download Error:", error);
      showToast("Server error while downloading.", "error");
    }
    setDownloading(false);
  };

  return (
    <div className="page-section" style={{ position: 'relative' }}>

      {/* ── Mobile Backdrop (closes sidebar on tap) ── */}
      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <div className="main-layout" style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        
        {/* LEFT Sidebar */}
        <Sidebar
          activeTab={activeTab} setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
          showAbout={showAbout}
          setShowAbout={setShowAbout}
          onHistorySelect={onHistorySelect}
          onOpenSettings={onOpenSettings}
        />

        {/* CENTER Panel */}
        <div className={`glass-panel panel-right ${!isSidebarOpen ? 'expanded' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', zIndex: 50, minWidth: 0 }}>
          {!showAbout && !summaryItem && (
            <HeaderStatus 
              loading={loading} 
              aiThreshold={aiThreshold} 
              result={result} 
              activeTab={activeTab} 
              onBack={() => setResult(null)}
              onDownload={downloadReport}
              downloading={downloading}
              onToggleSidebar={() => setIsSidebarOpen(v => !v)}
            />
          )}

          <div style={{ flex: 1, position: 'relative', display: 'flex', height: (showAbout || summaryItem || activeTab === 'history') ? '100%' : 'calc(100% - 54px)', overflow: 'hidden' }}>
            {showAbout ? (
              <About />
            ) : summaryItem ? (
              <HistorySummaryView 
                data={summaryItem} 
                onClose={() => setSummaryItem(null)} 
                onOpenDetails={() => { onHistorySelect(summaryItem); setSummaryItem(null); }} 
              />
            ) : activeTab === 'history' ? (
              <HistoryPage onSelectHistoryItem={setSummaryItem} />
            ) : loading ? (
                <HologramDisplay loading={loading} progress={progress} progressDetail={progressDetail} activeTab={activeTab} />
            ) : result ? (
               <SingleResultDisplay 
                 result={result} 
                 chatHistory={chatHistory} 
                 setChatHistory={setChatHistory}
                 activeTab={resultActiveTab}
                 setActiveTab={setResultActiveTab}
               />
            ) : batchResults.length > 0 ? (
               <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                 <div style={{ 
                   padding: '12px 24px', 
                   borderBottom: '1px solid var(--border-subtle)', 
                   display: 'flex', 
                   justifyContent: 'flex-end', 
                   gap: '12px', 
                   background: 'var(--bg-surface)',
                   flexShrink: 0
                 }}>
                   <button 
                     className={`tab-btn ${viewMode === 'list' ? 'active' : ''}`}
                     onClick={() => setViewMode('list')}
                     style={{ fontSize: '13px', padding: '6px 16px', borderRadius: '8px' }}
                   >
                     Table View
                   </button>
                   <button 
                     className={`tab-btn ${viewMode === '3d' ? 'active' : ''}`}
                     onClick={() => setViewMode('3d')}
                     style={{ fontSize: '13px', padding: '6px 16px', borderRadius: '8px' }}
                   >
                     3D Network Graph
                   </button>
                 </div>
                 <div style={{ flex: 1, overflow: 'hidden' }}>
                   {viewMode === 'list' ? (
                     <BatchResultList results={batchResults} aiThreshold={aiThreshold} onItemClick={handleDrugClick} />
                   ) : (
                     <div style={{ padding: '24px', height: '100%', boxSizing: 'border-box' }}>
                       <KnowledgeGraph targetId={target} activeDrugs={batchResults} />
                     </div>
                   )}
                 </div>
               </div>
            ) : (
               <DiscoveryDashboard 
                  activeTab={activeTab}
                  target={target} setTarget={setTarget}
                  smiles={smiles} setSmiles={setSmiles}
                  selectedFile={selectedFile} setSelectedFile={setSelectedFile}
                  fileInputRef={fileInputRef} handleFileSelect={handleFileSelect}
                  handleScan={handleScan} loading={loading}
               />
            )}
          </div>
        </div>

        {/* RIGHT Sidebar */}
        {result && !showAbout && (
           <ResultSidebar 
             activeTab={resultActiveTab} 
             setActiveTab={setResultActiveTab} 
             isOpen={isResultSidebarOpen} 
             setIsOpen={setIsResultSidebarOpen} 
           />
        )}
      </div>
    </div>
  );
};

export default Dashboard;