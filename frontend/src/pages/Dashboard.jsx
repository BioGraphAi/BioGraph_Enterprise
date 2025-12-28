import React from 'react';
import { useDashboardLogic } from '../hooks/useDashboardLogic';

// ✅ ALL IMPORTS ARE NOW MODULAR
import Sidebar from '../components/sidebar/Sidebar';
import HeaderStatus from '../components/dashboard/HeaderStatus';
import HologramDisplay from '../components/dashboard/HologramDisplay';
import SingleResultDisplay from '../components/dashboard/SingleResultDisplay';
import BatchResultList from '../components/dashboard/BatchResultList';
import ResultCard from '../components/ResultCard';

const Dashboard = ({ showToast, historyLoadData }) => {
  // Logic Hook
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

  return (
    <div className="page-section" style={{ position: 'relative' }}>
      <div className="main-layout">
        
        {/* 1. SIDEBAR */}
        <Sidebar
          activeTab={activeTab} setActiveTab={setActiveTab}
          target={target} setTarget={setTarget}
          smiles={smiles} setSmiles={setSmiles}
          selectedFile={selectedFile} fileInputRef={fileInputRef}
          setSelectedFile={setSelectedFile}
          handleFileSelect={handleFileSelect} handleScan={handleScan}
          loading={loading} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* 2. MAIN DISPLAY AREA */}
        <div className={`glass-panel panel-right ${!isSidebarOpen ? 'expanded' : ''}`} style={{ zIndex: 50 }}>
          
          {/* A. Header Status Bar */}
          <HeaderStatus 
            loading={loading} 
            aiThreshold={aiThreshold} 
            result={result} 
            activeTab={activeTab} 
            onBack={() => setResult(null)} 
          />

          {/* B. Dynamic Content Area */}
          <div style={{ flex: 1, position: 'relative', display: 'flex', height: 'calc(100% - 60px)' }}>
            
            {/* Case 1: Loading or Idle (Hologram) */}
            {(loading || (!result && batchResults.length === 0)) ? (
               <HologramDisplay loading={loading} progress={progress} activeTab={activeTab} />
            ) : 
            
            /* Case 2: Single Result View */
            result ? (
               <SingleResultDisplay result={result} />
            ) : 
            
            /* Case 3: Batch List View */
            (
               <BatchResultList 
                 results={batchResults} 
                 aiThreshold={aiThreshold} 
                 onItemClick={handleDrugClick} 
               />
            )}
            
          </div>
        </div>
      </div>
      
      {/* 3. RESULT CARD (Overlay) */}
      {result && <ResultCard result={result} cardRef={cardRef} isSidebarOpen={isSidebarOpen} />}
    
    </div>
  );
};

export default Dashboard;