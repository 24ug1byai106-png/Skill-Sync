# Product Requirements Document (PRD): SkillSync AI

## 1. Executive Summary
SkillSync AI is an AI-powered Career Operating System designed specifically for students and fresh graduates. Unlike generic AI chatbots, SkillSync AI acts as a continuous analysis engine that integrates a student’s resume, GitHub activity, coding profiles, and certifications to provide a personalized, data-driven roadmap to career success. The platform delivers a premium SaaS experience, focusing on actionable insights, skill gap analysis, and placement readiness.

## 2. Problem Statement
Students often face a "clarity gap" regarding their industry readiness. They struggle to identify:
*   Specific missing skills for target roles.
*   The quality and impact of their GitHub repositories.
*   Whether their resumes are optimized for ATS and industry standards.
*   What specific projects or certifications will move the needle for their careers.
Existing tools provide generic advice but lack the continuous monitoring and multi-source data integration required for a personalized career strategy.

## 3. Goals & Objectives
*   **Centralized Career Intelligence:** Create a single source of truth for a student's professional growth.
*   **Quantifiable Readiness:** Provide a "Placement Readiness Score" across multiple dimensions (Coding, Resume, GitHub, etc.).
*   **Actionable Guidance:** Generate weekly "missions" and long-term roadmaps that evolve with the student's progress.
*   **Premium UX:** Deliver a high-end, performant interface inspired by industry leaders like Linear and Vercel.

## 4. Target Users / Stakeholders
*   **College/Engineering Students:** Seeking internships and first-time placements.
*   **Placement Aspirants:** Focused on optimizing their profiles for specific high-tier companies.
*   **Fresh Graduates:** Looking to bridge the gap between academic projects and industry requirements.

## 5. Functional Requirements

### 5.1. Authentication & Profile
*   **Supabase Auth Integration:** Support for Google OAuth and Email/Password login.
*   **Profile Management:** User-defined career goals (e.g., AI Engineer, Cloud Engineer).

### 5.2. SkillSync AI Engine (Core Logic)
*   **Resume Intelligence:** 
    *   PDF parsing using PyMuPDF.
    *   Extraction of skills, projects, experience, and education.
    *   ATS scoring and improvement recommendations (grammar, action verbs, keywords).
*   **GitHub Intelligence:**
    *   Integration with GitHub API.
    *   Analysis of repository quality, README documentation, commit activity, and language distribution.
*   **Coding Profile Analysis:**
    *   Integration/Manual upload for LeetCode, HackerRank, and CodeChef stats.
    *   Generation of a "Coding Readiness Score."
*   **Certificate Analysis:**
    *   Extraction of skills and domains from uploaded certificates.
    *   Identification of missing industry-standard certifications.
*   **Skill Gap Engine:**
    *   Comparison of current student data against industry requirements for target roles.
    *   Generation of a "Skill Match Score" and prioritized learning list.

### 5.3. Guidance & Tracking
*   **Career Roadmap Generator:** Dynamic generation of weekly, monthly, and quarterly goals.
*   **AI Project Recommendation Engine:** Suggestions based on current skill level (Beginner to Advanced) and career goals.
*   **Weekly Mission Generator:** Personalized weekly tasks (e.g., "Solve 20 LeetCode problems," "Update Docker documentation").
*   **Progress Tracking:** Visual charts and progress rings for skills, goals, and placement readiness.

### 5.4. AI Career Mentor
*   **Context-Aware Chat:** A personalized mentor that understands the user's entire profile (Resume, GitHub, Goals) to answer specific career questions.

## 6. Non-Functional Requirements
*   **Performance:** Low-latency AI responses using Groq’s Llama-3.3-70b-versatile model.
*   **Scalability:** Cloud-native architecture capable of handling concurrent data processing.
*   **UI/UX:** Dark mode, glassmorphism, blue/purple gradients, and smooth animations (Framer Motion).
*   **Reliability:** Centralized AI engine (no multi-agent complexity) for predictable outputs.

## 7. System Architecture Overview
The system follows a modern 3-tier architecture:
1.  **Frontend:** Next.js application hosted on Vercel.
2.  **Backend:** FastAPI (Python) service hosted on Railway, acting as the orchestrator for AI logic and external APIs.
3.  **Persistence & Auth:** Supabase (PostgreSQL, Auth, and Object Storage).
4.  **AI Layer:** Groq API providing high-speed inference for the Llama 3.3 model.

## 8. Tech Stack
*   **Frontend:** Next.js, React, Tailwind CSS, Framer Motion, Lucide React.
*   **Backend:** FastAPI, Python, PyMuPDF, Pydantic.
*   **Database & Auth:** Supabase (PostgreSQL), Supabase Auth.
*   **Storage:** Supabase Storage (S3-compatible).
*   **AI/LLM:** Groq API (Llama-3.3-70b-versatile).
*   **External APIs:** GitHub REST API, Judge0 API (for code execution/validation).

## 9. Data Requirements
*   **Relational Data (PostgreSQL):** User profiles, skill scores, mission history, roadmap milestones, and metadata.
*   **Object Storage:** Original Resume PDFs, certificate images, and generated PDF career reports.
*   **Data Flow:** 
    *   User uploads data -> FastAPI parses/extracts -> Groq analyzes -> Results stored in Supabase -> Pushed to Next.js dashboard.

## 10. API Specifications (Key Endpoints)
*   `POST /auth/profile`: Initialize student career goals.
*   `POST /analyze/resume`: Upload and parse PDF; return skill extraction.
*   `GET /analyze/github/{username}`: Fetch and analyze repository metrics.
*   `POST /engine/skill-gap`: Compare profile vs. target role.
*   `GET /engine/missions/weekly`: Retrieve current personalized tasks.
*   `POST /mentor/chat`: Contextual AI interaction.

## 11. Security Requirements
*   **Authentication:** JWT-based session management via Supabase.
*   **Authorization:** Row Level Security (RLS) in PostgreSQL to ensure students only access their own data.
*   **Data Protection:** Secure handling of PDF uploads; no storage of raw GitHub credentials (using OAuth tokens).

## 12. Deployment & Infrastructure
*   **Frontend Deployment:** Vercel (CI/CD linked to GitHub).
*   **Backend Deployment:** Railway (Containerized FastAPI).
*   **Database:** Supabase Managed Cloud.
*   **Environment Management:** Strict separation of Development and Production environment variables.

## 13. Success Metrics
*   **Placement Readiness Score:** Average increase in student scores over a 3-month period.
*   **User Engagement:** Weekly active users (WAU) checking "Weekly Missions."
*   **Profile Completion:** Percentage of users who connect both Resume and GitHub.
*   **Inference Speed:** Average response time for AI-generated roadmaps (Target: < 2 seconds).

## 14. Timeline & Milestones
*   **Phase 1 (Foundation):** Supabase Auth, Resume Parsing (PyMuPDF), and Basic Dashboard UI.
*   **Phase 2 (Intelligence):** GitHub API integration, Groq AI Engine setup, and Skill Gap logic.
*   **Phase 3 (Guidance):** Roadmap Generator, Weekly Mission logic, and Project Recommendations.
*   **Phase 4 (Polish):** AI Career Mentor chat, Framer Motion animations, and Deployment to Railway/Vercel.

## 15. Open Questions & Risks
*   **API Rate Limits:** Managing Groq and GitHub API limits during high traffic (e.g., hackathons).
*   **Parsing Accuracy:** Handling non-standard resume formats or scanned PDFs.
*   **Data Privacy:** Ensuring student data is used solely for personalized guidance and not for model training (Groq privacy policy compliance).