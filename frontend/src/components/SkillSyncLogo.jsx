import React from 'react';

export default function SkillSyncLogo({ size = 36, showText = true, textStyle = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0px 0px 8px rgba(0, 229, 255, 0.4))' }}
      >
        <defs>
          <linearGradient id="circleGrad" x1="100" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="pathTopGrad" x1="70" y1="30" x2="130" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <linearGradient id="pathBottomGrad" x1="60" y1="80" x2="140" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          <linearGradient id="arrowGrad" x1="100" y1="10" x2="100" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* Outer Circular Ring */}
        <path
          d="M 100,22 A 78,78 0 1,1 70,172"
          stroke="url(#circleGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />

        {/* Top Upward Arrow */}
        <polygon
          points="100,8 112,28 88,28"
          fill="url(#arrowGrad)"
        />

        {/* Upper S-Curve Ribbon */}
        <path
          d="M 100,28 C 90,45 80,55 92,68 C 104,80 120,70 125,58"
          stroke="url(#pathTopGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="125" cy="58" r="7" fill="#00e5ff" />

        {/* Middle Node Connector */}
        <path
          d="M 88,92 C 95,85 105,82 115,88"
          stroke="url(#pathTopGrad)"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="88" cy="92" r="6" fill="#38bdf8" />

        {/* Lower Double Wave Ribbons */}
        <path
          d="M 72,120 C 85,100 110,105 135,130 C 120,150 95,155 80,145"
          stroke="url(#pathBottomGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 60,135 C 75,115 100,120 125,145"
          stroke="url(#pathBottomGrad)"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="72" cy="120" r="7" fill="#0284c7" />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', ...textStyle }}>
          <span style={{
            fontSize: '1.2rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '0.5px',
            fontFamily: "'Inter', 'Share Tech Mono', sans-serif",
            lineHeight: 1.1
          }}>
            SkillSync <span style={{ color: 'var(--hud-cyan-bright)' }}>AI</span>
          </span>
          <span style={{
            fontSize: '0.62rem',
            color: 'var(--hud-cyan-bright)',
            letterSpacing: '1px',
            fontFamily: "'Share Tech Mono', monospace"
          }}>
            CAREER HUD v3.0
          </span>
        </div>
      )}
    </div>
  );
}
