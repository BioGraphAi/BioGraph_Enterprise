import React, { useState } from 'react';
import { useDashboardLogic } from '../hooks/useDashboardLogic';
import { ArrowLeft, Eye } from 'lucide-react';

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
    showForm, setShowForm,
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

  // ── What to render in the center panel ──
  // Priority: special pages → loading → manual result nav → batch → input form
  const renderCenterContent = () => {
    // Special pages (About, History Summary, History tab)
    if (showAbout) return <About />;
    if (summaryItem) return (
      <HistorySummaryView
        data={summaryItem}
        onClose={() => setSummaryItem(null)}
        onOpenDetails={() => { onHistorySelect(summaryItem); setSummaryItem(null); }}
      />
    );
    if (activeTab === 'history') return <HistoryPage onSelectHistoryItem={setSummaryItem} />;

    // Loading spinner
    if (loading) return (
      <HologramDisplay loading={loading} progress={progress} progressDetail={progressDetail} activeTab={activeTab} />
    );

    // ── MANUAL MODE: result exists ──
    if (result && activeTab === 'manual') {
      if (showForm) {
        // User pressed "Back" — show form with a "View Result" pill at top
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* ── View Result Banner ── */}
            <div style={{
              padding: '7px 16px',
              background: 'rgba(99,102,241,0.06)',
              borderBottom: '1px solid rgba(99,102,241,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0, flexWrap: 'wrap', gap: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                  background: result.status === 'ACTIVE' ? '#00ff88' : '#ff4b4b',
                  boxShadow: `0 0 6px ${result.status === 'ACTIVE' ? '#00ff88' : '#ff4b4b'}`,
                }} />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Saved:
                  <strong style={{ color: 'var(--text-primary)', marginLeft: '4px' }}>{result.name}</strong>
                  <span style={{
                    marginLeft: '8px', fontSize: '11px', fontWeight: 700,
                    color: result.status === 'ACTIVE' ? '#00ff88' : '#ff4b4b',
                  }}>
                    pKd {result.score}
                  </span>
                </span>
              </div>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  color: 'white', border: 'none', cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(99,102,241,0.35)',
                  flexShrink: 0,
                }}
              >
                <Eye size={13} /> View Result
              </button>
            </div>

            {/* Input Form below banner */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <DiscoveryDashboard
                activeTab={activeTab}
                target={target} setTarget={setTarget}
                smiles={smiles} setSmiles={setSmiles}
                selectedFile={selectedFile} setSelectedFile={setSelectedFile}
                fileInputRef={fileInputRef} handleFileSelect={handleFileSelect}
                handleScan={handleScan} loading={loading}
              />
            </div>
          </div>
        );
      }

      // Showing the result — with a Back button at top
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* ── Back Bar ── */}
          <div style={{
            padding: '7px 16px',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', gap: '10px',
            flexShrink: 0, flexWrap: 'wrap',
          }}>
            <button
              onClick={() => setShowForm(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))',
                color: 'var(--accent)',
                border: '1px solid rgba(99,102,241,0.35)',
                cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.28), rgba(168,85,247,0.28))'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; }}
            >
              <ArrowLeft size={13} /> Back to Search
            </button>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
              Result: <strong style={{ color: 'var(--text-primary)' }}>{result.name}</strong>
              <span style={{ marginLeft: '8px', color: result.status === 'ACTIVE' ? '#00ff88' : '#ff4b4b', fontWeight: 700 }}>pKd {result.score}</span>
            </span>
          </div>

          {/* Result content */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <SingleResultDisplay
              result={result}
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              activeTab={resultActiveTab}
              setActiveTab={setResultActiveTab}
            />
          </div>
        </div>
      );
    }

    // ── BATCH results (auto / upload) ──
    if (batchResults.length > 0) return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>

        {/* Toggle bar */}
        <div style={{
          padding: '10px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px', background: 'var(--bg-surface)', flexShrink: 0,
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 700, color: '#00ff88' }}>
              {batchResults.filter(r => r.score >= aiThreshold).length}
            </span> active leads out of{' '}
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{batchResults.length}</span> screened
          </div>
          <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-sunken)', borderRadius: '10px', padding: '4px' }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                fontSize: '12px', fontWeight: 700, padding: '7px 16px', borderRadius: '8px',
                border: 'none', cursor: 'pointer',
                background: viewMode === 'list' ? 'var(--bg-elevated)' : 'transparent',
                color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: viewMode === 'list' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >📋 Table View</button>
            <button
              onClick={() => setViewMode('3d')}
              style={{
                fontSize: '12px', fontWeight: 700, padding: '7px 16px', borderRadius: '8px',
                border: 'none', cursor: 'pointer',
                background: viewMode === '3d' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent',
                color: viewMode === '3d' ? 'white' : 'var(--text-muted)',
                boxShadow: viewMode === '3d' ? '0 2px 12px rgba(99,102,241,0.4)' : 'none',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >🔬 3D Knowledge Graph</button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {viewMode === 'list' ? (
            <BatchResultList results={batchResults} aiThreshold={aiThreshold} onItemClick={handleDrugClick} targetId={target} />
          ) : (
            <div style={{ width: '100%', height: '100%', padding: '16px', boxSizing: 'border-box', overflow: 'hidden' }}>
              <KnowledgeGraph targetId={target} activeDrugs={batchResults} />
            </div>
          )}
        </div>
      </div>
    );

    // ── Default: input form ──
    return (
      <DiscoveryDashboard
        activeTab={activeTab}
        target={target} setTarget={setTarget}
        smiles={smiles} setSmiles={setSmiles}
        selectedFile={selectedFile} setSelectedFile={setSelectedFile}
        fileInputRef={fileInputRef} handleFileSelect={handleFileSelect}
        handleScan={handleScan} loading={loading}
      />
    );
  };

  const showingResult = result && activeTab === 'manual' && !showForm;

  return (
    <div className="page-section" style={{ position: 'relative' }}>

      {/* Mobile Backdrop */}
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
          showAbout={showAbout} setShowAbout={setShowAbout}
          onHistorySelect={onHistorySelect} onOpenSettings={onOpenSettings}
        />

        {/* CENTER Panel */}
        <div
          className={`glass-panel panel-right ${!isSidebarOpen ? 'expanded' : ''}`}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', zIndex: 50, minWidth: 0 }}
        >
          {/* Header — hide on special pages */}
          {!showAbout && !summaryItem && (
            <HeaderStatus
              loading={loading}
              aiThreshold={aiThreshold}
              result={showingResult ? result : null}
              activeTab={activeTab}
              onBack={() => setShowForm(true)}
              onDownload={downloadReport}
              downloading={downloading}
              onToggleSidebar={() => setIsSidebarOpen(v => !v)}
            />
          )}

          <div style={{
            flex: 1, position: 'relative', display: 'flex', flexDirection: 'column',
            height: (showAbout || summaryItem || activeTab === 'history') ? '100%' : 'calc(100% - 54px)',
            overflow: 'hidden',
            width: '100%'
          }}>
            {renderCenterContent()}
          </div>
        </div>

        {/* RIGHT Sidebar — only when actively viewing a result */}
        {showingResult && (
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