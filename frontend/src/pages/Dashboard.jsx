import React, { useState, useEffect } from 'react'; 
import { useDashboardLogic } from '../hooks/useDashboardLogic';

// Components
import Sidebar from '../components/sidebar/Sidebar';
import HeaderStatus from '../components/dashboard/HeaderStatus';
import HologramDisplay from '../components/dashboard/HologramDisplay';
import SingleResultDisplay from '../components/dashboard/SingleResultDisplay';
import BatchResultList from '../components/dashboard/BatchResultList';
import ResultCard from '../components/ResultCard';

// Modals
import AnalysisModal from '../components/AnalysisModal';
import ProteinViewer from '../components/ProteinViewer';

const Dashboard = ({ showToast, historyLoadData }) => {
  const {
    activeTab, setActiveTab,
    target, setTarget,
    smiles, setSmiles,
    loading, progress,
    result, setResult,
    batchResults,
    isSidebarOpen, setIsSidebarOpen,
    selectedFile, setSelectedFile,
    aiThreshold,
    fileInputRef,
    handleFileSelect,
    handleScan,
    handleDrugClick,
    cardRef
  } = useDashboardLogic(showToast, historyLoadData);

  // Local State
  const [showModal, setShowModal] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  // ✅ NEW: Chat Response State (Jawab yahan store hoga)
  const [chatResponse, setChatResponse] = useState(null);

  // Jab bhi naya result aye, purana chat clear kar dein
  useEffect(() => {
    setChatResponse(null);
  }, [result]);

  // Download Logic
  const downloadReport = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      const response = await fetch('http://localhost:8000/download_report', {
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
      <div className="main-layout">
        <Sidebar
          activeTab={activeTab} setActiveTab={setActiveTab}
          target={target} setTarget={setTarget}
          smiles={smiles} setSmiles={setSmiles}
          selectedFile={selectedFile} fileInputRef={fileInputRef}
          setSelectedFile={setSelectedFile}
          handleFileSelect={handleFileSelect} handleScan={handleScan}
          loading={loading} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className={`glass-panel panel-right ${!isSidebarOpen ? 'expanded' : ''}`} style={{ zIndex: 50 }}>
          <HeaderStatus 
            loading={loading} 
            aiThreshold={aiThreshold} 
            result={result} 
            activeTab={activeTab} 
            onBack={() => setResult(null)}
            onView={() => setShowModal(true)}
            on3D={() => setShow3D(true)}
            onDownload={downloadReport}
            downloading={downloading}
          />

          <div style={{ flex: 1, position: 'relative', display: 'flex', height: 'calc(100% - 60px)' }}>
            {(loading || (!result && batchResults.length === 0)) ? (
               <HologramDisplay loading={loading} progress={progress} activeTab={activeTab} />
            ) : result ? (
               // ✅ PASS: Chat Response ko display ke liye bhej rahe hain
               <SingleResultDisplay result={result} chatResponse={chatResponse} />
            ) : (
               <BatchResultList results={batchResults} aiThreshold={aiThreshold} onItemClick={handleDrugClick} />
            )}
          </div>
        </div>
      </div>
      
      {/* ✅ PASS: setChatResponse ko card mein bhej rahe hain taake wo update kar sake */}
      {result && <ResultCard result={result} cardRef={cardRef} isSidebarOpen={isSidebarOpen} setChatResponse={setChatResponse} />}

      {show3D && <ProteinViewer pdbId={target || "6LU7"} onClose={() => setShow3D(false)} />}
      {showModal && <AnalysisModal result={result} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Dashboard;