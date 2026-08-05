import React from 'react';
import { Sparkles, Clock, HelpCircle, BookOpen, Database, Code, Target } from 'lucide-react';
import { computeCareerAnalysis } from '../services/analysisEngine';

// Role-based 3 projects dictionary tailored to every career goal
const ROLE_PROJECTS = {
  'Backend Developer': [
    {
      id: 1,
      difficulty: 'Intermediate to Advanced',
      title: 'Distributed Microservices E-Commerce API',
      timeline: '2 to 3 Weeks',
      tech_stack: ['Python (FastAPI)', 'PostgreSQL', 'Redis', 'Docker'],
      why_build: 'When thousands of people shop online at once, a simple website will crash. By building this, you learn how big apps split their backend into smaller independent services so everything stays fast and never crashes.',
      knowledge_gained: [
        'How to write high-speed async APIs in Python using FastAPI.',
        'How to use Redis caching so database queries load in under 10 milliseconds.',
        'How to package your app inside Docker containers so it runs on any computer easily.'
      ],
      database_design: 'PostgreSQL relational database storing products and orders with Redis memory cache for fast lookups.',
      resume_bullet: 'Built microservices backend using FastAPI and PostgreSQL with Redis caching to process 1,000+ operations per second.'
    },
    {
      id: 2,
      difficulty: 'Advanced Systems',
      title: 'High-Speed Payment Gateway & Event Streaming Engine',
      timeline: '2 Weeks',
      tech_stack: ['Python', 'Kafka', 'PostgreSQL', 'Docker', 'Linux'],
      why_build: 'Banks and payment companies like Stripe handle payments using message queues so money transactions never get lost. Building this teaches you event streaming.',
      knowledge_gained: [
        'How Apache Kafka queues events so payment processing never drops orders.',
        'How to handle ACID database transactions securely with PostgreSQL.',
        'How to write fail-safe retry logic when third-party APIs fail.'
      ],
      database_design: 'Relational transaction ledger schema with strict row locks and idempotency keys.',
      resume_bullet: 'Engineered event-driven payment processing backend using Kafka and PostgreSQL with transactional idempotency.'
    },
    {
      id: 3,
      difficulty: 'Security & Auth',
      title: 'Redis-Backed Rate Limiting & Auth Microservice',
      timeline: '1.5 Weeks',
      tech_stack: ['FastAPI', 'Redis', 'JWT', 'Docker'],
      why_build: 'Hackers can overwhelm servers with fake requests. Building this project teaches you how to block spam attacks and secure user login tokens.',
      knowledge_gained: [
        'How to build sliding-window rate limiters with Redis.',
        'How JSON Web Tokens (JWT) verify logged-in users safely.',
        'How middleware intercepts bad requests before they hit your database.'
      ],
      database_design: 'In-memory Redis store tracking API request IP counters with automatic key expiration.',
      resume_bullet: 'Created security auth microservice with JWT authentication and Redis sliding-window rate limiting.'
    }
  ],

  'Frontend Developer': [
    {
      id: 1,
      difficulty: 'Intermediate UI/UX',
      title: 'Interactive Real-Time Analytics & Telemetry Dashboard',
      timeline: '2 Weeks',
      tech_stack: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Vite'],
      why_build: 'Modern web companies need dashboards that display data clearly. Building this teaches you how to build fast, beautiful, interactive web applications.',
      knowledge_gained: [
        'How to manage complex component state cleanly using React & TypeScript.',
        'How to build interactive charts and graphs with real data using Recharts.',
        'How to style pixel-perfect responsive layouts with Tailwind CSS.'
      ],
      database_design: 'Client-side state store connected to mock REST API telemetry feeds.',
      resume_bullet: 'Developed responsive analytics dashboard using React, TypeScript, and Tailwind CSS with dynamic data charts.'
    },
    {
      id: 2,
      difficulty: 'Advanced Frontend',
      title: 'E-Commerce Storefront with Next.js SSR & Dynamic Filters',
      timeline: '2.5 Weeks',
      tech_stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Zustand'],
      why_build: 'Standard React pages take a moment to load on Google Search. Next.js Server-Side Rendering (SSR) makes websites load instantly and rank #1 on Google.',
      knowledge_gained: [
        'How Next.js renders web pages on the server for ultra-fast page loads.',
        'How to implement shopping cart state with Zustand state management.',
        'How to build dynamic multi-filter search inputs without lag.'
      ],
      database_design: 'Server-side rendered product catalog with client-side shopping cart persistence.',
      resume_bullet: 'Built high-performance e-commerce web application with Next.js SSR and Zustand state management.'
    },
    {
      id: 3,
      difficulty: 'Design System',
      title: 'Reusable UI Component Library & Design Tokens Engine',
      timeline: '1.5 Weeks',
      tech_stack: ['React', 'TypeScript', 'Storybook', 'CSS Modules'],
      why_build: 'Top tech companies use internal UI component libraries (like Google Material UI). Building this teaches you how to create modular UI components used across large engineering teams.',
      knowledge_gained: [
        'How to package reusable React UI components with TypeScript props.',
        'How to document and visually test components using Storybook.',
        'How to create theme tokens for Dark Mode and Custom Color Accents.'
      ],
      database_design: 'NPM package bundle exporting design tokens and modular UI components.',
      resume_bullet: 'Architected reusable React UI component library tested with Storybook and published as a design system.'
    }
  ],

  'Full Stack Developer': [
    {
      id: 1,
      difficulty: 'Full Stack Real-Time',
      title: 'Real-Time Live Collaboration & Chat Workspace',
      timeline: '2 Weeks',
      tech_stack: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'MongoDB'],
      why_build: 'Normal web pages only update when refreshed. Building this teaches you how apps like Slack or Google Docs update instantly across devices the second someone types.',
      knowledge_gained: [
        'How WebSockets keep a permanent open connection between browser and server.',
        'How to build interactive user interfaces in React using TypeScript.',
        'How to store user accounts, chat messages, and notifications in MongoDB.'
      ],
      database_design: 'MongoDB document collection storing chat channels, messages, and user session states.',
      resume_bullet: 'Engineered real-time collaboration workspace using React, TypeScript, and WebSockets serving live multi-user updates.'
    },
    {
      id: 2,
      difficulty: 'Full Stack SaaS',
      title: 'SaaS Customer Portal & Automated Subscription Management',
      timeline: '2.5 Weeks',
      tech_stack: ['React', 'FastAPI', 'PostgreSQL', 'Docker', 'Stripe API'],
      why_build: 'Every web startup needs user accounts, billing, and dashboards. Building a SaaS portal teaches you full-stack development from frontend UI down to database tables.',
      knowledge_gained: [
        'How to connect React frontends to FastAPI backends with REST APIs.',
        'How to process customer billing with Stripe payment webhooks.',
        'How to design relational database schemas for users and subscriptions.'
      ],
      database_design: 'PostgreSQL schema linking User accounts to Payment Plan subscriptions and usage metrics.',
      resume_bullet: 'Created end-to-end SaaS management application with FastAPI backend, React frontend, and Stripe billing integrations.'
    },
    {
      id: 3,
      difficulty: 'Full Stack Web',
      title: 'Developer Portfolio & Automated Code Review Platform',
      timeline: '2 Weeks',
      tech_stack: ['React', 'Python', 'FastAPI', 'Docker', 'GitHub REST API'],
      why_build: 'Building a developer platform that analyzes GitHub repositories proves you can write full-stack code that connects to external developer tools.',
      knowledge_gained: [
        'How to fetch data from GitHub API to analyze code repositories.',
        'How to render interactive code metrics and charts on the web.',
        'How to deploy full-stack apps with Docker Compose.'
      ],
      database_design: 'PostgreSQL cache storing parsed repository metadata, commit histories, and code scores.',
      resume_bullet: 'Developed full-stack code analytics tool integrating GitHub API, FastAPI server, and interactive React UI.'
    }
  ],

  'AI Engineer': [
    {
      id: 1,
      difficulty: 'Advanced AI',
      title: 'Smart AI Document Search & Q&A Assistant (RAG)',
      timeline: '2 Weeks',
      tech_stack: ['Python', 'LangChain', 'FastAPI', 'Vector DB (FAISS)', 'React'],
      why_build: 'Reading long PDFs takes hours. By building this project, you create a smart AI assistant that can read entire books or document files and instantly answer any question about them accurately.',
      knowledge_gained: [
        'How AI models turn text into numerical math vectors (embeddings).',
        'How to store and search text instantly using Vector Databases (FAISS).',
        'How to connect an AI backend to a React web page so users can chat with PDFs.'
      ],
      database_design: 'Vector Database index storing document embeddings with cosine similarity search.',
      resume_bullet: 'Developed AI document search assistant using Python, LangChain, and Vector DBs to perform instant Q&A across 500+ PDF pages.'
    },
    {
      id: 2,
      difficulty: 'Autonomous AI',
      title: 'Autonomous AI Agent with Tool Calling & Search Execution',
      timeline: '2.5 Weeks',
      tech_stack: ['Python', 'PyTorch', 'LangGraph', 'FastAPI', 'OpenAI API'],
      why_build: 'The future of AI is Autonomous Agents that can perform multi-step tasks (like searching the web, running code, and writing reports). Building this teaches you AI agent loops.',
      knowledge_gained: [
        'How to build agent decision loops with LangGraph and Python.',
        'How to give AI agents access to tools (web search, calculator, database lookup).',
        'How to handle memory and conversation context across multi-step tasks.'
      ],
      database_design: 'In-memory graph state tracker with persistent SQLite conversation memory.',
      resume_bullet: 'Built autonomous AI agent framework using Python and LangGraph capable of multi-step web search and tool execution.'
    },
    {
      id: 3,
      difficulty: 'Deep Learning',
      title: 'Fine-Tuned Domain Sentiment & Code Assistant API',
      timeline: '2 Weeks',
      tech_stack: ['Python', 'PyTorch', 'HuggingFace Transformers', 'FastAPI'],
      why_build: 'Generic AI models sometimes give broad answers. Fine-tuning teaches you how to train open-source AI models on specific custom datasets to make them super accurate for specific tasks.',
      knowledge_gained: [
        'How to fine-tune open-source Transformer models using HuggingFace & PyTorch.',
        'How to clean and tokenize specialized training datasets.',
        'How to serve trained PyTorch AI models over FastAPI endpoints.'
      ],
      database_design: 'High-performance PyTorch model weights checkpoint file deployed on GPU inference server.',
      resume_bullet: 'Fine-tuned open-source HuggingFace Transformer model using PyTorch and deployed FastAPI inference backend.'
    }
  ],

  'Machine Learning Engineer': [
    {
      id: 1,
      difficulty: 'MLOps Pipeline',
      title: 'Automated ML Model Training & MLflow Tracking Pipeline',
      timeline: '2 Weeks',
      tech_stack: ['Python', 'Scikit-Learn', 'MLflow', 'FastAPI', 'Docker'],
      why_build: 'In industry, Machine Learning isn’t just writing Jupyter Notebooks — it’s building automated pipelines that train, track, and deploy models to production.',
      knowledge_gained: [
        'How to track ML model metrics and hyperparameters using MLflow.',
        'How to automate data preprocessing and model evaluation in Python.',
        'How to package ML models into Docker microservices for instant API deployment.'
      ],
      database_design: 'MLflow model registry tracking model versions, training metrics, and artifact artifacts.',
      resume_bullet: 'Architected automated MLOps pipeline using Scikit-Learn, MLflow, and FastAPI to train and deploy predictive models.'
    },
    {
      id: 2,
      difficulty: 'Predictive ML',
      title: 'Predictive Churn & Fraud Detection Machine Learning Engine',
      timeline: '2 Weeks',
      tech_stack: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'XGBoost'],
      why_build: 'Companies lose millions to fraud and customer churn. Building a prediction engine teaches you how to handle imbalanced real-world datasets.',
      knowledge_gained: [
        'How to perform feature engineering on tabular data with Pandas & NumPy.',
        'How to train classification models using Random Forest and XGBoost.',
        'How to evaluate models using Precision, Recall, and ROC-AUC curves.'
      ],
      database_design: 'Parquet column-oriented data store for high-speed feature vector retrieval.',
      resume_bullet: 'Trained XGBoost fraud detection model achieving 94% ROC-AUC score on imbalanced transactions dataset.'
    },
    {
      id: 3,
      difficulty: 'Computer Vision',
      title: 'Real-Time Object Detection & Video Analytics Engine',
      timeline: '2.5 Weeks',
      tech_stack: ['Python', 'PyTorch', 'OpenCV', 'YOLO', 'FastAPI'],
      why_build: 'Computer vision powers self-driving cars and industrial automation. Building this project teaches you how to process live video frames and detect objects.',
      knowledge_gained: [
        'How to process image frames in real-time using OpenCV and Python.',
        'How to use pre-trained YOLO/PyTorch models for object detection.',
        'How to stream bounding-box annotated video feeds to web browsers.'
      ],
      database_design: 'Frame metadata logging database tracking object counts, timestamps, and confidence scores.',
      resume_bullet: 'Developed real-time video analytics system using OpenCV and PyTorch YOLO model processing 30 FPS video feeds.'
    }
  ],

  'Software Engineer': [
    {
      id: 1,
      difficulty: 'Systems Programming',
      title: 'High-Performance In-Memory Key-Value Store Engine',
      timeline: '2 Weeks',
      tech_stack: ['C++', 'Python', 'Data Structures', 'Multithreading'],
      why_build: 'Building a lightweight Redis clone teaches you deep computer science fundamentals — how memory, threads, and data structures work at the lowest level.',
      knowledge_gained: [
        'How to build thread-safe hash maps using C++ / Python concurrency.',
        'How to implement cache eviction algorithms like LRU (Least Recently Used).',
        'How memory allocation impacts speed and throughput.'
      ],
      database_design: 'Custom in-memory hash index with LRU cache eviction policy.',
      resume_bullet: 'Implemented in-memory key-value cache engine in C++ with LRU eviction supporting 50,000 ops/sec.'
    },
    {
      id: 2,
      difficulty: 'Networking & OS',
      title: 'Multithreaded Web Server & HTTP Protocol Parser',
      timeline: '2 Weeks',
      tech_stack: ['C++', 'Python', 'Sockets', 'TCP/IP', 'Linux'],
      why_build: 'Understanding how raw TCP sockets and HTTP requests work equips you to debug any complex web or backend issue in your software engineering career.',
      knowledge_gained: [
        'How TCP/IP network sockets listen for incoming connections.',
        'How to parse raw HTTP request headers and body streams.',
        'How thread pools handle multiple concurrent client requests safely.'
      ],
      database_design: 'File-system static asset cache with MIME-type routing dictionary.',
      resume_bullet: 'Built multithreaded HTTP web server from scratch using TCP sockets handling concurrent client connections.'
    },
    {
      id: 3,
      difficulty: 'Algorithms & Data',
      title: 'Distributed File Transfer & Peer-to-Peer Protocol Engine',
      timeline: '2.5 Weeks',
      tech_stack: ['Python', 'Go', 'Networking', 'Hashing', 'Git'],
      why_build: 'Peer-to-peer apps (like BitTorrent or Git) split files into small hashed chunks. Building this teaches you how distributed software syncs files across computers.',
      knowledge_gained: [
        'How cryptographic hashing (SHA-256) verifies file data integrity.',
        'How distributed nodes exchange file chunks over network sockets.',
        'How to build robust error-recovery when network packets drop.'
      ],
      database_design: 'Chunk manifest table mapping file hashes to peer node network addresses.',
      resume_bullet: 'Engineered distributed peer-to-peer file transfer protocol in Python with SHA-256 chunk verification.'
    }
  ],

  'DevOps Engineer': [
    {
      id: 1,
      difficulty: 'Infrastructure & K8s',
      title: 'Automated CI/CD Pipeline & Kubernetes Cluster Deployer',
      timeline: '2 Weeks',
      tech_stack: ['Docker', 'Kubernetes', 'GitHub Actions', 'AWS', 'Linux'],
      why_build: 'DevOps engineers automate software deployments. Building this project teaches you how code automatically tests and deploys to production servers whenever developers push to GitHub.',
      knowledge_gained: [
        'How to write automated GitHub Actions build and test workflows.',
        'How to write multi-stage Dockerfiles for minimal container sizes.',
        'How to configure Kubernetes deployments, services, and ingress rules.'
      ],
      database_design: 'Stateless Kubernetes cluster deployment backed by managed cloud databases.',
      resume_bullet: 'Automated CI/CD deployment pipeline using GitHub Actions, Docker, and Kubernetes with zero-downtime rollouts.'
    },
    {
      id: 2,
      difficulty: 'Infrastructure as Code',
      title: 'Terraform Multi-Cloud Automated Infrastructure Provisioner',
      timeline: '2 Weeks',
      tech_stack: ['Terraform', 'AWS', 'Linux', 'Bash Scripting', 'Git'],
      why_build: 'Manually clicking buttons on AWS to create servers takes hours and causes errors. Building this teaches you Infrastructure as Code (IaC) — setting up entire clouds using code.',
      knowledge_gained: [
        'How to write modular HCL code in Terraform for AWS/GCP resources.',
        'How to configure Cloud Virtual Private Networks (VPCs) and Subnets.',
        'How to manage infrastructure state files securely.'
      ],
      database_design: 'Terraform state backend stored in encrypted AWS S3 buckets with DynamoDB state locking.',
      resume_bullet: 'Provisioned cloud infrastructure on AWS using Terraform IaC, reducing server setup time from hours to 2 minutes.'
    },
    {
      id: 3,
      difficulty: 'Monitoring & Telemetry',
      title: 'Prometheus & Grafana Cloud Monitoring & Alerting Suite',
      timeline: '1.5 Weeks',
      tech_stack: ['Prometheus', 'Grafana', 'Docker', 'Linux', 'Python'],
      why_build: 'When servers run out of memory or CPU, DevOps engineers get notified instantly. Building this teaches you real-time system monitoring and alert dashboards.',
      knowledge_gained: [
        'How Prometheus scrapes server metrics (CPU, RAM, latency, errors).',
        'How to build visual telemetry dashboards in Grafana.',
        'How to set up automated Slack or Email alerts when servers crash.'
      ],
      database_design: 'Prometheus time-series database storing system metrics and HTTP response codes.',
      resume_bullet: 'Configured Prometheus and Grafana monitoring suite tracking container CPU/memory telemetry with automated alerts.'
    }
  ]
};

export default function ProjectsView({ userData = {} }) {
  const analysis = computeCareerAnalysis(userData);
  const userGoal = analysis.targetGoal || 'AI Engineer';

  // Fallback projects if role isn't explicitly matched
  const currentProjects = ROLE_PROJECTS[userGoal] || ROLE_PROJECTS['AI Engineer'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title & Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Sparkles color="var(--hud-cyan-bright)" size={22} />
          <h2 style={{ fontSize: '1.4rem', color: 'var(--hud-cyan-bright)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
            PROJECTS FOR {userGoal.toUpperCase()}
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Here are 3 hands-on practical projects tailored specifically for your target role: <strong style={{ color: 'var(--hud-cyan-bright)' }}>{userGoal}</strong>.
        </p>
      </div>

      {/* Goal Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(0, 229, 255, 0.08)', border: '1px solid var(--border-cyan)', width: 'fit-content' }}>
        <Target size={16} color="var(--hud-cyan-bright)" />
        <span style={{ fontSize: '0.82rem', color: 'var(--hud-cyan-bright)', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
          ACTIVE ROLE: {userGoal.toUpperCase()} (3 Tailored Projects Loaded)
        </span>
      </div>

      {/* Projects List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {currentProjects.map((proj) => (
          <div key={proj.id} className="hud-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--bg-panel)' }}>
            
            {/* Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ background: 'rgba(0, 229, 255, 0.12)', color: 'var(--hud-cyan-bright)', border: '1px solid var(--border-cyan)', padding: '2px 10px', fontSize: '0.78rem', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
                    PROJECT #{proj.id}
                  </span>
                  <span style={{ color: 'var(--hud-amber-bright)', fontSize: '0.8rem', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
                    [{proj.difficulty}]
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
              
              {/* 1. WHY BUILD THIS PROJECT */}
              <div style={{ background: '#07090E', padding: '16px', border: '1px solid var(--border-amber)', borderRadius: '2px' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--hud-amber-bright)', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 8px 0', fontFamily: "'Share Tech Mono', monospace" }}>
                  <HelpCircle size={15} /> WHY BUILD THIS PROJECT?
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {proj.why_build}
                </p>
              </div>

              {/* 2. WHAT KNOWLEDGE & SKILLS YOU GET */}
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
                  <Code size={14} /> RESUME BULLET POINT YOU CAN WRITE
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontStyle: 'italic', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
                  "{proj.resume_bullet}"
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
