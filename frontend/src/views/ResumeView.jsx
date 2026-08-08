import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, ArrowRight, RefreshCw, Check, X, Eye } from 'lucide-react';
import { computeCareerAnalysis } from '../services/analysisEngine';
import AIResumeBuilder from '../components/AIResumeBuilder';

export default function ResumeView({ userData = {}, onUpdateUserData }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [file, setFile] = useState(userData.resumeFile || null);
  const [showResumePreview, setShowResumePreview] = useState(false);

  // Textarea starts completely EMPTY by default
  const [pastedText, setPastedText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(() => computeCareerAnalysis(userData));

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target.result || '').toString();
        const fileName = selectedFile.name || 'Resume.pdf';
        const existingText = userData.resumeText || '';
        const combinedText = `${existingText} ${text} ${fileName}`.replace(/undefined/gi, '').trim();

        if (onUpdateUserData) {
          onUpdateUserData({
            resumeFile: { name: fileName },
            resumeText: combinedText
          });
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handlePastedTextChange = (e) => {
    const text = e.target.value.replace(/undefined/gi, '');
    setPastedText(text);
    setSuccessMsg('');
  };

  const handleAnalyze = () => {
    if (!pastedText.trim() && !file) return;

    setAnalyzing(true);
    setSuccessMsg('');

    setTimeout(() => {
      const fileNameStr = file && file.name ? file.name : '';
      const existingText = userData.resumeText || '';
      // Accumulate newly pasted skills into global resumeText so skills build up globally!
      const combinedText = `${existingText} ${fileNameStr} ${pastedText}`.replace(/undefined/gi, '').trim();

      if (onUpdateUserData) {
        onUpdateUserData({
          resumeFile: file && file.name ? { name: file.name } : userData.resumeFile,
          resumeText: combinedText
        });
      }

      const updated = computeCareerAnalysis({
        ...userData,
        resumeText: combinedText,
        resumeFile: file && file.name ? { name: file.name } : userData.resumeFile
      });

      setAnalysisResult(updated);
      setAnalyzing(false);
      setSuccessMsg('✓ Skills extracted! Updated across all platform views (Dashboard, Skill Gap, Career DNA & Roadmap).');

      // Clear the textarea after parsing per user request
      setPastedText('');

      // Auto-clear success message after 5 seconds
      setTimeout(() => setSuccessMsg(''), 5000);
    }, 500);
  };

  useEffect(() => {
    setAnalysisResult(computeCareerAnalysis(userData));
  }, [userData]);

  const hasResumeData = Boolean(userData.resumeText || userData.resumeFile || analysisResult.atsScore > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: 'var(--hud-cyan-bright)', fontFamily: "'Share Tech Mono', monospace" }}>AI RESUME INTELLIGENCE & BUILDER</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Upload your resume, paste your skills, or let AI generate a brand new professional ATS-optimized resume for you.
          </p>
        </div>
      </div>

      {/* Upload & Paste Box */}
      <div className="hud-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', background: 'var(--bg-panel)' }}>
        
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: (file || userData.resumeFile) ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 159, 28, 0.1)',
          border: (file || userData.resumeFile) ? '1px solid var(--border-cyan)' : '1px solid var(--border-amber)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {(file || userData.resumeFile) ? <CheckCircle2 size={32} color="var(--hud-cyan-bright)" /> : <Upload size={28} color="var(--hud-amber-bright)" />}
        </div>

        {(file || userData.resumeFile) ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '10px 18px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--border-cyan)', color: 'var(--hud-cyan-bright)', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Share Tech Mono', monospace" }}>
              <CheckCircle2 size={18} /> Resume Uploaded: {file && file.name ? file.name : (userData.resumeFile ? userData.resumeFile.name : 'Resume.pdf')}
            </div>

            <label htmlFor="resume-input" style={{ color: 'var(--hud-amber-bright)', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Share Tech Mono', monospace" }}>
              Change / Replace Resume File
            </label>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--hud-cyan-bright)' }}>Upload Your Resume File</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Supports PDF, Word, and Text files</p>
            </div>

            <label htmlFor="resume-input" className="btn-secondary" style={{ cursor: 'pointer' }}>
              <Upload size={16} /> Choose Resume File
            </label>
          </>
        )}

        <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} id="resume-input" style={{ display: 'none' }} />

        {/* Text Area for direct paste fallback */}
        <div style={{ width: '100%', maxWidth: '640px', marginTop: '8px' }}>
          <label style={{ fontSize: '0.82rem', color: 'var(--hud-cyan-bright)', marginBottom: '6px', display: 'block', textAlign: 'left', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
            Or paste your resume text / skills directly:
          </label>
          
          <textarea
            className="form-input"
            rows={4}
            placeholder="Paste skills (e.g. Git, REST API, Python, Docker, React, PyTorch), experience, or project details here..."
            value={pastedText}
            onChange={handlePastedTextChange}
            style={{ width: '100%', resize: 'vertical', fontSize: '0.88rem', fontFamily: "'Share Tech Mono', monospace" }}
          />

          <button
            className="btn-hud-cyan"
            onClick={handleAnalyze}
            disabled={analyzing || (!pastedText.trim() && !file)}
            style={{ marginTop: '12px', width: '100%', justifyContent: 'center', opacity: (!pastedText.trim() && !file) ? 0.5 : 1 }}
          >
            {analyzing ? <RefreshCw size={16} className="spin" /> : <Sparkles size={16} />}
            {analyzing ? 'PARSING & UPDATING PLATFORM...' : 'PARSE RESUME TEXT & UPDATE SKILLS ACROSS ALL PLATFORM VIEWS'}
          </button>

          {/* Success Banner */}
          {successMsg && (
            <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--border-cyan)', color: 'var(--hud-cyan-bright)', fontSize: '0.82rem', fontWeight: 700, textAlign: 'center', fontFamily: "'Share Tech Mono', monospace" }}>
              {successMsg}
            </div>
          )}
        </div>
      </div>

      {/* Dynamic ATS Score & Analysis Result */}
      {hasResumeData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          
          {/* ATS Score Card */}
          <div className="hud-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', background: 'var(--bg-panel)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Share Tech Mono', monospace" }}>Calculated ATS Score</span>
            
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              border: '2px dashed var(--hud-cyan-bright)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px var(--hud-cyan-glow)'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'rgba(0, 229, 255, 0.08)',
                border: '1px solid var(--hud-cyan-bright)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 800,
                color: 'var(--hud-cyan-bright)'
              }}>
                {analysisResult.atsScore}%
              </div>
            </div>

            <p style={{ color: analysisResult.atsScore > 65 ? 'var(--hud-cyan-bright)' : 'var(--hud-amber-bright)', fontWeight: 700, fontSize: '0.9rem' }}>
              {analysisResult.atsScore > 75 ? '✓ Excellent Role Match!' : analysisResult.atsScore > 50 ? '✓ Good Baseline Match' : '⚠ Requires Keyword Enhancement'}
            </p>
          </div>

          {/* Details & Action Items */}
          <div className="hud-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-panel)' }}>
            <h3 style={{ color: 'var(--hud-cyan-bright)', margin: 0 }}>Target Role: {analysisResult.targetGoal} Analysis</h3>
            
            <div>
              <h4 style={{ fontSize: '0.88rem', color: 'var(--hud-cyan-bright)', marginBottom: '8px' }}>Matched Technical Skills ({analysisResult.matchedSkills.length})</h4>
              {analysisResult.matchedSkills.length > 0 ? (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {analysisResult.matchedSkills.map((s, i) => (
                    <span key={i} className="tag-acquired">✓ {s}</span>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>No target role skills detected yet. Paste your skills above and click Parse.</p>
              )}
            </div>

            <div>
              <h4 style={{ fontSize: '0.88rem', color: 'var(--hud-amber-bright)', marginBottom: '8px' }}>Missing Core Keywords for {analysisResult.targetGoal} ({analysisResult.missingSkills.length})</h4>
              {analysisResult.missingSkills.length > 0 ? (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {analysisResult.missingSkills.map((s, i) => (
                    <span key={i} className="tag-gap-secondary">Need: {s}</span>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--hud-cyan-bright)', margin: 0 }}>✓ Great job! All core skills present in your resume.</p>
              )}
            </div>

            <div style={{ background: '#0A0B0D', padding: '14px', border: '1px solid var(--border-cyan)' }}>
              <h4 style={{ fontSize: '0.82rem', color: 'var(--hud-cyan-bright)', marginBottom: '6px' }}>Actionable Resume Enhancements</h4>
              <ul style={{ paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: '1.6', margin: 0 }}>
                {analysisResult.missingSkills.slice(0, 3).map((s, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>Add project experience highlighting <strong>{s}</strong> to boost your ATS match score.</li>
                ))}
                <li>Include quantifiable metrics (e.g., "Built microservices API reducing latency by 30%").</li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* NEW FEATURE: AI RESUME BUILDER (Placed below Resume Upload section) */}
      <AIResumeBuilder userData={userData} onUpdateUserData={onUpdateUserData} />

      {/* RESUME PREVIEW MODAL */}
    </div>
  );
}
