import React from 'react';
import { ArrowRight } from 'lucide-react';
import SkillSyncLogo from './SkillSyncLogo';

export default function FuturisticNav({ onGetStarted, onLogin }) {
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header style={{
      padding: '14px 48px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--border-cyan)',
      background: 'rgba(10, 11, 13, 0.9)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand HUD Logo */}
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ cursor: 'pointer' }}
      >
        <SkillSyncLogo size={42} showText={true} />
      </div>

      {/* Relevant Student Nav Links */}
      <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, 'home')}
          style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1.5px', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.target.style.color = 'var(--hud-cyan-bright)')}
          onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
        >
          [HOME]
        </a>

        <a
          href="#features"
          onClick={(e) => handleNavClick(e, 'features')}
          style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1.5px', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.target.style.color = 'var(--hud-cyan-bright)')}
          onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
        >
          [FEATURES]
        </a>

        <a
          href="#pipeline"
          onClick={(e) => handleNavClick(e, 'pipeline')}
          style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1.5px', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.target.style.color = 'var(--hud-cyan-bright)')}
          onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
        >
          [PIPELINE]
        </a>

        <a
          href="#faq"
          onClick={(e) => handleNavClick(e, 'faq')}
          style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1.5px', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.target.style.color = 'var(--hud-cyan-bright)')}
          onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
        >
          [FAQ]
        </a>
      </nav>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button className="btn-hud-amber" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={onLogin}>
          STUDENT SIGN-IN
        </button>
        <button className="btn-hud-cyan" style={{ padding: '8px 18px', fontSize: '0.8rem' }} onClick={onGetStarted}>
          START ASSESSMENT <ArrowRight size={14} />
        </button>
      </div>
    </header>
  );
}
