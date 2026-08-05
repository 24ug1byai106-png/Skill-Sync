import React from 'react';
import { Award, Flame, Star, Trophy, Zap, ShieldCheck } from 'lucide-react';
import MonthlyStreakHUD from '../components/MonthlyStreakHUD';

export default function AchievementsView() {
  const badges = [
    { title: "FastAPI Architect", desc: "Built 3+ async microservices APIs", xp: 200, unlocked: true, icon: Zap, color: "var(--hud-cyan-bright)" },
    { title: "Docker Master", desc: "Wrote multi-stage production Dockerfiles", xp: 150, unlocked: true, icon: ShieldCheck, color: "var(--hud-cyan-bright)" },
    { title: "Streak Master 🔥", desc: "Logged in and completed missions consistently", xp: 100, unlocked: true, icon: Flame, color: "var(--hud-amber-bright)" },
    { title: "Kubernetes Pioneer", desc: "Deploy pods to Kubernetes cluster", xp: 300, unlocked: false, icon: Star, color: "var(--text-muted)" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2>Student Achievements & XP Badges</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Earn XP, unlock verified skill badges, and maintain your learning streak.</p>
      </div>

      {/* LeetCode-style Monthly Streak Calendar Grid */}
      <MonthlyStreakHUD />

      {/* Badges Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {badges.map((b, i) => {
          const Icon = b.icon;
          return (
            <div key={i} className="hud-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', opacity: b.unlocked ? 1 : 0.5 }}>
              <div style={{ width: '48px', height: '48px', border: '1px solid var(--border-cyan)', background: b.unlocked ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} color={b.unlocked ? b.color : 'var(--text-muted)'} />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--hud-cyan-bright)', margin: 0 }}>{b.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>{b.desc}</p>
              <span style={{ fontSize: '0.78rem', color: b.unlocked ? 'var(--hud-amber-bright)' : 'var(--text-muted)', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
                {b.unlocked ? `✓ Unlocked • +${b.xp} XP` : `Locked • ${b.xp} XP`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
