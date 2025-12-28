import React from 'react';
import { BindingScore, ConfidenceScore } from './result-card/ScoreSection';
import DrugChat from './dashboard/DrugChat';

// ✅ Accept setChatResponse prop
export default function ResultCard({ result, cardRef, isSidebarOpen, setChatResponse }) {
  if (!result) return null;

  const containerClass = `result-card ${result.status === 'ACTIVE' ? 'active' : 'inactive'} ${!isSidebarOpen ? 'sidebar-closed' : ''}`;

  return (
    <div 
      className={containerClass} 
      style={{ 
        borderColor: result.color, 
        zIndex: 60, 
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', 
        padding: '0 20px',
        gap: '20px',      
        height: '80px'    
      }} 
      ref={cardRef}
    >
      
      {/* 1. LEFT: Binding Score */}
      <div style={{ flex: '0 0 auto' }}>
        <BindingScore result={result} />
      </div>

      {/* 2. CENTER: Chat Bar (Pass onResponse) */}
      <div style={{ flex: 1, maxWidth: '600px' }}> 
        <DrugChat result={result} compact={true} onResponse={setChatResponse} />
      </div>

      {/* 3. RIGHT: Confidence Score */}
      <div style={{ flex: '0 0 auto' }}>
        <ConfidenceScore result={result} />
      </div>

    </div>
  );
}