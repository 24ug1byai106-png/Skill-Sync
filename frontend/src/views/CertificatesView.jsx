import React, { useState } from 'react';
import { Award, Upload, Trash2, ExternalLink, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';

export default function CertificatesView({ userData = {}, onUpdateUserData }) {
  const [certs, setCerts] = useState(userData.certificates || []);

  const handleUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      const newCert = {
        id: Date.now(),
        name: f.name,
        type: f.type.includes('pdf') ? 'PDF Document' : 'Image File',
        issueDate: new Date().toISOString().split('T')[0],
        verified: true
      };
      const updatedList = [...certs, newCert];
      setCerts(updatedList);
      if (onUpdateUserData) {
        onUpdateUserData({ certificates: updatedList });
      }
    }
  };

  const handleDelete = (id) => {
    const updatedList = certs.filter(c => c.id !== id);
    setCerts(updatedList);
    if (onUpdateUserData) {
      onUpdateUserData({ certificates: updatedList });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Certificate Vault & Verification</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Upload verifiable certificates (PDF, PNG, JPG) to boost your Certificate Score.</p>
        </div>

        <input type="file" id="cert-page-upload" accept=".pdf,.png,.jpg,.jpeg" style={{ display: 'none' }} onChange={handleUpload} />
        <label htmlFor="cert-page-upload" className="btn-primary" style={{ cursor: 'pointer' }}>
          <Upload size={16} /> Upload New Certificate
        </label>
      </div>

      {certs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Award size={40} color="#06b6d4" style={{ marginBottom: '12px' }} />
          <h3>No Certificates Uploaded Yet</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Upload your AWS, Docker, Python, or Web Development certificates to boost your score!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {certs.map(c => (
            <div key={c.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={24} color="#06b6d4" />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} /> Verifiable
                </span>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{c.name}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Uploaded: {c.issueDate || 'Today'} • {c.type || 'Credential'}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                  <ExternalLink size={14} /> Preview
                </button>
                <button onClick={() => handleDelete(c.id)} style={{ background: 'transparent', border: 'none', color: '#ec4899', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
