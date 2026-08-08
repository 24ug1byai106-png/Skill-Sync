import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, HelpCircle, BookOpen, Database, Code, Target, RefreshCw, Layers } from 'lucide-react';
import { computeCareerAnalysis } from '../services/analysisEngine';
import { generatePersonalizedProjects } from '../services/projectRecommendationEngine';
import { saveProjectRecommendationHistory } from '../services/supabase';

export default function ProjectsView({ userData = {}, onUpdateUserData }) {
  const analysis = computeCareerAnalysis(userData);
  const userGoal = analysis.targetGoal || userData.selectedGoal || userData.profile?.preferredCareer || 'AI Engineer';

  // Load Recommendation History from user data
  const [history, setHistory] = useState(() => userData.projectRecommendationHistory || []);
  
  // State for Currently Recommended 3 Projects
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize Personalized Project Recommendations on mount / user change
  useEffect(() => {
    const initialProjects = generatePersonalizedProjects(userData, history, 3, []);
    setRecommendedProjects(initialProjects);
  }, [userData]);

  // Handler: "↻ REFRESH RECOMMENDATIONS"
  const handleRefreshRecommendations = () => {
    setIsRefreshing(true);
    const currentlyDisplayedIds = recommendedProjects.map(p => p.id);

    setTimeout(() => {
      const freshProjects = generatePersonalizedProjects(userData, history, 3, currentlyDisplayedIds);
      
      // Update recommendation history with timestamps
      const newHistoryEntries = freshProjects.map(p => ({
        project_id: p.id,
        recommended_at: new Date().toISOString(),
        score: p.score
      }));

      const updatedHistory = [...history, ...newHistoryEntries];
      setHistory(updatedHistory);
      setRecommendedProjects(freshProjects);

      // Persist to user state
      if (onUpdateUserData) {
        onUpdateUserData({ projectRecommendationHistory: updatedHistory });
      }

      // Persist to Supabase
      freshProjects.forEach(p => {
        saveProjectRecommendationHistory(p.id, p.score, `Personalized for ${userGoal}`);
      });

      setIsRefreshing(false);
    }, 450);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Sparkles color="var(--hud-cyan-bright)" size={22} />
            <h2 style={{ fontSize: '1.4rem', color: 'var(--hud-cyan-bright)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
              PERSONALIZED RECOMMENDED PROJECTS FOR {userGoal.toUpperCase()}
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Dynamically evaluated and ranked from candidate profile, skill-gap telemetry, resume text, and GitHub repositories.
          </p>
        </div>

        {/* REFRESH RECOMMENDATIONS BUTTON */}
        <button
          onClick={handleRefreshRecommendations}
          disabled={isRefreshing}
          className="btn-hud-cyan"
          style={{
            padding: '10px 20px',
            fontSize: '0.85rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
            cursor: isRefreshing ? 'wait' : 'pointer'
          }}
        >
          <RefreshCw size={16} className={isRefreshing ? 'spin-icon' : ''} />
          {isRefreshing ? 'CALCULATING FRESH RECOMMENDATIONS...' : '↻ REFRESH RECOMMENDATIONS'}
        </button>
      </div>

      {/* Goal & Telemetry Vector Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(0, 229, 255, 0.08)', border: '1px solid var(--border-cyan)' }}>
          <Target size={16} color="var(--hud-cyan-bright)" />
          <span style={{ fontSize: '0.82rem', color: 'var(--hud-cyan-bright)', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
            ACTIVE ROLE: {userGoal.toUpperCase()} (3 High-Value Candidates Selected)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(255, 159, 28, 0.1)', border: '1px solid var(--border-amber)', borderRadius: '4px' }}>
          <Layers size={14} color="var(--hud-amber-bright)" />
          <span style={{ fontSize: '0.78rem', color: 'var(--hud-amber-bright)', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
            PERSONALIZED VIA 7 TELEMETRY VECTORS
          </span>
        </div>
      </div>

      {/* Projects List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {recommendedProjects.map((proj) => (
          <div key={proj.id} className="hud-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--bg-panel)' }}>
            
            {/* Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ background: 'rgba(0, 229, 255, 0.12)', color: 'var(--hud-cyan-bright)', border: '1px solid var(--border-cyan)', padding: '2px 10px', fontSize: '0.78rem', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
                    RECOMMENDED #{proj.rankNumber}
                  </span>
                  <span style={{ color: 'var(--hud-amber-bright)', fontSize: '0.8rem', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
                    [{proj.difficulty}]
                  </span>
                  <span style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600 }}>
                    CATEGORY: {proj.category}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', color: 'var(--hud-cyan-bright)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
                  {proj.title}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 159, 28, 0.1)', color: 'var(--hud-amber-bright)', border: '1px solid var(--border-amber)', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
                <Clock size={14} /> Time to Build: {proj.timeline}
              </div>
            </div>

            {/* Tech Stack Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
                TOOLS YOU WILL USE:
              </span>
              {proj.tech_stack.map(tech => (
                <span key={tech} className="tag-acquired" style={{ fontSize: '0.78rem' }}>
                  {tech}
                </span>
              ))}
            </div>

            {/* TWO STUDENT LEARNING SECTIONS: Why Build This & What Knowledge You Get */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              
              {/* 1. WHY BUILD THIS PROJECT (PERSONALIZED) */}
              <div style={{ background: '#07090E', padding: '16px', border: '1px solid var(--border-amber)', borderRadius: '2px' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--hud-amber-bright)', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 8px 0', fontFamily: "'Share Tech Mono', monospace" }}>
                  <HelpCircle size={15} /> WHY BUILD THIS PROJECT? (PERSONALIZED)
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {proj.why_build}
                </p>
              </div>

              {/* 2. WHAT KNOWLEDGE & SKILLS YOU GET (PERSONALIZED) */}
              <div style={{ background: '#07090E', padding: '16px', border: '1px solid var(--border-cyan)', borderRadius: '2px' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--hud-cyan-bright)', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 8px 0', fontFamily: "'Share Tech Mono', monospace" }}>
                  <BookOpen size={15} /> WHAT KNOWLEDGE YOU WILL LEARN:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-primary)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                  {proj.knowledge_gained.map((k, idx) => (
                    <li key={idx}>{k}</li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Architecture Schema & Resume Bullet Point */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(0, 229, 255, 0.03)', padding: '16px', border: '1px dashed var(--border-cyan)' }}>
              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--hud-cyan-bright)', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 4px 0', fontFamily: "'Share Tech Mono', monospace" }}>
                  <Database size={14} /> DATABASE & ARCHITECTURE YOU WILL LEARN
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {proj.database_design}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--hud-amber-bright)', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 4px 0', fontFamily: "'Share Tech Mono', monospace" }}>
                  <Code size={14} /> PERSONALIZED RESUME BULLET POINT YOU CAN WRITE
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontStyle: 'italic', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
                  "{proj.resume_bullet}"
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-icon {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
