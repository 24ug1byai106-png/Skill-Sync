import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, FileText, Download, Edit3, RefreshCw, CheckCircle2, AlertTriangle, User, Mail, Phone, MapPin, Globe, Award, Briefcase, GraduationCap, Code2 } from 'lucide-react';
import { buildAtsResumeFromText } from '../services/resumeBuilderEngine';

export default function AIResumeBuilder({ userData = {}, onUpdateUserData }) {
  const [inputText, setInputText] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState(() => userData.generatedResume || null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [missingData, setMissingData] = useState({ email: '', phone: '', degree: '' });

  const paperRef = useRef(null);

  useEffect(() => {
    if (userData.generatedResume) {
      setGeneratedResume(userData.generatedResume);
    }
  }, [userData.generatedResume]);

  const placeholderText = `Paste anything about yourself...

Example:
- Your education
- Skills
- Projects
- Internships
- Certifications
- Work experience
- Achievements
- Hackathons
- Leadership roles
- Clubs
- Languages
- Career objective

It doesn't need to be formatted. Just write naturally.`;

  const handleGenerate = () => {
    if (!inputText.trim()) return;

    setGenerating(true);
    setTimeout(() => {
      const result = buildAtsResumeFromText(inputText, userData.profile || {});

      if (result && result.missingFields.length > 0 && (!userData.profile?.email || !userData.profile?.phone)) {
        setShowMissingModal(true);
      }

      setGeneratedResume(result);
      setGenerating(false);

      // Auto-update student profile data & scores across SkillSync AI
      if (onUpdateUserData && result) {
        const skillsStr = result.skills ? Object.values(result.skills).flat().join(' ') : '';
        const projsStr = result.projects ? result.projects.map(p => `${p.title} ${p.tech}`).join(' ') : '';
        const resumeTextStr = `${result.summary} ${skillsStr} ${projsStr}`;

        onUpdateUserData({
          generatedResume: result,
          resumeText: resumeTextStr,
          profile: {
            ...userData.profile,
            fullName: result.personal.fullName,
            email: result.personal.email || missingData.email || userData.profile?.email,
            phone: result.personal.phone || missingData.phone || userData.profile?.phone
          }
        });
      }
    }, 800);
  };

  const handleSaveMissingData = () => {
    if (generatedResume) {
      const updated = {
        ...generatedResume,
        personal: {
          ...generatedResume.personal,
          email: missingData.email || generatedResume.personal.email,
          phone: missingData.phone || generatedResume.personal.phone
        },
        education: {
          ...generatedResume.education,
          degree: missingData.degree || generatedResume.education.degree
        }
      };
      setGeneratedResume(updated);

      if (onUpdateUserData) {
        const skillsStr = updated.skills ? Object.values(updated.skills).flat().join(' ') : '';
        const projsStr = updated.projects ? updated.projects.map(p => `${p.title} ${p.tech}`).join(' ') : '';
        const resumeTextStr = `${updated.summary} ${skillsStr} ${projsStr}`;

        onUpdateUserData({
          generatedResume: updated,
          resumeText: resumeTextStr,
          profile: {
            ...userData.profile,
            email: updated.personal.email,
            phone: updated.personal.phone
          }
        });
      }
    }
    setShowMissingModal(false);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleDownloadDOCX = () => {
    if (!generatedResume) return;

    const r = generatedResume;
    const docContent = `
================================================================================
${r.personal.fullName.toUpperCase()}
Email: ${r.personal.email} | Phone: ${r.personal.phone} | Location: ${r.personal.location}
GitHub: ${r.personal.github} | LinkedIn: ${r.personal.linkedin}
================================================================================

PROFESSIONAL SUMMARY
${r.summary}

TECHNICAL SKILLS
- Languages: ${r.skills.languages.join(', ')}
- Frameworks & Libraries: ${r.skills.frameworks.join(', ')}
- Tools & Cloud: ${r.skills.tools.join(', ')}
- Databases: ${r.skills.databases.join(', ')}

EDUCATION
${r.education.degree} | ${r.education.college} | ${r.education.year}
${r.education.gpa}

TECHNICAL PROJECTS
${r.projects.map(p => `
* ${p.title} (${p.tech})
${p.bullets.map(b => `  - ${b}`).join('\n')}
`).join('\n')}

CERTIFICATIONS
${r.certifications.map(c => `* ${c}`).join('\n')}

ACHIEVEMENTS & HACKATHONS
${r.achievements.map(a => `* ${a}`).join('\n')}

POSITIONS OF RESPONSIBILITY
${r.leadership.map(l => `* ${l}`).join('\n')}

LANGUAGES
${r.languages.join(', ')}
    `;

    const blob = new Blob([docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${r.personal.fullName.replace(/\s+/g, '_')}_ATS_Resume.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="hud-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--bg-panel)' }}>
      
      {/* Title & Subtitle */}
      <div style={{ borderBottom: '1px solid var(--border-cyan)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Sparkles color="var(--hud-cyan-bright)" size={22} />
          <h2 style={{ fontSize: '1.4rem', color: 'var(--hud-cyan-bright)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
            AI RESUME BUILDER
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Don't have a resume? Describe yourself, and AI will create a professional ATS-optimized resume.
        </p>
      </div>

      {/* Input Area */}
      {!generatedResume && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--hud-cyan-bright)', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
            [RAW NOTES // DESCRIBE YOUR EXPERIENCE & SKILLS]
          </label>
          
          <textarea
            className="form-input"
            rows={10}
            placeholder={placeholderText}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              width: '100%',
              resize: 'vertical',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              fontFamily: "'Share Tech Mono', monospace"
            }}
          />

          <button
            className="btn-hud-cyan"
            onClick={handleGenerate}
            disabled={generating || !inputText.trim()}
            style={{
              padding: '12px 28px',
              fontSize: '0.92rem',
              justifyContent: 'center',
              alignSelf: 'flex-start',
              opacity: !inputText.trim() ? 0.5 : 1
            }}
          >
            {generating ? <RefreshCw size={18} className="spin" /> : <Sparkles size={18} />}
            {generating ? 'ANALYZING & GENERATING RESUME...' : 'GENERATE PROFESSIONAL RESUME'}
          </button>
        </div>
      )}

      {/* Missing Information Prompt Modal / Card */}
      {showMissingModal && (
        <div style={{
          padding: '20px',
          background: 'rgba(255, 159, 28, 0.08)',
          border: '1px solid var(--hud-amber)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--hud-amber-bright)' }}>
            <AlertTriangle size={18} />
            <strong style={{ fontSize: '0.9rem', fontFamily: "'Share Tech Mono', monospace" }}>
              MISSING CONTACT & DEGREE DETAILS
            </strong>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
            Enter your missing contact information to complete your ATS header format:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <input
              type="text"
              placeholder="Email Address (e.g. alex@gmail.com)"
              className="form-input"
              value={missingData.email}
              onChange={e => setMissingData({ ...missingData, email: e.target.value })}
              style={{ fontSize: '0.8rem' }}
            />
            <input
              type="text"
              placeholder="Phone Number (e.g. +91 9876543210)"
              className="form-input"
              value={missingData.phone}
              onChange={e => setMissingData({ ...missingData, phone: e.target.value })}
              style={{ fontSize: '0.8rem' }}
            />
            <input
              type="text"
              placeholder="Degree & College (e.g. B.Tech CS, NIT)"
              className="form-input"
              value={missingData.degree}
              onChange={e => setMissingData({ ...missingData, degree: e.target.value })}
              style={{ fontSize: '0.8rem' }}
            />
          </div>

          <button className="btn-hud-amber" onClick={handleSaveMissingData} style={{ alignSelf: 'flex-start', padding: '6px 16px', fontSize: '0.78rem' }}>
            SAVE DETAILS & UPDATE RESUME
          </button>
        </div>
      )}

      {/* Generated Resume Actions & Realistic A4 Preview */}
      {generatedResume && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Action Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: '#07090E', padding: '14px 20px', border: '1px solid var(--border-cyan)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--hud-cyan-bright)' }}>
              <CheckCircle2 size={18} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
                ATS-OPTIMIZED RESUME GENERATED
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="btn-secondary" onClick={() => setIsEditing(!isEditing)} style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                <Edit3 size={14} /> {isEditing ? 'FINISH EDITING' : 'EDIT RESUME'}
              </button>
              <button className="btn-secondary" onClick={handleDownloadPDF} style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                <Download size={14} /> DOWNLOAD PDF
              </button>
              <button className="btn-secondary" onClick={handleDownloadDOCX} style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                <Download size={14} /> DOWNLOAD DOCX
              </button>
              <button className="btn-hud-cyan" onClick={() => setGeneratedResume(null)} style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                <RefreshCw size={14} /> REGENERATE RESUME
              </button>
            </div>
          </div>

          {/* Realistic A4 Document Sheet Preview */}
          <div
            ref={paperRef}
            className="a4-resume-sheet"
            style={{
              width: '100%',
              maxWidth: '820px',
              margin: '0 auto',
              background: '#ffffff',
              color: '#0f172a',
              padding: '44px 48px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              fontFamily: "'Inter', Arial, sans-serif",
              fontSize: '13px',
              lineHeight: 1.5,
              borderRadius: '2px',
              boxSizing: 'border-box'
            }}
          >
            {/* 1. Header & Contact */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a', margin: '0 0 6px 0' }}>
                {generatedResume.personal.fullName && generatedResume.personal.fullName.includes(' ') ? generatedResume.personal.fullName : (userData.profile?.fullName || 'Vishnu Karanth')}
              </h1>
              <div style={{ fontSize: '11px', color: '#475569', display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                {generatedResume.personal.email && <span>📧 {generatedResume.personal.email}</span>}
                {generatedResume.personal.phone && <span>📞 {generatedResume.personal.phone}</span>}
                {generatedResume.personal.location && <span>📍 {generatedResume.personal.location}</span>}
                {generatedResume.personal.linkedin && <span>🔗 {generatedResume.personal.linkedin}</span>}
                {generatedResume.personal.github && <span>💻 {generatedResume.personal.github}</span>}
              </div>
            </div>

            {/* 2. Professional Summary */}
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px', color: '#1e293b' }}>
                PROFESSIONAL SUMMARY
              </h2>
              <p style={{ color: '#334155', fontSize: '12px', margin: 0, textAlign: 'justify' }}>
                {generatedResume.summary}
              </p>
            </div>

            {/* 3. Technical Skills */}
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px', color: '#1e293b' }}>
                TECHNICAL SKILLS
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', color: '#334155' }}>
                <div><strong>Languages:</strong> {generatedResume.skills.languages.join(', ')}</div>
                <div><strong>Frameworks & Libraries:</strong> {generatedResume.skills.frameworks.join(', ')}</div>
                <div><strong>Tools & Cloud:</strong> {generatedResume.skills.tools.join(', ')}</div>
                <div><strong>Databases:</strong> {generatedResume.skills.databases.join(', ')}</div>
              </div>
            </div>

            {/* 4. Education */}
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px', color: '#1e293b' }}>
                EDUCATION
              </h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f172a' }}>
                <span>{generatedResume.education.degree}</span>
                <span>{generatedResume.education.year}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '11.5px' }}>
                <span>{generatedResume.education.college}</span>
                <span>{generatedResume.education.gpa}</span>
              </div>
            </div>

            {/* 5. Work Experience (if any) */}
            {generatedResume.experience && generatedResume.experience.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px', color: '#1e293b' }}>
                  WORK EXPERIENCE
                </h2>
                {generatedResume.experience.map((exp, idx) => (
                  <div key={idx} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f172a' }}>
                      <span>{exp.role} — {exp.company}</span>
                      <span>{exp.period}</span>
                    </div>
                    <ul style={{ margin: '4px 0 0 16px', padding: 0, color: '#334155' }}>
                      {exp.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* 6. Technical Projects */}
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px', color: '#1e293b' }}>
                PROJECTS
              </h2>
              {generatedResume.projects.map((proj, idx) => (
                <div key={idx} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f172a' }}>
                    <span>{proj.title}</span>
                    <span style={{ fontSize: '11px', color: '#475569', fontWeight: 500 }}>[{proj.tech}]</span>
                  </div>
                  <ul style={{ margin: '3px 0 0 16px', padding: 0, color: '#334155' }}>
                    {proj.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            {/* 7. Certifications */}
            <div style={{ marginBottom: '14px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px', color: '#1e293b' }}>
                CERTIFICATIONS
              </h2>
              <ul style={{ margin: '0 0 0 16px', padding: 0, color: '#334155' }}>
                {generatedResume.certifications.map((c, ci) => <li key={ci}>{c}</li>)}
              </ul>
            </div>

            {/* 8. Achievements */}
            <div style={{ marginBottom: '14px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px', color: '#1e293b' }}>
                ACHIEVEMENTS & HACKATHONS
              </h2>
              <ul style={{ margin: '0 0 0 16px', padding: 0, color: '#334155' }}>
                {generatedResume.achievements.map((a, ai) => <li key={ai}>{a}</li>)}
              </ul>
            </div>

            {/* 9. Leadership & Languages */}
            <div>
              <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px', color: '#1e293b' }}>
                POSITIONS OF RESPONSIBILITY & LANGUAGES
              </h2>
              <ul style={{ margin: '0 0 0 16px', padding: 0, color: '#334155' }}>
                {generatedResume.leadership.map((l, li) => <li key={li}>{l}</li>)}
                <li><strong>Languages:</strong> {generatedResume.languages.join(', ')}</li>
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
