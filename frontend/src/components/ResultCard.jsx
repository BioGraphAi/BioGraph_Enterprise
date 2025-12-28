import React, { useState } from 'react';
import AnalysisModal from './AnalysisModal';
import ProteinViewer from './ProteinViewer';

// ✅ NEW MODULAR IMPORTS
import ScoreSection from './result-card/ScoreSection';
import ActionButtons from './result-card/ActionButtons';

export default function ResultCard({ result, cardRef, isSidebarOpen }) {
  const [showModal, setShowModal] = useState(false);
  const [show3D, setShow3D] = useState(false); 
  const [downloading, setDownloading] = useState(false);

  if (!result) return null;

  const containerClass = `result-card ${result.status === 'ACTIVE' ? 'active' : 'inactive'} ${!isSidebarOpen ? 'sidebar-closed' : ''}`;

  // Download Logic
  const downloadReport = async () => {
    setDownloading(true);
    try {
      const response = await fetch('http://localhost:8000/download_report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.name,
          smiles: result.smiles,
          score: result.score,
          target_id: "6LU7", 
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
      } else {
        alert("Failed to generate report.");
      }
    } catch (error) {
      console.error("Download Error:", error);
      alert("Server error while downloading.");
    }
    setDownloading(false);
  };

  return (
    <>
      <div 
        className={containerClass} 
        style={{ 
          borderColor: result.color, 
          zIndex: 60, 
          pointerEvents: 'auto',
          justifyContent: 'space-between', 
          paddingRight: '20px'
        }} 
        ref={cardRef}
      >
        
        {/* 1. LEFT SIDE (Scores) */}
        <ScoreSection result={result} />

        {/* 2. RIGHT SIDE (Buttons) */}
        <ActionButtons 
          result={result} 
          onView={() => setShowModal(true)}
          on3D={() => setShow3D(true)}
          onDownload={downloadReport}
          downloading={downloading}
        />

      </div>

      {/* Render Modals */}
      {show3D && <ProteinViewer pdbId="6LU7" onClose={() => setShow3D(false)} />}
      {showModal && <AnalysisModal result={result} onClose={() => setShowModal(false)} />}
    </>
  );
}