import React, { useState, useEffect } from 'react';
import { Send, Loader, Sparkles } from 'lucide-react';
import { apiClient } from '../../api/client';

export default function DrugChat({ result, compact, setChatHistory }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // --- 1. ANIMATION STATE ---
  const [placeholder, setPlaceholder] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // --- 2. TYPING EFFECT LOGIC ---
  useEffect(() => {
    const texts = [
      "Ask about toxicity risks...",
      "Is this molecule stable?",
      "Explain the binding score...",
      "What are the side effects?",
      "Can this penetrate the BBB?",
      "Analyze Lipinski rules..."
    ];

    let loopNum = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    let timer;

    const handleType = () => {
      const i = loopNum % texts.length;
      const fullText = texts[i];

      if (isDeleting) {
        setPlaceholder(fullText.substring(0, charIndex - 1));
        charIndex--;
        typeSpeed = 40; // Deleting speed fast
      } else {
        setPlaceholder(fullText.substring(0, charIndex + 1));
        charIndex++;
        typeSpeed = 80; // Typing speed normal
      }

      if (!isDeleting && charIndex === fullText.length) {
        isDeleting = true;
        typeSpeed = 2000; // Text pura hone ke baad pause
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        loopNum++;
        typeSpeed = 500; // Next word start hone se pehle pause
      }

      timer = setTimeout(handleType, typeSpeed);
    };

    timer = setTimeout(handleType, 500);
    return () => clearTimeout(timer);
  }, []);

  // --- 3. SEND HANDLER ---
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const question = input;
    setInput('');
    setLoading(true);

    // User Question
    setChatHistory(prev => [...prev, { role: 'user', content: question }]);

    try {
      // API Call
      const data = await apiClient.askDrugAI(question, {
        name: result.name,
        smiles: result.smiles,
        score: result.score,
        admet: result.admet,
        active_sites: result.active_sites
      });

      // AI Answer
      setChatHistory(prev => [
        ...prev, 
        { role: 'ai', content: data.answer || "Sorry, I couldn't analyze that." }
      ]);

    } catch (error) {
      setChatHistory(prev => [
        ...prev, 
        { role: 'ai', content: "Error connecting to AI server." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSend} 
      style={{ 
        position: 'relative', 
        width: '100%',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* 4. GLOWING CONTAINER */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        background: 'rgba(10, 10, 15, 0.6)',
        border: isFocused ? '1px solid #00f3ff' : '1px solid rgba(255,255,255,0.15)',
        boxShadow: isFocused ? '0 0 15px rgba(0, 243, 255, 0.2)' : 'none',
        borderRadius: '30px',
        padding: '5px 8px',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)'
      }}>
        
        {/* AI Icon */}
        <div style={{ paddingLeft: '12px', opacity: isFocused ? 1 : 0.5, transition: '0.3s' }}>
          <Sparkles size={16} color={isFocused ? "#00f3ff" : "#888"} />
        </div>

        {/* Animated Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={loading ? "AI is thinking..." : placeholder}
          disabled={loading}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: '#fff',
            padding: '12px 15px',
            fontSize: '13px',
            outline: 'none',
            letterSpacing: '0.5px',
            width: '100%'
          }}
        />

        {/* Send Button */}
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          style={{
            background: input.trim() ? '#00f3ff' : 'rgba(255,255,255,0.1)',
            border: 'none',
            color: input.trim() ? '#000' : '#555',
            width: '36px', height: '36px',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'default',
            transition: 'all 0.3s ease',
            marginRight: '2px'
          }}
        >
          {loading ? <Loader size={16} className="spin-loader"/> : <Send size={16} />}
        </button>
      </div>

      {/* Styles for Animations */}
      <style>{`
        .spin-loader { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.4); transition: color 0.3s; }
        input:focus::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </form>
  );
}