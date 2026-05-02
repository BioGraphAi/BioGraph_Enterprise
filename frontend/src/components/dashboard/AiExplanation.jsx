import React from 'react';
import { BrainCircuit, Sparkles, FileText, Shield, Activity, Target } from 'lucide-react';

// Section helper
const Section = ({ icon: Icon, title, content, accent }) => (
  <div style={{ marginBottom: '14px', animation: 'fadeIn 0.4s ease-in' }}>
    <div style={{ 
      display: 'flex', alignItems: 'center', gap: '7px',
      marginBottom: '5px', color: accent || 'var(--text-secondary)', fontSize: '11px',
      fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'
    }}>
      <Icon size={12} /> {title}
    </div>
    <div style={{ 
      fontSize: '12px', color: 'var(--text-primary)', lineHeight: '1.6',
      background: 'var(--bg-tertiary)', padding: '10px 12px',
      borderRadius: 'var(--radius-sm)', borderLeft: '2px solid var(--border-strong)'
    }}>
      {content || 'N/A'}
    </div>
  </div>
);

export default function AiExplanation({ result }) {
  const explanation = result?.ai_explanation;

  if (!explanation) return (
    <div style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center' }}>
      Waiting for AI analysis...
    </div>
  );

  const displayedData = typeof explanation === 'object' ? explanation : { summary: explanation };

  return (
    <div style={{ 
      height: '100%', width: '100%',
      display: 'flex', flexDirection: 'column',
      padding: '14px',
      background: 'var(--bg-tertiary)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxSizing: 'border-box', overflow: 'hidden'
    }}>
      
      {/* Header */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '10px', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BrainCircuit size={16} color="var(--text-secondary)" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.3px' }}>
            BioGraph Intelligence
          </span>
        </div>
        <Sparkles size={13} color="var(--text-muted)" className="animate-pulse" />
      </div>

      {/* Scrollable Content */}
      <div className="custom-scroll" style={{ flex: 1, width: '100%', overflowY: 'auto', paddingRight: '4px' }}>
        {displayedData.summary      && <Section icon={FileText}  title="Executive Summary"       content={displayedData.summary}                                                       />}
        {displayedData.mechanism    && <Section icon={Activity}  title="Mechanism of Action"     content={displayedData.mechanism}                                                     />}
        {(displayedData.safety_analysis || displayedData.safety) && <Section icon={Shield} title="Safety Profile (ADMET)"  content={displayedData.safety_analysis || displayedData.safety}  />}
        {(displayedData.clinical || displayedData.clinical_potential) && <Section icon={Target} title="Clinical Implications" content={displayedData.clinical || displayedData.clinical_potential} />}
        {(displayedData.conclusion)  && <Section icon={Target}   title="Final Verdict"           content={displayedData.conclusion}                                                    />}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 99px; }
      `}</style>
    </div>
  );
}