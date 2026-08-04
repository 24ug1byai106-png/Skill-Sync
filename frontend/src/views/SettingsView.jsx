import React from 'react';
import { User, Shield, Activity, Key, CheckCircle2 } from 'lucide-react';

export default function SettingsView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2>Account Settings & System Health</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your profile credentials, Supabase session, and API settings.</p>
      </div>

      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3>Account Credentials</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Full Name</label>
            <input className="form-input" defaultValue="Vishnu Karanth" />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Address</label>
            <input className="form-input" defaultValue="vishnu@university.edu" disabled />
          </div>
        </div>

        <button className="btn-primary" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
      </div>

      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3>API Connections Status</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <span>FastAPI REST Backend (`http://localhost:8000`)</span>
            <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={16} /> Connected
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <span>Supabase Auth & Storage (`pylupxecznfdwnurlyvj`)</span>
            <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={16} /> Connected
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <span>Groq Llama 3.3 70B Model</span>
            <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={16} /> Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
