import React from 'react';
import { ShieldCheck, Trophy, Zap, Code, Award, Star } from 'lucide-react';
import { computeCareerAnalysis } from '../services/analysisEngine';

export default function CareerReadinessView({ userData = {} }) {
  const analysis = computeCareerAnalysis(userData);

  const readinessComponents = [
    { label: "Resume ATS Score", score: analysis.atsScore, weight: "35%", icon: Trophy, color: "#3b82f6" },
    { label: "GitHub Code Quality", score: analysis.githubScore, weight: "25%", icon: Zap, color: "#8b5cf6" },
    { label: "Coding Benchmark Score", score: analysis.codingScore, weight: "20%", icon: Code, color: "#06b6d4" },
    { label: "Production Project Rating", score: analysis.projectScore, weight: "10%", icon: Star, color: "#f59e0b" },
    { label: "Certificates & Credentials", score: analysis.certScore, weight: "10%", icon: Award, color: "#ec4899" },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2>Placement Career Readiness Engine</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Dynamically calculated score for target role: <strong>{analysis.targetGoal}</strong>.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'var(--accent-gradient)',
          padding: '4px',
          boxShadow: 'var(--accent-glow)'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'var(--bg-dark)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '2.8rem', fontWeight: 800 }}>{analysis.overallReadiness}%</span>
            <span style={{ fontSize: '0.75rem', color: analysis.overallReadiness > 60 ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
              Placement Ready
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {readinessComponents.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={20} color={c.color} />
                <div>
                  <h4 style={{ fontSize: '0.95rem' }}>{c.label}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Weight: {c.weight}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '120px', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${c.score}%`, height: '100%', background: c.color, borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 700, minWidth: '45px' }}>{c.score}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
