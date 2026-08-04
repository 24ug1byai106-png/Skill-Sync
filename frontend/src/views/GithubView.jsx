import React from 'react';
import { Github, Star, GitFork, GitCommit, FileText, CheckCircle2, ShieldCheck, Code } from 'lucide-react';

export default function GithubView() {
  const repos = [
    {
      name: "skill-pilot-backend",
      stars: 24,
      forks: 6,
      commits: 142,
      lang: "Python",
      readmeScore: 92,
      qualityScore: 88,
      tech: ["FastAPI", "PostgreSQL", "Docker", "Alembic", "Redis"],
      summary: "Production-ready backend API with async DB pooling, JWT auth, and Docker composition."
    },
    {
      name: "ai-career-agent",
      stars: 42,
      forks: 12,
      commits: 89,
      lang: "TypeScript",
      readmeScore: 95,
      qualityScore: 91,
      tech: ["React", "Vite", "Supabase", "Tailwind CSS"],
      summary: "Next-gen career operating system frontend with interactive glassmorphism UI."
    },
    {
      name: "distributed-cache-engine",
      stars: 15,
      forks: 3,
      commits: 34,
      lang: "Go",
      readmeScore: 85,
      qualityScore: 82,
      tech: ["Go", "gRPC", "Protobuf"],
      summary: "High-throughput in-memory key-value cache implementation using LRU eviction."
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>GitHub Intelligence & Code Quality</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Automated analysis of repository structure, README documentation, and tech stack quality.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem' }}>
          <Github size={16} /> Synced @vishnukaranth
        </div>
      </div>

      {/* Repos Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {repos.map((repo, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Github size={22} color="#3b82f6" />
                <h3 style={{ fontSize: '1.2rem' }}>{repo.name}</h3>
              </div>
              <div style={{ display: 'flex', gap: '14px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span><Star size={14} color="#f59e0b" /> {repo.stars} stars</span>
                <span><GitFork size={14} color="#a855f7" /> {repo.forks} forks</span>
                <span><GitCommit size={14} color="#10b981" /> {repo.commits} commits</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{repo.summary}</p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {repo.tech.map((t, i) => (
                <span key={i} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem' }}>
                  {t}
                </span>
              ))}
            </div>

            {/* Quality Scores */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(10, 14, 23, 0.5)', padding: '12px 16px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>README Quality Score</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>{repo.readmeScore}/100</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Architecture Rating</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#3b82f6' }}>{repo.qualityScore}/100</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
