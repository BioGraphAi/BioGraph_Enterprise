import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, User, Bot, BookOpen, FileSearch, ChevronDown, ChevronUp } from 'lucide-react';
import AiExplanation from './AiExplanation';
import DrugChat from './DrugChat';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function IntelligenceHub({ result, chatHistory, setChatHistory }) {
  const chatEndRef = useRef(null);
  const [paperText, setPaperText] = useState('');
  const [paperSummary, setPaperSummary] = useState(null);
  const [paperLoading, setPaperLoading] = useState(false);
  const [showPaperSummarizer, setShowPaperSummarizer] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSummarizePaper = async () => {
    if (!paperText.trim() || paperText.trim().length < 20) return;
    setPaperLoading(true);
    setPaperSummary(null);
    try {
      const resp = await fetch(`${BASE_URL}/summarize_paper`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abstract: paperText }),
      });
      const data = await resp.json();
      setPaperSummary(data);
    } catch (e) {
      setPaperSummary({ key_findings: 'Failed to connect to AI engine.', error: e.message });
    }
    setPaperLoading(false);
  };

  return (
    /* ── OUTER: full height, column, NO overflow:hidden so page can scroll ── */
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'var(--bg-canvas)',
      overflow: 'auto',          /* ✅ FIX: was 'hidden' — now scrollable */
      minHeight: 0,
      paddingBottom: '32px'      /* ✅ FIX: Footer gap */
    }}>

      {/* ══ Research Paper Summarizer Panel ══ */}
      <div style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        flexShrink: 0,
      }}>
        {/* Toggle button */}
        <button
          onClick={() => setShowPaperSummarizer(v => !v)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 20px', background: 'transparent',
            border: 'none', cursor: 'pointer', color: 'var(--text-primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSearch size={15} color="#a855f7" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Research Paper Summarizer
            </span>
            <span style={{
              fontSize: '10px', background: 'rgba(168,85,247,0.15)',
              color: '#a855f7', padding: '2px 8px', borderRadius: '10px', fontWeight: 600,
            }}>AI Powered</span>
          </div>
          {showPaperSummarizer
            ? <ChevronUp size={14} color="var(--text-muted)" />
            : <ChevronDown size={14} color="var(--text-muted)" />}
        </button>

        {/* Collapsible body — scrolls as part of the outer scroll */}
        {showPaperSummarizer && (
          <div style={{ padding: '0 20px 16px 20px' }}>
            <textarea
              value={paperText}
              onChange={e => setPaperText(e.target.value)}
              placeholder="Paste a biomedical research paper abstract here to get an AI-powered structured summary..."
              rows={4}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'var(--bg-sunken)',
                border: '1px solid var(--border-default)',
                borderRadius: '10px', color: 'var(--text-primary)',
                fontSize: '12px', padding: '10px 14px',
                resize: 'vertical', outline: 'none',
                fontFamily: 'inherit', lineHeight: '1.5',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                onClick={handleSummarizePaper}
                disabled={paperLoading || paperText.trim().length < 20}
                style={{
                  padding: '8px 18px', borderRadius: '8px',
                  fontSize: '12px', fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  color: 'white', border: 'none', cursor: 'pointer',
                  opacity: (paperLoading || paperText.trim().length < 20) ? 0.5 : 1,
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                <BookOpen size={13} />
                {paperLoading ? 'Analyzing...' : 'Summarize Paper'}
              </button>
            </div>

            {/* Summary result */}
            {paperSummary && (
              <div style={{
                marginTop: '12px',
                background: 'var(--bg-sunken)',
                border: '1px solid rgba(168,85,247,0.2)',
                borderRadius: '10px', padding: '14px',
              }}>
                {paperSummary.error && !paperSummary.key_findings ? (
                  <div style={{ color: 'var(--status-error)', fontSize: '12px' }}>
                    Error: {paperSummary.error}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {paperSummary.title_guess && (
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', marginBottom: '3px' }}>Paper Title</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>{paperSummary.title_guess}</div>
                      </div>
                    )}
                    {paperSummary.key_findings && (
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', marginBottom: '3px' }}>Key Findings</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{paperSummary.key_findings}</div>
                      </div>
                    )}
                    {paperSummary.drug_targets && (
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '3px' }}>Drug Targets / Diseases</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{paperSummary.drug_targets}</div>
                      </div>
                    )}
                    {paperSummary.relevance && (
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '3px' }}>Relevance to Drug Repurposing</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{paperSummary.relevance}</div>
                      </div>
                    )}
                    {paperSummary.keywords && Array.isArray(paperSummary.keywords) && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {paperSummary.keywords.map((kw, i) => (
                          <span key={i} style={{
                            fontSize: '10px', fontWeight: 600,
                            padding: '2px 8px',
                            background: 'rgba(99,102,241,0.1)',
                            color: 'var(--accent)',
                            borderRadius: '10px',
                            border: '1px solid rgba(99,102,241,0.2)',
                          }}>{kw}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ Main: AI Analysis Report + Chat ══ */}
      {/* ✅ FIX: flex:1 + min-height:0 + inner overflow so chat still scrolls */}
      <div
        className="intelligence-hub-inner"
        style={{
          flex: 1,
          display: 'flex',
          gap: 'clamp(16px, 3vw, 20px)',
          padding: 'clamp(16px, 3vw, 24px)',
          minHeight: '480px',        /* ✅ guarantees content is visible */
          overflow: 'visible',       /* ✅ lets outer wrapper scroll it */
        }}
      >
        {/* Left: AI Analysis Report */}
        <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', minHeight: '350px' }}>
          <AiExplanation result={result} isHub={true} />
        </div>

        {/* Right: Interactive Chat */}
        <div style={{
          flex: '1',
          display: 'flex', flexDirection: 'column',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          minHeight: '400px',
        }}>
          {/* Chat header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', gap: '10px',
            flexShrink: 0,
          }}>
            <div style={{ width: '8px', height: '8px', background: 'var(--status-success)', borderRadius: '50%' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Interactive Analysis Assistant
            </span>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: '20px',
            display: 'flex', flexDirection: 'column', gap: '16px',
          }}>
            {chatHistory.length > 0 ? (
              chatHistory.map((msg, idx) => (
                <div key={idx} style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%', padding: '12px 16px',
                  background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-sunken)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  fontSize: '13px', lineHeight: '1.5',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    marginBottom: '6px', opacity: 0.8,
                    fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                  }}>
                    {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                    {msg.role === 'user' ? 'You' : 'Intelligence Engine'}
                  </div>
                  {msg.content}
                </div>
              ))
            ) : (
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', opacity: 0.4,
              }}>
                <MessageSquare size={32} style={{ marginBottom: '12px' }} />
                <p style={{ fontSize: '13px', textAlign: 'center' }}>
                  Ask anything about {result.name}'s <br /> binding properties or side effects.
                </p>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            flexShrink: 0,
          }}>
            <DrugChat result={result} setChatHistory={setChatHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}
