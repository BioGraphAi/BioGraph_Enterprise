import React from 'react';
import { Dna } from 'lucide-react';

export default function AboutHero() {
  return (
    <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 9999 }}>
      
      <div style={{ 
        height: '110px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent), #a855f7)',
          padding: '22px',
          borderRadius: '24px',
          boxShadow: '0 12px 35px rgba(99, 102, 241, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Dna size={56} color="#ffffff" strokeWidth={2} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <span className="brand-text" style={{ 
            fontSize: '46px', 
            fontWeight: 800, 
            letterSpacing: '-1.5px', 
            margin: 0, 
            lineHeight: '1.2',
            background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
        }}>BioGraph</span>
        <span style={{ 
          fontSize: '15px', 
          fontWeight: 600,
          letterSpacing: '1px',
          background: 'linear-gradient(90deg, var(--accent), #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textTransform: 'uppercase'
        }}>
          The Universal Drug Repurposing Engine
        </span>
      </div>
    </div>
  );
}