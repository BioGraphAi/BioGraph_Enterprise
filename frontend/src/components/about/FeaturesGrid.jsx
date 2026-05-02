import React from 'react';
import { Brain, Magnet, ShieldCheck, Atom, RefreshCw, Activity, Network, FlaskConical } from 'lucide-react';

export default function FeaturesGrid() {

  const features = [
    {
      icon: <Brain size={28} />,
      title: "AI-Driven GNN Model",
      desc: "DeepDrugNet V4 — Graph Attention Network predicts drug-target binding affinity (pKd) with high accuracy using molecular graph representations.",
      color: '#6366f1'
    },
    {
      icon: <Magnet size={28} style={{ transform: 'rotate(45deg)' }} />,
      title: "Binding Affinity Scores",
      desc: "Quantifies the binding strength between drug ligands and protein targets using predicted pKd scores on a 4–12 scale.",
      color: '#a855f7'
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "ADMET Safety Verdict",
      desc: "Full physicochemical profiling: Lipinski Rule-of-5, QED Drug-Likeness Score, TPSA, and instant toxicity/safety classification.",
      color: '#10b981'
    },
    {
      icon: <Network size={28} />,
      title: "3D Knowledge Graph",
      desc: "Interactive 3D-Force-Graph visualizing Drug–Protein–Disease relationships with color-coded binding affinity and real-time search.",
      color: '#00f3ff'
    },
    {
      icon: <RefreshCw size={28} />,
      title: "Drug Repurposing Engine",
      desc: "Screens entire drug databases against any PDB target to discover novel therapeutic uses for FDA-approved compounds.",
      color: '#f59e0b'
    },
    {
      icon: <Activity size={28} />,
      title: "LLM Intelligence Layer",
      desc: "OpenRouter GPT-4o generates structured scientific insights: mechanism of action, safety assessment, and clinical implications.",
      color: '#ec4899'
    },
    {
      icon: <FlaskConical size={28} />,
      title: "PubChem & RCSB Integration",
      desc: "Real-time molecular data via PubChem API. Protein sequences fetched live from RCSB PDB for accurate drug-target pairing.",
      color: '#8b5cf6'
    },
    {
      icon: <Atom size={28} />,
      title: "3D Protein Visualizer",
      desc: "Embedded NGL/Mol* viewer renders full 3D protein structures from PDB IDs for interactive drug-binding site exploration.",
      color: '#06b6d4'
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      {features.map((f, index) => (
        <div key={index} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: '14px',
          padding: '20px 22px',
          transition: 'all 0.2s ease',
          cursor: 'default',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.boxShadow = `0 4px 20px ${f.color}22`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{ color: f.color, marginBottom: '12px' }}>{f.icon}</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{f.title}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{f.desc}</div>
        </div>
      ))}
    </div>
  );
}