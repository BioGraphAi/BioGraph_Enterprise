import React from 'react';

export default function AdmetChart({ admet, color }) {
  if (!admet) return null;

  // 1. Data Definitions (Tooltips)
  const definitions = {
    'MW': "Molecular Weight: Dawa ka wazan. (Target: < 500 g/mol)",
    'LogP': "Lipophilicity: Charbi/Pani mein ghulne ki taqat. (Target: < 5)",
    'TPSA': "Polar Surface Area: Jism mein jazb (absorb) honay ki salahiyat.",
    'QED': "Drug-likeness Score: Dawa banne ki overall quality (0 se 1 tak).",
    'HBD': "H-Bond Donors: Solubility ke liye zaroori factor.",
    'HBA': "H-Bond Acceptors: Protein se judne ke liye zaroori."
  };

  // 2. Data Normalization
  const data = [
    { label: 'MW', value: admet.mw, max: 600 },
    { label: 'LogP', value: Math.max(0, admet.logp + 2), max: 8 },
    { label: 'TPSA', value: admet.tpsa, max: 160 },
    { label: 'QED', value: admet.qed * 100, max: 100 },
    { label: 'HBD', value: admet.hbd * 20, max: 100 },
    { label: 'HBA', value: admet.hba * 10, max: 100 }
  ];

  const size = 200;
  const center = size / 2;
  const radius = 80;
  const angleSlice = (Math.PI * 2) / data.length;

  // Helper: Coordinates
  const getCoordinates = (value, max, index) => {
    const r = (Math.min(value, max) / max) * radius;
    const angle = index * angleSlice - Math.PI / 2;
    return {
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r
    };
  };

  const getPolyPoints = (r) => {
    return data.map((_, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
    }).join(' ');
  };

  const points = data.map((d, i) => getCoordinates(d.value, d.max, i));
  const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        
        {/* Grid */}
        <polygon points={getPolyPoints(radius)} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <polygon points={getPolyPoints(radius * 0.75)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <polygon points={getPolyPoints(radius * 0.5)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

        {/* Axis Lines */}
        {points.map((_, i) => {
          const outer = getCoordinates(data[i].max, data[i].max, i);
          return <line key={i} x1={center} y1={center} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.1)" />;
        })}

        {/* Data Shape */}
        <polygon points={polyPoints} fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2" />
        {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#fff" />)}

        {/* ✅ Labels with Tooltips (!) */}
        {data.map((d, i) => {
          const pos = getCoordinates(d.max * 1.25, d.max, i);
          return (
            <g key={i} style={{ cursor: 'help' }}>
              <title>{definitions[d.label]}</title> {/* Native Tooltip */}
              <text 
                x={pos.x} y={pos.y} 
                fill="#888" fontSize="10" textAnchor="middle" alignmentBaseline="middle"
                style={{ fontWeight: 'bold' }}
              >
                {d.label} <tspan fill={color} fontSize="9">!</tspan>
              </text>
            </g>
          );
        })}

      </svg>
    </div>
  );
}