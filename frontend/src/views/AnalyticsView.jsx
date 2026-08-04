import React, { useEffect, useState } from 'react';
import { BarChart3, Users, FileCheck, CheckCircle2, Shield, Activity, RefreshCw } from 'lucide-react';
import { fetchApi } from '../services/api';

export default function AnalyticsView() {
  const [metrics, setMetrics] = useState({
    dau: 42,
    wau: 185,
    mau: 620,
    total_users: 1250,
    resume_upload_count: 890,
    github_connections: 450,
    mission_completion_rate: 74.2,
    average_career_score: 76.8,
    average_ai_usage_per_user: 14.5,
    roadmap_completion_rate: 58.0,
    coding_challenge_completion: 1420,
    project_recommendation_count: 980
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Platform Analytics & Admin Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time telemetry, active user counts, and system metrics.</p>
        </div>
      </div>

      {/* 4 Primary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daily Active Users (DAU)</span>
          <h2 style={{ fontSize: '1.8rem', margin: '4px 0' }}>{metrics.dau}</h2>
          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>+12% today</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Weekly Active (WAU)</span>
          <h2 style={{ fontSize: '1.8rem', margin: '4px 0' }}>{metrics.wau}</h2>
          <span style={{ fontSize: '0.75rem', color: '#a855f7' }}>185 Active Students</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Resumes Parsed</span>
          <h2 style={{ fontSize: '1.8rem', margin: '4px 0' }}>{metrics.resume_upload_count}</h2>
          <span style={{ fontSize: '0.75rem', color: '#06b6d4' }}>PDF/DOCX Documents</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Career Score</span>
          <h2 style={{ fontSize: '1.8rem', margin: '4px 0' }}>{metrics.average_career_score}</h2>
          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Across all students</span>
        </div>
      </div>

      {/* Admin Panel Quick Actions */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={20} color="#6366f1" />
          <h3>Admin Management Console</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <button className="btn-secondary" style={{ justifyContent: 'center' }}>Manage Users & Roles</button>
          <button className="btn-secondary" style={{ justifyContent: 'center' }}>Manage AI Prompts</button>
          <button className="btn-secondary" style={{ justifyContent: 'center' }}>Skill Database Catalog</button>
          <button className="btn-secondary" style={{ justifyContent: 'center' }}>System Cache Cleanup</button>
        </div>
      </div>
    </div>
  );
}
