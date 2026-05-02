import React from 'react';
import { ShieldCheck, AlertTriangle, ChevronRight } from 'lucide-react';

// Same disease map as KnowledgeGraph for consistency
const DISEASE_MAP = {
  '6lu7': 'COVID-19', '1hsg': 'HIV/AIDS', '4w9h': 'Type 2 Diabetes',
  '2hhi': 'Metabolic Syndrome', '3eiy': "Alzheimer's", '1aoi': 'Cancer',
  '1a9m': 'Malaria', '4j28': 'Breast Cancer', '2w1i': 'Rheumatoid Arthritis',
  '3htb': 'Hypertension', '5hhb': 'Sickle Cell Anemia', '1phg': "Parkinson's",
};

export default function BatchResultList({ results, aiThreshold, onItemClick, targetId }) {
  const activeResults = results.filter(r => r.score >= aiThreshold);
  const disease = targetId ? (DISEASE_MAP[targetId.toLowerCase()] || 'Potential Therapeutic Target') : '—';

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', background: 'transparent' }}>

      {/* ── Summary Header ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5,
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px', flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Drug Name
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#00ff88' }}>
              {activeResults.length} Active Leads
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ {results.length} Total</span>
          </div>
        </div>

        {/* Drug-Disease Connection Banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: '8px', padding: '5px 12px'
        }}>
          <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            🔗 Drug-Disease Connection
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>
            {disease}
          </span>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '80px', textAlign: 'right' }}>
          pKd Score
        </div>
      </div>

      {/* ── List Items ── */}
      <div style={{ padding: '8px' }}>
        {results.map((item, index) => {
          const isActive = item.score >= aiThreshold;
          const scoreColor = item.score >= 8.5 ? '#00ff88' : item.score >= 7.0 ? '#ffd700' : '#ff4b4b';

          return (
            <div
              key={index}
              onClick={() => onItemClick(item)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', marginBottom: '4px',
                borderRadius: '10px', cursor: 'pointer',
                background: 'var(--bg-surface)',
                border: `1px solid ${isActive ? 'rgba(0,255,136,0.12)' : 'var(--border-subtle)'}`,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = scoreColor; e.currentTarget.style.transform = 'translateX(2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = isActive ? 'rgba(0,255,136,0.12)' : 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateX(0)'; }}
            >
              {/* Rank + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, minWidth: '24px' }}>
                  #{index + 1}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>{item.name}</div>
                  {/* Drug-Disease link */}
                  {isActive && (
                    <div style={{ fontSize: '10px', color: '#f59e0b', marginTop: '2px' }}>
                      → {disease}
                    </div>
                  )}
                </div>
              </div>

              {/* Safety badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
                {item.admet && (
                  <span title={item.admet.is_safe ? 'ADMET Safe' : 'ADMET Caution'}>
                    {item.admet.is_safe
                      ? <ShieldCheck size={14} color="#10b981" />
                      : <AlertTriangle size={14} color="#ef4444" />}
                  </span>
                )}

                {/* Status badge */}
                <span style={{
                  fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px',
                  background: isActive ? 'rgba(0,255,136,0.1)' : 'rgba(255,75,75,0.08)',
                  color: isActive ? '#00ff88' : '#ff4b4b',
                  border: `1px solid ${isActive ? 'rgba(0,255,136,0.2)' : 'rgba(255,75,75,0.15)'}`,
                }}>
                  {isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>

                {/* Score */}
                <span style={{ fontWeight: 800, fontSize: '15px', color: scoreColor, minWidth: '36px', textAlign: 'right' }}>
                  {item.score}
                </span>

                <ChevronRight size={14} color="var(--text-muted)" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}