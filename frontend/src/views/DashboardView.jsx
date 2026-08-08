import React, { useState } from 'react';
import { Trophy, Zap, ShieldCheck, Flame, Star, Code, AlertTriangle, CheckCircle, Globe, ExternalLink, Sparkles, CheckCircle2, Edit3, Save } from 'lucide-react';
import { computeCareerAnalysis } from '../services/analysisEngine';
import { getStreakData } from '../utils/streakManager';

// Radial HUD Gauge Component
function RadialGaugeHUD({ percentage = 0, size = 52, color = "var(--hud-cyan-bright)" }) {
  const radius = 19;
  const circumference = 2 * Math.PI * radius;
  const activeOffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox="0 0 52 52" style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Ring */}
        <circle cx="26" cy="26" r={radius} fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="3" />
        {/* Active Arc */}
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeDasharray={circumference}
          strokeDashoffset={activeOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <span style={{ position: 'absolute', fontSize: '0.72rem', fontWeight: 700, color: color }}>
        {percentage}%
      </span>
    </div>
  );
}

export default function DashboardView({ userData = {}, onUpdateUserData }) {
  const analysis = computeCareerAnalysis(userData);
  const streakInfo = getStreakData();
  const pa = analysis.portfolioAnalysis || {};

  const [editingPortfolio, setEditingPortfolio] = useState(false);
  const [portfolioInput, setPortfolioInput] = useState(pa.url || '');

  const handleSavePortfolio = () => {
    if (onUpdateUserData) {
      onUpdateUserData({
        portfolioUrl: portfolioInput.trim(),
        profile: {
          ...(userData.profile || {}),
          portfolio: portfolioInput.trim()
        }
      });
    }
    setEditingPortfolio(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Overview Hero Banner */}
      <div className="hud-panel" style={{
        padding: '28px 32px',
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-cyan)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '660px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="telemetry-dot telemetry-dot-cyan" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', color: 'var(--hud-cyan-bright)' }}>
              [Overview // Student Career Dashboard]
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', margin: '4px 0 10px', color: 'var(--hud-cyan-bright)' }}>
            PLACEMENT SCORE: <span style={{ color: '#ffffff' }}>{analysis.overallReadiness}%</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
            Target Goal: <strong style={{ color: 'var(--hud-cyan-bright)' }}>{analysis.targetGoal}</strong>.
            {analysis.matchedSkills.length > 0 ? (
              <span> Skills Found: <span style={{ color: '#ffffff' }}>{analysis.matchedSkills.slice(0, 5).join(', ')}</span>.</span>
            ) : (
              <span> Upload your resume, connect GitHub, or add a portfolio link to see your skills.</span>
            )}
            {analysis.missingSkills.length > 0 && (
              <span style={{ color: 'var(--hud-amber)', display: 'inline-block', marginLeft: '6px', fontWeight: 700 }}>
                Top Skill Gap: {analysis.missingSkills[0]}.
              </span>
            )}
          </p>
        </div>
        
        {/* Main Score Circle */}
        <div style={{
          width: '124px',
          height: '124px',
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1, color: 'var(--hud-cyan-bright)' }}>{analysis.overallReadiness}%</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--hud-cyan-bright)', fontWeight: 700, letterSpacing: '1px', marginTop: '3px' }}>SCORE</span>
          </div>
        </div>
      </div>

      {/* 7 Metric Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px' }}>
        
        <div className="hud-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>[ATS Resume]</span>
            <RadialGaugeHUD percentage={analysis.atsScore} size={40} />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--hud-cyan-bright)', margin: 0 }}>{analysis.atsScore}%</h2>
          <span style={{ fontSize: '0.7rem', color: analysis.atsScore > 50 ? 'var(--hud-cyan-bright)' : 'var(--hud-amber)', fontWeight: 700 }}>
            {analysis.atsScore > 0 ? `Resume Uploaded` : 'No Resume'}
          </span>
        </div>

        <div className="hud-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>[GitHub Repos]</span>
            <RadialGaugeHUD percentage={analysis.githubScore} size={40} />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--hud-cyan-bright)', margin: 0 }}>{analysis.githubScore}%</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--hud-cyan-bright)', fontWeight: 700 }}>
            {analysis.reposCount > 0 ? `${analysis.reposCount} Repos` : 'Not Connected'}
          </span>
        </div>

        <div className="hud-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>[Coding Score]</span>
            <RadialGaugeHUD percentage={analysis.codingScore} size={40} />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--hud-cyan-bright)', margin: 0 }}>{analysis.codingScore}%</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--hud-cyan-bright)', fontWeight: 700 }}>
            {analysis.codingScore > 0 ? `${analysis.matchedSkills.length} Skills` : 'Pending'}
          </span>
        </div>

        <div className="hud-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>[Projects]</span>
            <RadialGaugeHUD percentage={analysis.projectScore} size={40} />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--hud-cyan-bright)', margin: 0 }}>{analysis.projectScore}%</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--hud-cyan-bright)', fontWeight: 700 }}>Quality</span>
        </div>

        <div className="hud-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>[Certificates]</span>
            <RadialGaugeHUD percentage={analysis.certScore} size={40} />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--hud-cyan-bright)', margin: 0 }}>{analysis.certScore}%</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--hud-cyan-bright)', fontWeight: 700 }}>
            {analysis.certsCount > 0 ? `${analysis.certsCount} Verified` : '0 Uploaded'}
          </span>
        </div>

        {/* Portfolio Score HUD Card */}
        <div className="hud-panel" style={{ padding: '16px', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--hud-cyan-bright)', fontWeight: 700 }}>[Portfolio Score]</span>
            <RadialGaugeHUD percentage={pa.score || 0} size={40} color="#06b6d4" />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: pa.isProvided ? '#06b6d4' : 'var(--text-muted)', margin: 0 }}>
            {pa.isProvided ? `${pa.score}%` : 'N/A'}
          </h2>
          <span style={{ fontSize: '0.7rem', color: pa.isProvided ? '#06b6d4' : 'var(--hud-amber)', fontWeight: 700 }}>
            {pa.isProvided ? 'Website Analyzed' : 'Optional / Unlinked'}
          </span>
        </div>

        <div className="hud-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>[Streak]</span>
            <Flame size={18} color="var(--hud-amber)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--hud-amber-bright)', margin: 0 }}>
            {streakInfo.currentStreak} {streakInfo.currentStreak === 1 ? 'DAY' : 'DAYS'}
          </h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--hud-amber-bright)', fontWeight: 700 }}>
            🔥 BEST: {streakInfo.bestStreak} D
          </span>
        </div>
      </div>

      {/* NEW: JOB OPPORTUNITIES WIDGET CARD */}
      <div className="hud-panel" style={{
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.08) 0%, rgba(7, 9, 14, 0.9) 100%)',
        border: '1px solid var(--border-cyan)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '8px',
            background: 'rgba(0, 229, 255, 0.12)',
            border: '1px solid var(--hud-cyan-bright)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px var(--hud-cyan-glow)'
          }}>
            <Sparkles size={28} color="var(--hud-cyan-bright)" />
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--hud-amber-bright)', fontWeight: 700, letterSpacing: '1px', fontFamily: "'Share Tech Mono', monospace" }}>
              🚀 JOBS MATCHED TO YOUR CAREER GOAL
            </div>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--hud-cyan-bright)', margin: '2px 0 4px', fontFamily: "'Share Tech Mono', monospace" }}>
              {analysis.targetGoal.toUpperCase()}
            </h3>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Target Location: <strong style={{ color: '#fff' }}>{userData.profile?.location || 'Bengaluru'}</strong> · Matches computed from your skills & gaps.
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab && onNavigateTab('jobs')}
          className="btn-hud-cyan"
          style={{
            padding: '12px 24px',
            fontSize: '0.88rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)'
          }}
        >
          [ EXPLORE MATCHED JOBS → ]
        </button>
      </div>

      {/* Dedicated Portfolio Analysis Widget */}
      <div className="hud-panel" style={{ padding: '24px', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={20} color="#06b6d4" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--hud-cyan-bright)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Portfolio & Web Presence Intelligence
                {pa.isProvided && (
                  <span style={{ fontSize: '0.72rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '12px' }}>
                    ✓ {pa.status}
                  </span>
                )}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Automated evaluation of live web showcase, design quality, mobile responsiveness, and deployment setup.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {pa.isProvided && pa.cleanUrl && (
              <a
                href={pa.cleanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
              >
                <ExternalLink size={14} /> Visit Portfolio
              </a>
            )}

            <button
              onClick={() => {
                setEditingPortfolio(!editingPortfolio);
                setPortfolioInput(pa.url || '');
              }}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Edit3 size={14} /> {pa.isProvided ? 'Update Link' : 'Add Portfolio Link'}
            </button>
          </div>
        </div>

        {/* Inline Edit Form */}
        {editingPortfolio && (
          <div style={{ padding: '16px', background: 'rgba(10, 14, 23, 0.8)', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="url"
              className="form-input"
              placeholder="Paste portfolio URL (e.g. https://myportfolio.dev or username.github.io)"
              value={portfolioInput}
              onChange={e => setPortfolioInput(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="btn-primary" onClick={handleSavePortfolio} style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Save size={14} /> Save & Analyze
            </button>
          </div>
        )}

        {pa.isProvided ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Audit Badges Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Hosting Domain</span>
                <strong style={{ fontSize: '0.85rem', color: '#38bdf8' }}>{pa.domainType}</strong>
              </div>

              <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Security & SSL</span>
                <strong style={{ fontSize: '0.85rem', color: '#10b981' }}>{pa.httpsStatus}</strong>
              </div>

              <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>UI/UX Polish</span>
                <strong style={{ fontSize: '0.85rem', color: 'var(--hud-cyan-bright)' }}>{pa.uiUxGrade}</strong>
              </div>

              <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>SEO & Audit Score</span>
                <strong style={{ fontSize: '0.85rem', color: '#f59e0b' }}>{pa.seoScore}</strong>
              </div>
            </div>

            {/* Highlights & Tech Stack */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#0A0B0D', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-cyan)' }}>
                <h4 style={{ fontSize: '0.82rem', color: 'var(--hud-cyan-bright)', margin: '0 0 8px', letterSpacing: '0.5px' }}>
                  [Portfolio Audit Highlights]
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {(pa.highlights || []).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#0A0B0D', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-cyan)' }}>
                <h4 style={{ fontSize: '0.82rem', color: 'var(--hud-cyan-bright)', margin: '0 0 8px', letterSpacing: '0.5px' }}>
                  [AI Enhancement Action Items]
                </h4>
                <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {(pa.recommendations || []).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '18px', background: 'rgba(255, 159, 28, 0.05)', borderRadius: '10px', border: '1px dashed rgba(255, 159, 28, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--hud-amber-bright)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} /> Boost Your Readiness Score by +15%
              </strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                You haven't linked a portfolio site yet. Adding your personal website or GitHub Pages showcase helps SkillSync AI evaluate your design polish and live projects.
              </p>
            </div>

            {!editingPortfolio && (
              <button
                onClick={() => setEditingPortfolio(true)}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
              >
                + Add Portfolio Link
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Grid: Skill Gap & Acquired Skills */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        
        {/* Missing Skills Section */}
        <div className="hud-panel hud-panel-amber" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="telemetry-dot telemetry-dot-amber" />
              <h3 style={{ fontSize: '1.05rem', color: 'var(--hud-amber-bright)', margin: 0 }}>
                Skills You Need to Learn for {analysis.targetGoal}
              </h3>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--hud-amber)', letterSpacing: '1px' }}>[Gaps]</span>
          </div>

          {(analysis.missingSkills || []).length > 0 ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(analysis.missingSkills || []).map((skill, i) => {
                const isCritical = i < 2;
                return (
                  <span key={i} className={isCritical ? 'tag-gap-critical' : 'tag-gap-secondary'}>
                    Need: {skill}
                  </span>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--hud-cyan-bright)', fontSize: '0.85rem', margin: 0 }}>✓ Awesome! You have all the core skills for this role.</p>
          )}

          {/* Easy Action Plan */}
          <div style={{ background: '#0A0B0D', padding: '16px', border: '1px solid var(--border-amber)', marginTop: '4px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--hud-amber-bright)', marginBottom: '8px', letterSpacing: '1px' }}>
              [Recommended Action Plan]
            </h4>
            <ol style={{ paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.7 }}>
              {(analysis.learningPriorities || []).map((item, idx) => (
                <li key={idx}><strong>{item.step}:</strong> {item.recommendation}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Acquired Skills Section */}
        <div className="hud-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--hud-cyan-bright)', margin: 0 }}>
              Skills You Already Have
            </h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--hud-cyan)', letterSpacing: '1px' }}>[Verified]</span>
          </div>

          {(analysis.matchedSkills || []).length > 0 ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(analysis.matchedSkills || []).map((skill, i) => (
                <span key={i} className="tag-acquired">
                  ✓ {skill}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>No skills detected yet. Upload your resume, connect GitHub, or add a portfolio link!</p>
          )}

          <div style={{ background: '#0A0B0D', padding: '14px', border: '1px solid var(--border-cyan)', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--hud-cyan-bright)' }}>
              <span className="telemetry-dot telemetry-dot-cyan" />
              <span>Score calculated from 1,200+ actual job requirements.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
