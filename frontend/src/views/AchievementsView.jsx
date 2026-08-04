import React from 'react';
import { Award, Flame, Star, Trophy, Zap, ShieldCheck } from 'lucide-react';

export default function AchievementsView() {
  const badges = [
    { title: "FastAPI Architect", desc: "Built 3+ async microservices APIs", xp: 200, unlocked: true, icon: Zap, color: "#3b82f6" },
    { title: "Docker Master", desc: "Wrote multi-stage production Dockerfiles", xp: 150, unlocked: true, icon: ShieldCheck, color: "#8b5cf6" },
    { title: "10-Day Streak 🔥", desc: "Logged in and completed missions 10 days in a row", xp: 100, unlocked: true, icon: Flame, color: "#f59e0b" },
    { title: "Kubernetes Pioneer", desc: "Deploy pods to Kubernetes cluster", xp: 300, unlocked: false, icon: Star, color: "#ec4899" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2>Student Achievements & XP Badges</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Earn XP, unlock verified skill badges, and maintain your learning streak.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {badges.map((b, i) => {
          const Icon = b.icon;
          return (
            <div key={i} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', opacity: b.unlocked ? 1 : 0.5 }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: b.unlocked ? `${b.color}20` : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} color={b.unlocked ? b.color : 'var(--text-muted)'} />
              </div>
              <h3 style={{ fontSize: '1.1rem' }}>{b.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.desc}</p>
              <span style={{ fontSize: '0.75rem', color: b.unlocked ? b.color : 'var(--text-muted)', fontWeight: 600 }}>
                {b.unlocked ? `Unlocked • +${b.xp} XP` : `Locked • ${b.xp} XP`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
