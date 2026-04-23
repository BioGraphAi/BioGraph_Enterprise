import React from 'react';

export default function BatchResultList({ results, aiThreshold, onItemClick }) {
  return (
    <div className="scan-results-list" style={{ width: '100%', height: '100%', overflowY: 'auto', background: 'transparent' }}>
       
       {/* Sticky Header */}
       <div className="list-header" style={{
         position: 'sticky', top: 0,
         background: 'var(--bg-secondary)',
         borderBottom: '1px solid var(--border-subtle)',
         padding: '12px 20px'
       }}>
          <div>Drug Name</div><div>Score</div>
       </div>
       
       {/* List Items */}
       <div style={{ padding: '8px' }}>
          {results.map((item, index) => {
             const isItemActive = item.score >= aiThreshold;
             return (
               <div 
                 key={index} 
                 onClick={() => onItemClick(item)} 
                 className="scan-item"
               >
                  <div className="drug-name">{item.name}</div>
                  <div style={{ 
                    fontWeight: 700, fontSize: '15px',
                    color: isItemActive ? 'var(--status-success)' : 'var(--status-error)'
                  }}>{item.score}</div>
               </div>
             );
          })}
       </div>
    </div>
  );
}