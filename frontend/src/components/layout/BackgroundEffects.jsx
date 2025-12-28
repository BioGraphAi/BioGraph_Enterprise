import React from 'react';
import { Atom, Dna } from 'lucide-react';

export default function BackgroundEffects() {
  return (
    <>
      <div className="bg-grid" style={{ pointerEvents: 'none' }}></div>
      <div className="floating-elements" style={{ pointerEvents: 'none' }}>
        <div className="float-icon" style={{ top: '15%', left: '10%', animationDuration: '25s', color: '#00f3ff' }}>
          <Atom size={180} strokeWidth={1} />
        </div>
        <div className="float-icon" style={{ top: '60%', right: '15%', animationDuration: '35s', color: '#bc13fe' }}>
          <Dna size={200} strokeWidth={1} />
        </div>
      </div>
    </>
  );
}