import React, { useEffect, useState } from 'react';
import { FolderGit2, Layers, Database, Code, Clock, Sparkles } from 'lucide-react';
import { fetchApi } from '../services/api';

export default function ProjectsView() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/projects/recommendations').then(res => {
      setRecommendations(Array.isArray(res) ? res : []);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2>AI Project Recommendation Engine</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tailored production project architecture designed to close your target role skill gaps.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {recommendations.map((item, index) => {
          const proj = item.custom_project || {};
          return (
            <div key={index} className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                      RANK #{item.rank || index + 1}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{proj.difficulty || 'Advanced'}</span>
                  </div>
                  <h3 style={{ fontSize: '1.4rem' }}>{proj.title || "Distributed Microservices E-Commerce API"}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>{proj.description}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                  <Clock size={14} /> {proj.timeline || '3 Weeks'}
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tech Stack:</span>
                {(proj.tech_stack || ["FastAPI", "PostgreSQL", "Redis", "Kafka", "Kubernetes", "Docker"]).map(tech => (
                  <span key={tech} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem' }}>
                    {tech}
                  </span>
                ))}
              </div>

              {/* Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(10, 13, 20, 0.4)', padding: '16px', borderRadius: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Database size={14} /> Database Schema
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{proj.database_design}</p>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.85rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Code size={14} /> Resume Bullet Point
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', italic: 'true' }}>"{proj.resume_description}"</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
