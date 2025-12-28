import React from 'react';
import { MessageSquare, Sparkles, BrainCircuit, Activity, Box } from 'lucide-react'; // ❌ Box hata dein
import { apiClient } from '../../api/client';
import AdmetChart from './AdmetChart';
import AiExplanation from './AiExplanation';

export default function SingleResultDisplay({ result, chatResponse }) {
  if (!result) return null;

  // 1. GLOBAL STYLE CONFIGURATION
  const styles = {
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr', 
      gridTemplateRows: 'minmax(400px, 1fr) minmax(400px, 1fr)', 
      gap: '25px', 
      padding: '25px',
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
    },
    panel: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: `1px solid ${result.color}20`,
      borderRadius: '24px', 
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden', 
      position: 'relative',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(5px)',
    },
    label: (isLeft = false) => ({
      position: 'absolute',
      top: '15px',
      [isLeft ? 'left' : 'right']: '20px', 
      color: isLeft ? '#00f3ff' : result.color,
      fontSize: '11px',
      fontWeight: 'bold',
      letterSpacing: '1px',
      opacity: 0.8,
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    })
  };

  return (
    <div className="fade-in-text" style={{ width: '100%', height: '100%', overflowY: 'auto' }}>

      {/* MAIN SYMMETRIC GRID */}
      <div style={styles.gridContainer}>
          
          {/* --- PANEL 1: AI ANALYSIS (Top Left) --- */}
          <div style={styles.panel}>
             <div style={{ flex: 1, overflow: 'hidden' }}>
                <AiExplanation result={result} />
             </div>
          </div>

          {/* --- PANEL 2: CHEMICAL STRUCTURE (Top Right) --- */}
          <div style={styles.panel}>
            <div style={styles.label()}>
              <Box size={14}/> 2D STRUCTURE
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <img 
                  src={apiClient.getImageUrl(result.smiles)} 
                  alt="Structure"
                  style={{ 
                    width: '90%', 
                    maxHeight: '250px', 
                    objectFit: 'contain', 
                    filter: `invert(1) brightness(2) drop-shadow(0 0 15px ${result.color})`,
                    marginBottom: '15px'
                  }}
              />
              <div style={{ 
                  color: '#888', fontSize: '11px', fontFamily: 'monospace', 
                  textAlign: 'center', wordBreak: 'break-all', maxWidth: '90%', 
                  background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px'
              }}>
                  {result.smiles}
              </div>
            </div>
          </div>

          {/* --- PANEL 3: AI CHAT ASSISTANT (Bottom Left) --- */}
          <div style={styles.panel}>
             <div style={styles.label(true)}>
                 <MessageSquare size={14} /> AI ASSISTANT
             </div>

             <div style={{ flex: 1, padding: '50px 25px 25px 25px', overflowY: 'auto', fontSize: '14px', lineHeight: '1.6', color: '#e0e0e0' }}>
                {chatResponse ? (
                    <div className="fade-in-text" style={{ whiteSpace: 'pre-wrap' }}>
                        {chatResponse}
                    </div>
                ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                        <Sparkles size={40} style={{ marginBottom: '15px', color: '#00f3ff' }} />
                        <div style={{ textAlign: 'center' }}>
                           ASK AI DOCTOR<br/>
                           <span style={{ fontSize: '12px' }}>Use the central input bar to chat.</span>
                        </div>
                    </div>
                )}
             </div>
          </div>

          {/* --- PANEL 4: ADMET RADAR CHART (Bottom Right) --- */}
          <div style={styles.panel}>
             {/* Label Change Kiya */}
             <div style={styles.label()}>
                 <Activity size={14} /> ADMET RADAR CHART
             </div>

             {/* ✅ Sirf Radar Chart yahan show hoga */}
             <div style={{ 
               flex: 1, 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center', 
               padding: '20px',
               overflow: 'hidden' // Taake chart bahar na nikle
             }}>
                <div style={{ width: '100%', height: '100%', display:'flex', justifyContent:'center', alignItems:'center' }}>
                   <AdmetChart admet={result.admet} color={result.color} />
                </div>
             </div>
          </div>

      </div>
    </div>
  );
}