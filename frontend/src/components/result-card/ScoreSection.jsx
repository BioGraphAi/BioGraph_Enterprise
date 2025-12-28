import React from 'react';

export default function ScoreSection({ result }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          
      {/* 1. Binding Score */}
      <div className="score-box" style={{ textAlign: 'left' }}>
        <div className="input-label" style={{color: result.color, fontSize: '10px', letterSpacing:'1px', marginBottom:'2px'}}>BINDING</div>
        <div className="score-val fade-in-text" style={{ textShadow: `0 0 20px ${result.color}`, lineHeight: '1' }}>{result.score}</div>
        <div style={{ fontSize: '10px', color: '#666', marginTop: '5px', fontWeight: 'bold' }}>pKd VALUE</div>
      </div>

      {/* Divider */}
      <div className="vertical-div" style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.15)' }}></div>

      {/* 2. Confidence Score */}
      <div className="score-box" style={{ textAlign: 'left' }}>
        <div className="input-label" style={{color: result.color, fontSize: '10px', letterSpacing:'1px', marginBottom:'2px'}}>CONFIDENCE</div>
        <div className="score-val fade-in-text" style={{ fontSize: '28px', fontWeight:'800', color: '#fff', textShadow: `0 0 15px ${result.color}80`, lineHeight: '1' }}>
            {result.confidence || "N/A"}
        </div>
        <div style={{ fontSize: '10px', color: '#888', marginTop: '5px', fontWeight: 'bold', letterSpacing: '0.5px' }}>AI PROBABILITY</div>
      </div>

    </div>
  );
}