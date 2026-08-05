import React, { useState, useEffect } from 'react';
import SciFiBackground from '../components/SciFiBackground';
import HolographicGlobe from '../components/HolographicGlobe';
import FuturisticNav from '../components/FuturisticNav';
import HorizontalPipeline from '../components/HorizontalPipeline';

import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Terminal as TerminalIcon, 
  Dna, 
  FileText, 
  Github, 
  FolderGit2, 
  Target, 
  Map, 
  CheckSquare, 
  Bot,
  HelpCircle
} from 'lucide-react';

export default function LandingPage({ onGetStarted, onLogin }) {
  const [terminalLogs, setTerminalLogs] = useState([
    "INITIALIZING SKILLSYNC CAREER ENGINE v3.0...",
    "LOADING AI MODEL (Groq Llama 3.3 70B)...",
    "REALTIME DATABASE CONNECTED...",
  ]);

  useEffect(() => {
    const sequence = [
      "ANALYZING RESUME ATS KEYWORDS...",
      "CHECKING GITHUB REPOS & CODE QUALITY...",
      "COMPARING SKILLS AGAINST REAL JOB DESCRIPTIONS...",
      "CREATING PERSONALIZED 12-WEEK LEARNING ROADMAP...",
      "SYSTEM READY // PLACEMENT SCORE CALCULATED."
    ];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < sequence.length) {
        setTerminalLogs(prev => [...prev, sequence[idx]]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="home" style={{ minHeight: '100vh', background: 'var(--bg-page)', position: 'relative', color: 'var(--text-primary)' }}>
      
      {/* Background Grid Lines & Scan Sweep */}
      <SciFiBackground />

      {/* Top Navigation Header */}
      <FuturisticNav onGetStarted={onGetStarted} onLogin={onLogin} />

      {/* HERO SECTION */}
      <section style={{
        padding: '60px 48px 80px',
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: '48px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Left Text Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            border: '1px solid var(--border-cyan)',
            background: 'rgba(0, 229, 255, 0.08)',
            color: 'var(--hud-cyan-bright)',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '1px',
            alignSelf: 'flex-start'
          }}>
            <span className="telemetry-dot telemetry-dot-cyan" /> [Overview // SkillSync AI Platform]
          </div>

          <h1 style={{ fontSize: '3.6rem', lineHeight: 1.1, fontWeight: 700, letterSpacing: '0.5px' }}>
            SKILLSYNC <span style={{ color: 'var(--hud-cyan-bright)' }}>AI</span><br />
            <span style={{ fontSize: '2.5rem', color: 'var(--hud-cyan-bright)' }}>CAREER GUIDANCE</span><br />
            <span style={{ fontSize: '2.2rem', color: 'var(--text-secondary)' }}>FOR COLLEGE STUDENTS</span>
          </h1>

          <p style={{ fontSize: '1.02rem', color: '#cbd5e1', lineHeight: 1.7, maxWidth: '600px', letterSpacing: '0.3px' }}>
            Scan your resume, analyze your GitHub projects, discover your missing skill gaps, and get a personalized 12-week roadmap to land your dream technical job.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
            <button className="btn-hud-cyan" onClick={onGetStarted}>
              START FREE ASSESSMENT <ArrowRight size={16} />
            </button>
            <button className="btn-hud-amber" onClick={onLogin}>
              STUDENT SIGN-IN
            </button>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '32px', marginTop: '16px', paddingTop: '20px', borderTop: '1px solid var(--border-cyan)' }}>
            <div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--hud-cyan-bright)', margin: 0 }}>98.7%</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px', margin: 0 }}>[Scoring Accuracy]</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--hud-amber-bright)', margin: 0 }}>12,450+</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px', margin: 0 }}>[Students Analyzed]</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--hud-cyan-bright)', margin: 0 }}>78.5%</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px', margin: 0 }}>[Avg Placement Readiness]</p>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Holographic 3D Globe Visual */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <HolographicGlobe />
        </div>

      </section>


      {/* SECTION 2 — MODULES */}
      <section id="features" style={{ padding: '70px 48px', maxWidth: '1300px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        
        <span className="sec-callout">
          [Modules // Tools For Students]
        </span>
        <h2 style={{ fontSize: '2.4rem', margin: '8px 0 12px', color: 'var(--hud-cyan-bright)' }}>9 INTELLIGENT CAREER MODULES</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', maxWidth: '650px', margin: '0 auto 40px', letterSpacing: '0.3px' }}>
          Interconnected tools working together to check your skills and prepare you for campus placements and technical interviews.
        </p>

        {/* HUD Modules Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            { title: "Resume Intelligence", icon: FileText, desc: "Scans your resume for ATS keywords, formatting, and industry match.", isWarning: false },
            { title: "GitHub Intelligence", icon: Github, desc: "Evaluates commit frequency, code quality, and tech stack in your repos.", isWarning: false },
            { title: "Career DNA Engine", icon: Dna, desc: "Calculates your technical strengths, core domain expertise, and level.", isWarning: false },
            { title: "Skill Gap Analysis", icon: Target, desc: "Compares your skills against your target job title to find missing skills.", isWarning: true },
            { title: "Roadmap Generator", icon: Map, desc: "Creates a 12-week step-by-step learning path with free video resources.", isWarning: false },
            { title: "Weekly AI Missions", icon: CheckSquare, desc: "Actionable daily coding tasks to build real projects and earn XP.", isWarning: false },
            { title: "Project Architect", icon: FolderGit2, desc: "Provides system design blueprints and ideas for your portfolio projects.", isWarning: false },
            { title: "Career Readiness", icon: ShieldCheck, desc: "Calculates a single overall score showing how ready you are for jobs.", isWarning: false },
            { title: "AI Career Mentor", icon: Bot, desc: "24/7 Groq Llama 3.3 AI assistant to answer all your career questions.", isWarning: false },
          ].map((mod, i) => {
            const Icon = mod.icon;
            return (
              <div key={i} className={`hud-panel ${mod.isWarning ? 'hud-panel-amber' : ''}`} style={{ padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    width: '36px', height: '36px',
                    border: '1px solid',
                    borderColor: mod.isWarning ? 'var(--hud-amber)' : 'var(--hud-cyan-bright)',
                    background: mod.isWarning ? 'rgba(255, 159, 28, 0.1)' : 'rgba(0, 229, 255, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon size={20} color={mod.isWarning ? 'var(--hud-amber)' : 'var(--hud-cyan-bright)'} />
                  </div>
                  <span style={{ fontSize: '0.68rem', color: mod.isWarning ? 'var(--hud-amber)' : 'var(--hud-cyan)', letterSpacing: '1px' }}>
                    [Module {i + 1}]
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', color: mod.isWarning ? 'var(--hud-amber-bright)' : 'var(--hud-cyan-bright)', margin: 0 }}>{mod.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{mod.desc}</p>
                
                <div style={{ fontSize: '0.72rem', color: mod.isWarning ? 'var(--hud-amber)' : 'var(--hud-cyan-bright)', fontWeight: 700, letterSpacing: '1px', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className={`telemetry-dot ${mod.isWarning ? 'telemetry-dot-amber' : 'telemetry-dot-cyan'}`} /> MODULE ACTIVE <ArrowRight size={10} />
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* SECTION 3 — PIPELINE */}
      <div id="pipeline">
        <HorizontalPipeline />
      </div>


      {/* SECTION 4 — LIVE SYSTEM LOG */}
      <section style={{ padding: '70px 48px', maxWidth: '1300px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="sec-callout">
            [Live Stream // AI System Log]
          </span>
          <h2 style={{ fontSize: '2.4rem', margin: '8px 0', color: 'var(--hud-cyan-bright)' }}>LIVE CAREER ENGINE OUTPUT</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '28px' }}>
          
          {/* HUD Live Terminal */}
          <div className="hud-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', background: '#07090E' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-cyan)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TerminalIcon size={16} color="var(--hud-cyan-bright)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--hud-cyan-bright)', fontWeight: 700, letterSpacing: '1px' }}>
                  SYSTEM_LOGS // live_stream.sh
                </span>
              </div>
              <span className="telemetry-dot telemetry-dot-cyan" />
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--hud-cyan-bright)', minHeight: '200px', display: 'flex', flexDirection: 'column', gap: '6px', lineHeight: 1.5 }}>
              {terminalLogs.map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--hud-amber-bright)' }}>[OK]</span>
                  <span>{log}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '8px', color: 'var(--hud-cyan-bright)' }}>
                <span>&gt;</span>
                <span className="pulse">_</span>
              </div>
            </div>
          </div>

          {/* Live Readiness Circle HUD */}
          <div className="hud-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>
              [Placement Readiness Dial]
            </span>

            <div style={{
              width: '145px',
              height: '145px',
              borderRadius: '50%',
              border: '2px dashed var(--hud-cyan-bright)',
              padding: '5px',
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
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--hud-cyan-bright)' }}>78.5%</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--hud-cyan-bright)', fontWeight: 700, letterSpacing: '1px' }}>READY</span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Target Role: Backend Engineer • 4 Skill Gaps Found
            </p>
          </div>

        </div>

      </section>

      {/* SECTION 5 — STUDENT FAQ */}
      <section id="faq" style={{ padding: '70px 48px', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="sec-callout">
            [FAQ // Frequently Asked Questions]
          </span>
          <h2 style={{ fontSize: '2.2rem', margin: '8px 0', color: 'var(--hud-cyan-bright)' }}>STUDENT QUESTIONS</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {[
            { q: "Is SkillSync free for college students?", a: "Yes! SkillSync AI is 100% free for all students to upload resumes, analyze GitHub repos, and get learning roadmaps." },
            { q: "How is my Placement Readiness Score calculated?", a: "We scan your resume keywords, check your GitHub code quality, and compare your skills against real job requirements." },
            { q: "What happens after I find my skill gaps?", a: "SkillSync generates a personalized 12-week roadmap with free video tutorials, docs, and weekly coding tasks to learn those skills." },
            { q: "Do I need a GitHub account to use SkillSync?", a: "No! Having GitHub helps analyze your projects, but you can also use SkillSync by uploading your resume or answering a quick quiz." }
          ].map((item, idx) => (
            <div key={idx} className="hud-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--hud-cyan-bright)', fontWeight: 700 }}>
                <HelpCircle size={18} />
                <h4 style={{ fontSize: '0.92rem', margin: 0, color: 'var(--hud-cyan-bright)' }}>{item.q}</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{item.a}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <button className="btn-hud-cyan" onClick={onGetStarted} style={{ padding: '12px 32px', fontSize: '0.9rem' }}>
            START YOUR FREE ASSESSMENT NOW <ArrowRight size={16} />
          </button>
        </div>
      </section>


      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border-cyan)',
        background: '#05070B',
        padding: '40px 48px 24px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '34px', height: '34px', border: '1px solid var(--hud-cyan-bright)', background: 'rgba(0, 229, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu color="var(--hud-cyan-bright)" size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
                  SKILLSYNC <span style={{ color: 'var(--hud-cyan-bright)' }}>AI</span>
                </h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>AI Career Guidance Platform for College Students</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap', letterSpacing: '0.5px' }}>
              <span>System Uptime: <strong style={{ color: 'var(--hud-cyan-bright)' }}>99.99%</strong></span>
              <span>Scoring Accuracy: <strong style={{ color: 'var(--hud-cyan-bright)' }}>98.7%</strong></span>
              <span>Students Connected: <strong style={{ color: 'var(--hud-amber-bright)' }}>12,450+</strong></span>
              <span>Data Protection: <strong style={{ color: 'var(--hud-cyan-bright)' }}>256-Bit AES</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', paddingTop: '16px', borderTop: '1px solid rgba(0, 229, 255, 0.1)' }}>
            <p>© 2026 SkillSync AI Inc. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); if (onLogin) onLogin(); }} style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); if (onLogin) onLogin(); }} style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
              <a href="#" onClick={(e) => { e.preventDefault(); if (onLogin) onLogin(); }} style={{ color: 'inherit', textDecoration: 'none' }}>Help & Support</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
