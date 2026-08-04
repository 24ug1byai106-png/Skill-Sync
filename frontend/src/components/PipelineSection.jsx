import React, { useState, useEffect } from 'react';
import { User, RefreshCw, Cpu, Dna, Target, Map, TrendingUp, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const stages = [
  {
    id: 1,
    num: "01",
    title: "Student Profile",
    icon: User,
    desc: "Academic background, CGPA, target preferences & study availability setup.",
    status: "CONFIGURED",
    details: "12 Data Fields Registered • Preferred Role & Stack Calibrated",
    color: "#00E5FF"
  },
  {
    id: 2,
    num: "02",
    title: "Data Synchronization",
    icon: RefreshCw,
    desc: "Automated ingestion of GitHub repositories, ATS Resume & Credentials.",
    status: "SYNCHRONIZED",
    details: "GitHub @vishnukaranth • ATS Resume Parsed • 2 Certs Verified",
    color: "#00F5D4"
  },
  {
    id: 3,
    num: "03",
    title: "AI Intelligence Engine",
    icon: Cpu,
    desc: "Groq Llama 3.3 70B foundation models process multi-modal career data.",
    status: "PROCESSING",
    details: "Deep Neural Pipeline Active • Context Memory Loaded",
    color: "#8A2BE2"
  },
  {
    id: 4,
    num: "04",
    title: "Career DNA Generation",
    icon: Dna,
    desc: "Compute career personality, technical strengths & confidence scores.",
    status: "COMPUTED",
    details: "94.2% DNA Match Score • Backend Specialist Persona",
    color: "#c084fc"
  },
  {
    id: 5,
    num: "05",
    title: "Skill Gap Detection",
    icon: Target,
    desc: "Compare acquired student skills against industry role benchmarks.",
    status: "DETECTED",
    details: "4 Priority Gaps Identified (Kubernetes, Redis, Kafka, AWS)",
    color: "#FF007F"
  },
  {
    id: 6,
    num: "06",
    title: "Smart Roadmap",
    icon: Map,
    desc: "Generate 12-week structured milestones, YouTube courses & projects.",
    status: "GENERATED",
    details: "12 Milestones Active • Curated YouTube & Official Docs",
    color: "#FFB703"
  },
  {
    id: 7,
    num: "07",
    title: "Continuous Growth",
    icon: TrendingUp,
    desc: "Execute Weekly AI Missions, daily tasks & Judge0 code sandbox.",
    status: "ACTIVE_TRACK",
    details: "🔥 12-Day Streak • 630 XP Earned • Judge0 Sandbox Connected",
    color: "#3b82f6"
  },
  {
    id: 8,
    num: "08",
    title: "Placement Ready",
    icon: ShieldCheck,
    desc: "Calibrate 90%+ career readiness index for tier-1 placement success.",
    status: "READY_90%+",
    details: "78.5% ➔ 92.4% Projected Readiness • Placement Drives Active",
    color: "#10b981"
  }
];

export default function PipelineSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredStage, setHoveredStage] = useState(null);

  // Sequential active stage lighting animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % stages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="how-it-works" style={{
      padding: '100px 48px',
      background: 'rgba(5, 8, 14, 0.85)',
      borderTop: '1px solid var(--border-cyber)',
      borderBottom: '1px solid var(--border-cyber)',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 10
    }}>
      
      {/* Sci-Fi Blueprint & Circuit Background Elements */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.15 }}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px', position: 'relative', zIndex: 10 }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '30px',
            background: 'rgba(138, 43, 226, 0.12)',
            border: '1px solid var(--border-purple)',
            color: '#c084fc',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            alignSelf: 'center'
          }}>
            <Sparkles size={14} /> LIVE AI PROCESSING ENGINE
          </div>

          <h2 style={{ fontSize: '3.2rem', lineHeight: 1.1, fontWeight: 800 }}>
            AI Career <span className="cyber-text">Execution Pipeline</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Watch how SkillSync AI continuously ingests student data, calculates neural insights, and drives daily placement preparation in real time.
          </p>
        </div>

        {/* 8-Stage Neural Grid & Energy Connectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', position: 'relative' }}>
          {stages.map((st, idx) => {
            const Icon = st.icon;
            const isActive = activeStep === idx;
            const isHovered = hoveredStage === st.id;

            return (
              <div
                key={st.id}
                onMouseEnter={() => setHoveredStage(st.id)}
                onMouseLeave={() => setHoveredStage(null)}
                className="holo-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative',
                  borderColor: isHovered || isActive ? st.color : 'var(--border-cyber)',
                  boxShadow: isHovered || isActive ? `0 0 30px ${st.color}50, inset 0 0 15px ${st.color}20` : '0 8px 32px rgba(0,0,0,0.5)',
                  transform: isHovered ? 'scale(1.04) translateY(-4px)' : isActive ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer'
                }}
              >
                {/* Active Energy Pulse Indicator */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: '-1px',
                    left: 0,
                    width: '100%',
                    height: '3px',
                    background: st.color,
                    boxShadow: `0 0 15px ${st.color}`
                  }} />
                )}

                {/* Stage Header Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-code)', fontSize: '1.2rem', fontWeight: 800, color: st.color }}>
                    {st.num}
                  </span>

                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: `${st.color}18`,
                    border: `1px solid ${st.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: isHovered ? 'rotate(15deg) scale(1.1)' : 'none',
                    transition: 'transform 0.3s ease'
                  }}>
                    <Icon size={22} color={st.color} />
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '6px' }}>{st.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{st.desc}</p>
                </div>

                {/* Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: '0.7rem',
                    color: st.color,
                    background: `${st.color}15`,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontWeight: 700
                  }}>
                    [{st.status}]
                  </span>

                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isActive ? st.color : 'rgba(255,255,255,0.2)', boxShadow: isActive ? `0 0 10px ${st.color}` : 'none' }} />
                </div>

                {/* Revealed Details on Hover */}
                {isHovered && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#00F5D4',
                    background: 'rgba(0, 245, 212, 0.08)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(0, 245, 212, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '4px',
                    animation: 'fadeIn 0.2s ease'
                  }}>
                    <CheckCircle2 size={14} /> {st.details}
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
