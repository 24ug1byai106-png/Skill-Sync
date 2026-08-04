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
  Zap, 
  CheckCircle2, 
  Terminal as TerminalIcon, 
  Activity, 
  BarChart3, 
  Database, 
  Dna, 
  FileText, 
  Github, 
  FolderGit2, 
  Target, 
  Map, 
  CheckSquare, 
  Award, 
  Bot, 
  Code2, 
  Lock, 
  Globe 
} from 'lucide-react';

export default function LandingPage({ onGetStarted, onLogin }) {
  // Live Typing Terminal state
  const [terminalLogs, setTerminalLogs] = useState([
    "Initializing SkillSync AI Command Core v3.0...",
    "Loading Neural Network Models (Groq Llama 3.3 70B)...",
    "Connecting Supabase Realtime Engine...",
  ]);

  useEffect(() => {
    const sequence = [
      "Synchronizing Resume ATS Intelligence...",
      "Scanning GitHub Commits & Tech Stack Quality...",
      "Calculating Skill Gap Matrix for Target Engineering Roles...",
      "Generating Personal 12-Week AI Learning Roadmap...",
      "System Ready. Placement Readiness Index Calibrated."
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', position: 'relative', color: '#f8fafc' }}>
      
      {/* Sci-Fi Canvas Particles & Grid Background */}
      <SciFiBackground />

      {/* Futuristic Transparent Top Nav */}
      <FuturisticNav onGetStarted={onGetStarted} onLogin={onLogin} />

      {/* HERO COMMAND CENTER SECTION */}
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
        
        {/* Left Command Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '30px',
            background: 'rgba(0, 229, 255, 0.08)',
            border: '1px solid var(--border-cyber)',
            color: 'var(--cyber-blue)',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '1px',
            alignSelf: 'flex-start'
          }}>
            <Sparkles size={14} /> AI CAREER OS v3.0 • COMMAND CENTER
          </div>

          <h1 style={{ fontSize: '4.2rem', lineHeight: 1.05, fontWeight: 800, letterSpacing: '-1px' }}>
            SKILLSYNC <span className="cyber-text">AI</span><br />
            <span style={{ fontSize: '2.8rem', color: 'var(--text-primary)', fontWeight: 700 }}>THE FUTURE OF</span><br />
            <span style={{ fontSize: '3rem', color: '#c084fc' }}>CAREER INTELLIGENCE</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '620px' }}>
            SkillSync AI is an AI Career Operating System that analyzes resumes, GitHub repositories, projects, certificates and career goals to generate Career DNA, detect skill gaps, create learning roadmaps and prepare students for placements.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <button className="btn-cyber-primary" onClick={onGetStarted}>
              Access Command Center <ArrowRight size={18} />
            </button>
            <button className="btn-cyber-secondary" onClick={onLogin}>
              Watch System Demo
            </button>
          </div>

          {/* Quick HUD Metrics */}
          <div style={{ display: 'flex', gap: '32px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--cyber-blue)' }}>98.7%</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Prediction Accuracy</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c084fc' }}>12,450+</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Students Connected</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#00F5D4' }}>78.5%</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg Placement Readiness</p>
            </div>
          </div>
        </div>

        {/* Right Side: LIVE HOLOGRAPHIC AI CORE GLOBE */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <HolographicGlobe />
        </div>

      </section>


      {/* SECTION 2 — SKILLSYNC AI CORE NEURAL NETWORK */}
      <section id="features" style={{ padding: '80px 48px', maxWidth: '1300px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        
        <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', color: 'var(--cyber-blue)', textTransform: 'uppercase' }}>
          SYSTEM ARCHITECTURE
        </span>
        <h2 style={{ fontSize: '2.8rem', margin: '8px 0 16px' }}>SkillSync AI Core Engine</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto 50px' }}>
          9 interconnected intelligence modules continuously communicating to compute your real-time Career DNA and placement readiness.
        </p>

        {/* Neural Network Grid Diagram */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { title: "Resume Intelligence", icon: FileText, desc: "ATS match scoring, keyword parsing, and bullet point optimizers.", color: "#00E5FF" },
            { title: "GitHub Intelligence", icon: Github, desc: "Automatic commit quality, README analysis, and tech stack detection.", color: "#8A2BE2" },
            { title: "Career DNA Engine", icon: Dna, desc: "Personality profiling, technical strengths, and confidence scoring.", color: "#00F5D4" },
            { title: "Skill Gap Engine", icon: Target, desc: "Target role gap comparison and priority learning sequence.", color: "#FF007F" },
            { title: "Roadmap Generator", icon: Map, desc: "Dynamic 12-week structured milestones with YouTube & Docs resources.", color: "#FFB703" },
            { title: "Weekly AI Missions", icon: CheckSquare, desc: "Actionable daily tasks, XP rewards (+150 XP), and proof verification.", color: "#3b82f6" },
            { title: "Project Architect", icon: FolderGit2, desc: "Tailored microservices project blueprints with DB schema & API specs.", color: "#10b981" },
            { title: "Career Readiness", icon: ShieldCheck, desc: "Weighted placement index computed across 6 technical dimensions.", color: "#ec4899" },
            { title: "AI Career Mentor", icon: Bot, desc: "24/7 Groq Llama 3.3 70B chatbot aware of profile and chat history.", color: "#00E5FF" },
          ].map((mod, i) => {
            const Icon = mod.icon;
            return (
              <div key={i} className="holo-panel" style={{ padding: '28px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${mod.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} color={mod.color} />
                </div>
                <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{mod.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{mod.desc}</p>
                <div style={{ fontSize: '0.75rem', color: mod.color, fontWeight: 700, letterSpacing: '0.5px', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  MODULE ACTIVE <ArrowRight size={12} />
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* SECTION 3 — AI CAREER PIPELINE */}
      <HorizontalPipeline />





      {/* SECTION 4 — LIVE COMMAND CENTER HUD & SCI-FI TERMINAL */}
      <section style={{ padding: '80px 48px', maxWidth: '1300px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', color: 'var(--cyber-blue)', textTransform: 'uppercase' }}>
            REAL-TIME TELEMETRY
          </span>
          <h2 style={{ fontSize: '2.8rem', margin: '8px 0' }}>Live Command Center Preview</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px' }}>
          
          {/* Sci-Fi Live Terminal */}
          <div className="holo-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#03060d' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-cyber)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TerminalIcon size={18} color="#00E5FF" />
                <span style={{ fontFamily: 'var(--font-code)', fontSize: '0.85rem', color: '#00E5FF', fontWeight: 600 }}>
                  SKILLSYNC_AI_KERNEL_LOGS.sh
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ec4899' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              </div>
            </div>

            <div style={{ fontFamily: 'var(--font-code)', fontSize: '0.85rem', color: '#38bdf8', minHeight: '220px', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.6 }}>
              {terminalLogs.map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#a855f7' }}>[SYS_OK]</span>
                  <span>{log}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '8px', color: '#00F5D4' }}>
                <span>&gt;</span>
                <span className="pulse">_</span>
              </div>
            </div>
          </div>

          {/* Live Readiness HUD Ring Widget */}
          <div className="holo-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              CAREER READINESS INDEX
            </span>

            <div style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'var(--cyber-gradient)',
              padding: '4px',
              boxShadow: 'var(--cyber-glow)'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'var(--bg-void)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '2.8rem', fontWeight: 800 }}>78.5%</span>
                <span style={{ fontSize: '0.75rem', color: '#00F5D4', fontWeight: 600 }}>Placement Ready</span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Backend Engineer Role • 4 Priority Skill Gaps Detected
            </p>
          </div>

        </div>

      </section>


      {/* TELEMETRY FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border-cyber)',
        background: 'rgba(3, 5, 9, 0.95)',
        padding: '48px 48px 32px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
            
            {/* Brand Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--cyber-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu color="#030509" size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>SkillSync <span className="cyber-text">AI</span></h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bridge Your Skills to Success</p>
              </div>
            </div>

            {/* Live System Telemetry Bar */}
            <div style={{ display: 'flex', gap: '24px', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <span>System Uptime: <strong style={{ color: '#10b981' }}>99.99%</strong></span>
              <span>AI Accuracy: <strong style={{ color: '#00E5FF' }}>98.7%</strong></span>
              <span>Users Online: <strong style={{ color: '#c084fc' }}>4,210</strong></span>
              <span>Data Processed: <strong style={{ color: '#FFB703' }}>1.2 TB</strong></span>
              <span>Encryption: <strong style={{ color: '#00F5D4' }}>256-Bit AES</strong></span>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p>© 2026 SkillSync AI Inc. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact AI HQ</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
