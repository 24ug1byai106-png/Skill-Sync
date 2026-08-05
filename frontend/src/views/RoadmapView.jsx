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
  ],

  'Full Stack Developer': [
    { week: 1, title: 'React & TypeScript Full-Stack Setup', skill: 'React', time: 'Week 1-2', summary: 'Build React apps with TypeScript interfaces, custom hooks, and component composition patterns.', youtubeQuery: 'React+TypeScript+full+course+2024', officialDocs: 'https://react.dev/' },
    { week: 2, title: 'Node.js & Express REST API Backend', skill: 'Node.js', time: 'Week 3-4', summary: 'Create REST APIs using Node.js and Express with JWT authentication and middleware.', youtubeQuery: 'Node.js+Express+REST+API+tutorial', officialDocs: 'https://nodejs.org/en/docs/' },
    { week: 3, title: 'PostgreSQL & MongoDB Data Modeling', skill: 'Databases', time: 'Week 5-6', summary: 'Design SQL relational schemas and NoSQL document models for modern full-stack applications.', youtubeQuery: 'PostgreSQL+vs+MongoDB+full+course', officialDocs: 'https://www.postgresql.org/docs/' },
    { week: 4, title: 'Docker Compose Full-Stack Deployment', skill: 'Docker', time: 'Week 7-8', summary: 'Package React, Node.js, and PostgreSQL together in Docker Compose for repeatable deployments.', youtubeQuery: 'Docker+Compose+full+stack+tutorial', officialDocs: 'https://docs.docker.com/compose/' },
    { week: 5, title: 'WebSockets & Real-Time Features', skill: 'WebSockets', time: 'Week 9-10', summary: 'Add live notifications, chat, and real-time dashboard updates using Socket.io.', youtubeQuery: 'Socket.io+real+time+app+tutorial', officialDocs: 'https://socket.io/docs/v4/' },
    { week: 6, title: 'CI/CD & Cloud Deployment (Vercel + Railway)', skill: 'Deployment', time: 'Week 11-12', summary: 'Deploy React frontend on Vercel and Node.js backend on Railway with automated GitHub Actions CI/CD.', youtubeQuery: 'Vercel+Railway+full+stack+deployment', officialDocs: 'https://vercel.com/docs' }
  ],

  'Machine Learning Engineer': [
    { week: 1, title: 'Python for ML & NumPy/Pandas Mastery', skill: 'Pandas', time: 'Week 1-2', summary: 'Master data loading, cleaning, feature engineering, and exploratory data analysis using Pandas and NumPy.', youtubeQuery: 'Pandas+NumPy+full+course+for+data+science', officialDocs: 'https://pandas.pydata.org/docs/' },
    { week: 2, title: 'Scikit-Learn Classification & Regression Models', skill: 'Scikit-Learn', time: 'Week 3-4', summary: 'Train, tune, and evaluate machine learning models using Scikit-Learn pipelines.', youtubeQuery: 'Scikit+Learn+machine+learning+tutorial', officialDocs: 'https://scikit-learn.org/stable/user_guide.html' },
    { week: 3, title: 'PyTorch Deep Learning Fundamentals', skill: 'PyTorch', time: 'Week 5-6', summary: 'Build neural networks from scratch using PyTorch tensors, autograd, and training loops.', youtubeQuery: 'PyTorch+deep+learning+full+course', officialDocs: 'https://pytorch.org/tutorials/' },
    { week: 4, title: 'MLflow Model Tracking & Experiment Registry', skill: 'MLflow', time: 'Week 7-8', summary: 'Track model experiments, log hyperparameters, and register production-ready model versions using MLflow.', youtubeQuery: 'MLflow+tutorial+for+beginners', officialDocs: 'https://mlflow.org/docs/latest/index.html' },
    { week: 5, title: 'FastAPI ML Model Serving', skill: 'FastAPI', time: 'Week 9-10', summary: 'Wrap trained PyTorch/Scikit-Learn models in FastAPI REST endpoints for real-time inference.', youtubeQuery: 'FastAPI+ML+model+deployment+tutorial', officialDocs: 'https://fastapi.tiangolo.com/' },
    { week: 6, title: 'Docker & MLOps Production Deployment', skill: 'MLOps', time: 'Week 11-12', summary: 'Package ML inference services in Docker containers and deploy with automated retraining pipelines.', youtubeQuery: 'MLOps+full+course+for+beginners', officialDocs: 'https://docs.docker.com/' }
  ],

  'Software Engineer': [
    { week: 1, title: 'Data Structures & Algorithms Foundations', skill: 'DSA', time: 'Week 1-2', summary: 'Master Arrays, Linked Lists, Stacks, Queues, Trees, and Graphs — the core building blocks of efficient software.', youtubeQuery: 'Data+structures+and+algorithms+full+course', officialDocs: 'https://docs.python.org/3/tutorial/' },
    { week: 2, title: 'Dynamic Programming & Problem Solving', skill: 'Algorithms', time: 'Week 3-4', summary: 'Solve complex DP problems (knapsack, LCS, coin change) and master Big O complexity analysis.', youtubeQuery: 'Dynamic+programming+full+course', officialDocs: 'https://leetcode.com/' },
    { week: 3, title: 'System Design Fundamentals', skill: 'System Design', time: 'Week 5-6', summary: 'Design scalable systems like URL shorteners, notification services, and distributed caches.', youtubeQuery: 'System+design+interview+full+course', officialDocs: 'https://github.com/donnemartin/system-design-primer' },
    { week: 4, title: 'Java / C++ Object-Oriented Programming', skill: 'OOP', time: 'Week 7-8', summary: 'Master OOP design principles: SOLID, design patterns (Factory, Observer, Strategy), and inheritance.', youtubeQuery: 'Java+OOP+full+course+for+beginners', officialDocs: 'https://docs.oracle.com/en/java/' },
    { week: 5, title: 'Git, CI/CD & DevOps Collaboration', skill: 'Git', time: 'Week 9-10', summary: 'Master advanced Git workflows (rebase, cherry-pick, bisect) and GitHub Actions CI pipelines.', youtubeQuery: 'Git+and+GitHub+full+course', officialDocs: 'https://git-scm.com/doc' },
    { week: 6, title: 'Docker & Cloud Deployment Basics', skill: 'Docker', time: 'Week 11-12', summary: 'Package and deploy your Java/Python applications in Docker containers on cloud servers.', youtubeQuery: 'Docker+full+course+for+beginners', officialDocs: 'https://docs.docker.com/' }
  ],

  'DevOps Engineer': [
    { week: 1, title: 'Linux System Administration & Bash Scripting', skill: 'Linux', time: 'Week 1-2', summary: 'Master Linux file systems, process management, user permissions, networking, and shell scripting automation.', youtubeQuery: 'Linux+full+course+for+beginners', officialDocs: 'https://linux.die.net/man/' },
    { week: 2, title: 'Docker Containerization & Multi-Stage Builds', skill: 'Docker', time: 'Week 3-4', summary: 'Write production Dockerfiles, set up Docker Compose multi-service environments, and optimize image sizes.', youtubeQuery: 'Docker+full+course+for+beginners', officialDocs: 'https://docs.docker.com/' },
    { week: 3, title: 'Kubernetes Cluster Orchestration', skill: 'Kubernetes', time: 'Week 5-6', summary: 'Deploy apps to Kubernetes: pods, deployments, services, ingress, configmaps, and secrets.', youtubeQuery: 'Kubernetes+full+course+for+beginners', officialDocs: 'https://kubernetes.io/docs/home/' },
    { week: 4, title: 'CI/CD with GitHub Actions & Jenkins', skill: 'CI/CD', time: 'Week 7-8', summary: 'Automate testing, building, and deployment pipelines using GitHub Actions and Jenkins.', youtubeQuery: 'GitHub+Actions+CI+CD+full+course', officialDocs: 'https://docs.github.com/en/actions' },
    { week: 5, title: 'Terraform Infrastructure as Code (AWS)', skill: 'Terraform', time: 'Week 9-10', summary: 'Provision cloud resources (EC2, RDS, VPC, S3) on AWS using Terraform HCL declarative code.', youtubeQuery: 'Terraform+full+course+AWS', officialDocs: 'https://developer.hashicorp.com/terraform/docs' },
    { week: 6, title: 'Prometheus & Grafana Monitoring', skill: 'Monitoring', time: 'Week 11-12', summary: 'Set up Prometheus metrics scraping and Grafana dashboards to monitor containers and servers in production.', youtubeQuery: 'Prometheus+Grafana+monitoring+tutorial', officialDocs: 'https://prometheus.io/docs/introduction/overview/' }
  ],

  'Cloud Engineer': [
    { week: 1, title: 'AWS Core Services Foundations', skill: 'AWS', time: 'Week 1-2', summary: 'Learn EC2, S3, IAM, VPC, Route 53, and CloudWatch — the essential AWS services every cloud engineer must know.', youtubeQuery: 'AWS+full+course+for+beginners', officialDocs: 'https://docs.aws.amazon.com/' },
    { week: 2, title: 'Terraform Infrastructure as Code', skill: 'Terraform', time: 'Week 3-4', summary: 'Write reusable Terraform modules to provision cloud infrastructure across AWS, GCP, and Azure.', youtubeQuery: 'Terraform+full+course+for+beginners', officialDocs: 'https://developer.hashicorp.com/terraform/docs' },
    { week: 3, title: 'Docker & Kubernetes on Cloud', skill: 'Kubernetes', time: 'Week 5-6', summary: 'Deploy containerized apps using Docker on AWS ECS and managed Kubernetes clusters (EKS/GKE).', youtubeQuery: 'AWS+EKS+Kubernetes+tutorial', officialDocs: 'https://kubernetes.io/docs/home/' },
    { week: 4, title: 'Serverless Architecture (AWS Lambda)', skill: 'Serverless', time: 'Week 7-8', summary: 'Build event-driven serverless functions using AWS Lambda, API Gateway, and SQS queues.', youtubeQuery: 'AWS+Lambda+serverless+tutorial', officialDocs: 'https://docs.aws.amazon.com/lambda/' },
    { week: 5, title: 'Cloud Networking & Security (VPC, IAM)', skill: 'Cloud Security', time: 'Week 9-10', summary: 'Design secure cloud networks using VPCs, subnets, security groups, and IAM role policies.', youtubeQuery: 'AWS+VPC+networking+tutorial+for+beginners', officialDocs: 'https://docs.aws.amazon.com/vpc/' },
    { week: 6, title: 'CI/CD on Cloud with CodePipeline & GitHub Actions', skill: 'CI/CD', time: 'Week 11-12', summary: 'Automate cloud deployments using AWS CodePipeline or GitHub Actions for zero-downtime releases.', youtubeQuery: 'AWS+CodePipeline+CI+CD+tutorial', officialDocs: 'https://docs.aws.amazon.com/codepipeline/' }
  ],

  'Cyber Security Engineer': [
    { week: 1, title: 'Linux & Networking Security Fundamentals', skill: 'Linux Security', time: 'Week 1-2', summary: 'Master Linux hardening, firewall rules (iptables), port scanning, and network packet analysis.', youtubeQuery: 'Linux+security+for+beginners', officialDocs: 'https://linux.die.net/man/' },
    { week: 2, title: 'OWASP Top 10 & Web Application Security', skill: 'OWASP', time: 'Week 3-4', summary: 'Understand and exploit the OWASP Top 10 vulnerabilities: SQL Injection, XSS, CSRF, IDOR, and Broken Auth.', youtubeQuery: 'OWASP+top+10+explained+for+beginners', officialDocs: 'https://owasp.org/www-project-top-ten/' },
    { week: 3, title: 'Network Packet Analysis with Wireshark', skill: 'Wireshark', time: 'Week 5-6', summary: 'Capture and analyze TCP/UDP network traffic to detect intrusions, credential sniffing, and suspicious activity.', youtubeQuery: 'Wireshark+full+course+tutorial', officialDocs: 'https://www.wireshark.org/docs/' },
    { week: 4, title: 'Penetration Testing with Kali Linux & Metasploit', skill: 'Pen Testing', time: 'Week 7-8', summary: 'Perform authorized penetration tests using Nmap scanning, Metasploit exploit modules, and Burp Suite proxies.', youtubeQuery: 'Kali+Linux+ethical+hacking+full+course', officialDocs: 'https://www.metasploit.com/get-started/' },
    { week: 5, title: 'Cryptography & Secure Authentication Systems', skill: 'Cryptography', time: 'Week 9-10', summary: 'Implement bcrypt password hashing, JWT token security, RSA encryption, and TLS certificate management.', youtubeQuery: 'Cryptography+for+beginners+course', officialDocs: 'https://cryptography.io/en/latest/' },
    { week: 6, title: 'SIEM & Incident Response with Splunk', skill: 'SIEM', time: 'Week 11-12', summary: 'Collect security logs into SIEM dashboards, write detection rules, and practice real-world incident response workflows.', youtubeQuery: 'Splunk+SIEM+tutorial+for+beginners', officialDocs: 'https://docs.splunk.com/Documentation/Splunk' }
  ],

  'Data Scientist': [
    { week: 1, title: 'Python, NumPy & Pandas Data Wrangling', skill: 'Pandas', time: 'Week 1-2', summary: 'Load, clean, reshape, and analyze large datasets using Pandas DataFrames and NumPy array operations.', youtubeQuery: 'Pandas+NumPy+full+course+data+science', officialDocs: 'https://pandas.pydata.org/docs/' },
    { week: 2, title: 'Statistics & Probability for Data Science', skill: 'Statistics', time: 'Week 3-4', summary: 'Master hypothesis testing, probability distributions, correlation, and A/B testing fundamentals.', youtubeQuery: 'Statistics+for+data+science+full+course', officialDocs: 'https://docs.scipy.org/doc/scipy/reference/stats.html' },
    { week: 3, title: 'Machine Learning with Scikit-Learn', skill: 'Scikit-Learn', time: 'Week 5-6', summary: 'Train regression, classification, and clustering models with feature engineering pipelines and cross-validation.', youtubeQuery: 'Scikit+Learn+machine+learning+full+course', officialDocs: 'https://scikit-learn.org/stable/user_guide.html' },
    { week: 4, title: 'Data Visualization (Matplotlib, Seaborn, Plotly)', skill: 'Visualization', time: 'Week 7-8', summary: 'Create impactful charts, heatmaps, pair plots, and interactive dashboards to communicate data insights.', youtubeQuery: 'Matplotlib+Seaborn+data+visualization+tutorial', officialDocs: 'https://matplotlib.org/stable/tutorials/index.html' },
    { week: 5, title: 'Deep Learning & Neural Networks (PyTorch)', skill: 'PyTorch', time: 'Week 9-10', summary: 'Build and train deep neural networks for tabular data, image classification, and text analysis.', youtubeQuery: 'PyTorch+deep+learning+full+course', officialDocs: 'https://pytorch.org/tutorials/' },
    { week: 6, title: 'SQL & Business Intelligence (Tableau / Power BI)', skill: 'SQL & BI', time: 'Week 11-12', summary: 'Query complex business databases with advanced SQL and build executive dashboards in Tableau or Power BI.', youtubeQuery: 'SQL+for+data+analysis+full+course', officialDocs: 'https://www.postgresql.org/docs/' }
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
