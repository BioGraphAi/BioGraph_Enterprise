import React from 'react';
import { apiClient } from '../../api/client';
import AdmetChart from './AdmetChart';
import PharmacophoreViewer from './PharmacophoreViewer';
import AiExplanation from './AiExplanation';
import DrugChat from './DrugChat'; // ✅ Import

export default function SingleResultDisplay({ result }) {
  if (!result) return null;

  return (
    <div className="large-molecule-display fade-in-text" style={{ 
      width: '100%', height:'100%', 
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start', // Top align for scrolling
      gap: '20px', padding: '20px', overflowY: 'auto'
    }}>
       
       <h2 style={{ color: result.color, textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
         {result.name}
       </h2>

       {/* Grid: Image + Chart */}
       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', maxWidth: '900px', gap: '40px' }}>
          {/* Left: Molecule Image */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img 
                src={apiClient.getImageUrl(result.smiles)} 
                alt="Structure"
                style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', filter: `invert(1) brightness(2) drop-shadow(0 0 15px ${result.color})` }}
            />
          </div>
          {/* Right: Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <AdmetChart admet={result.admet} color={result.color} />
          </div>
       </div>

       {/* ✅ NEW: Chat Bar (Center) */}
       <DrugChat result={result} />

       {/* LLM Explanation */}
       <AiExplanation result={result} />

       {/* Pharmacophores */}
       {result.active_sites && <PharmacophoreViewer activeSites={result.active_sites} />}
       
    </div>
  );
}