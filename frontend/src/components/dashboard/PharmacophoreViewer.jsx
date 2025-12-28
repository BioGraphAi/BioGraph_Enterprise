import React from 'react';
import { Crosshair, Droplet, Zap, Hexagon } from 'lucide-react';

export default function PharmacophoreViewer({ activeSites }) {
  if (!activeSites || activeSites.length === 0) return null;

  // Real Science Icons
  const getIcon = (type) => {
    switch(type) {
      case 'Donor': return <Zap size={14} color="#00f3ff" />; // H-Bond Donor
      case 'Acceptor': return <Droplet size={14} color="#ff0055" />; // H-Bond Acceptor
      case 'Aromatic': return <Hexagon size={14} color="#bc13fe" />; // Aromatic Ring
      default: return <Crosshair size={14} color="#888" />;
    }
  };

  return (
    <div style={{ marginTop: '20px', width: '100%', maxWidth: '800px' }}>
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', 
        borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' 
      }}>
        <Crosshair size={18} color="#00ff66" />
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', letterSpacing: '1px' }}>
          DETECTED PHARMACOPHORES (REAL-TIME)
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
        {activeSites.slice(0, 6).map((site, idx) => (
          <div key={idx} style={{ 
            background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px' }}>
              {getIcon(site.type)}
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>{site.type}</div>
              <div style={{ color: '#666', fontSize: '9px' }}>Atoms: {site.atoms.join(', ')}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '10px', color: '#555', fontStyle: 'italic' }}>
        *Mapped using RDKit Feature Factory (BaseFeatures.fdef)
      </div>
    </div>
  );
}