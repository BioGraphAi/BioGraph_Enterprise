import React from 'react';
import { Search } from 'lucide-react';

export default function ManualMode({ target, setTarget, smiles, setSmiles }) {
  return (
    <div className="fade-in-text">
      {/* 1. TARGET INPUT with Suggestions */}
      <div className="input-group">
        <label className="input-label">TARGET PROTEIN (PDB ID)</label>
        <div className="input-wrapper">
          <Search size={16} color="#888" className="input-icon" />
          <input className="cyber-input" placeholder="Ex: 6LU7" value={target} onChange={(e) => setTarget(e.target.value)} />
        </div>
        
        {/* ✅ Suggestions Added Back */}
        <div className="suggestions-box" style={{ pointerEvents: 'auto', flexWrap: 'wrap' }}>
          <span>Try:</span>
          <span className="suggestion-text" onClick={() => setTarget('6LU7')}>Covid-19</span>
          <span className="suggestion-text" onClick={() => setTarget('3PP0')}>Cancer</span>
          <span className="suggestion-text" onClick={() => setTarget('1Z00')}>Diabetes</span>
          <span className="suggestion-text" onClick={() => setTarget('1J3I')}>Malaria</span>
          <span className="suggestion-text" onClick={() => setTarget('5DI3')}>Alzheimer</span>
        </div>
      </div>

      {/* 2. DRUG INPUT with Suggestions */}
      <div className="input-group">
        <label className="input-label">DRUG NAME OR SMILES</label> 
        <textarea className="cyber-input textarea" rows="4" placeholder="Ex:'Panadol', or SMILES code..." value={smiles} onChange={(e) => setSmiles(e.target.value)} />
        
        {/* ✅ Suggestions Added Back */}
        <div className="suggestions-box" style={{ pointerEvents: 'auto', flexWrap: 'wrap' }}>
          <span>Try:</span>
          <span className="suggestion-text" onClick={() => setSmiles('CC(=O)Nc1ccc(O)cc1')}>Panadol</span>
          <span className="suggestion-text" onClick={() => setSmiles('CC(=O)Oc1ccccc1C(=O)O')}>Aspirin</span>
          <span className="suggestion-text" onClick={() => setSmiles('CN(C)C(=N)NC(=N)N')}>Metformin</span>
          <span className="suggestion-text" onClick={() => setSmiles('CC1(C(N2C(S1)C(C2=O)NC(=O)C(C3=CC=C(C=C3)O)N)C(=O)O)C')}>Amoxil</span>
          <span className="suggestion-text" onClick={() => setSmiles('Cc1c(C)c(OC)nc(CS(=O)c2nc3ccc(OC)cc3[nH]2)c1C')}>Omeprazole</span>
        </div>
      </div>
    </div>
  );
}