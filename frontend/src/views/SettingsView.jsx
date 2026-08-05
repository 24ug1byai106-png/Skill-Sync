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
            <input className="form-input" placeholder="Your Full Name" />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Address</label>
            <input className="form-input" placeholder="your.email@university.edu" disabled />
          </div>
        </div>

        <button className="btn-primary" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
      </div>

    </div>
  );
}
