import React, { useState } from 'react';
import { Send, Sparkles, Loader, Search } from 'lucide-react';
import { apiClient } from '../../api/client';

export default function DrugChat({ result, compact = false, onResponse }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    if (onResponse) onResponse(null);

    const context = {
      name: result.name,
      smiles: result.smiles,
      score: result.score,
      admet: result.admet,
      active_sites: result.active_sites
    };

    try {
        const res = await apiClient.askDrugAI(query, context);
        if (onResponse) onResponse(res.answer);
    } catch (err) {
        if (onResponse) onResponse("Error: Could not connect to AI.");
    }
    
    setLoading(false);
    setQuery("");
  };

  // ✨ NEW DESIGN STYLE
  return (
    <div style={{ 
      width: '100%', 
      maxWidth: compact ? '100%' : '700px', 
      margin: compact ? '0' : '30px auto',
      position: 'relative',
      zIndex: 100
    }}>
      
      <form onSubmit={handleAsk} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        
        {/* Animated Icon Container */}
        <div style={{ 
          position: 'absolute', left: '20px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isFocused ? '#00f3ff' : '#666',
          transition: 'all 0.4s ease',
          pointerEvents: 'none',
          filter: isFocused ? 'drop-shadow(0 0 5px #00f3ff)' : 'none'
        }}>
          {loading ? <Loader size={18} className="spin" /> : <Sparkles size={18} />}
        </div>

        {/* The Input Field */}
        <input 
          type="text" 
          placeholder={loading ? "Llama 3 is analyzing..." : "Ask Llama 3 about this drug..."} 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={loading}
          style={{
            width: '100%',
            height: '50px',
            padding: '0 60px 0 55px', // Space for icons
            
            // 🔥 Background & Border Styling
            background: 'linear-gradient(90deg, rgba(20,20,30,0.8), rgba(10,10,20,0.95))',
            border: '1px solid',
            borderColor: isFocused ? '#00f3ff' : 'rgba(255,255,255,0.1)',
            borderRadius: '16px', // Slightly squared for tech look
            
            // Text Styling
            color: '#fff',
            fontSize: '14px',
            letterSpacing: '0.5px',
            outline: 'none',
            
            // ✨ Glow Effects
            boxShadow: isFocused 
              ? '0 0 30px rgba(0, 243, 255, 0.15), inset 0 0 20px rgba(0, 243, 255, 0.05)' 
              : '0 5px 15px rgba(0,0,0,0.2)',
            
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        />

        {/* Send Button */}
        <button 
          type="submit" 
          disabled={loading || !query.trim()}
          style={{
            position: 'absolute', right: '10px',
            height: '36px', width: '36px',
            borderRadius: '12px',
            border: 'none',
            background: query.trim() ? '#00f3ff' : 'rgba(255,255,255,0.05)',
            color: query.trim() ? '#000' : '#444',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: query.trim() ? 'pointer' : 'default',
            transition: 'all 0.3s ease',
            transform: query.trim() && !loading ? 'scale(1)' : 'scale(0.9)',
            boxShadow: query.trim() ? '0 0 15px rgba(0, 243, 255, 0.5)' : 'none'
          }}
        >
          <Send size={16} />
        </button>

      </form>

      {/* Placeholder Animation */}
      <style>{`
        .spin { animation: spin 1s linear infinite; } 
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.3);
          transition: color 0.3s ease;
        }
        input:focus::placeholder {
          color: rgba(0, 243, 255, 0.5);
        }
      `}</style>
    </div>
  );
}