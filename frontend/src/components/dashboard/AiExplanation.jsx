import React, { useEffect, useState } from 'react';
import { Bot, Sparkles, BrainCircuit } from 'lucide-react';

export default function AiExplanation({ result }) {
  const [text, setText] = useState("");
  
  // Backend se aya hua text
  const fullText = result.ai_explanation || "Waiting for AI analysis...";

  // Typing Effect Logic
  useEffect(() => {
    setText("");
    if(!fullText) return;

    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 15); // Typing speed
    return () => clearInterval(interval);
  }, [fullText]);

  if (!result.ai_explanation) return null;

  return (
    <div style={{
      marginTop: '20px',
      padding: '20px',
      background: 'linear-gradient(90deg, rgba(188, 19, 254, 0.05), rgba(0, 243, 255, 0.05))',
      borderLeft: '4px solid #bc13fe', // Purple AI Color
      borderRadius: '8px',
      width: '100%',
      maxWidth: '800px',
      boxShadow: '0 4px 20px rgba(188, 19, 254, 0.15)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <BrainCircuit size={20} color="#bc13fe" />
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', letterSpacing: '1px' }}>
          GENERATIVE AI DOCTOR (GEMINI)
        </span>
        <Sparkles size={14} color="#00f3ff" className="animate-pulse" />
      </div>

      {/* Content */}
      <div style={{ color: '#e0e0e0', fontSize: '13px', lineHeight: '1.6', fontFamily: 'sans-serif' }}>
        {text}
        <span style={{color: '#bc13fe', animation: 'blink 1s infinite'}}>|</span>
      </div>
      
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}