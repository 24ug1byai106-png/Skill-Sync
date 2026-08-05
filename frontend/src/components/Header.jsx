import React, { useState, useEffect } from 'react';
import { Bell, UserCheck, Trash2 } from 'lucide-react';
import { computeCareerAnalysis } from '../services/analysisEngine';

export default function Header({ user }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Generate dynamic pending tasks notifications from user state & missions
  useEffect(() => {
    try {
      const savedNotifs = localStorage.getItem('skillsync_notifications_cleared');
      if (savedNotifs === 'true') {
        setNotifications([]);
        return;
      }

      const pendingList = [];
      
      // 1. Check pending missions from localStorage
      const rawMissions = localStorage.getItem('skillsync_user_missions');
      if (rawMissions) {
        const parsed = JSON.parse(rawMissions);
        const pendingMissions = parsed.filter(m => m.status === 'pending');
        pendingMissions.slice(0, 2).forEach(m => {
          pendingList.push({
            id: `mission_${m.id}`,
            title: `PENDING MISSION: ${m.title.toUpperCase()}`,
            desc: `Reward: +${m.xp} XP • Deadline: ${m.deadline}`,
            type: 'warning'
          });
        });
      } else {
        pendingList.push({
          id: 'mission_default',
          title: 'PENDING MISSION: DOCKER CONTAINER SETUP',
          desc: 'Deploy backend container before Aug 17 deadline.',
          type: 'warning'
        });
      }

      // 2. Check skill gaps
      const analysis = computeCareerAnalysis(user || {});
      if (analysis.missingSkills && analysis.missingSkills.length > 0) {
        pendingList.push({
          id: 'skill_gap_top',
          title: `SKILL GAP: LEARN ${analysis.missingSkills[0].toUpperCase()}`,
          desc: `Required for ${analysis.targetGoal} role placement.`,
          type: 'action'
        });
      }

      // 3. Check resume status
      if (analysis.atsScore === 0) {
        pendingList.push({
          id: 'resume_missing',
          title: 'ACTION NEEDED: UPLOAD YOUR RESUME',
          desc: 'Calculate your ATS match score for target companies.',
          type: 'action'
        });
      }

      setNotifications(pendingList);
    } catch (e) {
      console.warn("Notification gen error:", e);
    }
  }, [user]);

  const handleClearAll = () => {
    setNotifications([]);
    try {
      localStorage.setItem('skillsync_notifications_cleared', 'true');
    } catch (e) {}
  };

  const handleDismissOne = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const hasUnread = notifications.length > 0;

  return (
    <header style={{
      height: '62px',
      borderBottom: '1px solid var(--border-cyan)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(10, 11, 13, 0.9)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      {/* Left Title Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <UserCheck size={18} color="var(--hud-cyan-bright)" />
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '1px', fontFamily: "'Share Tech Mono', monospace" }}>
          STUDENT DASHBOARD <span style={{ color: 'var(--hud-cyan-bright)' }}>// ACTIVE SESSION</span>
        </span>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

        {/* Dynamic Notifications Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            title="Pending Tasks & Notifications"
            style={{
              width: '36px',
              height: '36px',
              background: '#0A0B0D',
              border: '1px solid var(--border-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--hud-cyan-bright)',
              position: 'relative'
            }}
          >
            <Bell size={15} />
            {hasUnread && (
              <span style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--hud-amber)',
                boxShadow: '0 0 6px var(--hud-amber)'
              }} />
            )}
          </button>

          {/* Dynamic Notifications Dropdown */}
          {showNotifs && (
            <div className="hud-panel" style={{ position: 'absolute', right: 0, top: '44px', width: '350px', padding: '16px', zIndex: 100, background: '#0A0B0D' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid var(--border-cyan)' }}>
                <h4 style={{ fontSize: '0.82rem', color: 'var(--hud-cyan-bright)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
                  [PENDING WORK // {notifications.length} ITEMS]
                </h4>
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.72rem',
                      color: 'var(--hud-amber-bright)',
                      cursor: 'pointer',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      fontFamily: "'Share Tech Mono', monospace"
                    }}
                  >
                    CLEAR ALL
                  </button>
                )}
              </div>

              {notifications.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: '10px 12px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid',
                        borderColor: n.type === 'warning' ? 'var(--border-amber)' : 'var(--border-cyan)',
                        fontSize: '0.78rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '10px'
                      }}
                    >
                      <div>
                        <strong style={{ color: n.type === 'warning' ? 'var(--hud-amber-bright)' : 'var(--hud-cyan-bright)', display: 'block', fontSize: '0.78rem' }}>
                          {n.title}
                        </strong>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', margin: '2px 0 0' }}>
                          {n.desc}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDismissOne(n.id)}
                        title="Dismiss"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                      >
                        <Trash2 size={12} color="var(--hud-amber)" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--hud-cyan-bright)', fontSize: '0.82rem' }}>
                  ✓ All caught up! No pending tasks right now.
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </header>
  );
}
