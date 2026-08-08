import React, { useState } from 'react';
import { Award, Upload, Trash2, ExternalLink, CheckCircle2, ShieldCheck, X, Eye, Image as ImageIcon } from 'lucide-react';

const DEFAULT_CERT_PHOTO = "https://images.unsplash.com/photo-1589330694653-aded6f773eb0?w=800&auto=format&fit=crop&q=80";

export default function CertificatesView({ userData = {}, onUpdateUserData }) {
  const [certs, setCerts] = useState(userData.certificates || []);
  const [previewCert, setPreviewCert] = useState(null);

  const handleUpload = (e, targetCertId = null) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      const isPdf = f.type.includes('pdf') || f.name.toLowerCase().endsWith('.pdf');
      const isImage = f.type.includes('image') || /\.(png|jpg|jpeg|gif|webp)$/i.test(f.name);

      const reader = new FileReader();
      reader.onload = (event) => {
        const fileDataUrl = event.target.result;

        if (targetCertId) {
          // Attach photo to existing certificate entry
          const updatedList = certs.map(c => {
            if (c.id === targetCertId) {
              return {
                ...c,
                fileUrl: fileDataUrl,
                fileType: f.type,
                isImage,
                isPdf
              };
            }
            return c;
          });
          setCerts(updatedList);
          if (previewCert && previewCert.id === targetCertId) {
            setPreviewCert({
              ...previewCert,
              fileUrl: fileDataUrl,
              isImage,
              isPdf
            });
          }
          if (onUpdateUserData) {
            onUpdateUserData({ certificates: updatedList });
          }
        } else {
          // New Upload
          const newCert = {
            id: Date.now(),
            name: f.name,
            type: isPdf ? 'PDF Document' : (isImage ? 'Image File' : 'Document'),
            issueDate: new Date().toISOString().split('T')[0],
            verified: true,
            fileUrl: fileDataUrl,
            fileType: f.type,
            isImage,
            isPdf
          };

          const updatedList = [newCert, ...certs];
          setCerts(updatedList);
          if (onUpdateUserData) {
            onUpdateUserData({ certificates: updatedList });
          }
        }
      };

      reader.readAsDataURL(f);
    }
  };

  const handleDelete = (id) => {
    const updatedList = certs.filter(c => c.id !== id);
    setCerts(updatedList);
    if (previewCert && previewCert.id === id) {
      setPreviewCert(null);
    }
    if (onUpdateUserData) {
      onUpdateUserData({ certificates: updatedList });
    }
  };

  const handleOpenPreview = (cert) => {
    setPreviewCert(cert);
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
          onChange={(e) => handleUpload(e)} 
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
          {certs.map(c => {
            const displayPhoto = c.fileUrl || DEFAULT_CERT_PHOTO;

            return (
              <div 
                key={c.id} 
                className="hud-panel" 
                style={{ 
                  padding: '20px', 
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
                    Uploaded: {c.issueDate || 'Today'} · {c.type || 'Certificate Document'}
                  </p>
                </div>

                {/* Interactive Thumbnail Photo Box */}
                <div 
                  onClick={() => handleOpenPreview(c)}
                  style={{ 
                    height: '130px', 
                    borderRadius: '4px', 
                    overflow: 'hidden', 
                    border: '1px solid var(--border-cyan)', 
                    cursor: 'pointer',
                    position: 'relative',
                    background: '#000'
                  }}
                >
                  <img 
                    src={displayPhoto} 
                    alt={c.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: 'var(--hud-cyan-bright)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    fontFamily: "'Share Tech Mono', monospace"
                  }}>
                    <Eye size={18} /> CLICK TO ENLARGE CERTIFICATE PHOTO
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <button 
                    onClick={() => handleOpenPreview(c)}
                    className="btn-hud-amber" 
                    style={{ fontSize: '0.78rem', padding: '6px 14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                  >
                    <Eye size={14} /> PREVIEW PHOTO
                  </button>

                  <button 
                    onClick={() => handleDelete(c.id)} 
                    style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                    title="Delete Certificate"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CERTIFICATE PREVIEW MODAL */}
      {previewCert && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 7, 11, 0.88)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div className="hud-panel" style={{
            width: '100%',
            maxWidth: '900px',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            background: '#07090E',
            border: '2px solid var(--hud-cyan-bright)',
            boxShadow: '0 0 50px var(--hud-cyan-glow)',
            padding: '28px',
            overflowY: 'auto'
          }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--hud-amber-bright)', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
                  CERTIFICATE DOCUMENT PREVIEW
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--hud-cyan-bright)', margin: '2px 0 0', fontFamily: "'Share Tech Mono', monospace" }}>
                  {previewCert.name.toUpperCase()}
                </h3>
              </div>

              <button 
                onClick={() => setPreviewCert(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={24} color="var(--hud-cyan-bright)" />
              </button>
            </div>

            {/* Modal Certificate Photo Container */}
            <div style={{
              background: '#030407',
              border: '1px solid var(--border-cyan)',
              borderRadius: '6px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '380px'
            }}>
              {previewCert.isPdf || previewCert.type?.includes('pdf') || previewCert.name?.endsWith('.pdf') ? (
                previewCert.fileUrl ? (
                  <iframe 
                    src={previewCert.fileUrl} 
                    title={previewCert.name}
                    style={{ width: '100%', height: '520px', border: 'none', borderRadius: '4px' }}
                  />
                ) : (
                  <img 
                    src={DEFAULT_CERT_PHOTO} 
                    alt={previewCert.name}
                    style={{ maxWidth: '100%', maxHeight: '550px', objectFit: 'contain', borderRadius: '4px', border: '2px solid var(--hud-cyan-bright)', boxShadow: '0 0 25px var(--hud-cyan-glow)' }}
                  />
                )
              ) : (
                <img 
                  src={previewCert.fileUrl || DEFAULT_CERT_PHOTO} 
                  alt={previewCert.name}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '560px', 
                    objectFit: 'contain', 
                    borderRadius: '4px', 
                    border: '2px solid var(--hud-cyan-bright)',
                    boxShadow: '0 0 30px var(--hud-cyan-glow)' 
                  }}
                />
              )}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="file" 
                  id={`replace-cert-photo-${previewCert.id}`}
                  accept=".png,.jpg,.jpeg,.webp,.pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => handleUpload(e, previewCert.id)}
                />
                <label 
                  htmlFor={`replace-cert-photo-${previewCert.id}`}
                  style={{
                    background: 'rgba(0, 229, 255, 0.1)',
                    border: '1px solid var(--border-cyan)',
                    color: 'var(--hud-cyan-bright)',
                    padding: '8px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: "'Share Tech Mono', monospace"
                  }}
                >
                  <ImageIcon size={14} /> [ ATTACH / REPLACE CERTIFICATE PHOTO ]
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {previewCert.fileUrl && (
                  <a
                    href={previewCert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-hud-cyan"
                    style={{ padding: '8px 16px', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    [ ↗ OPEN FULL PHOTO ] <ExternalLink size={14} />
                  </a>
                )}

                <button
                  onClick={() => setPreviewCert(null)}
                  className="btn-hud-amber"
                  style={{ padding: '8px 18px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  [ CLOSE PREVIEW ]
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
