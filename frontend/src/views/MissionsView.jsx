import React, { useState } from 'react';
import { Target, CheckCircle2, Award, Clock, Upload, Plus } from 'lucide-react';

export default function MissionsView() {
  const [missions, setMissions] = useState([
    { id: 1, title: "Learn Docker & Write Multi-Stage Dockerfile", xp: 150, deadline: "Aug 10", status: "completed" },
    { id: 2, title: "Deploy FastAPI Backend Container on Railway", xp: 200, deadline: "Aug 17", status: "in_progress" },
    { id: 3, title: "Implement Redis Caching Layer for Dashboard", xp: 180, deadline: "Aug 24", status: "pending" },
    { id: 4, title: "Solve 5 LeetCode Medium Dynamic Programming Problems", xp: 100, deadline: "Aug 31", status: "pending" }
  ]);

  const toggleMission = (id) => {
    setMissions(missions.map(m => {
      if (m.id === id) {
        return { ...m, status: m.status === 'completed' ? 'pending' : 'completed' };
      }
      return m;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Weekly AI Missions & Daily Preparation</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Dynamic actionable tasks assigned weekly by Groq AI to close your skill gaps.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem' }}>
          <Award size={16} /> 630 Total XP
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {missions.map(m => (
          <div
            key={m.id}
            onClick={() => toggleMission(m.id)}
            className="glass-panel"
            style={{
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderColor: m.status === 'completed' ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <input
                type="checkbox"
                checked={m.status === 'completed'}
                onChange={() => {}}
                style={{ width: '20px', height: '20px', accentColor: '#3b82f6' }}
              />
              <div>
                <h4 style={{ fontSize: '1rem', textDecoration: m.status === 'completed' ? 'line-through' : 'none', color: m.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                  {m.title}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deadline: {m.deadline}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
              +{m.xp} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
