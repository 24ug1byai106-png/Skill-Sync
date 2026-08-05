import React from 'react';
import { Target, Check, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { computeCareerAnalysis } from '../services/analysisEngine';

export default function SkillGapView({ userData = {} }) {
  const analysis = computeCareerAnalysis(userData);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ color: 'var(--hud-cyan-bright)', fontFamily: "'Share Tech Mono', monospace" }}>
          SKILL GAP MATRIX & PRIORITY ORDER
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Calculated comparative analysis for target role: <strong>{analysis.targetGoal}</strong>.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Acquired Skills */}
        <div className="hud-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-panel)' }}>
          <h3 style={{ color: 'var(--hud-cyan-bright)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
            <Check size={20} color="var(--hud-cyan-bright)" /> ACQUIRED SKILLS ({analysis.matchedSkills.length})
          </h3>
          {analysis.matchedSkills.length > 0 ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {analysis.matchedSkills.map(s => (
                <span key={s} className="tag-acquired">
                  ✓ {s}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>No acquired skills detected yet. Paste your skills in Resume Intelligence!</p>
          )}
        </div>

        {/* Missing Skills */}
        <div className="hud-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-panel)' }}>
          <h3 style={{ color: 'var(--hud-amber-bright)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
            <AlertTriangle size={20} color="var(--hud-amber-bright)" /> MISSING SKILLS FOR {analysis.targetGoal.toUpperCase()} ({analysis.missingSkills.length})
          </h3>
          {analysis.missingSkills.length > 0 ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {analysis.missingSkills.map(s => (
                <span key={s} className="tag-gap-secondary">
                  Need: {s}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--hud-cyan-bright)', margin: 0 }}>🎉 You have covered all required skills for {analysis.targetGoal}!</p>
          )}
        </div>

      </div>
    </div>
  );
}
