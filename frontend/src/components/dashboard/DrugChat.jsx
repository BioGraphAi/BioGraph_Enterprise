import React, { useState } from 'react';
import { Send, Sparkles, MessageSquare, Loader } from 'lucide-react';
import { apiClient } from '../../api/client';

export default function DrugChat({ result }) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);

    // Prepare Context (Jo data backend ko bhejna hai)
    const context = {
      name: result.name,
      smiles: result.smiles,
      score: result.score,
      admet: result.admet,
      active_sites: result.active_sites
    };

    const res = await apiClient.askDrugAI(query, context);
    setResponse(res.answer);
    setLoading(false);
  };

  return (
    <div style={{ width: '100%', maxWidth: '700px', margin: '30px auto 10px auto' }}>
      
      {/* Search Bar Container */}
      <form onSubmit={handleAsk} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        
        <div style={{ position: 'absolute', left: '15px', color: '#00f3ff' }}>
          <Sparkles size={18} className="animate-pulse" />
        </div>

        <input 
          type="text" 
          placeholder={`Ask AI about ${result.name || 'this drug'}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 50px 14px 45px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(0, 243, 255, 0.3)',
            borderRadius: '50px',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 15px rgba(0, 243, 255, 0.05)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#00f3ff';
            e.target.style.boxShadow = '0 0 25px rgba(0, 243, 255, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(0, 243, 255, 0.3)';
            e.target.style.boxShadow = '0 0 15px rgba(0, 243, 255, 0.05)';
          }}
        />

        <button 
          type="submit" 
          disabled={loading}
          style={{
            position: 'absolute', right: '8px',
            background: 'linear-gradient(135deg, #00f3ff, #0066ff)',
            border: 'none', borderRadius: '50%',
            width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'scale(1)')}
        >
          {loading ? <Loader size={16} className="spin" color="#000" /> : <Send size={16} color="#000" />}
        </button>

      </form>

      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Answer Area (Chat Bubble) */}
      {response && (
        <div className="fade-in-text" style={{ 
          marginTop: '15px', 
          padding: '15px 20px', 
          background: 'rgba(255, 255, 255, 0.05)', 
          borderLeft: '3px solid #00f3ff', 
          borderRadius: '0 12px 12px 0',
          display: 'flex', gap: '12px'
        }}>
          <div style={{ marginTop: '2px' }}><MessageSquare size={18} color="#00f3ff" /></div>
          <div style={{ color: '#ddd', fontSize: '13px', lineHeight: '1.5' }}>
            {response}
          </div>
        </div>
      )}

    </div>
  );
}