import React, { useState } from 'react';
import { Search, Bell, Sparkles, Activity, ShieldCheck } from 'lucide-react';

export default function Header({ user, onSearch }) {
  const [query, setQuery] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <header style={{
      height: '66px',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(7, 9, 14, 0.7)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '380px' }}>
        <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Search skills, projects, roadmaps, certificates..."
          className="form-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ paddingLeft: '40px', fontSize: '0.85rem', height: '38px' }}
        />
      </form>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <Activity size={14} color="#10b981" />
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>FastAPI REST Online</span>
        </div>

        {/* Notifications Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              position: 'relative'
            }}
          >
            <Bell size={16} />
            <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899' }} />
          </button>

          {/* Notif Dropdown */}
          {showNotifs && (
            <div className="glass-panel" style={{ position: 'absolute', right: 0, top: '48px', width: '320px', padding: '16px', zIndex: 100 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.85rem' }}>SkillSync AI Notifications</h4>
                <span style={{ fontSize: '0.75rem', color: '#3b82f6', cursor: 'pointer' }}>Mark all read</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', fontSize: '0.8rem' }}>
                  <strong>Weekly Mission Deadline</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Deploy FastAPI backend on Railway by Aug 17.</p>
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', fontSize: '0.8rem' }}>
                  <strong>Resume Intelligence Ready</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>ATS Match: 84%. 3 new keyword suggestions.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Model Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(139, 92, 246, 0.1)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(139, 92, 246, 0.25)' }}>
          <Sparkles size={14} color="#a855f7" />
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Groq Llama 3.3 70B</span>
        </div>
      </div>
    </header>
  );
}
