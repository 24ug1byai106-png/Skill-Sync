# 🚀 SkillSync AI — Career Intelligence Platform

> **Bridge your skills to your career with AI-powered evidence, skill-gap analysis, personalized roadmaps, missions, and mentorship.**

🌐 **Live App:** https://skillsync-mu-brown.vercel.app/  
📦 **Repository:** https://github.com/24ug1byai106-png/Skill-Sync

---

## 📌 Overview

**SkillSync AI** is an AI-powered career development platform designed primarily for university students and recent graduates preparing for technical careers.

Students usually have career information scattered across their resume, GitHub repositories, certificates, coding practice, projects, and learning history. SkillSync brings these signals together to create a continuously updated **Career DNA / Placement Readiness profile**.

The platform helps answer three questions:

1. **Where am I now?**
2. **What skills am I missing for my target role?**
3. **What should I do next to become job-ready?**

SkillSync combines deterministic application logic with AI services instead of treating the LLM as the source of truth.

---

## 🎯 Target Users

### Primary Users
- University students
- Recent graduates
- CSE / AIML / IT students
- Students preparing for technical placements

### Secondary Users
- Career counselors
- University placement cells
- Training and upskilling organizations

---

## ✨ Core Features

### 🧬 1. Career DNA & Placement Readiness
- Multi-dimensional career readiness profile
- Skill-level visualization
- Role-specific skill-gap analysis
- Progress tracking over time
- Evidence-based career recommendations

### 📄 2. AI Resume Intelligence
- PDF/DOCX resume processing
- **Google Gemini 2.5 Flash is used for resume parsing and structured JSON extraction**
- Extracts education, experience, skills, projects, and other relevant information
- Resume quality and ATS-oriented feedback
- AI-assisted resume improvement
- Google XYZ-style accomplishment-oriented bullet guidance

### 🐙 3. GitHub Intelligence
- Public GitHub repository analysis
- Programming language distribution
- Repository activity
- Project structure and complexity signals
- Documentation quality
- Technology and framework evidence

> GitHub activity is treated as **evidence**, not absolute proof of technical ability.

### 🎯 4. Skill Gap Engine
Compares the user's current evidence against the requirements of a target career role.

Example:

```text
Target Role: Backend Engineer

Current Evidence
✓ Python
✓ FastAPI
✓ PostgreSQL

Identified Gaps
→ Docker
→ System Design
→ Distributed Systems
```

### 🗺️ 5. Personalized Career Roadmaps
- Step-by-step learning path
- Skill dependencies
- Project recommendations
- Prioritized next actions
- Progress-aware recommendations

### 🔥 6. Weekly AI Missions
Turns skill gaps into actionable tasks.

Verification modes include:
1. Course/certificate evidence
2. AI knowledge check
3. Built-something/project proof
4. Timed skill assessment

The goal is:

```text
Identify Gap
      ↓
Assign Mission
      ↓
Complete Mission
      ↓
Verify Evidence
      ↓
Update Career Profile
```

### 💻 7. Code Playground
Powered by **Judge0** for isolated code execution.

Supported languages include:
- Python
- Java
- C++
- JavaScript
- Go
- Rust

### 🤖 8. AI Career Mentor
Powered by **Groq / Llama 3.3 70B** for:
- Career guidance
- Interview preparation
- Technical discussion
- Project architecture advice
- Resume guidance
- Personalized career questions

### 🏆 9. Progress & Gamification
- Monthly activity tracking
- Skill badges
- XP
- Streaks
- Mission progress

Gamification is intended to encourage consistent learning rather than reward activity for its own sake.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │       Student        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ React + Vite Frontend│
                         │     SkillSync UI     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     FastAPI API      │
                         │   Backend / Gateway  │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
     ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
     │ Gemini 2.5     │   │ Groq Llama 3.3 │   │   GitHub API   │
     │ Flash          │   │      70B        │   │                │
     │ Resume Parsing │   │ Reasoning / AI  │   │ Repo Evidence  │
     └────────────────┘   └────────────────┘   └────────────────┘
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    ▼
                         ┌──────────────────────┐
                         │    Career Engine     │
                         │ Skill Gap / Roadmap  │
                         │ Missions / Analytics │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    ▼               ▼                ▼
             ┌────────────┐  ┌────────────┐  ┌──────────────┐
             │ PostgreSQL │  │   Redis    │  │    Judge0    │
             │  Supabase  │  │ Cache/Jobs │  │ Code Sandbox │
             └────────────┘  └────────────┘  └──────────────┘
```

---

# 🤖 AI Architecture

SkillSync separates AI responsibilities instead of using one model for everything.

### Google Gemini 2.5 Flash
Used for:
- Resume parsing
- Document understanding
- Structured JSON extraction

### Groq — Llama 3.3 70B
Used for:
- Career reasoning
- Skill-gap analysis
- Roadmap generation
- AI Mentor
- Personalized recommendations

This separation allows the AI provider/model for a specific workload to be changed without redesigning the entire application.

---

# 🛠️ Technology Stack

## Frontend
- React 18
- Vite
- Vanilla CSS / CSS variables
- Glassmorphism / Holographic HUD UI
- Lucide React
- Supabase Auth

## Backend
- Python 3.11
- FastAPI
- Pydantic
- SQLAlchemy

## AI
- **Google Gemini 2.5 Flash — Resume Parsing**
- **Groq API — Llama 3.3 70B — Reasoning & Mentorship**

## Database & Storage
- Supabase
- PostgreSQL
- Supabase Storage

## Infrastructure / Supporting Services
- Redis
- Celery
- Judge0
- Docker
- Google Cloud / Cloud Run deployment architecture

## External Integrations
- GitHub API
- Gemini API
- Groq API
- Supabase

---

# 🔐 Security

SkillSync is designed around several security principles:

- Supabase authentication
- Backend authorization
- User-owned resource access
- Private document storage
- Server-side AI API keys
- Input/file validation
- Rate limiting
- Restricted code execution through Judge0
- Protection against cross-user data access
- Treating uploaded documents and GitHub content as untrusted data

AI-generated recommendations are treated as recommendations, not unquestionable facts.

---

# 📊 Data Flow

```text
Resume
  ↓
Gemini 2.5 Flash
  ↓
Structured Resume Profile
  ↓
Career Engine
  ↓
Skill Evidence
  ↓
Skill Gap Analysis
  ↓
Roadmap + Missions
  ↓
Verification
  ↓
Updated Career DNA
```

GitHub evidence, assessments, projects, and mission completion can contribute additional signals to the career profile.

---

# 📈 Product Success Metrics

Key metrics include:

- Percentage of users closing at least one meaningful skill gap
- Weekly Mission completion rate
- Roadmap completion
- Assessment improvement
- Career Mentor engagement
- Skill-profile improvement over time
- User retention
- Interview-readiness improvement

The long-term goal is to validate whether SkillSync's readiness indicators correlate with independent assessments and real career outcomes.

---

# 🚀 Production Scalability

For larger deployments:

- Keep FastAPI instances stateless
- Move heavy resume/GitHub analysis to asynchronous workers
- Use Redis for caching, rate limiting, and job coordination
- Use PostgreSQL as the durable source of truth
- Use private object storage for documents
- Stream interactive AI responses
- Cache previously generated analysis
- Use smaller models for simple tasks and stronger models for complex reasoning
- Add model-provider fallback and circuit breakers
- Add observability, model evaluation, and automated security testing

The current application is a deployed prototype with a production-oriented architecture; additional hardening and evaluation would be required for large-scale enterprise deployment.

---

# 📂 Project Structure

```text
Skill-Sync/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── services/
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── analytics/
│   │   ├── github/
│   │   ├── groq/
│   │   ├── judge0/
│   │   ├── mentor/
│   │   ├── missions/
│   │   ├── resume/
│   │   ├── roadmaps/
│   │   └── main.py
│   └── requirements.txt
│
├── create_supabase_schema.sql
├── run.bat
├── README.md
└── Prd.md
```

---

# ⚙️ Local Setup

## Prerequisites

- Node.js 18+
- Python 3.10+
- Git
- Supabase project
- Gemini API key
- Groq API key
- Judge0 instance/API

## Clone

```bash
git clone https://github.com/24ug1byai106-png/Skill-Sync.git
cd Skill-Sync
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Backend

```bash
cd ../backend

python -m venv venv

# Windows
.\venv\Scripts\activate

# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload --port 8000
```

Backend API:

```text
http://localhost:8000/docs
```

---

# 🔑 Environment Variables

Example backend configuration:

```env
PROJECT_NAME="SkillSync AI"
DEBUG=True

DATABASE_URL="postgresql://..."
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-key"

GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.5-flash"

GROQ_API_KEY="your-groq-api-key"
GROQ_MODEL="llama-3.3-70b-versatile"

JUDGE0_API_URL="your-judge0-url"

REDIS_URL="redis://..."
```

Never commit API keys or secrets to GitHub.

---

# 🔮 Future Roadmap

### Phase 1 — Core Career Intelligence
- Stronger semantic skill extraction
- Better Career DNA calibration
- Improved GitHub evidence analysis

### Phase 2 — Market Intelligence
- Job-description ingestion
- Industry skill ontology
- Current market-demand signals
- Trusted learning-resource recommendations

### Phase 3 — University Platform
- Placement-cell dashboard
- Counselor workflows
- Cohort analytics
- Student intervention tracking

### Phase 4 — Career Intelligence Graph
Build a longitudinal graph connecting:

```text
Student
  ↓
Evidence
  ↓
Skills
  ↓
Gaps
  ↓
Interventions
  ↓
Assessments
  ↓
Career Outcomes
```

The long-term vision is to become a **career intelligence layer**, not simply an AI resume builder.

---

# 📜 License

MIT License.

---

<p align="center">
  <b>Built to help students turn skills into demonstrable career readiness.</b>
</p>
