import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const steps = [
  "Resume Intelligence & ATS Analysis",
  "GitHub Repository & Commit Analysis",
  "Portfolio & Web Showcase Audit",
  "Career DNA Profile Generation",
  "Skill Gap Detection Engine",
  "Career Readiness Calculation",
  "Personalized Learning Roadmap",
  "Dashboard Complete"
];

export default function AiProcessingView({ onFinishProcessing }) {
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < steps.length) {
        setCompletedSteps(prev => [...prev, index]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onFinishProcessing();
        }, 800);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [onFinishProcessing]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        
        {/* Animated Glowing Logo */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 35px rgba(139, 92, 246, 0.5)',
          animation: 'pulse-glow 2s infinite'
        }}>
          <Cpu size={36} color="#fff" />
        </div>

        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#a855f7' }}>
            GROQ LLAMA 3.3 70B
          </span>
          <h2 style={{ fontSize: '1.8rem', margin: '6px 0' }}>Analyzing Your Career...</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Generating your SkillSync AI Career DNA & Readiness Matrix</p>
        </div>

        {/* Live Step Progress List */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(10, 14, 23, 0.6)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
          {steps.map((stepName, i) => {
            const isDone = completedSteps.includes(i);
            const isCurrent = completedSteps.length === i;

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.9rem',
                  color: isDone ? '#10b981' : isCurrent ? '#f8fafc' : 'var(--text-muted)',
                  fontWeight: isDone || isCurrent ? 600 : 400,
                  transition: 'var(--transition)'
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={18} color="#10b981" />
                ) : isCurrent ? (
                  <Loader2 size={18} color="#3b82f6" className="spin-slow" />
                ) : (
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1px solid var(--border-color)' }} />
                )}
                <span>{stepName}</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
