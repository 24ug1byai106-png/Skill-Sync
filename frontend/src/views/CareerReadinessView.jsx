import React from 'react';
import { ShieldCheck, Trophy, Zap, Code, Award, Star } from 'lucide-react';

export default function CareerReadinessView() {
  const readinessComponents = [
    { label: "Resume ATS Score", score: 82, weight: "25%", status: "Strong", icon: Trophy, color: "#3b82f6" },
    { label: "GitHub Code Quality", score: 75, weight: "25%", status: "Good", icon: Zap, color: "#8b5cf6" },
    { label: "Coding Benchmark Score", score: 85, weight: "20%", status: "Excellent", icon: Code, color: "#06b6d4" },
    { label: "Production Project Rating", score: 78, weight: "15%", status: "Good", icon: Star, color: "#f59e0b" },
    { label: "Certificates & Credentials", score: 90, weight: "15%", status: "Verified", icon: Award, color: "#ec4899" },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2>Placement Career Readiness Engine</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Weighted algorithm measuring student preparedness for target industry engineering roles.</p>
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
            <span style={{ fontSize: '2.8rem', fontWeight: 800 }}>78.5%</span>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Placement Ready</span>
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
