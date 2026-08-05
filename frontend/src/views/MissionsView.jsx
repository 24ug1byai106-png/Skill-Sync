import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, Award, Clock, Sparkles, Check, Play } from 'lucide-react';
import { recordDailyLogin } from '../utils/streakManager';
import VerifyMissionModal from '../components/VerifyMissionModal';

const DEFAULT_MISSIONS = [
  { id: 1, title: "Learn Docker & Containerization Fundamentals", xp: 150, deadline: "Aug 10", status: "pending", category: "DevOps & Cloud" },
  { id: 2, title: "Deploy FastAPI Backend Container on Cloud Server", xp: 200, deadline: "Aug 17", status: "pending", category: "Backend Engineering" },
  { id: 3, title: "Implement Redis In-Memory Caching Layer", xp: 180, deadline: "Aug 24", status: "pending", category: "Systems & Performance" },
  { id: 4, title: "Solve 5 LeetCode Medium DSA & Dynamic Programming Problems", xp: 100, deadline: "Aug 31", status: "pending", category: "Algorithms & DSA" }
];

export default function MissionsView() {
  const [missions, setMissions] = useState(() => {
    try {
      const saved = localStorage.getItem('skillsync_user_missions');
      return saved ? JSON.parse(saved) : DEFAULT_MISSIONS;
    } catch (e) {
      return DEFAULT_MISSIONS;
    }
  });

  const [toastMsg, setToastMsg] = useState('');
  const [selectedMissionForVerification, setSelectedMissionForVerification] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('skillsync_user_missions', JSON.stringify(missions));
    } catch (e) {
      console.warn("Missions save error:", e);
    }
  }, [missions]);

  const handleCompleteMission = (id) => {
    // Keep this for the play button or remove it? The play button can also open the verification modal
    const missionToVerify = missions.find(m => m.id === id);
    if (missionToVerify && missionToVerify.status !== 'completed') {
        setSelectedMissionForVerification(missionToVerify);
    }
  };

  const handleVerifySuccess = (id) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id) {
        recordDailyLogin(); // Record daily login streak
        setToastMsg(`✓ Mission Completed Successfully! Earned +${m.xp} XP!`);
        setTimeout(() => setToastMsg(''), 3500);
        return { ...m, status: 'completed' };
      }
      return m;
    }));
  };

  const totalEarnedXP = missions.filter(m => m.status === 'completed').reduce((sum, m) => sum + m.xp, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <VerifyMissionModal
        mission={selectedMissionForVerification}
        isOpen={!!selectedMissionForVerification}
        onClose={() => setSelectedMissionForVerification(null)}
        onVerify={handleVerifySuccess}
      />
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Sparkles color="var(--hud-cyan-bright)" size={20} />
            <h2 style={{ fontSize: '1.4rem', color: 'var(--hud-cyan-bright)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
              WEEKLY AI MISSIONS & PREPARATION
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Complete your assigned weekly preparation missions to earn XP and maintain your daily learning streak.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 159, 28, 0.1)', color: 'var(--hud-amber-bright)', padding: '6px 16px', border: '1px solid var(--hud-amber)', fontWeight: 700, fontSize: '0.9rem', fontFamily: "'Share Tech Mono', monospace" }}>
          <Award size={18} /> {totalEarnedXP} Total XP Earned
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div style={{ padding: '12px 16px', background: 'rgba(0, 229, 255, 0.12)', border: '1px solid var(--border-cyan)', color: 'var(--hud-cyan-bright)', fontSize: '0.85rem', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
          {toastMsg}
        </div>
      )}

      {/* Active Missions Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--hud-cyan-bright)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
          [ACTIVE WEEKLY MISSIONS]
        </h3>

        {missions.map(m => {
          const isDone = m.status === 'completed';

          return (
            <div
              key={m.id}
              className="hud-panel"
              style={{
                padding: '22px 26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                borderColor: isDone ? 'var(--hud-cyan-bright)' : 'var(--border-cyan)',
                background: isDone ? 'rgba(0, 229, 255, 0.04)' : 'var(--bg-panel)'
              }}
            >
              {/* Left Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div
                  onClick={() => handleCompleteMission(m.id)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: isDone ? 'var(--hud-cyan-bright)' : 'var(--hud-amber-bright)',
                    background: isDone ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255, 159, 28, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {isDone ? <CheckCircle2 size={20} color="var(--hud-cyan-bright)" /> : <Play size={14} color="var(--hud-amber-bright)" />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{
                      fontSize: '1.05rem',
                      color: isDone ? 'var(--hud-cyan-bright)' : 'var(--text-primary)',
                      textDecoration: isDone ? 'line-through' : 'none',
                      margin: 0,
                      fontFamily: "'Share Tech Mono', monospace"
                    }}>
                      {m.title}
                    </h4>
                    {isDone && (
                      <span style={{ fontSize: '0.72rem', background: 'rgba(0, 229, 255, 0.15)', color: 'var(--hud-cyan-bright)', border: '1px solid var(--border-cyan)', padding: '2px 8px', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
                        ✓ COMPLETED
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> Deadline: {m.deadline}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Complete Action Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  className={isDone ? 'btn-secondary' : 'btn-hud-cyan'}
                  onClick={() => !isDone && setSelectedMissionForVerification(m)}
                  style={{ padding: '8px 18px', fontSize: '0.82rem', opacity: isDone ? 0.7 : 1, cursor: isDone ? 'default' : 'pointer' }}
                  disabled={isDone}
                >
                  {isDone ? <CheckCircle2 size={16} /> : <Check size={16} />}
                  {isDone ? '✅ VERIFIED' : 'VERIFY MISSION'}
                </button>

                <div style={{
                  padding: '6px 14px',
                  border: isDone ? '1px solid var(--border-cyan)' : '1px solid var(--hud-amber)',
                  background: isDone ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255, 159, 28, 0.1)',
                  color: isDone ? 'var(--hud-cyan-bright)' : 'var(--hud-amber-bright)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  fontFamily: "'Share Tech Mono', monospace"
                }}>
                  +{m.xp} XP
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
