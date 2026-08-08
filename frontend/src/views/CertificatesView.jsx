import React, { useState } from 'react';
import { Award, Upload, Trash2, CheckCircle2 } from 'lucide-react';

export default function CertificatesView({ userData = {}, onUpdateUserData }) {
  const [certs, setCerts] = useState(userData.certificates || []);

  const handleUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      const isPdf = f.type.includes('pdf') || f.name.toLowerCase().endsWith('.pdf');
      const isImage = f.type.includes('image') || /\.(png|jpg|jpeg|gif|webp)$/i.test(f.name);

      const newCert = {
        id: Date.now(),
        name: f.name,
        type: isPdf ? 'PDF Document' : (isImage ? 'Image File' : f.type || 'Document'),
        issueDate: new Date().toISOString().split('T')[0],
        verified: true
      };

      const updatedList = [newCert, ...certs];
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
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ color: 'var(--hud-cyan-bright)', fontFamily: "'Share Tech Mono', monospace", margin: 0 }}>
            CERTIFICATE VAULT & VERIFICATION
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '4px 0 0' }}>
            Upload verifiable certificates (PDF, PNG, JPG) to boost your Certificate Readiness Score.
          </p>
        </div>

        <input 
          type="file" 
          id="cert-page-upload" 
          accept=".pdf,.png,.jpg,.jpeg,.webp" 
          style={{ display: 'none' }} 
          onChange={handleUpload} 
        />
        <label 
          htmlFor="cert-page-upload" 
          className="btn-hud-cyan" 
          style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}
        >
          <Upload size={16} /> UPLOAD NEW CERTIFICATE
        </label>
      </div>

      {/* Certificate Grid */}
      {certs.length === 0 ? (
        <div className="hud-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-panel)' }}>
          <Award size={48} color="var(--hud-cyan-bright)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--hud-cyan-bright)', fontFamily: "'Share Tech Mono', monospace" }}>
            NO CERTIFICATES UPLOADED YET
          </h3>
          <p style={{ fontSize: '0.85rem', marginTop: '6px', color: 'var(--text-secondary)' }}>
            Upload your AWS, PyTorch, Docker, Python, or Full Stack certificates to verify your credentials.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {certs.map(c => (
            <div 
              key={c.id} 
              className="hud-panel" 
              style={{ 
                padding: '24px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px', 
                background: 'var(--bg-panel)',
                borderLeft: '4px solid var(--hud-amber-bright)' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '8px', 
                  background: 'rgba(255, 159, 28, 0.12)', 
                  border: '1px solid var(--border-amber)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Award size={22} color="var(--hud-amber-bright)" />
                </div>

                <span style={{ 
                  fontSize: '0.72rem', 
                  color: '#10B981', 
                  background: 'rgba(16, 185, 129, 0.12)', 
                  border: '1px solid #10B981', 
                  padding: '2px 8px', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  fontFamily: "'Share Tech Mono', monospace" 
                }}>
                  <CheckCircle2 size={12} /> VERIFIED
                </span>
              </div>

              <div>
                <h4 style={{ 
                  fontSize: '0.95rem', 
                  color: 'var(--text-primary)', 
                  margin: '0 0 4px', 
                  wordBreak: 'break-word',
                  fontFamily: "'Share Tech Mono', monospace" 
                }}>
                  {c.name.toUpperCase()}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Uploaded: {c.issueDate || 'Today'} · {c.type || 'Credential Document'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <button 
                  onClick={() => handleDelete(c.id)} 
                  style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Delete Certificate"
                >
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
