import React from 'react';
import { Dna, Github, Mail, User, GraduationCap, BookOpen, ExternalLink } from 'lucide-react';

export default function AboutHero() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', position: 'relative', zIndex: 9999, paddingBottom: '20px' }}>

      {/* ── University Badge ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.08))',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '16px',
        padding: '14px 24px',
        marginBottom: '4px',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}>
        <GraduationCap size={28} color="var(--accent)" style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 'clamp(12px, 3.5vw, 14px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.3px' }}>
            Abdul Wali Khan University Mardan (AWKUM)
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Department of Computer Science
          </div>
        </div>
      </div>

      {/* ── Main Title ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent), #a855f7)',
          padding: '18px',
          borderRadius: '20px',
          boxShadow: '0 12px 35px rgba(99, 102, 241, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Dna size={48} color="#ffffff" strokeWidth={2} />
        </div>

        <span style={{
          fontSize: 'clamp(32px, 10vw, 42px)', fontWeight: 800, letterSpacing: '-1.5px', margin: 0, lineHeight: '1.2',
          background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block',
          textAlign: 'center'
        }}>BioGraph Enterprise</span>

        <span style={{
          fontSize: 'clamp(11px, 3vw, 14px)', fontWeight: 600, letterSpacing: '2px',
          background: 'linear-gradient(90deg, var(--accent), #a855f7)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          textTransform: 'uppercase',
          textAlign: 'center'
        }}>
          AI-Driven Drug Repurposing & Knowledge Graph Engine
        </span>

        <div style={{
          marginTop: '8px', padding: '6px 18px',
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: '30px', fontSize: '12px', color: 'var(--accent)', fontWeight: 600
        }}>
          Final Year Project (FYP) — 2026
        </div>
      </div>

      {/* ── Team Cards ── */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '750px', boxSizing: 'border-box' }}>

        {/* Lead Researcher */}
        <div style={{
          flex: '1 1 220px',
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          borderRadius: '16px', padding: '20px 24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ background: 'rgba(99,102,241,0.15)', borderRadius: '10px', padding: '8px' }}>
              <User size={18} color="var(--accent)" />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Lead Researcher</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>Riaz Ahmad</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Reg ID: 2213/9445</div>
          <a href="mailto:riazmad@cs.awkum.edu.pk" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>
            <Mail size={13} /> Riazahmadnew2018@gmail.com
          </a>
        </div>

        {/* Supervisor */}
        <div style={{
          flex: '1 1 220px',
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          borderRadius: '16px', padding: '20px 24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ background: 'rgba(168,85,247,0.15)', borderRadius: '10px', padding: '8px' }}>
              <BookOpen size={18} color="#a855f7" />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Supervisor</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>Prof. Shahid Akber</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Department of Computer Science</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AWKUM, Mardan</div>
        </div>

        {/* GitHub */}
        <div style={{
          flex: '1 1 220px',
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          borderRadius: '16px', padding: '20px 24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px' }}>
              <Github size={18} color="var(--text-primary)" />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Repository</span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>GitHub Repository</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>RiazAhmad-ai / BioGraph_Enterprise</div>
          <a
            href="https://github.com/RiazAhmad-ai/BioGraph_Enterprise"
            target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}
          >
            <ExternalLink size={13} /> View on GitHub
          </a>
        </div>
      </div>

      {/* ── Abstract ── */}
      <div style={{
        maxWidth: '720px', width: '100%',
        background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
        borderRadius: '16px', padding: '24px 28px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Abstract</div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.8', margin: 0 }}>
          BioGraph Enterprise is an advanced computational platform designed to accelerate drug repurposing using
          Artificial Intelligence and Graph Theory. By integrating molecular data with 3D Knowledge Graphs, the system
          identifies new therapeutic uses for existing drugs — significantly reducing the time and cost associated with
          traditional drug discovery. The platform combines a high-performance FastAPI backend with a reactive
          React-based dashboard featuring AI prediction, ADMET analysis, and LLM-powered scientific insights.
        </p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
          {['Drug Repurposing', 'GNN', 'Knowledge Graph', 'ADMET', 'FastAPI', 'React', 'PyTorch', 'LLM'].map(tag => (
            <span key={tag} style={{
              fontSize: '11px', fontWeight: 600, padding: '4px 10px',
              background: 'rgba(99,102,241,0.1)', color: 'var(--accent)',
              borderRadius: '20px', border: '1px solid rgba(99,102,241,0.2)'
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Tagline */}
      <p style={{
        fontSize: '13px', fontWeight: 400, color: 'var(--text-muted)',
        fontStyle: 'italic', letterSpacing: '0.5px',
        background: 'linear-gradient(90deg, var(--text-muted), var(--accent), var(--text-muted))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        margin: 0
      }}>
        "Smarter Discovery. Faster Solutions. Better Lives."
      </p>
    </div>
  );
}