import React from 'react';

// ✅ Component 1: Binding Score (Left Side)
export function BindingScore({ result }) {
  return (
    <div className="score-box" style={{ textAlign: 'left', minWidth: '80px' }}>
      <div className="input-label" style={{color: result.color, fontSize: '10px', letterSpacing:'1px', marginBottom:'2px'}}>BINDING</div>
      <div className="score-val fade-in-text" style={{ textShadow: `0 0 20px ${result.color}`, lineHeight: '1', fontSize: '32px' }}>{result.score}</div>
      <div style={{ fontSize: '9px', color: '#666', marginTop: '5px', fontWeight: 'bold' }}>pKd VALUE</div>
    </div>
  );
}

// ✅ Component 2: Confidence Score (Right Side)
export function ConfidenceScore({ result }) {
  return (
    <div className="score-box" style={{ textAlign: 'right', minWidth: '80px' }}>
      <div className="input-label" style={{color: result.color, fontSize: '10px', letterSpacing:'1px', marginBottom:'2px'}}>CONFIDENCE</div>
      <div className="score-val fade-in-text" style={{ fontSize: '28px', fontWeight:'800', color: '#fff', textShadow: `0 0 15px ${result.color}80`, lineHeight: '1' }}>
          {result.confidence || "N/A"}
      </div>
      <div style={{ fontSize: '9px', color: '#888', marginTop: '5px', fontWeight: 'bold', letterSpacing: '0.5px' }}>AI PROBABILITY</div>
    </div>
  );
}