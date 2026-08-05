import React from 'react';
import { Trophy, Zap, ShieldCheck, Flame, Star, Code, AlertTriangle, CheckCircle } from 'lucide-react';
import { computeCareerAnalysis } from '../services/analysisEngine';
import { getStreakData } from '../utils/streakManager';

// Radial HUD Gauge Component
function RadialGaugeHUD({ percentage = 0, size = 52 }) {
  const radius = 19;
  const circumference = 2 * Math.PI * radius;
  const activeOffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox="0 0 52 52" style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Ring */}
        <circle cx="26" cy="26" r={radius} fill="none" stroke="rgba(255, 159, 28, 0.25)" strokeWidth="3" />
        {/* Active Arc */}
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          stroke="var(--hud-cyan-bright)"
          strokeWidth="3.5"
          strokeDasharray={circumference}
          strokeDashoffset={activeOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <span style={{ position: 'absolute', fontSize: '0.72rem', fontWeight: 700, color: 'var(--hud-cyan-bright)' }}>
        {percentage}%
      </span>
    </div>
  );
}

export default function DashboardView({ userData = {} }) {
  const analysis = computeCareerAnalysis(userData);
  const streakInfo = getStreakData();

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
              <span> Upload your resume or sync GitHub to see your skills.</span>
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

      {/* 6 Metric Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
        
        <div className="hud-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>[ATS Resume Score]</span>
            <RadialGaugeHUD percentage={analysis.atsScore} size={44} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--hud-cyan-bright)', margin: 0 }}>{analysis.atsScore}%</h2>
          <span style={{ fontSize: '0.72rem', color: analysis.atsScore > 50 ? 'var(--hud-cyan-bright)' : 'var(--hud-amber)', fontWeight: 700 }}>
            {analysis.atsScore > 0 ? `Resume Uploaded` : 'No Resume Yet'}
          </span>
        </div>

        <div className="hud-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>[GitHub Repos]</span>
            <RadialGaugeHUD percentage={analysis.githubScore} size={44} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--hud-cyan-bright)', margin: 0 }}>{analysis.githubScore}%</h2>
          <span style={{ fontSize: '0.72rem', color: 'var(--hud-cyan-bright)', fontWeight: 700 }}>
            {analysis.reposCount > 0 ? `${analysis.reposCount} Repos Connected` : 'Not Connected'}
          </span>
        </div>

        <div className="hud-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>[Coding Score]</span>
            <RadialGaugeHUD percentage={analysis.codingScore} size={44} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--hud-cyan-bright)', margin: 0 }}>{analysis.codingScore}%</h2>
          <span style={{ fontSize: '0.72rem', color: 'var(--hud-cyan-bright)', fontWeight: 700 }}>
            {analysis.codingScore > 0 ? `${analysis.matchedSkills.length} Skills Matched` : 'Pending Evaluation'}
          </span>
        </div>

        <div className="hud-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>[Project Score]</span>
            <RadialGaugeHUD percentage={analysis.projectScore} size={44} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--hud-cyan-bright)', margin: 0 }}>{analysis.projectScore}%</h2>
          <span style={{ fontSize: '0.72rem', color: 'var(--hud-cyan-bright)', fontWeight: 700 }}>Project Quality</span>
        </div>

        <div className="hud-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>[Certificates]</span>
            <RadialGaugeHUD percentage={analysis.certScore} size={44} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--hud-cyan-bright)', margin: 0 }}>{analysis.certScore}%</h2>
          <span style={{ fontSize: '0.72rem', color: 'var(--hud-cyan-bright)', fontWeight: 700 }}>
            {analysis.certsCount > 0 ? `${analysis.certsCount} Verified` : '0 Uploaded'}
          </span>
        </div>

        <div className="hud-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>[Learning Streak]</span>
            <Flame size={18} color="var(--hud-amber)" />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--hud-amber-bright)', margin: 0 }}>
            {streakInfo.currentStreak} {streakInfo.currentStreak === 1 ? 'DAY' : 'DAYS'}
          </h2>
          <span style={{ fontSize: '0.72rem', color: 'var(--hud-amber-bright)', fontWeight: 700 }}>
            🔥 BEST: {streakInfo.bestStreak} DAYS STREAK
          </span>
        </div>
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

          {analysis.missingSkills.length > 0 ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {analysis.missingSkills.map((skill, i) => {
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
              {analysis.learningPriorities.map((item, idx) => (
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

          {analysis.matchedSkills.length > 0 ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {analysis.matchedSkills.map((skill, i) => (
                <span key={i} className="tag-acquired">
                  ✓ {skill}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>No skills detected yet. Upload your resume or connect GitHub!</p>
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
