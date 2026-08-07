import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, Award, Clock, Sparkles, Check, Play, Briefcase } from 'lucide-react';
import { recordDailyLogin } from '../utils/streakManager';
import { computeCareerAnalysis } from '../services/analysisEngine';
import VerifyMissionModal from '../components/VerifyMissionModal';

function generateRoleMissions(userData) {
  const analysis = computeCareerAnalysis(userData || {});
  const role = analysis.targetGoal || 'Software Engineer';
  const missing = analysis.missingSkills || [];

  const roleTemplates = {
    'AI Engineer': [
      { id: 1, title: `Build a RAG Knowledge Base Search App with ${missing[0] || 'LangChain'}`, xp: 200, deadline: "Aug 10", category: "AI Architecture" },
      { id: 2, title: `Fine-tune LLM Prompt Pipeline using ${missing[1] || 'Transformers'}`, xp: 180, deadline: "Aug 17", category: "LLM Systems" },
      { id: 3, title: `Implement Multi-Agent Vector Search Workflow`, xp: 150, deadline: "Aug 24", category: "Vector AI" },
      { id: 4, title: `Solve 5 Machine Learning & Neural Network Problems`, xp: 100, deadline: "Aug 31", category: "AI Algorithms" }
    ],
    'Forward Deployed Engineer': [
      { id: 1, title: `Implement Enterprise RAG Solution with ${missing[0] || 'LangChain & Vector DB'}`, xp: 200, deadline: "Aug 10", category: "Enterprise AI" },
      { id: 2, title: `Build & Deploy REST API Microservice with ${missing[1] || 'FastAPI'}`, xp: 180, deadline: "Aug 17", category: "API Architecture" },
      { id: 3, title: `Design Client Systems Integration & Cloud Auth Security`, xp: 160, deadline: "Aug 24", category: "Client Solutions" },
      { id: 4, title: `Package Containerized App for Multi-Cloud Deployment`, xp: 120, deadline: "Aug 31", category: "Cloud & DevOps" }
    ],
    'AI Solutions Architect': [
      { id: 1, title: `Design Multi-Agent Architecture using ${missing[0] || 'LangGraph'}`, xp: 220, deadline: "Aug 10", category: "AI Systems Design" },
      { id: 2, title: `Benchmark & Optimize Vector Database Indexing`, xp: 180, deadline: "Aug 17", category: "Vector Search" },
      { id: 3, title: `Architect Scalable Cloud AI Pipeline on GCP / AWS`, xp: 160, deadline: "Aug 24", category: "Cloud Infrastructure" },
      { id: 4, title: `Conduct Enterprise AI Security & Cost Audit`, xp: 120, deadline: "Aug 31", category: "Enterprise Governance" }
    ],
    'Frontend Developer': [
      { id: 1, title: `Build Glassmorphism Responsive UI Component using ${missing[0] || 'React'}`, xp: 180, deadline: "Aug 10", category: "Frontend UI/UX" },
      { id: 2, title: `Optimize Web Application Lighthouse Score (>90)`, xp: 150, deadline: "Aug 17", category: "Web Performance" },
      { id: 3, title: `Implement Global State Management with ${missing[1] || 'Redux / Context'}`, xp: 160, deadline: "Aug 24", category: "State Architecture" },
      { id: 4, title: `Solve 5 Async JavaScript & DOM Manipulation Challenges`, xp: 100, deadline: "Aug 31", category: "JS Mastery" }
    ],
    'Backend Developer': [
      { id: 1, title: `Build Microservice REST API with ${missing[0] || 'FastAPI / Django'}`, xp: 200, deadline: "Aug 10", category: "Backend Architecture" },
      { id: 2, title: `Implement In-Memory Caching Layer using ${missing[1] || 'Redis'}`, xp: 180, deadline: "Aug 17", category: "Database & Caching" },
      { id: 3, title: `Write Automated Unit & Integration Testing Suite`, xp: 150, deadline: "Aug 24", category: "API Quality" },
      { id: 4, title: `Optimize PostgreSQL Relational Query Performance`, xp: 120, deadline: "Aug 31", category: "Database Optimization" }
    ],
    'Data Engineer': [
      { id: 1, title: `Build Automated ETL Pipeline with ${missing[0] || 'Apache Airflow'}`, xp: 200, deadline: "Aug 10", category: "Data Pipelines" },
      { id: 2, title: `Process Distributed Large-Scale Dataset using ${missing[1] || 'PySpark'}`, xp: 180, deadline: "Aug 17", category: "Big Data Processing" },
      { id: 3, title: `Optimize Data Warehouse Queries in Snowflake / BigQuery`, xp: 160, deadline: "Aug 24", category: "Cloud Data Warehouse" },
      { id: 4, title: `Implement Real-time Event Streaming with Kafka`, xp: 140, deadline: "Aug 31", category: "Streaming Architecture" }
    ],
    'Data Scientist': [
      { id: 1, title: `Perform Exploratory Data Analysis on Real-World Dataset`, xp: 180, deadline: "Aug 10", category: "Data Analytics" },
      { id: 2, title: `Train & Evaluate Predictive Model using ${missing[0] || 'Scikit-Learn'}`, xp: 200, deadline: "Aug 17", category: "Machine Learning" },
      { id: 3, title: `Build Interactive Data Visualization Dashboard`, xp: 150, deadline: "Aug 24", category: "Data Storytelling" },
      { id: 4, title: `Apply Statistical Hypothesis Testing & A/B Testing`, xp: 120, deadline: "Aug 31", category: "Statistical Math" }
    ],
    'Site Reliability Engineer (SRE)': [
      { id: 1, title: `Build Observability Dashboard with ${missing[0] || 'Prometheus & Grafana'}`, xp: 200, deadline: "Aug 10", category: "Observability" },
      { id: 2, title: `Write Infrastructure Code in ${missing[1] || 'Terraform'} for Cloud Deployment`, xp: 180, deadline: "Aug 17", category: "Infrastructure as Code" },
      { id: 3, title: `Configure Automated Incident Response & SLO Alerting`, xp: 160, deadline: "Aug 24", category: "Reliability Engineering" },
      { id: 4, title: `Simulate Chaos Engineering Fault Injection Scenario`, xp: 120, deadline: "Aug 31", category: "System Hardening" }
    ],
    'Cyber Security Engineer': [
      { id: 1, title: `Conduct OWASP Web Application Vulnerability Audit`, xp: 200, deadline: "Aug 10", category: "Web Security" },
      { id: 2, title: `Configure Firewall Rules & Packet Inspection using ${missing[0] || 'Wireshark'}`, xp: 180, deadline: "Aug 17", category: "Network Defense" },
      { id: 3, title: `Implement Secure Cryptographic Key Exchange Module`, xp: 150, deadline: "Aug 24", category: "Applied Cryptography" },
      { id: 4, title: `Solve 5 Penetration Testing & Threat Analysis Challenges`, xp: 120, deadline: "Aug 31", category: "Threat Hunting" }
    ]
  };

  const defaultMissions = roleTemplates[role] || [
    { id: 1, title: `Master Core Competency: Learn ${missing[0] || 'System Design'}`, xp: 200, deadline: "Aug 10", category: `${role} Fundamentals` },
    { id: 2, title: `Build Hands-on Technical Project matching ${role}`, xp: 180, deadline: "Aug 17", category: "Portfolio Project" },
    { id: 3, title: `Practice Coding & Problem Solving with ${missing[1] || 'Algorithms'}`, xp: 150, deadline: "Aug 24", category: "Technical Practice" },
    { id: 4, title: `Optimize GitHub Repository Code & Documentation`, xp: 100, deadline: "Aug 31", category: "Code Quality" }
  ];

  return defaultMissions.map(m => ({ ...m, status: 'pending' }));
}

export default function MissionsView({ userData }) {
  const analysis = computeCareerAnalysis(userData || {});
  const targetRole = analysis.targetGoal || 'Software Engineer';
  const storageKey = `skillsync_user_missions_${targetRole.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

  const [missions, setMissions] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : generateRoleMissions(userData);
    } catch (e) {
      return generateRoleMissions(userData);
    }
  });

  // Regenerate when target role changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setMissions(JSON.parse(saved));
      } else {
        const fresh = generateRoleMissions(userData);
        setMissions(fresh);
        localStorage.setItem(storageKey, JSON.stringify(fresh));
      }
    } catch (e) {
      setMissions(generateRoleMissions(userData));
    }
  }, [targetRole, storageKey]);

  const [toastMsg, setToastMsg] = useState('');
  const [selectedMissionForVerification, setSelectedMissionForVerification] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('skillsync_user_missions', JSON.stringify(missions));
    } catch (e) {
      console.warn("Missions save error:", e);
    }
  }, [missions]);

  const handleCompleteMission = (id) => {
    // Keep this for the play button or remove it? The play button can also open the verification modal
    const missionToVerify = missions.find(m => m.id === id);
    if (missionToVerify && missionToVerify.status !== 'completed') {
        setSelectedMissionForVerification(missionToVerify);
    }
  };

  const handleVerifySuccess = (id) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id) {
        recordDailyLogin(); // Record daily login streak
        setToastMsg(`✓ Mission Completed Successfully! Earned +${m.xp} XP!`);
        setTimeout(() => setToastMsg(''), 3500);
        return { ...m, status: 'completed' };
      }
      return m;
    }));
  };

  const totalEarnedXP = missions.filter(m => m.status === 'completed').reduce((sum, m) => sum + m.xp, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <VerifyMissionModal
        mission={selectedMissionForVerification}
        isOpen={!!selectedMissionForVerification}
        onClose={() => setSelectedMissionForVerification(null)}
        onVerify={handleVerifySuccess}
      />
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Sparkles color="var(--hud-cyan-bright)" size={20} />
            <h2 style={{ fontSize: '1.4rem', color: 'var(--hud-cyan-bright)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
              WEEKLY AI MISSIONS & PREPARATION
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Complete your assigned weekly preparation missions to earn XP and maintain your daily learning streak.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 159, 28, 0.1)', color: 'var(--hud-amber-bright)', padding: '6px 16px', border: '1px solid var(--hud-amber)', fontWeight: 700, fontSize: '0.9rem', fontFamily: "'Share Tech Mono', monospace" }}>
          <Award size={18} /> {totalEarnedXP} Total XP Earned
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div style={{ padding: '12px 16px', background: 'rgba(0, 229, 255, 0.12)', border: '1px solid var(--border-cyan)', color: 'var(--hud-cyan-bright)', fontSize: '0.85rem', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
          {toastMsg}
        </div>
      )}

      {/* Active Missions Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--hud-cyan-bright)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
            [ACTIVE WEEKLY MISSIONS]
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#a855f7', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.4)', padding: '4px 12px', borderRadius: '12px', fontWeight: 700, letterSpacing: '0.5px', fontFamily: "'Share Tech Mono', monospace" }}>
            TARGET ROLE: {targetRole.toUpperCase()}
          </span>
        </div>

        {missions.map(m => {
          const isDone = m.status === 'completed';

          return (
            <div
              key={m.id}
              className="hud-panel"
              style={{
                padding: '22px 26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                borderColor: isDone ? 'var(--hud-cyan-bright)' : 'var(--border-cyan)',
                background: isDone ? 'rgba(0, 229, 255, 0.04)' : 'var(--bg-panel)'
              }}
            >
              {/* Left Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div
                  onClick={() => handleCompleteMission(m.id)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: isDone ? 'var(--hud-cyan-bright)' : 'var(--hud-amber-bright)',
                    background: isDone ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255, 159, 28, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {isDone ? <CheckCircle2 size={20} color="var(--hud-cyan-bright)" /> : <Play size={14} color="var(--hud-amber-bright)" />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{
                      fontSize: '1.05rem',
                      color: isDone ? 'var(--hud-cyan-bright)' : 'var(--text-primary)',
                      textDecoration: isDone ? 'line-through' : 'none',
                      margin: 0,
                      fontFamily: "'Share Tech Mono', monospace"
                    }}>
                      {m.title}
                    </h4>
                    {isDone && (
                      <span style={{ fontSize: '0.72rem', background: 'rgba(0, 229, 255, 0.15)', color: 'var(--hud-cyan-bright)', border: '1px solid var(--border-cyan)', padding: '2px 8px', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
                        ✓ COMPLETED
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> Deadline: {m.deadline}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Complete Action Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  className={isDone ? 'btn-secondary' : 'btn-hud-cyan'}
                  onClick={() => !isDone && setSelectedMissionForVerification(m)}
                  style={{ padding: '8px 18px', fontSize: '0.82rem', opacity: isDone ? 0.7 : 1, cursor: isDone ? 'default' : 'pointer' }}
                  disabled={isDone}
                >
                  {isDone ? <CheckCircle2 size={16} /> : <Check size={16} />}
                  {isDone ? '✅ VERIFIED' : 'VERIFY MISSION'}
                </button>

                <div style={{
                  padding: '6px 14px',
                  border: isDone ? '1px solid var(--border-cyan)' : '1px solid var(--hud-amber)',
                  background: isDone ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255, 159, 28, 0.1)',
                  color: isDone ? 'var(--hud-cyan-bright)' : 'var(--hud-amber-bright)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  fontFamily: "'Share Tech Mono', monospace"
                }}>
                  +{m.xp} XP
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
