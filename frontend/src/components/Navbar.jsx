import React from 'react';

// ✅ MODULAR IMPORTS
import BrandLogo from './navbar/BrandLogo';
import NavTagline from './navbar/NavTagline';
import NavActions from './navbar/NavActions';

const Navbar = ({ showAbout, setShowAbout, onHistorySelect, onOpenSettings }) => {
  return (
    <nav className="glass-nav" style={{
        padding: '8px 25px', 
        height: '60px', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      
      {/* 1. Left: Brand Logo */}
      <BrandLogo onClick={() => setShowAbout(false)} />
      
      {/* 2. Center: Tagline */}
      <NavTagline />
      
      {/* 3. Right: Actions */}
      <NavActions 
        showAbout={showAbout} 
        setShowAbout={setShowAbout} 
        onHistorySelect={onHistorySelect} 
        onOpenSettings={onOpenSettings} 
      />

    </nav>
  );
};

export default Navbar;