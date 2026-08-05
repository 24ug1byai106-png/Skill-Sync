import React from 'react';
import { Flame, Calendar, Award, CheckCircle2 } from 'lucide-react';
import { getStreakData } from '../utils/streakManager';

export default function MonthlyStreakHUD() {
  const streakData = getStreakData();
  const now = new Date();
  const monthName = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
  const year = now.getFullYear();
  const todayDay = now.getDate();

  const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
  const history = streakData.monthlyHistory || new Array(daysInMonth).fill(true);

  const activeDaysCount = history.filter(Boolean).length;
  const activePercentage = Math.round((activeDaysCount / daysInMonth) * 100);

  return (
    <div className="hud-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', border: '1px solid var(--hud-amber)', background: 'rgba(255, 159, 28, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame color="var(--hud-amber-bright)" size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--hud-cyan-bright)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
              DAILY STREAK TRACKER // {monthName} {year}
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
              LeetCode-style Daily Login Activity Grid
            </p>
          </div>
        </div>

        {/* Streak Stats Pills */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(255, 159, 28, 0.1)', border: '1px solid var(--hud-amber)' }}>
            <Flame size={16} color="var(--hud-amber-bright)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--hud-amber-bright)', fontFamily: "'Share Tech Mono', monospace" }}>
              {streakData.currentStreak} DAY STREAK 🔥
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(0, 229, 255, 0.08)', border: '1px solid var(--border-cyan)' }}>
            <Award size={16} color="var(--hud-cyan-bright)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--hud-cyan-bright)', fontFamily: "'Share Tech Mono', monospace" }}>
              BEST: {streakData.bestStreak} DAYS
            </span>
          </div>
        </div>
      </div>

      {/* LeetCode-style 31-Day Activity Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'Share Tech Mono', monospace" }}>
            Monthly Activity Heatmap ({activeDaysCount} of {daysInMonth} Days Active — {activePercentage}%)
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--hud-cyan-bright)', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
            ● ACTIVE DAY &nbsp; ○ MISSED DAY
          </span>
        </div>

        {/* Grid Day Blocks */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(16, 1fr)',
          gap: '8px',
          background: '#07090E',
          padding: '16px',
          border: '1px solid var(--border-cyan)'
        }}>
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const isActive = history[idx];
            const isToday = dayNum === todayDay;

            return (
              <div
                key={dayNum}
                title={`Day ${dayNum} - ${isActive ? 'Active Login Completed' : 'No Activity'}`}
                style={{
                  aspectRatio: '1',
                  borderRadius: '2px',
                  background: isActive ? 'var(--hud-cyan-bright)' : 'rgba(255, 255, 255, 0.04)',
                  border: isToday ? '2px solid var(--hud-amber)' : (isActive ? '1px solid var(--hud-cyan-bright)' : '1px solid rgba(255, 255, 255, 0.08)'),
                  boxShadow: isActive ? '0 0 10px rgba(0, 229, 255, 0.4)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: isActive ? '#0A0B0D' : 'var(--text-muted)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'transform 0.15s ease'
                }}
              >
                {dayNum}
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational Bottom Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0, 229, 255, 0.04)', padding: '10px 14px', border: '1px solid var(--border-cyan)', fontSize: '0.78rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--hud-cyan-bright)' }}>
          <CheckCircle2 size={16} />
          <span>Daily Login Recorded Today! Keep your streak going to unlock bonus XP points.</span>
        </div>
        <span style={{ fontWeight: 700, color: 'var(--hud-amber-bright)', fontFamily: "'Share Tech Mono', monospace" }}>+150 XP / DAY</span>
      </div>

    </div>
  );
}
