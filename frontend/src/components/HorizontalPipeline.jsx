import React, { useState, useEffect } from 'react';
import { User, RefreshCw, Cpu, Dna, Target, Map, TrendingUp, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';

const pipelineStages = [
  {
    num: "01",
    title: "Student Profile",
    desc: "Student profile, education and career goals.",
    icon: User,
    color: "#00E5FF"
  },
  {
    num: "02",
    title: "Data Sync",
    desc: "Resume, GitHub and certificates synchronized.",
    icon: RefreshCw,
    color: "#00F5D4"
  },
  {
    num: "03",
    title: "AI Analysis",
    desc: "AI analyzes skills, projects and experience.",
    icon: Cpu,
    color: "#8A2BE2"
  },
  {
    num: "04",
    title: "Career DNA",
    desc: "Learning style, strengths and career profile generated.",
    icon: Dna,
    color: "#c084fc"
  },
  {
    num: "05",
    title: "Skill Gap",
    desc: "Missing technologies and priority skills identified.",
    icon: Target,
    color: "#FF007F"
  },
  {
    num: "06",
    title: "Smart Roadmap",
    desc: "Personalized roadmap and weekly missions generated.",
    icon: Map,
    color: "#FFB703"
  },
  {
    num: "07",
    title: "Skill Growth",
    desc: "Track learning progress and project completion.",
    icon: TrendingUp,
    color: "#3b82f6"
  },
  {
    num: "08",
    title: "Placement Ready",
    desc: "Industry-ready score and interview readiness.",
    icon: ShieldCheck,
    color: "#10b981"
  }
];

export default function HorizontalPipeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Sequential active stage lighting cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % pipelineStages.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="how-it-works" style={{
      padding: '100px 48px',
      background: 'rgba(5, 8, 14, 0.9)',
      borderTop: '1px solid var(--border-cyber)',
      borderBottom: '1px solid var(--border-cyber)',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 10
    }}>
      
      {/* Background Cyber Blueprint Grid & Sci-Fi Data Streams */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
        
        {/* Blueprint Grid Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'linear-gradient(to right, rgba(0, 229, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 229, 255, 0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.8
        }} />

        {/* Floating Matrix & Hex Data Stream */}
        <div style={{ position: 'absolute', top: '12%', left: '4%', fontFamily: 'var(--font-code)', fontSize: '0.7rem', color: 'rgba(0, 229, 255, 0.25)', lineHeight: 1.6 }}>
          0x7F4A_PIPELINE_INIT<br />
          01011001_DATA_STREAM_ACTIVE<br />
          [GROQ_LLAMA_3.3_70B]
        </div>

        <div style={{ position: 'absolute', bottom: '12%', right: '4%', fontFamily: 'var(--font-code)', fontSize: '0.7rem', color: 'rgba(138, 43, 226, 0.25)', textAlign: 'right', lineHeight: 1.6 }}>
          FASTAPI_ROUTER_READY<br />
          AUTONOMOUS_WORKFLOW_LOOP<br />
          256-BIT_ENCRYPTION_LAYER
        </div>
      </div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px', position: 'relative', zIndex: 10 }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '30px',
            background: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid var(--border-cyber)',
            color: 'var(--cyber-blue)',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            alignSelf: 'center',
            boxShadow: '0 0 15px rgba(0, 229, 255, 0.2)'
          }}>
            <Sparkles size={14} /> AUTOMATED AI WORKFLOW
          </div>

          <h2 style={{ fontSize: '3.2rem', lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.5px' }}>
            AI Career <span className="cyber-text">Execution Pipeline</span>
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6 }}>
            Transforming student data into personalized career intelligence through a fully automated AI workflow.
          </p>

        </div>

        {/* 8-Stage Horizontal Pipeline Container */}
        <div style={{ position: 'relative', width: '100%', overflowX: 'auto', paddingBottom: '20px' }}>
          
          {/* Continuous Glowing Energy Beam Running Behind Cards */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '30px',
            right: '30px',
            height: '3px',
            background: 'linear-gradient(90deg, #00E5FF, #8A2BE2, #00F5D4, #FF007F, #10b981)',
            boxShadow: '0 0 15px rgba(0, 229, 255, 0.6)',
            transform: 'translateY(-50%)',
            zIndex: 1
          }}>
            {/* Animated Energy Particle Dot Traveling Left to Right */}
            <div style={{
              position: 'absolute',
              top: '-4px',
              left: `${(activeStep / (pipelineStages.length - 1)) * 100}%`,
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 0 20px #00E5FF, 0 0 40px #00F5D4',
              transition: 'left 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
          </div>

          {/* Horizontal Layout Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, minmax(260px, 1fr))',
            gap: '20px',
            position: 'relative',
            zIndex: 2,
            minWidth: '1350px'
          }}>
            
            {pipelineStages.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = activeStep === idx;
              const isHovered = hoveredIndex === idx;

              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  
                  {/* Stage Card */}
                  <div
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="holo-panel floating-panel"
                    style={{
                      width: '100%',
                      padding: '24px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      borderRadius: 'var(--radius-lg)',
                      background: isHovered || isActive ? 'rgba(14, 22, 38, 0.92)' : 'rgba(8, 12, 20, 0.8)',
                      borderColor: isHovered || isActive ? stage.color : 'var(--border-cyber)',
                      boxShadow: isHovered || isActive 
                        ? `0 0 35px ${stage.color}60, inset 0 0 20px ${stage.color}25` 
                        : '0 8px 32px rgba(0, 0, 0, 0.6)',
                      transform: isHovered ? 'translateY(-6px) scale(1.02)' : isActive ? 'translateY(-3px)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      animationDelay: `${idx * 0.4}s`,
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    
                    {/* Animated Diagonal Light Reflection Sweep */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '200%',
                      height: '100%',
                      background: 'linear-gradient(135deg, transparent 40%, rgba(0, 229, 255, 0.15) 50%, transparent 60%)',
                      pointerEvents: 'none',
                      transform: isHovered ? 'translateX(100%)' : 'none',
                      transition: 'transform 0.8s ease'
                    }} />

                    {/* Step Number & LIVE Status Badge Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontFamily: 'var(--font-code)',
                        fontSize: '1.4rem',
                        fontWeight: 800,
                        color: stage.color,
                        letterSpacing: '1px'
                      }}>
                        {stage.num}
                      </span>

                      {/* Small LIVE Status Indicator */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '3px 8px',
                        borderRadius: '20px',
                        background: `${stage.color}15`,
                        border: `1px solid ${stage.color}40`,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: stage.color,
                        letterSpacing: '0.5px'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: stage.color,
                          boxShadow: `0 0 8px ${stage.color}`
                        }} />
                        LIVE
                      </div>
                    </div>

                    {/* Large Pulsing Icon Container */}
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '14px',
                      background: `${stage.color}18`,
                      border: `1px solid ${stage.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isActive ? `0 0 20px ${stage.color}` : 'none',
                      transform: isHovered ? 'rotate(10deg) scale(1.08)' : 'none',
                      transition: 'transform 0.3s ease'
                    }}>
                      <Icon size={26} color={stage.color} />
                    </div>

                    {/* Stage Title & 1-Line Description */}
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '6px', fontWeight: 700 }}>
                        {stage.title}
                      </h3>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {stage.desc}
                      </p>
                    </div>

                    {/* Bottom Neon Accent Pulse Bar */}
                    <div style={{
                      height: '2px',
                      width: '100%',
                      background: isActive ? stage.color : 'transparent',
                      boxShadow: isActive ? `0 0 10px ${stage.color}` : 'none',
                      transition: 'background 0.3s ease',
                      marginTop: 'auto'
                    }} />

                  </div>

                  {/* Pulsing Arrow Connector Between Stages */}
                  {idx < pipelineStages.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      right: '-16px',
                      zIndex: 10,
                      color: isActive ? '#00E5FF' : 'rgba(0, 229, 255, 0.4)',
                      filter: isActive ? 'drop-shadow(0 0 8px #00E5FF)' : 'none',
                      pointerEvents: 'none'
                    }}>
                      <ChevronRight size={22} />
                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
}
