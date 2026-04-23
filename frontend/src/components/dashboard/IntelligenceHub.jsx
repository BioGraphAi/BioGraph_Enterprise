import React, { useEffect, useRef } from 'react';
import { BrainCircuit, Sparkles, MessageSquare, User, Bot, Volume2, VolumeX } from 'lucide-react';
import AiExplanation from './AiExplanation';
import DrugChat from './DrugChat';

export default function IntelligenceHub({ result, chatHistory, setChatHistory }) {
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', height: '100%', 
      background: 'var(--bg-canvas)', overflow: 'hidden' 
    }}>
      
      <div className="intelligence-hub-inner" style={{ flex: 1, display: 'flex', gap: 'clamp(16px, 3vw, 20px)', padding: 'clamp(16px, 3vw, 24px)', overflow: 'hidden' }}>
        
        {/* ── Left: Analysis Report ── */}
        <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '350px' }}>
           <AiExplanation result={result} isHub={true} />
        </div>

        {/* ── Right: AI Assistant Conversation ── */}
        <div style={{ 
          flex: '1', 
          display: 'flex', 
          flexDirection: 'column', 
          background: 'var(--bg-surface)', 
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          overflow: 'hidden',
          minHeight: '400px'
        }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', background: 'var(--status-success)', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Interactive Analysis Assistant</span>
          </div>

          {/* Messages List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
             {chatHistory.length > 0 ? (
                chatHistory.map((msg, idx) => (
                  <div key={idx} style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '12px 16px',
                    background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-sunken)',
                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', opacity: 0.8, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
                      {msg.role === 'user' ? <User size={10}/> : <Bot size={10}/>}
                      {msg.role === 'user' ? 'You' : 'Intelligence Engine'}
                    </div>
                    {msg.content}
                  </div>
                ))
             ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                  <MessageSquare size={32} style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '13px', textAlign: 'center' }}>Ask anything about {result.name}'s <br/> binding properties or side effects.</p>
                </div>
             )}
             <div ref={chatEndRef} />
          </div>

          {/* Chat Input Area */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
             <DrugChat result={result} setChatHistory={setChatHistory} />
          </div>
        </div>

      </div>
    </div>
  );
}
