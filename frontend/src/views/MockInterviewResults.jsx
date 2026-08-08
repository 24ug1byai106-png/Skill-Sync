import React from 'react';
import { 
  CheckCircle2, AlertTriangle, ArrowRight, Award, BarChart3, 
  Code, BookOpen, RotateCcw, Sparkles, Shield, Cpu, ExternalLink
} from 'lucide-react';

export default function MockInterviewResults({ userData = {} }) {
  // Retrieve last interview session from userData or fallback
  const session = userData.lastInterviewSession || {};
  const targetRole = session.targetRole || userData.selectedGoal || userData.profile?.preferredCareer || 'AI / Software Engineer';
  
  // Scores
  const overallScore = session.overallScore || 78;
  const technicalScore = session.technicalScore || 82;
  const problemSolvingScore = session.problemSolvingScore || 81;
  const communicationScore = session.communicationScore || 74;
  const projectScore = session.projectScore || 86;
  const confidenceScore = session.confidenceScore || 69;

  // Analysis lists
  const strengths = session.strengths || [
    `Strong technical fundamentals in ${targetRole}`,
    `Good project understanding and architectural explanations`,
    `Clear step-by-step problem-solving breakdown`
  ];

  const weaknesses = session.weaknesses || [
    `System design under high-throughput burst loads`,
    `Relational SQL query index tuning & execution plan optimization`,
    `Response structure for unexpected architectural failure modes`
  ];

  // Feedback Paragraph
  const aiFeedback = `You demonstrated a strong understanding of core ${targetRole} fundamentals and explained your project architecture effectively. Your responses were clear during code walkthroughs, but became less structured when discussing system scalability and SQL optimization under heavy database concurrency.`;

  const navigateToFeature = (tabName) => {
    // If opened in a new tab, navigate main app window or set location
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.location.href = '/';
      }
    } catch (e) {}
    window.location.href = '/';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#06080C',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Share Tech Mono', monospace",
      position: 'relative',
      paddingBottom: '60px'
    }}>
      
      {/* Background Cyber Grid */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(0, 229, 255, 0.1) 0%, transparent 60%), repeating-linear-gradient(90deg, rgba(0, 229, 255, 0.02) 0, rgba(0, 229, 255, 0.02) 1px, transparent 1px, transparent 40px)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* TOP HEADER */}
      <header style={{
        height: '70px',
        borderBottom: '1px solid rgba(0, 229, 255, 0.3)',
        background: 'rgba(10, 14, 23, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 36px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '6px',
            background: 'rgba(0, 229, 255, 0.15)', border: '1px solid #00E5FF',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Award size={20} color="#00E5FF" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00E5FF', letterSpacing: '1px' }}>
            SKILLSYNC <span style={{ color: '#FF9F1C' }}>AI</span>
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 8px' }}>|</span>
          <span style={{ fontSize: '0.95rem', color: '#cbd5e1', letterSpacing: '1px' }}>
            INTERVIEW RESULTS & TELEMETRY
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{
            padding: '6px 14px', background: 'rgba(255, 159, 28, 0.15)',
            border: '1px solid rgba(255, 159, 28, 0.4)', color: '#FF9F1C',
            borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700
          }}>
            TARGET ROLE: {targetRole.toUpperCase()}
          </span>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main style={{
        maxWidth: '1100px', width: '100%', margin: '0 auto',
        padding: '40px 24px', display: 'flex', flexDirection: 'column',
        gap: '32px', position: 'relative', zIndex: 1
      }}>
        
        {/* TITLE BANNER */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', background: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.3)', borderRadius: '20px',
            color: '#00E5FF', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px'
          }}>
            <Sparkles size={14} /> EVALUATION COMPLETE
          </div>
          <h1 style={{ fontSize: '2.4rem', color: '#FFFFFF', margin: 0, letterSpacing: '2px' }}>
            INTERVIEW COMPLETE
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '8px' }}>
            Comprehensive AI Technical Assessment & Skill Gap Telemetry Report
          </p>
        </div>

        {/* OVERALL SCORE & RADAR BREAKDOWN CARD */}
        <div className="hud-panel" style={{
          padding: '36px', borderRadius: '16px', background: 'rgba(13, 17, 26, 0.95)',
          border: '1px solid rgba(0, 229, 255, 0.4)', boxShadow: '0 0 35px rgba(0, 229, 255, 0.15)',
          display: 'grid', gridTemplateColumns: '300px 1fr', gap: '36px', alignItems: 'center'
        }}>
          
          {/* OVERALL SCORE GAUGE */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '24px', borderRight: '1px solid rgba(0, 229, 255, 0.2)'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', letterSpacing: '2px', marginBottom: '12px' }}>
              OVERALL PERFORMANCE
            </span>

            <div style={{
              position: 'relative', width: '160px', height: '160px',
              borderRadius: '50%', background: 'radial-gradient(circle, #09121f 0%, #04070d 100%)',
              border: '3px solid #00E5FF', boxShadow: '0 0 30px rgba(0, 229, 255, 0.3)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '3.2rem', fontWeight: 800, color: '#00E5FF', lineHeight: 1 }}>
                {overallScore}
              </span>
              <span style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '4px' }}>
                / 100
              </span>
            </div>

            <div style={{
              marginTop: '16px', padding: '4px 14px', borderRadius: '12px',
              background: overallScore >= 75 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 159, 28, 0.15)',
              border: `1px solid ${overallScore >= 75 ? '#10B981' : '#FF9F1C'}`,
              color: overallScore >= 75 ? '#10B981' : '#FF9F1C', fontSize: '0.85rem', fontWeight: 700
            }}>
              {overallScore >= 75 ? 'PLACEMENT READY' : 'NEEDS REFINEMENT'}
            </div>
          </div>

          {/* DETAILED SCORE BREAKDOWN METRICS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 style={{ fontSize: '1rem', color: '#00E5FF', margin: '0 0 4px', letterSpacing: '1px' }}>
              SKILL EVALUATION BREAKDOWN
            </h3>

            {/* Technical Skills */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1' }}>Technical Skills</span>
                <span style={{ color: '#00E5FF', fontWeight: 700 }}>{technicalScore}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${technicalScore}%`, height: '100%', background: 'linear-gradient(90deg, #00E5FF 0%, #3b82f6 100%)' }} />
              </div>
            </div>

            {/* Problem Solving */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1' }}>Problem Solving</span>
                <span style={{ color: '#00E5FF', fontWeight: 700 }}>{problemSolvingScore}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${problemSolvingScore}%`, height: '100%', background: 'linear-gradient(90deg, #00E5FF 0%, #10B981 100%)' }} />
              </div>
            </div>

            {/* Project Knowledge */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1' }}>Project Knowledge</span>
                <span style={{ color: '#00E5FF', fontWeight: 700 }}>{projectScore}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${projectScore}%`, height: '100%', background: 'linear-gradient(90deg, #00E5FF 0%, #8b5cf6 100%)' }} />
              </div>
            </div>

            {/* Communication */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1' }}>Communication</span>
                <span style={{ color: '#FF9F1C', fontWeight: 700 }}>{communicationScore}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${communicationScore}%`, height: '100%', background: 'linear-gradient(90deg, #FF9F1C 0%, #f59e0b 100%)' }} />
              </div>
            </div>

            {/* Confidence */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1' }}>Confidence</span>
                <span style={{ color: '#FF9F1C', fontWeight: 700 }}>{confidenceScore}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${confidenceScore}%`, height: '100%', background: 'linear-gradient(90deg, #FF9F1C 0%, #ef4444 100%)' }} />
              </div>
            </div>

          </div>
        </div>

        {/* AI INTERVIEW ANALYSIS: STRENGTHS & IMPROVEMENT AREAS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* STRENGTHS CARD */}
          <div className="hud-panel" style={{
            padding: '28px', borderRadius: '12px', background: 'rgba(13, 17, 26, 0.95)',
            border: '1px solid rgba(16, 185, 129, 0.4)'
          }}>
            <h3 style={{ fontSize: '1.1rem', color: '#10B981', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={20} /> STRENGTHS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {strengths.map((str, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: '#e2e8f0' }}>
                  <span style={{ color: '#10B981', fontWeight: 800 }}>✓</span>
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AREAS TO IMPROVE CARD */}
          <div className="hud-panel hud-panel-amber" style={{
            padding: '28px', borderRadius: '12px', background: 'rgba(13, 17, 26, 0.95)',
            border: '1px solid rgba(255, 159, 28, 0.4)'
          }}>
            <h3 style={{ fontSize: '1.1rem', color: '#FF9F1C', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={20} /> AREAS TO IMPROVE
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {weaknesses.map((wk, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: '#e2e8f0' }}>
                  <span style={{ color: '#FF9F1C', fontWeight: 800 }}>⚠</span>
                  <span>{wk}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* AI FEEDBACK DETAILED SUMMARY */}
        <div className="hud-panel" style={{
          padding: '28px', borderRadius: '12px', background: 'rgba(13, 17, 26, 0.95)',
          border: '1px solid rgba(0, 229, 255, 0.3)'
        }}>
          <h3 style={{ fontSize: '1.1rem', color: '#00E5FF', margin: '0 0 14px', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} /> AI INTERVIEWER FEEDBACK SUMMARY
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-line' }}>
            "{aiFeedback}"
          </p>
        </div>

        {/* ACTIONABLE NEXT STEPS BUTTONS CONNECTED TO SKILLSYNC AI */}
        <div style={{ marginTop: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#00E5FF', margin: '0 0 20px', letterSpacing: '1px', textAlign: 'center' }}>
            RECOMMENDED NEXT STEPS
          </h3>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            
            <button
              onClick={() => navigateToFeature('roadmap')}
              style={{
                padding: '16px 20px', background: 'rgba(0, 229, 255, 0.1)',
                border: '1px solid #00E5FF', borderRadius: '8px', color: '#00E5FF',
                fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 229, 255, 0.2)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)'}
            >
              <Cpu size={18} /> Practice System Design
            </button>

            <button
              onClick={() => navigateToFeature('coding')}
              style={{
                padding: '16px 20px', background: 'rgba(255, 159, 28, 0.1)',
                border: '1px solid #FF9F1C', borderRadius: '8px', color: '#FF9F1C',
                fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 159, 28, 0.2)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 159, 28, 0.1)'}
            >
              <Code size={18} /> Start SQL Challenge
            </button>

            <button
              onClick={() => navigateToFeature('roadmap')}
              style={{
                padding: '16px 20px', background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid #3b82f6', borderRadius: '8px', color: '#60a5fa',
                fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
            >
              <BookOpen size={18} /> Review Learning Roadmap
            </button>

            <button
              onClick={() => window.location.href = '/mock-interview'}
              style={{
                padding: '16px 20px', background: 'linear-gradient(135deg, #00E5FF 0%, #3b82f6 100%)',
                border: 'none', borderRadius: '8px', color: '#000',
                fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)', transition: 'all 0.2s'
              }}
            >
              <RotateCcw size={18} /> Take Another Mock Interview
            </button>

          </div>
        </div>

      </main>

    </div>
  );
}
