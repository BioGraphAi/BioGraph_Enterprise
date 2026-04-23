import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip 
} from 'recharts';

// --- 1. Enhanced Tooltip with Warning Logic ---
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload.find(p => p.name === 'Drug Candidate')?.payload;
    if (!data) return null;

    // Check if current metric violates safe limit
    const isViolation = data.A > data.ideal;

    return (
      <div style={{
        background: 'var(--bg-elevated)',
        border: `1px solid ${isViolation ? 'var(--status-error)' : 'var(--border-default)'}`,
        padding: '11px',
        borderRadius: 'var(--radius-sm)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
        minWidth: '150px',
        backdropFilter: 'blur(10px)'
      }}>
        <p style={{ color: '#fff', fontSize: '13px', margin: '0 0 8px 0', fontWeight: 'bold', borderBottom:'1px solid #333', paddingBottom:'4px' }}>
          {data.subject} {isViolation ? '⚠️' : '✅'}
        </p>
        
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'4px' }}>
          <span style={{color:'#888'}}>Detected:</span>
          <span style={{color: isViolation ? 'var(--status-error)' : 'var(--text-secondary)', fontWeight: 600}}>{data.fullMark}</span>
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'6px' }}>
          <span style={{color:'#888'}}>Ideal Range:</span>
          <span style={{color:'var(--status-success)', fontSize:'11px'}}>{data.limit}</span>
        </div>

        <div style={{ fontSize: '10px', color: isViolation ? '#ff99aa' : '#666', fontStyle:'italic' }}>
          {isViolation ? 'Critical Violation: ' : ''}{data.desc}
        </div>
      </div>
    );
  }
  return null;
};

export default function AdmetChart({ admet }) {
  if (!admet) return <div style={{color:'#666', textAlign:'center', marginTop:'50px', fontSize:'12px'}}>Awaiting Molecule Data...</div>;

  const formatData = (val, max) => {
    if (val === undefined || val === null) return 0;
    return Math.min(100, (val / max) * 100);
  };

  // Mapping with Violation Markers
  const data = [
    { subject: 'LIPO', A: formatData(admet.logp, 8), fullMark: admet.logp, limit: '< 5.0', ideal: 62.5, desc: 'Lipophilicity' },
    { subject: 'SIZE', A: formatData(admet.mw, 800), fullMark: `${admet.mw} g/mol`, limit: '< 500', ideal: 62.5, desc: 'Molecular Weight' },
    { subject: 'POLAR', A: formatData(admet.tpsa, 200), fullMark: `${admet.tpsa} Å²`, limit: '< 140', ideal: 70, desc: 'Polar Surface Area' },
    { subject: 'INSOLU', A: formatData(admet.hba, 15), fullMark: admet.hba, limit: '< 10', ideal: 66, desc: 'H-Bond Acceptors' },
    { subject: 'H-DONOR', A: formatData(admet.hbd, 10), fullMark: admet.hbd, limit: '< 5', ideal: 50, desc: 'H-Bond Donors' },
    { subject: 'FLEX', A: formatData(admet.rotatable_bonds, 15), fullMark: admet.rotatable_bonds, limit: '< 10', ideal: 66, desc: 'Rotatable Bonds' },
    { subject: 'DRUG-LIKE', A: (admet.qed || 0) * 100, fullMark: admet.qed?.toFixed(2), limit: '> 0.5', ideal: 50, desc: 'QED Score' },
  ];

  const totalViolations = data.filter(d => d.A > d.ideal).length;

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px', position: 'relative' }}>
      
      {/* Title & Dynamic Status */}
      <div style={{ position: 'absolute', top: 0, left: 10, zIndex: 5 }}>
         <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.5px', fontWeight: 600 }}>
            BIOAVAILABILITY RADAR
         </div>
         <div style={{ fontSize: '10px', fontWeight: 'bold', marginTop:'2px' }}>
            Status: <span style={{ color: totalViolations > 0 ? 'var(--status-error)' : 'var(--status-success)', fontWeight: 600 }}>
              {totalViolations > 0 ? `⚠️ ${totalViolations} Violations` : '✅ Optimal'}
            </span>
         </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          
          <PolarGrid stroke="rgba(255,255,255,0.05)" />
          
          <PolarAngleAxis 
            dataKey="subject" 
            tick={({ x, y, payload }) => {
              const item = data.find(d => d.subject === payload.value);
              const isBad = item.A > item.ideal;
              return (
                <text x={x} y={y} textAnchor="middle" fill={isBad ? 'var(--status-error)' : 'var(--text-muted)'} fontSize={9} fontWeight="bold">
                  {payload.value}
                </text>
              );
            }} 
          />
          
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

          {/* 1. IDEAL ZONE (Safe Boundary) */}
          <Radar
            name="Safe Limit"
            dataKey="ideal"
            stroke="rgba(74, 222, 128, 0.4)"
            strokeDasharray="4 4"
            fill="#4ade80"
            fillOpacity={0.06}
          />

          {/* 2. ACTUAL DRUG DATA (With Dynamic Color) */}
          <Radar
            name="Drug Candidate"
            dataKey="A"
            stroke={totalViolations > 2 ? 'var(--status-error)' : 'var(--text-primary)'}
            strokeWidth={2}
            fill={totalViolations > 2 ? 'var(--status-error)' : 'var(--text-primary)'}
            fillOpacity={totalViolations > 2 ? 0.2 : 0.15}
            isAnimationActive={true}
            dot={({ cx, cy, payload }) => {
              if (payload.A > payload.ideal) {
                return <circle cx={cx} cy={cy} r={4} fill="var(--status-error)" className="pulse-red" />;
              }
              return <circle cx={cx} cy={cy} r={2} fill="var(--text-secondary)" />;
            }}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={false} />
          
        </RadarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ 
        position:'absolute', bottom:0, width:'100%', 
        display:'flex', justifyContent:'center', gap:'15px', fontSize:'9px', color:'#666' 
      }}>
         <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
            <div style={{width:'7px', height:'7px', background:'rgba(74, 222, 128, 0.1)', border:'1px solid rgba(74, 222, 128, 0.4)'}}></div>
            <span>Ideal Zone</span>
         </div>
         <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
            <div style={{width:'7px', height:'7px', background: totalViolations > 2 ? 'rgba(248,113,113,0.2)' : 'rgba(255, 255, 255, 0.1)', border: totalViolations > 2 ? '1px solid var(--status-error)' : '1px solid var(--border-default)'}}></div>
            <span>Your Molecule {totalViolations > 0 && " (Warning)"}</span>
         </div>
      </div>

      <style>{`
        .pulse-red { animation: pulseWarning 1.5s infinite; filter: drop-shadow(0 0 5px #ff0055); }
        @keyframes pulseWarning { 0% { r: 3; opacity: 1; } 50% { r: 5; opacity: 0.5; } 100% { r: 3; opacity: 1; } }
      `}</style>

    </div>
  );
}