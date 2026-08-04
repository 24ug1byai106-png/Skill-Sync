import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { fetchApi } from '../services/api';

export default function ResumeView() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    // Simulate backend parse & Groq AI resume analysis
    setTimeout(() => {
      setResult({
        ats_score: 84,
        skills: ["Python", "FastAPI", "PostgreSQL", "Docker", "REST APIs", "Git", "Linux"],
        missing_skills: ["Kubernetes", "Redis", "Kafka"],
        weak_skills: ["System Architecture Diagramming"],
        strong_skills: ["FastAPI Async Endpoints", "PostgreSQL Schema Design"],
        career_summary: "Strong entry-to-mid level Backend Engineer with solid foundation in modern Python microservices.",
        grammar_suggestions: ["In project #2, change 'built an api' to 'Architected RESTful OpenAPI endpoints'."],
        resume_improvements: [
          "Add quantifiable metrics e.g., 'Reduced API query latency by 35% using composite indexes'.",
          "Include link to your live GitHub repositories in contact header."
        ]
      });
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>AI Resume Intelligence</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Upload your PDF or DOCX resume for production-grade parsing and ATS scoring.</p>
        </div>
      </div>

      {/* Upload Box */}
      <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}>
          <Upload size={28} color="#6366f1" />
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem' }}>{file ? file.name : "Select your PDF or DOCX Resume"}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Supports PDF and Word formats (Max 10MB)</p>
        </div>

        <input type="file" accept=".pdf,.docx" onChange={handleFileChange} id="resume-input" style={{ display: 'none' }} />
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <label htmlFor="resume-input" className="btn-secondary" style={{ cursor: 'pointer' }}>
            Browse File
          </label>
          <button className="btn-primary" onClick={handleAnalyze} disabled={!file || analyzing}>
            {analyzing ? "Analyzing with Groq AI..." : "Analyze Resume"}
            <Sparkles size={16} />
          </button>
        </div>
      </div>

      {/* Analysis Result */}
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {/* ATS Score Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>ATS Match Score</span>
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <div style={{
                width: '124px',
                height: '124px',
                borderRadius: '50%',
                background: 'var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 800
              }}>
                {result.ats_score}%
              </div>
            </div>
            <p style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>Great ATS Compatibility!</p>
          </div>

          {/* Details & Action Items */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3>Key Feedback & Improvements</h3>
            
            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#10b981', marginBottom: '6px' }}>Strong Areas</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {result.strong_skills.map((s, i) => (
                  <span key={i} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>{s}</span>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#ec4899', marginBottom: '6px' }}>Missing Keywords for Target Role</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {result.missing_skills.map((s, i) => (
                  <span key={i} style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>{s}</span>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '6px' }}>AI Recommended Resume Tweaks</h4>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {result.resume_improvements.map((imp, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
