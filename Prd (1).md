# Product Requirements Document (PRD): SkillSync AI

## 1. Product Overview

**SkillSync AI** is an AI-powered career intelligence platform for university students and recent graduates preparing for technical careers.

The platform combines resume evidence, GitHub activity, projects, assessments, certifications, target career roles, and mission progress to create a continuously updated **Career DNA / Placement Readiness profile**.

SkillSync is designed to answer:

1. Where is the student currently?
2. What skills are missing for the target role?
3. What should the student do next?
4. Has the student actually demonstrated the required skill?

The platform combines deterministic application logic with specialized AI services.

---

## 2. Problem Statement

Students often have fragmented career information across resumes, GitHub, certificates, projects, coding practice, and learning platforms.

Traditional career guidance is often generic and static. Students may know what career they want but still lack a personalized answer to:

> **"What exactly am I missing, and what should I do next?"**

SkillSync addresses this guidance gap by converting scattered career evidence into an actionable progression loop:

```text
Evidence
   ↓
Skill Profile
   ↓
Skill Gap
   ↓
Roadmap
   ↓
Mission
   ↓
Verification
   ↓
Updated Career Profile
```

---

## 3. Product Goals

### Primary Goals

- Parse and structure resume information automatically.
- Analyze GitHub project evidence.
- Build a role-specific skill profile.
- Identify meaningful skill gaps.
- Generate personalized career roadmaps.
- Recommend projects and learning actions.
- Convert gaps into weekly missions.
- Verify progress through assessments and evidence.
- Provide an AI Career Mentor.
- Track progress over time.

### Non-Goals

- Automatically deciding a student's career.
- Replacing human career counselors.
- Guaranteeing employment or placement.
- Treating AI-generated scores as absolute measures of ability.

---

## 4. Target Users

### Primary Users

- University students
- Recent graduates
- CSE students
- AIML students
- IT students
- Students preparing for technical placements

### Secondary Users

- Career counselors
- University placement cells
- Training organizations
- Upskilling programs

---

## 5. Core Product Features

### 5.1 Resume Intelligence

The system accepts PDF/DOCX resumes and creates structured career information.

**Google Gemini 2.5 Flash is used for resume parsing and structured JSON extraction.**

Expected output:

```json
{
  "education": [],
  "experience": [],
  "skills": [],
  "projects": [],
  "certifications": []
}
```

The parsing layer should preserve source evidence and avoid inventing qualifications.

---

### 5.2 GitHub Intelligence

The platform analyzes public GitHub repositories to identify evidence such as:

- Programming languages
- Frameworks
- Repository activity
- Project structure
- Documentation
- Technology usage
- Complexity signals

GitHub data is treated as supporting evidence rather than definitive proof of competence.

---

### 5.3 Career DNA

Career DNA represents the student's current role-specific capability profile.

Possible dimensions include:

- Programming
- DSA
- Backend
- Frontend
- Databases
- Cloud
- DevOps
- System Design
- AI/ML
- Project Development

Career DNA should be interpreted as a readiness indicator rather than an objective measurement of human ability.

---

### 5.4 Skill Gap Engine

The Skill Gap Engine compares:

```text
Current Evidence
       VS
Target Role Requirements
```

Example:

```text
Target: Backend Engineer

Strong Evidence
✓ Python
✓ FastAPI
✓ PostgreSQL

Skill Gaps
→ Docker
→ Distributed Systems
→ System Design
```

The production version should use a canonical skill ontology and calibrated scoring rather than simple keyword matching alone.

---

### 5.5 Career Roadmap Generator

The system generates a step-by-step roadmap based on:

- Target role
- Existing skills
- Skill gaps
- Skill dependencies
- Project experience
- Mission history

The roadmap should prioritize high-value gaps rather than producing an unlimited learning checklist.

---

### 5.6 Project Recommendation Engine

Projects are recommended based on missing competencies.

Example:

```text
Missing Skill: Docker + PostgreSQL + API Architecture

Recommended Project:
Production-style containerized REST API
```

The objective is to create demonstrable evidence rather than merely consume learning content.

---

### 5.7 Weekly AI Missions

Long-term goals are broken into smaller actions.

Mission lifecycle:

```text
Identify Gap
    ↓
Generate Mission
    ↓
Student Completes Mission
    ↓
Verification
    ↓
Evidence Stored
    ↓
Career DNA Updated
```

Verification modes:

1. Certificate/course evidence
2. AI knowledge check
3. Built-something/project proof
4. Timed skill assessment

---

### 5.8 AI Career Mentor

The AI Career Mentor is powered by **Groq / Llama 3.3 70B**.

Capabilities:

- Career guidance
- Technical interview preparation
- Mock interviews
- Project architecture guidance
- Resume guidance
- Skill explanations
- Personalized career questions

The mentor operates as an interface to the student's career context rather than replacing the underlying Career Engine.

---

### 5.9 Code Playground

Judge0 provides isolated code execution for coding assessments.

Supported languages include:

- Python
- Java
- C++
- JavaScript
- Go
- Rust

Code execution must remain sandboxed and resource-limited.

---

### 5.10 Progress & Gamification

The platform tracks:

- Mission completion
- Skill progress
- Activity streaks
- XP
- Badges
- Roadmap progress

Gamification should encourage meaningful skill progression rather than optimize for logins or superficial activity.

---

## 6. AI Architecture

SkillSync uses specialized AI responsibilities.

### Gemini 2.5 Flash

**Primary responsibility:**

- Resume/document understanding
- Resume parsing
- Structured JSON extraction

### Groq — Llama 3.3 70B

**Primary responsibility:**

- Career reasoning
- Skill-gap analysis
- Roadmap generation
- Project recommendations
- AI Career Mentor

This separation creates a provider abstraction so models can be changed without rewriting the product's core business logic.

---

## 7. System Architecture

```text
                         STUDENT
                            │
                            ▼
                  React + Vite Frontend
                            │
                            ▼
                       FastAPI API
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
   Gemini 2.5 Flash   Groq Llama 3.3     GitHub API
   Resume Parsing     Reasoning/Mentor   Repo Evidence
          │                 │                 │
          └─────────────────┼─────────────────┘
                            ▼
                    Career Intelligence
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
        Skill Gaps       Roadmaps       Missions
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                       Verification
                            │
                            ▼
                     Career DNA Update
                            │
          ┌─────────────────┼────────────────┐
          ▼                 ▼                ▼
      PostgreSQL          Redis             Judge0
      Supabase            Cache/Jobs       Sandbox
```

---

## 8. Technology Stack

### Frontend

- React 18
- Vite
- Vanilla CSS / CSS Variables
- Glassmorphism / Holographic HUD UI
- Lucide React
- Supabase Auth

### Backend

- Python 3.11
- FastAPI
- Pydantic
- SQLAlchemy

### AI

- **Google Gemini 2.5 Flash — Resume Parsing**
- **Groq API — Llama 3.3 70B — Reasoning & Mentorship**

### Database & Storage

- Supabase
- PostgreSQL
- Supabase Storage

### Supporting Infrastructure

- Redis
- Celery
- Docker
- Judge0
- Google Cloud / Cloud Run deployment architecture

### External APIs

- GitHub API
- Gemini API
- Groq API

---

## 9. Data Requirements

### User Profile

- User ID
- Name
- Target role
- Career preferences
- Current skill profile

### Resume Data

- Original document
- Structured education
- Experience
- Skills
- Projects
- Certifications
- Parsing metadata

### GitHub Data

- Username
- Repository metadata
- Languages
- Activity
- Project signals

### Career Data

- Career DNA
- Skill levels
- Skill gaps
- Confidence/evidence
- Roadmaps

### Mission Data

- Mission
- Target skill
- Status
- Verification type
- Evidence
- Completion date

### Analytics

- Mission completion
- Roadmap progress
- Skill progress
- Mentor usage
- Engagement

---

## 10. API Requirements

Representative internal endpoints:

```text
POST /upload/resume
POST /analyze/github
GET  /career/roadmap
GET  /career/dna
POST /missions
POST /missions/{id}/verify
POST /mentor/chat
POST /judge0/execute
GET  /analytics
```

### External Integrations

- GitHub API for repository evidence
- Gemini API for resume parsing
- Groq API for reasoning and mentorship
- Judge0 for code execution
- Supabase for authentication, database and storage

---

## 11. Security Requirements

### Authentication

Supabase Auth manages user authentication and sessions.

### Authorization

Backend endpoints must verify ownership of user resources.

### Document Security

- Private document storage
- File type validation
- File size validation
- User-scoped access
- Deletion controls

### API Security

- API keys stored server-side
- Secrets managed through environment/secret-management infrastructure
- Rate limiting
- Input validation
- Secure HTTP configuration

### AI Security

Uploaded resumes, GitHub repositories, README files, comments, and other external content must be treated as **untrusted data**.

The system must defend against prompt injection and must not treat document text as privileged instructions.

### Code Execution

User code must execute in an isolated sandbox with:

- CPU limits
- Memory limits
- Execution timeout
- Restricted network access
- No privileged host access

---

## 12. AI Reliability

The LLM should not be treated as the source of truth for deterministic information.

Examples:

- GitHub repository metadata → GitHub API
- Code execution result → Judge0
- Authentication → Supabase
- Durable application state → PostgreSQL
- Resume semantic parsing → Gemini
- Career reasoning → Groq

AI outputs should use structured formats where machine-readable data is required.

---

## 13. Scalability

For larger deployments:

- Stateless FastAPI instances
- Horizontal scaling
- Asynchronous workers for heavy analysis
- Redis caching/rate limiting
- PostgreSQL as source of truth
- Private object storage
- Streaming AI responses
- Model/provider fallback
- Circuit breakers
- Observability and logging

Heavy workloads such as resume analysis and GitHub analysis should be moved to background jobs rather than blocking interactive API requests.

---

## 14. Performance Requirements

### Interactive Workloads

- Low-latency AI Mentor responses
- Streaming responses where appropriate
- Cached repeated analysis
- Connection pooling

### Background Workloads

- Resume parsing
- Large GitHub analysis
- Career-profile recalculation
- Batch analytics

These should use asynchronous job processing.

---

## 15. Evaluation Strategy

The production system should evaluate:

### Resume Parsing

- Field extraction precision
- Field extraction recall
- Structured output validity

### Skill Extraction

- Precision
- Recall
- F1 score

### Recommendations

- Expert relevance rating
- User usefulness rating
- Mission completion

### Career DNA

- Correlation with independent assessments
- Calibration across user cohorts
- Longitudinal improvement

### Mentor

- Helpfulness
- Groundedness
- Hallucination rate
- Response latency

---

## 16. Product Success Metrics

Primary metric:

> **Percentage of users who close at least one meaningful skill gap within a defined period.**

Supporting metrics:

- Weekly Mission completion
- Roadmap completion
- Assessment improvement
- Skill-profile improvement
- Mentor engagement
- User retention
- Interview-readiness improvement

The long-term objective is to validate whether Career DNA correlates with independent skill assessments and real career outcomes.

---

## 17. Business Model

### B2C

Freemium student model:

**Free**
- Basic career analysis
- Limited resume analysis
- Basic roadmap

**Premium**
- Advanced GitHub analysis
- Advanced assessments
- Unlimited mentor interactions
- Deeper career reports
- Advanced interview preparation

### B2B

Potential customers:

- Universities
- Placement cells
- Training organizations
- Upskilling programs

The student is the primary user, while the institution can become the B2B buyer.

---

## 18. Competitive Differentiation

SkillSync is not positioned as another AI chatbot or resume builder.

Its core workflow is:

```text
Resume
  +
GitHub
  +
Projects
  +
Assessments
  +
Career Goal
       ↓
Career Intelligence
       ↓
Skill Gap
       ↓
Mission
       ↓
Verification
       ↓
Updated Career Profile
```

The long-term defensibility comes from longitudinal career evidence and learning-outcome data rather than UI alone.

---

## 19. Production Readiness

The current application is a deployed prototype with a production-oriented architecture.

For large-scale production, additional work is required in:

- AI evaluation
- Skill ontology calibration
- Readiness-score validation
- Observability
- Provider fallback
- Privacy controls
- Security testing
- Automated testing
- Disaster recovery
- Cost optimization
- Large-scale load testing

Production readiness is defined as predictable, secure, observable, scalable, testable, and recoverable behavior—not simply having a working deployment.

---

## 20. Future Roadmap

### Phase 1 — Career Intelligence

- Stronger semantic skill extraction
- Career DNA calibration
- Better GitHub evidence scoring

### Phase 2 — Market Intelligence

- Job-description ingestion
- Industry skill ontology
- Market-demand signals
- Trusted learning-resource recommendations

### Phase 3 — University Platform

- Placement-cell dashboard
- Counselor workflows
- Cohort analytics
- Student intervention tracking

### Phase 4 — Career Intelligence Graph

Longitudinal graph:

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

The long-term vision is to become a **career intelligence layer** that helps students make better next-step decisions rather than simply generating AI answers.

---

## 21. Key Product Principle

> **The score is a summary, not the explanation.**

Every important career recommendation should be traceable to evidence, confidence, and a concrete next action.

---

## 22. Risks

### AI Risks
- Hallucinations
- Prompt injection
- Model/provider outages
- Model drift

### Data Risks
- Sensitive resume information
- Unauthorized access
- Inaccurate GitHub evidence
- Fake project/certificate claims

### Product Risks
- Students may not complete missions
- Readiness scores may not correlate with real outcomes
- Users may over-trust AI recommendations

### Infrastructure Risks
- API rate limits
- AI inference cost
- Database scalability
- Code execution abuse

---

## 23. Milestones

### Phase 1
Core infrastructure:
- Supabase
- FastAPI
- React/Vite

### Phase 2
Document intelligence:
- Gemini 2.5 Flash resume parsing
- Structured resume extraction

### Phase 3
Career intelligence:
- Groq reasoning
- Skill-gap analysis
- Roadmaps
- Project recommendations

### Phase 4
Engagement:
- Weekly missions
- Verification
- Career Mentor
- Progress dashboard

### Phase 5
Production hardening:
- Security testing
- AI evaluation
- Observability
- Scalability
- Cost optimization
- GCP/Cloud Run deployment

---

## 24. Final Product Vision

SkillSync AI is intended to evolve from an AI career assistant into a **Career Intelligence Platform**.

The long-term system should understand:

> **What the student knows → what they can demonstrate → what their target role requires → what gap matters most → what action will close that gap → whether the student actually improved.**

The goal is not to predict a student's future.

> **The goal is to improve their next career decision.**
