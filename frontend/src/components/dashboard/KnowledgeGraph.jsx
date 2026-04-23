import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { Search, Camera, RefreshCw, X } from 'lucide-react';

export default function KnowledgeGraph({ targetId, activeDrugs = [] }) {
  const fgRef = useRef();
  const [searchText, setSearchText] = useState('');
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);

  const graphData = useMemo(() => {
    // 1. Root Node (Target)
    const rootNode = {
      id: targetId || 'TARGET',
      name: `Target: ${targetId || 'Protein'}`,
      val: 20, // Base sizing
      color: '#ff4b4b',
      isRoot: true,
    };

    // 2. Child Nodes (High and Low Affinity for contrast)
    const sorted = [...activeDrugs].sort((a, b) => (b.score || 0) - (a.score || 0));
    const topDrugs = sorted.slice(0, 25);
    const bottomDrugs = sorted.slice(-15);
    const displayedDrugs = [...topDrugs, ...bottomDrugs];

    const drugNodes = displayedDrugs.map((drug, index) => {
      const score = drug.score || 0;
      const val = Math.max(3, score);
      
      let color = '#4a90e2';
      if (score >= 8.5) color = '#00ff88'; // High
      else if (score >= 7.0) color = '#ffd700'; // Mid
      else color = '#ff4b4b'; // Low (Red)

      return {
        id: `drug-${index}`,
        name: drug.name || drug.compound || `Drug ${index + 1}`,
        score: score,
        val: val,
        color: color,
        isRoot: false,
        // Calculate distance based on score (Higher score = shorter distance)
        distance: Math.max(50, 300 - (score * 25))
      };
    });

    // 3. Links connecting root to all children
    const links = drugNodes.map(node => ({
      source: rootNode.id,
      target: node.id,
      color: node.score > 7.5 ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 75, 75, 0.1)',
      distance: node.distance
    }));

    return {
      nodes: [rootNode, ...drugNodes],
      links: links
    };
  }, [targetId, activeDrugs]);

  // Auto-rotate the camera
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.controls().autoRotate = true;
      fgRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  // Search/Highlight Logic
  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearchText(val);
    
    if (!val) {
      setHighlightNodes(new Set());
      return;
    }

    const matched = graphData.nodes.filter(n => n.name.toLowerCase().includes(val));
    setHighlightNodes(new Set(matched.map(n => n.id)));
    
    // If exactly one match, focus on it
    if (matched.length === 1 && fgRef.current) {
      const node = matched[0];
      const distance = 100;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        1500
      );
    }
  };

  const resetCamera = () => {
    if (fgRef.current) {
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 400 }, { x: 0, y: 0, z: 0 }, 1500);
      setSearchText('');
      setHighlightNodes(new Set());
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

  // Center camera on the clicked node
  const handleNodeClick = useCallback(node => {
    if (fgRef.current) {
      const distance = 80;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
      
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        2000
      );
    }
  }, [fgRef]);

  // Custom 3D Object rendering to add the "Wow Factor" glow effect
  const nodeThreeObject = useCallback(node => {
    // Create a 3D Sprite with the drug name for "Wow" scientific feel
    const group = new THREE.Group();
    
    // Node Sphere
    const size = node.isRoot ? 10 : Math.max(2, node.score * 0.6);
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshPhongMaterial({
      color: node.color,
      emissive: node.color,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.9
    });
    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);

    // Glow for root
    if (node.isRoot) {
      const glowGeo = new THREE.SphereGeometry(size * 1.5, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.1 });
      group.add(new THREE.Mesh(glowGeo, glowMat));
    }

    // Label Sprite (Always visible)
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    context.font = 'Bold 24px Arial';
    context.fillStyle = node.color;
    context.textAlign = 'center';
    context.fillText(node.name, 128, 40);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(0, size + 5, 0);
    sprite.scale.set(20, 5, 1);
    group.add(sprite);

    return group;
  }, []);

  return (
    <div style={{ 
      width: '100%', 
      height: '500px', 
      background: '#0b0f19', // Dark premium theme 
      borderRadius: '16px', 
      overflow: 'hidden', 
      position: 'relative', 
      border: '1px solid #1f2937',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
    }}>
      {/* Decorative Glassmorphism Overlay */}
      <div style={{ 
        position: 'absolute', top: 20, left: 20, zIndex: 10, 
        color: 'white', pointerEvents: 'none',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(8px)',
        padding: '12px 20px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4b4b', display: 'inline-block', boxShadow: '0 0 10px #ff4b4b' }} />
          Binding Network
        </h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>3D AI Discoveries Viewer</p>
      </div>

      {/* NEW: Toolbar */}
      <div style={{ 
        position: 'absolute', top: 20, right: 20, zIndex: 10, 
        display: 'flex', gap: '8px'
      }}>
        <div style={{ 
          background: 'rgba(11, 15, 25, 0.8)', 
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '4px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: searchText ? '200px' : '40px',
          transition: 'width 0.3s ease',
          overflow: 'hidden'
        }}>
          <Search size={16} color="#9ca3af" style={{ minWidth: '16px' }} />
          <input 
            placeholder="Search drug..." 
            value={searchText}
            onChange={handleSearch}
            onFocus={() => fgRef.current.controls().autoRotate = false}
            style={{ 
              background: 'transparent', border: 'none', color: 'white', 
              fontSize: '13px', outline: 'none', width: '100%' 
            }} 
          />
          {searchText && <X size={14} color="#9ca3af" style={{ cursor: 'pointer' }} onClick={() => { setSearchText(''); setHighlightNodes(new Set()); }} />}
        </div>

        <button 
          onClick={resetCamera}
          title="Reset View"
          style={{ 
            background: 'rgba(11, 15, 25, 0.8)', color: 'white', border: '1px solid rgba(255,255,255,0.1)',
            width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.target.style.background = 'rgba(11, 15, 25, 0.8)'}
        >
          <RefreshCw size={18} />
        </button>

        <button 
          onClick={exportImage}
          title="Export Snapshot"
          style={{ 
            background: 'var(--accent)', color: 'white', border: 'none',
            width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,243,255,0.2)'
          }}
        >
          <Camera size={18} />
        </button>
      </div>
      
      {/* Floating Legend */}
      <div style={{ 
        position: 'absolute', bottom: 20, right: 20, zIndex: 10, 
        background: 'rgba(11, 15, 25, 0.7)', 
        padding: '12px 16px', 
        borderRadius: '12px', 
        backdropFilter: 'blur(12px)', 
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88' }} />
          <span style={{ color: '#e5e7eb', fontSize: '12px', fontWeight: 500 }}>High Affinity (Closer)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffd700', boxShadow: '0 0 8px #ffd700' }} />
          <span style={{ color: '#e5e7eb', fontSize: '12px', fontWeight: 500 }}>Moderate</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff4b4b', boxShadow: '0 0 8px #ff4b4b' }} />
          <span style={{ color: '#ff4b4b', fontSize: '12px', fontWeight: 500 }}>Low Affinity (Further)</span>
        </div>
      </div>

      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        d3VelocityDecay={0.3}
        forceEngine="d3"
        nodeLabel={null} // Disable hover labels as we have sprites now
        nodeColor={node => {
          if (highlightNodes.size > 0 && !highlightNodes.has(node.id)) return 'rgba(50, 50, 50, 0.1)';
          return node.color;
        }}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        nodeResolution={16} 
        
        // Link Aesthetics
        linkWidth={d => d.distance < 100 ? 2 : 1}
        linkColor={d => {
          if (highlightNodes.size > 0 && (!highlightNodes.has(d.source.id) && !highlightNodes.has(d.target.id))) return 'rgba(50, 50, 50, 0.05)';
          return d.color;
        }}
        linkOpacity={0.3}
        
        // Particle Effects
        linkDirectionalParticles={d => {
          if (highlightNodes.size > 0 && (!highlightNodes.has(d.source.id) && !highlightNodes.has(d.target.id))) return 0;
          return d.distance < 150 ? 3 : 0;
        }}
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleColor={d => d.target.color || '#fff'}
        
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
