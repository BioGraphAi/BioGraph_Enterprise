import React, { useEffect, useState } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';

export default function AiExplanation({ result }) {
  const [text, setText] = useState("");
  const fullText = result?.ai_explanation || "Waiting for Llama 3 analysis..."; // ✅ Name Fixed

  useEffect(() => {
    setText("");
    if(!fullText) return;

    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 5); 
    return () => clearInterval(interval);
  }, [fullText]);

  if (!result?.ai_explanation) return null;

  return (
    <div style={{ 
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '15px',
      background: 'linear-gradient(135deg, rgba(188, 19, 254, 0.05), rgba(0, 243, 255, 0.05))',
      borderLeft: '4px solid #00f3ff', // ✅ Cyan Color for Llama
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 243, 255, 0.1)',
      boxSizing: 'border-box',
      overflow: 'hidden' 
    }}>
      
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        marginBottom: '10px',
        borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
        paddingBottom: '8px',
        flexShrink: 0 
      }}>
        <BrainCircuit size={20} color="#00f3ff" />
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', letterSpacing: '1px' }}>
          GENERATIVE AI DOCTOR (LLAMA 3) {/* ✅ Name Fixed */}
        </span>
        <Sparkles size={14} color="#bc13fe" className="animate-pulse" />
      </div>

      <div className="custom-scroll" style={{ 
        flex: 1, 
        width: '100%',           
        overflowY: 'auto',       
        overflowX: 'hidden',     
        paddingRight: '5px'
      }}>
        <div style={{ 
          color: '#e0e0e0', 
          fontSize: '13px', 
          lineHeight: '1.6', 
          fontFamily: 'sans-serif',
          width: '100%',         
          whiteSpace: 'pre-wrap',   
          wordBreak: 'break-word',  
          overflowWrap: 'anywhere', 
          boxSizing: 'border-box'   
        }}>
          {text}
          <span style={{color: '#00f3ff', animation: 'blink 1s infinite', marginLeft:'2px'}}>|</span>
        </div>
      </div>
      
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(0, 243, 255, 0.3); borderRadius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0, 243, 255, 0.6); }
      `}</style>
    </div>
  );
}