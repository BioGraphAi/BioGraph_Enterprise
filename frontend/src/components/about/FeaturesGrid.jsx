import React from 'react';
import { Brain, Magnet, ShieldCheck, Atom, RefreshCw, Activity } from 'lucide-react';

export default function FeaturesGrid() {
  
  // Feature Data Array (Easy to edit)
  const features = [
    { icon: <Brain size={30} />, title: "AI-Driven GNNs", desc: "Advanced Graph Neural Networks (GNNs) analyze molecular graphs to predict drug-target interactions." },
    { icon: <Magnet size={30} style={{ transform: 'rotate(45deg)' }} />, title: "Binding Affinity", desc: "Quantifies the binding strength (Kd/Ki) between ligands and protein pockets." },
    { icon: <ShieldCheck size={30} />, title: "ADMET & Safety", desc: "Comprehensive profiling of Absorption, Toxicity, and Drug-Likeness (QED)." },
    { icon: <Atom size={30} />, title: "3D Visualization", desc: "Interactive molecular rendering engine to inspect chemical structures." },
    { icon: <RefreshCw size={30} />, title: "Drug Repurposing", desc: "Screening libraries of existing FDA-approved drugs to identify novel therapeutic uses." },
    { icon: <Activity size={30} />, title: "Smart Analytics", desc: "Instant graphical analysis using Radar Charts to visualize multi-parameter scores." }
  ];

  return (
    <div className="features-grid">
      {features.map((f, index) => (
        <div key={index} className="feature-card">
          <div className="f-icon">{f.icon}</div>
          <div className="f-title">{f.title}</div>
          <div className="f-desc">{f.desc}</div>
        </div>
      ))}
    </div>
  );
}