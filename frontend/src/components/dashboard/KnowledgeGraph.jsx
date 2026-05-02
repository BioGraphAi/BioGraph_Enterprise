import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { Search, Camera, RefreshCw, X } from 'lucide-react';

// ── Disease database: maps PDB target IDs to known disease associations ──
const DISEASE_MAP = {
  '6lu7': ['COVID-19', 'SARS-CoV-2'],
  '1hsg': ['HIV/AIDS', 'Retroviral Infection'],
  '4w9h': ['Type 2 Diabetes', 'Obesity'],
  '2hhi': ['Insulin Resistance', 'Metabolic Syndrome'],
  '3eiy': ['Alzheimer\'s Disease', 'Neurodegeneration'],
  '1aoi': ['Cancer', 'Tumor Growth'],
  '1a9m': ['Malaria', 'Plasmodium Infection'],
  '4j28': ['Breast Cancer', 'ER+ Tumors'],
  '2w1i': ['Rheumatoid Arthritis', 'Inflammation'],
  '3htb': ['Hypertension', 'Cardiovascular Disease'],
  '5hhb': ['Sickle Cell Anemia', 'Hemoglobin Disorders'],
  '1phg': ['Parkinson\'s Disease', 'Neurodegeneration'],
};

function getDiseases(targetId) {
  if (!targetId) return ['Unknown Disease'];
  const key = targetId.toLowerCase();
  return DISEASE_MAP[key] || ['Potential Disease Target', 'Therapeutic Use'];
}

export default function KnowledgeGraph({ targetId, activeDrugs = [] }) {
  const fgRef = useRef();
  const [searchText, setSearchText] = useState('');
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());

  const graphData = useMemo(() => {
    const diseases = getDiseases(targetId);

    // ── 1. Root Node (Target Protein) ──
    const rootNode = {
      id: targetId || 'TARGET',
      name: `Protein: ${targetId || 'Target'}`,
      val: 22,
      color: '#ff4b4b',
      isRoot: true,
      nodeType: 'protein',
    };

    // ── 2. Disease Nodes ──
    const diseaseNodes = diseases.map((d, i) => ({
      id: `disease-${i}`,
      name: d,
      val: 14,
      color: '#f59e0b',
      isRoot: false,
      nodeType: 'disease',
    }));

    // ── 3. Drug Nodes (Top 25 + Bottom 10 for contrast) ──
    const sorted = [...activeDrugs].sort((a, b) => (b.score || 0) - (a.score || 0));
    const topDrugs = sorted.slice(0, 25);
    const bottomDrugs = sorted.slice(-10);
    const displayedDrugs = [...new Map([...topDrugs, ...bottomDrugs].map(d => [d.name, d])).values()];

    const drugNodes = displayedDrugs.map((drug, index) => {
      const score = drug.score || 0;
      let color = '#4a90e2';
      if (score >= 8.5) color = '#00ff88';
      else if (score >= 7.0) color = '#ffd700';
      else color = '#ff4b4b';
      return {
        id: `drug-${index}`,
        name: drug.name || `Drug ${index + 1}`,
        score: score,
        val: Math.max(3, score),
        color: color,
        isRoot: false,
        nodeType: 'drug',
        distance: Math.max(60, 300 - (score * 25)),
        status: drug.status,
        admetSafe: drug.admet?.is_safe,
      };
    });

    // ── 4. Links: Drug → Protein → Disease ──
    const drugLinks = drugNodes.map(node => ({
      source: rootNode.id,
      target: node.id,
      color: node.score >= 7.5 ? 'rgba(0,255,136,0.25)' : 'rgba(255,75,75,0.12)',
      distance: node.distance,
      linkType: 'drug-protein',
    }));

    const diseaseLinks = diseaseNodes.map(d => ({
      source: rootNode.id,
      target: d.id,
      color: 'rgba(245,158,11,0.4)',
      distance: 180,
      linkType: 'protein-disease',
    }));

    return {
      nodes: [rootNode, ...diseaseNodes, ...drugNodes],
      links: [...drugLinks, ...diseaseLinks],
    };
  }, [targetId, activeDrugs]);

  // Auto-rotate
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.controls().autoRotate = true;
      fgRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  // Search & highlight
  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearchText(val);
    if (!val) { setHighlightNodes(new Set()); return; }
    const matched = graphData.nodes.filter(n => n.name.toLowerCase().includes(val));
    setHighlightNodes(new Set(matched.map(n => n.id)));
    if (matched.length === 1 && fgRef.current) {
      const node = matched[0];
      const distance = 100;
      const distRatio = 1 + distance / Math.hypot(node.x || 1, node.y || 1, node.z || 1);
      fgRef.current.cameraPosition(
        { x: (node.x || 0) * distRatio, y: (node.y || 0) * distRatio, z: (node.z || 0) * distRatio },
        node, 1500
      );
    }
  };

  const resetCamera = () => {
    if (fgRef.current) {
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 400 }, { x: 0, y: 0, z: 0 }, 1500);
      setSearchText(''); setHighlightNodes(new Set());
    }
  };

  const exportImage = () => {
    const canvas = document.querySelector('.force-graph-container canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `BioGraph_Network_${targetId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleNodeClick = useCallback(node => {
    if (fgRef.current) {
      const distance = 80;
      const distRatio = 1 + distance / Math.hypot(node.x || 1, node.y || 1, node.z || 1);
      fgRef.current.cameraPosition(
        { x: (node.x || 0) * distRatio, y: (node.y || 0) * distRatio, z: (node.z || 0) * distRatio },
        node, 2000
      );
      if (fgRef.current.controls) fgRef.current.controls().autoRotate = false;
    }
  }, []);

  // Custom 3D nodes for Drugs, Proteins, and Diseases
  const nodeThreeObject = useCallback(node => {
    const group = new THREE.Group();

    let size, shape;
    if (node.nodeType === 'protein') {
      size = 10;
      const geo = new THREE.SphereGeometry(size, 20, 20);
      const mat = new THREE.MeshPhongMaterial({ color: node.color, emissive: node.color, emissiveIntensity: 0.6, transparent: true, opacity: 0.95 });
      shape = new THREE.Mesh(geo, mat);
      // Glow ring for protein
      const ringGeo = new THREE.TorusGeometry(size * 1.6, 0.5, 8, 40);
      const ringMat = new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.2 });
      group.add(new THREE.Mesh(ringGeo, ringMat));
    } else if (node.nodeType === 'disease') {
      size = 6;
      // Diamond shape for disease nodes
      const geo = new THREE.OctahedronGeometry(size, 0);
      const mat = new THREE.MeshPhongMaterial({ color: node.color, emissive: node.color, emissiveIntensity: 0.5, transparent: true, opacity: 0.9 });
      shape = new THREE.Mesh(geo, mat);
    } else {
      // Drug nodes — sphere
      size = Math.max(2, (node.score || 5) * 0.5);
      const geo = new THREE.SphereGeometry(size, 16, 16);
      const mat = new THREE.MeshPhongMaterial({ color: node.color, emissive: node.color, emissiveIntensity: 0.35, transparent: true, opacity: 0.9 });
      shape = new THREE.Mesh(geo, mat);
    }
    group.add(shape);

    // Glow outer for root protein
    if (node.nodeType === 'protein') {
      const glowGeo = new THREE.SphereGeometry(size * 1.8, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.06 });
      group.add(new THREE.Mesh(glowGeo, glowMat));
    }

    // Label sprite
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 280;
    canvas.height = 70;
    ctx.font = `Bold ${node.nodeType === 'protein' ? '22px' : '18px'} Arial`;
    ctx.fillStyle = node.color;
    ctx.textAlign = 'center';
    ctx.fillText(node.name.length > 22 ? node.name.slice(0, 20) + '…' : node.name, 140, 45);
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(0, size + 6, 0);
    sprite.scale.set(22, 6, 1);
    group.add(sprite);

    return group;
  }, []);

  // Count stats
  const activeCount = activeDrugs.filter(d => d.score >= 7.5).length;
  const diseases = getDiseases(targetId);

  return (
    <div style={{
      width: '100%',
      height: '100%',        /* ✅ FIX: was '500px' — now fills parent */
      minHeight: '420px',    /* safety floor so it doesn't collapse */
      background: '#0b0f19', borderRadius: '16px',
      overflow: 'hidden', position: 'relative',
      border: '1px solid #1f2937',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
    }}>

      {/* Title overlay */}
      <div style={{
        position: 'absolute', top: 16, left: 16, zIndex: 10,
        background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)',
        padding: '10px 18px', borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4b4b', display: 'inline-block', boxShadow: '0 0 8px #ff4b4b' }} />
          Drug–Protein–Disease Network
        </h3>
        <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#6b7280' }}>3D Knowledge Graph · {activeDrugs.length} drugs · {diseases.length} diseases</p>
      </div>

      {/* Toolbar */}
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, display: 'flex', gap: '8px' }}>
        <div style={{
          background: 'rgba(11,15,25,0.85)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
          padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '8px',
          width: searchText ? '200px' : '40px', transition: 'width 0.3s ease', overflow: 'hidden'
        }}>
          <Search size={16} color="#9ca3af" style={{ minWidth: '16px' }} />
          <input
            placeholder="Search drug / disease..."
            value={searchText}
            onChange={handleSearch}
            onFocus={() => fgRef.current && (fgRef.current.controls().autoRotate = false)}
            style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '13px', outline: 'none', width: '100%' }}
          />
          {searchText && <X size={14} color="#9ca3af" style={{ cursor: 'pointer' }} onClick={() => { setSearchText(''); setHighlightNodes(new Set()); }} />}
        </div>
        <button onClick={resetCamera} title="Reset View" style={{ background: 'rgba(11,15,25,0.85)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <RefreshCw size={18} />
        </button>
        <button onClick={exportImage} title="Export Snapshot" style={{ background: 'var(--accent)', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,243,255,0.25)' }}>
          <Camera size={18} />
        </button>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 16, right: 16, zIndex: 10,
        background: 'rgba(11,15,25,0.8)', padding: '12px 16px', borderRadius: '12px',
        backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)',
      }}>
        {[
          { color: '#ff4b4b', label: 'Target Protein', shape: '●' },
          { color: '#f59e0b', label: 'Disease', shape: '◆' },
          { color: '#00ff88', label: 'High Affinity Drug', shape: '●' },
          { color: '#ffd700', label: 'Moderate Drug', shape: '●' },
          { color: '#ff4b4b', label: 'Low Affinity Drug', shape: '●' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: i < 4 ? '6px' : 0 }}>
            <span style={{ color: item.color, fontSize: '14px', lineHeight: 1 }}>{item.shape}</span>
            <span style={{ color: '#e5e7eb', fontSize: '11px', fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Stats bar */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16, zIndex: 10,
        background: 'rgba(11,15,25,0.8)', padding: '10px 14px',
        borderRadius: '12px', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column', gap: '4px'
      }}>
        <div style={{ fontSize: '11px', color: '#9ca3af' }}>Active Leads: <span style={{ color: '#00ff88', fontWeight: 700 }}>{activeCount}</span></div>
        <div style={{ fontSize: '11px', color: '#9ca3af' }}>Diseases Linked: <span style={{ color: '#f59e0b', fontWeight: 700 }}>{diseases.length}</span></div>
        <div style={{ fontSize: '11px', color: '#9ca3af' }}>Total Screened: <span style={{ color: '#fff', fontWeight: 700 }}>{activeDrugs.length}</span></div>
      </div>

      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        d3VelocityDecay={0.3}
        forceEngine="d3"
        nodeLabel={null}
        nodeColor={node => {
          if (highlightNodes.size > 0 && !highlightNodes.has(node.id)) return 'rgba(50,50,50,0.1)';
          return node.color;
        }}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        nodeResolution={16}
        linkWidth={d => d.linkType === 'protein-disease' ? 2 : (d.distance < 100 ? 2 : 1)}
        linkColor={d => {
          if (highlightNodes.size > 0 && (!highlightNodes.has(d.source?.id) && !highlightNodes.has(d.target?.id))) return 'rgba(50,50,50,0.05)';
          return d.color;
        }}
        linkOpacity={0.4}
        linkDirectionalParticles={d => {
          if (highlightNodes.size > 0 && (!highlightNodes.has(d.source?.id) && !highlightNodes.has(d.target?.id))) return 0;
          return d.linkType === 'protein-disease' ? 4 : (d.distance < 150 ? 3 : 0);
        }}
        linkDirectionalParticleSpeed={d => d.linkType === 'protein-disease' ? 0.003 : 0.005}
        linkDirectionalParticleWidth={d => d.linkType === 'protein-disease' ? 3 : 2}
        linkDirectionalParticleColor={d => d.linkType === 'protein-disease' ? '#f59e0b' : (d.target?.color || '#fff')}
        backgroundColor="#05080f"
        onNodeClick={handleNodeClick}
        enableNodeDrag={true}
        showNavInfo={false}
        warmupTicks={150}
        cooldownTicks={100}
      />
    </div>
  );
}
