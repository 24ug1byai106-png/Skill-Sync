import React from 'react';
import { Map, Calendar, Youtube, ExternalLink, Sparkles, Clock, BookOpen, CheckCircle2, Target } from 'lucide-react';
import { computeCareerAnalysis } from '../services/analysisEngine';

// Role-based 12-week learning roadmaps with YouTube tutorial video buttons & official docs
const ROLE_ROADMAPS = {
  'AI Engineer': [
    {
      week: 1,
      title: 'Python Advanced & PyTorch Fundamentals',
      skill: 'PyTorch',
      time: 'Week 1-2',
      summary: 'Learn PyTorch tensors, neural network layers, autograd gradients, and building your first deep learning model.',
      youtubeQuery: 'PyTorch+full+course+for+beginners',
      officialDocs: 'https://pytorch.org/tutorials/'
    },
    {
      week: 2,
      title: 'FastAPI Production Backend Microservices',
      skill: 'FastAPI',
      time: 'Week 3-4',
      summary: 'Build high-performance REST APIs in Python using type hints, Pydantic schemas, and async request handlers.',
      youtubeQuery: 'FastAPI+full+course+tutorial',
      officialDocs: 'https://fastapi.tiangolo.com/tutorial/'
    },
    {
      week: 3,
      title: 'RAG AI, Embeddings & Vector Databases (FAISS)',
      skill: 'Vector DBs',
      time: 'Week 5-6',
      summary: 'Learn how to generate text embeddings, store vector math in FAISS/Pinecone, and build PDF chat assistants.',
      youtubeQuery: 'Vector+databases+explained+for+beginners',
      officialDocs: 'https://faiss.ai/'
    },
    {
      week: 4,
      title: 'LangChain & Autonomous Agent Architecture',
      skill: 'LangChain',
      time: 'Week 7-8',
      summary: 'Connect LLM models to web search tools, external APIs, and persistent graph memory states using LangChain.',
      youtubeQuery: 'LangChain+tutorial+for+beginners',
      officialDocs: 'https://python.langchain.com/docs/get_started/introduction'
    },
    {
      week: 5,
      title: 'Docker Containerization for AI Models',
      skill: 'Docker',
      time: 'Week 9-10',
      summary: 'Package your PyTorch AI inference models and FastAPI backend into Docker containers for easy cloud deployment.',
      youtubeQuery: 'Docker+full+course+for+beginners',
      officialDocs: 'https://docs.docker.com/get-started/'
    },
    {
      week: 6,
      title: 'Model Fine-Tuning & GPU Cloud Deployment',
      skill: 'HuggingFace',
      time: 'Week 11-12',
      summary: 'Fine-tune open-source HuggingFace Transformer models on custom datasets and deploy on GPU cloud instances.',
      youtubeQuery: 'HuggingFace+fine+tuning+tutorial',
      officialDocs: 'https://huggingface.co/docs/transformers/training'
    }
  ],

  'Backend Developer': [
    {
      week: 1,
      title: 'Python Async & FastAPI Microservices',
      skill: 'FastAPI',
      time: 'Week 1-2',
      summary: 'Master asynchronous Python, HTTP request methods, Dependency Injection, and Pydantic validation.',
      youtubeQuery: 'FastAPI+full+course+tutorial',
      officialDocs: 'https://fastapi.tiangolo.com/tutorial/'
    },
    {
      week: 2,
      title: 'PostgreSQL Relational Schema & Indexing',
      skill: 'PostgreSQL',
      time: 'Week 3-4',
      summary: 'Design relational database schemas, write complex SQL JOIN queries, and optimize query indexes.',
      youtubeQuery: 'PostgreSQL+database+tutorial+for+beginners',
      officialDocs: 'https://www.postgresql.org/docs/'
    },
    {
      week: 3,
      title: 'Redis In-Memory Caching & Rate Limiting',
      skill: 'Redis',
      time: 'Week 5-6',
      summary: 'Implement Redis caching to serve API responses in under 10ms and build sliding-window rate limiters.',
      youtubeQuery: 'Redis+crash+course',
      officialDocs: 'https://redis.io/docs/'
    },
    {
      week: 4,
      title: 'Docker & Docker Compose Containerization',
      skill: 'Docker',
      time: 'Week 7-8',
      summary: 'Write multi-stage Dockerfiles and compose files to run Python, PostgreSQL, and Redis together.',
      youtubeQuery: 'Docker+full+course+for+beginners',
      officialDocs: 'https://docs.docker.com/'
    },
    {
      week: 5,
      title: 'Kafka Event Streaming Architecture',
      skill: 'Kafka',
      time: 'Week 9-10',
      summary: 'Build event-driven microservices using Apache Kafka queues to process payment & notification events.',
      youtubeQuery: 'Apache+Kafka+tutorial+for+beginners',
      officialDocs: 'https://kafka.apache.org/documentation/'
    },
    {
      week: 6,
      title: 'Kubernetes Cluster Deployment & CI/CD',
      skill: 'Kubernetes',
      time: 'Week 11-12',
      summary: 'Deploy containerized backend microservices to Kubernetes clusters with automated GitHub Actions CI/CD.',
      youtubeQuery: 'Kubernetes+tutorial+for+beginners',
      officialDocs: 'https://kubernetes.io/docs/tutorials/'
    }
  ],

  'Frontend Developer': [
    {
      week: 1,
      title: 'Modern React & Component Architecture',
      skill: 'React.js',
      time: 'Week 1-2',
      summary: 'Master React state, hooks (useState, useEffect, useMemo), and component lifecycle.',
      youtubeQuery: 'React+js+full+course+for+beginners',
      officialDocs: 'https://react.dev/'
    },
    {
      week: 2,
      title: 'TypeScript for Frontend Developers',
      skill: 'TypeScript',
      time: 'Week 3-4',
      summary: 'Add strict types, interfaces, and generics to React components to eliminate runtime bugs.',
      youtubeQuery: 'TypeScript+full+course+for+beginners',
      officialDocs: 'https://www.typescriptlang.org/docs/'
    },
    {
      week: 3,
      title: 'Next.js Server-Side Rendering (SSR)',
      skill: 'Next.js',
      time: 'Week 5-6',
      summary: 'Build fast Next.js applications using App Router, Server Components, and API routes for top SEO performance.',
      youtubeQuery: 'Next+js+full+course+tutorial',
      officialDocs: 'https://nextjs.org/docs'
    },
    {
      week: 4,
      title: 'Tailwind CSS & Responsive UI Systems',
      skill: 'Tailwind CSS',
      time: 'Week 7-8',
      summary: 'Design modern responsive layouts, dark modes, and micro-animations using utility-first Tailwind CSS.',
      youtubeQuery: 'Tailwind+CSS+full+course',
      officialDocs: 'https://tailwindcss.com/docs'
    },
    {
      week: 5,
      title: 'Global State Management (Zustand / Redux)',
      skill: 'State Management',
      time: 'Week 9-10',
      summary: 'Manage complex frontend application state cleanly across pages using Zustand or Redux Toolkit.',
      youtubeQuery: 'Zustand+React+state+management+tutorial',
      officialDocs: 'https://zustand-demo.pmnd.rs/'
    },
    {
      week: 6,
      title: 'WebSockets & Live Real-Time Interactivity',
      skill: 'WebSockets',
      time: 'Week 11-12',
      summary: 'Connect React frontends to WebSockets for live chat, instant notifications, and real-time dashboards.',
      youtubeQuery: 'React+WebSockets+realtime+chat+tutorial',
      officialDocs: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket'
    }
  ]
};

export default function RoadmapView({ userData = {} }) {
  const analysis = computeCareerAnalysis(userData);
  const userGoal = analysis.targetGoal || 'AI Engineer';

  const roadmapSteps = ROLE_ROADMAPS[userGoal] || ROLE_ROADMAPS['AI Engineer'];

  const openYoutube = (query) => {
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  const openDocs = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Sparkles color="var(--hud-cyan-bright)" size={22} />
          <h2 style={{ fontSize: '1.4rem', color: 'var(--hud-cyan-bright)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
            12-WEEK CAREER ROADMAP & VIDEO TUTORIALS
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Structured week-by-week learning roadmap for <strong style={{ color: 'var(--hud-cyan-bright)' }}>{userGoal}</strong> with direct YouTube video courses & official documentation.
        </p>
      </div>

      {/* Goal Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(0, 229, 255, 0.08)', border: '1px solid var(--border-cyan)', width: 'fit-content' }}>
        <Target size={16} color="var(--hud-cyan-bright)" />
        <span style={{ fontSize: '0.82rem', color: 'var(--hud-cyan-bright)', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
          ROADMAP GOAL: {userGoal.toUpperCase()} (12-WEEK CURRICULUM LOADED)
        </span>
      </div>

      {/* Timeline Roadmap Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {roadmapSteps.map((step) => (
          <div
            key={step.week}
            className="hud-panel"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: 'var(--bg-panel)',
              borderLeft: '4px solid var(--hud-cyan-bright)'
            }}
          >
            {/* Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{
                    background: 'rgba(0, 229, 255, 0.12)',
                    color: 'var(--hud-cyan-bright)',
                    border: '1px solid var(--border-cyan)',
                    padding: '2px 10px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    fontFamily: "'Share Tech Mono', monospace"
                  }}>
                    {step.time.toUpperCase()}
                  </span>
                  <span style={{ color: 'var(--hud-amber-bright)', fontSize: '0.8rem', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
                    [TARGET SKILL: {step.skill.toUpperCase()}]
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', color: 'var(--hud-cyan-bright)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
                  {step.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {step.summary}
            </p>

            {/* Direct Video & Docs Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid var(--border-cyan)', paddingTop: '16px' }}>
              
              <button
                className="btn-hud-amber"
                onClick={() => openYoutube(step.youtubeQuery)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.84rem' }}
              >
                <Youtube size={18} color="#FF0000" />
                WATCH FREE TUTORIAL ON YOUTUBE ▶
              </button>

              <button
                className="btn-secondary"
                onClick={() => openDocs(step.officialDocs)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.84rem' }}
              >
                <ExternalLink size={16} color="var(--hud-cyan-bright)" />
                OFFICIAL DOCS & GUIDE 🌐
              </button>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
