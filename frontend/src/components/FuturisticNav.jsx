import React from 'react';
import { Cpu, ArrowRight, Shield, Zap } from 'lucide-react';

export default function FuturisticNav({ onGetStarted, onLogin }) {
  return (
    <header style={{
      padding: '16px 48px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--border-cyber)',
      background: 'rgba(3, 5, 9, 0.75)',
      backdropFilter: 'blur(24px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.8)'
    }}>
      {/* Sci-Fi Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'var(--cyber-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--cyber-glow)'
        }}>
          <Cpu color="#030509" size={24} fontWeight="bold" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.35rem', lineHeight: 1, letterSpacing: '0.5px' }}>
            SkillSync <span className="cyber-text">AI</span>
          </h2>
          <span style={{ fontSize: '0.65rem', color: 'var(--cyber-blue)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            AI CAREER OS v3.0
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {['Home', 'Features', 'How It Works', 'Pricing', 'About', 'Docs'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.5px',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--cyber-blue)';
              e.target.style.textShadow = '0 0 10px rgba(0, 229, 255, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--text-secondary)';
              e.target.style.textShadow = 'none';
            }}
          >
            {item}
          </a>
        ))}
      </nav>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button className="btn-cyber-secondary" style={{ padding: '10px 20px', fontSize: '0.85rem' }} onClick={onLogin}>
          Sign In
        </button>
        <button className="btn-cyber-primary" style={{ padding: '10px 22px', fontSize: '0.85rem' }} onClick={onGetStarted}>
          Access Command Center <ArrowRight size={16} />
        </button>
      </div>
    </header>
  );
}
