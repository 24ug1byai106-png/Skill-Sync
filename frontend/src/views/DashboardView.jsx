import React, { useEffect, useState } from 'react';
import { Trophy, Zap, ShieldCheck, Flame, CheckCircle, ArrowUpRight, TrendingUp, Cpu, Award, Star, Code, BookOpen } from 'lucide-react';
import { fetchApi } from '../services/api';

export default function DashboardView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/dashboard/optimized').then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', color: 'var(--text-secondary)' }}>Loading SkillSync AI Dashboard...</div>;
  }

  const score = data?.career_readiness || 78.5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Executive Hero Banner */}
      <div className="glass-panel" style={{
        padding: '32px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#a855f7' }}>
            SKILLSYNC AI CAREER OPERATING SYSTEM
          </span>
          <h1 style={{ fontSize: '2.4rem', margin: '8px 0' }}>
            You're <span className="gradient-text">78.5% Placement Ready</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Target Goal: <strong>Backend Developer</strong>. Your Python and FastAPI foundations are strong. Complete your Kubernetes & Redis weekly missions to reach 90%+ placement readiness.
          </p>
        </div>
        
        {/* Score Ring */}
        <div style={{
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          background: 'var(--accent-gradient)',
          padding: '4px',
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
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
            <span style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>out of 100</span>
          </div>
        </div>
      </div>

      {/* 6 Metric Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem' }}>Resume Score</span>
            <Trophy size={16} color="#3b82f6" />
          </div>
          <h2 style={{ fontSize: '1.7rem' }}>82%</h2>
          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>+5% ATS Match</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem' }}>GitHub Score</span>
            <Zap size={16} color="#8b5cf6" />
          </div>
          <h2 style={{ fontSize: '1.7rem' }}>75%</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3 Repos Synced</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem' }}>Coding Score</span>
            <Code size={16} color="#06b6d4" />
          </div>
          <h2 style={{ fontSize: '1.7rem' }}>85%</h2>
          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>85% Accepted</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem' }}>Project Score</span>
            <Star size={16} color="#f59e0b" />
          </div>
          <h2 style={{ fontSize: '1.7rem' }}>78%</h2>
          <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>1 Microservices Proj</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem' }}>Certificate Score</span>
            <Award size={16} color="#ec4899" />
          </div>
          <h2 style={{ fontSize: '1.7rem' }}>90%</h2>
          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>2 Verifiable Certs</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem' }}>Learning Streak</span>
            <Flame size={16} color="#f59e0b" />
          </div>
          <h2 style={{ fontSize: '1.7rem' }}>12 Days</h2>
          <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>🔥 630 Total XP</span>
        </div>
      </div>

      {/* Main Grid: Career DNA & Priority Gaps */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3>Skill Gap & Recommended Priorities</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {["Kubernetes", "Redis Caching", "Kafka Event Streams", "AWS Lambda"].map((skill, i) => (
              <span key={i} style={{
                background: 'rgba(236, 72, 153, 0.12)',
                color: '#ec4899',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                Missing: {skill}
              </span>
            ))}
          </div>

          <div style={{ background: 'rgba(10, 14, 23, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Learning Order Recommendation</h4>
            <ol style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.8' }}>
              <li>Week 1: Implement Redis Caching Layer in FastAPI backend</li>
              <li>Week 2-3: Dockerize microservices and write Kubernetes manifests</li>
              <li>Week 4: Integrate Kafka distributed event streaming</li>
            </ol>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3>Recent Activities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { action: "Resume ATS Score Generated (84%)", time: "10 mins ago" },
              { action: "Connected GitHub @vishnukaranth", time: "1 hour ago" },
              { action: "Uploaded AWS Certified Developer Certificate", time: "2 hours ago" },
              { action: "Completed Weekly Mission: Learn Docker", time: "Yesterday" }
            ].map((act, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)' }}>
                <CheckCircle size={18} color="#10b981" />
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{act.action}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
