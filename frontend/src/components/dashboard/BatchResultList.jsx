import React from 'react';

export default function BatchResultList({ results, aiThreshold, onItemClick }) {
  return (
    <div className="scan-results-list" style={{ width: '100%', height: '100%', overflowY: 'auto', background: 'rgba(0,0,0,0.2)' }}>
       
       {/* Sticky Header */}
       <div className="list-header" style={{ position: 'sticky', top: 0, background: 'rgba(5, 5, 10, 0.95)', borderBottom: '1px solid #00f3ff', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', color: '#00f3ff', fontWeight: 'bold' }}>
          <div>DRUG NAME</div><div>SCORE</div>
       </div>
       
       {/* List Items */}
       <div style={{ padding: '10px' }}>
          {results.map((item, index) => {
             const isItemActive = item.score >= aiThreshold;
             return (
               <div 
                 key={index} 
                 onClick={() => onItemClick(item)} 
                 style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', marginBottom: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', cursor: 'pointer' }}
               >
                  <div style={{ fontWeight: 'bold', color: '#fff' }}>{item.name}</div>
                  <div style={{ color: isItemActive ? '#00f3ff' : '#ff0055' }}>{item.score}</div>
               </div>
             );
          })}
       </div>
    </div>
  );
}