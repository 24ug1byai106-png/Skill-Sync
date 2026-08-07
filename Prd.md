# Product Requirements Document (PRD): SkillSync AI

## 1. Executive Summary
SkillSync AI is an advanced career development platform designed to "Bridge Your Skills to Success." By leveraging a dual-AI strategy, the platform transforms unstructured student data (resumes, certificates, and GitHub repositories) into actionable career intelligence. The system provides personalized roadmaps, skill gap analyses, and real-time mentorship to help students navigate the transition from education to employment.

## 2. Problem Statement
Students and early-career professionals often struggle to identify the specific technical and soft skills required for their target roles. Traditional career guidance is often generic, static, and fails to account for a student's existing projects or real-world coding contributions. There is a significant "guidance gap" between having a resume and having a clear, executable plan to become job-ready.

## 3. Goals & Objectives
*   **Automated Skill Extraction:** Eliminate manual data entry by accurately parsing resumes and certificates.
*   **Actionable Insights:** Provide a precise "Skill Gap Analysis" comparing current abilities against industry standards.
*   **Personalized Guidance:** Generate dynamic, weekly learning goals and long-term career roadmaps.
*   **Real-time Support:** Offer an AI Career Mentor for 24/7 guidance and resume optimization.
*   **Centralized Progress:** Create a single dashboard to track learning milestones and project completions.

## 4. Target Users / Stakeholders
*   **Primary Users:** University students and recent graduates.
*   **Secondary Users:** Career counselors (as a tool to assist students).
*   **Stakeholders:** Product owners, developers, and AI engineers.

## 5. Functional Requirements

### 5.1 Document Intelligence & Parsing
*   **Resume Parsing:** System must extract structured JSON data (Education, Experience, Skills, Projects) from uploaded PDF/Docx files using Gemini 2.5 Flash.
*   **Certificate Analysis:** System must validate and extract skills/credentials from uploaded certificates.
*   **GitHub Integration:** System must analyze public repositories to identify programming languages, framework usage, and project complexity.

### 5.2 AI Career Engine (Core Logic)
*   **Skill Gap Engine:** Compare extracted skills against target job roles to identify missing competencies.
*   **Career Roadmap Generator:** Create a step-by-step visual path to reach a specific career goal.
*   **Project Recommendation Engine:** Suggest specific projects to build based on identified skill gaps.
*   **Weekly Mission Generator:** Break down long-term goals into manageable "Weekly Missions."
*   **Resume Intelligence:** Provide specific feedback and optimization suggestions for the user's resume.

### 5.3 Mentorship & Interaction
*   **AI Career Mentor:** A chat interface providing personalized career advice, interview prep, and industry insights using Groq (Llama 3.3).
*   **Progress Tracker:** A visual dashboard showing completed missions and skill acquisition over time.

## 6. Non-Functional Requirements
*   **Performance:** AI responses from Groq must be delivered with low latency to ensure a fluid chat experience.
*   **Scalability:** The backend (FastAPI on Cloud Run) must scale horizontally to handle concurrent user requests.
*   **Reliability:** The system must handle document parsing failures gracefully, providing clear error messages to the user.
*   **Usability:** The UI must be highly responsive and utilize Framer Motion for smooth transitions.

## 7. System Architecture Overview
The system follows a centralized AI Career Engine model:
1.  **Frontend:** Next.js application serves as the user interface.
2.  **Authentication:** Supabase Auth manages user sessions.
3.  **Orchestration:** FastAPI (Backend) receives requests and coordinates between AI services and the database.
4.  **Parsing Layer:** Google Gemini 2.5 Flash converts documents into structured JSON.
5.  **Intelligence Layer:** Groq API (Llama 3.3-70b) performs reasoning, gap analysis, and mentorship.
6.  **Persistence:** Supabase PostgreSQL stores user profiles and career data; Supabase Storage holds physical files.

## 8. Tech Stack
*   **Frontend:** Next.js, React, Tailwind CSS, Framer Motion.
*   **Design/Dev Tools:** Google Stitch (UI Design), Antigravity (Frontend Dev), Google AI Studio (Logo).
*   **Backend:** FastAPI (Python), Codex (Assisted Development).
*   **AI Engines:** 
    *   **Groq API (Llama-3.3-70b-versatile):** Primary reasoning and mentorship.
    *   **Google Gemini 2.5 Flash:** Document parsing and JSON extraction.
*   **Database & Auth:** Supabase (PostgreSQL, Auth, Storage).
*   **Infrastructure:** Google Cloud Platform (Cloud Run).

## 9. Data Requirements
*   **User Profiles:** Name, contact, target role, and current skill levels.
*   **Structured Resume Data:** JSON representation of experience, education, and projects.
*   **Roadmaps:** Sequential steps, status (pending/complete), and associated resources.
*   **Missions:** Weekly tasks linked to specific skill acquisition.
*   **Analytics:** Tracking user engagement and progress metrics.

## 10. API Specifications
*   **Internal Endpoints (FastAPI):**
    *   `POST /upload/resume`: Triggers Gemini parsing.
    *   `POST /analyze/github`: Triggers GitHub API analysis.
    *   `GET /career/roadmap`: Returns the generated roadmap from Groq.
    *   `POST /mentor/chat`: Handles real-time interaction with the AI Mentor.
*   **External Integrations:**
    *   **GitHub API:** Fetching repository metadata.
    *   **Groq API:** Sending prompts for career analysis.
    *   **Gemini API:** Sending files for text extraction.

## 11. Security Requirements
*   **Authentication:** All routes must be protected by Supabase Auth JWT validation.
*   **Data Protection:** Resumes and sensitive documents must be stored in private Supabase Storage buckets with restricted access policies.
*   **API Security:** API keys for Groq and Gemini must be managed via GCP Secret Manager.

## 12. Deployment & Infrastructure
*   **Frontend Deployment:** Next.js deployed on Google Cloud.
*   **Backend Deployment:** FastAPI containerized via Docker and deployed on Google Cloud Run for auto-scaling.
*   **Database:** Managed PostgreSQL via Supabase.
*   **CI/CD:** Automated deployment pipeline to GCP.

## 13. Success Metrics
*   **Parsing Accuracy:** >95% accuracy in extracting skills from standard resume formats.
*   **User Retention:** Percentage of users who complete at least one "Weekly Mission."
*   **Mentorship Engagement:** Average number of interactions per session with the AI Career Mentor.
*   **Roadmap Completion:** Number of users who successfully bridge identified skill gaps.

## 14. Timeline & Milestones
*   **Phase 1: Core Infrastructure:** Setup Supabase, FastAPI, and Next.js boilerplate.
*   **Phase 2: Parsing Engine:** Implement Gemini 2.5 Flash integration for resume/certificate parsing.
*   **Phase 3: Intelligence Layer:** Integrate Groq for Skill Gap Analysis and Roadmap generation.
*   **Phase 4: Mentorship & UI:** Build the AI Career Mentor chat and the Student Dashboard.
*   **Phase 5: Deployment:** Finalize GCP Cloud Run configuration and launch.

## 15. Open Questions & Risks
*   **Risk:** Rate limits on Groq or Gemini APIs during high traffic.
*   **Risk:** Accuracy of GitHub analysis for users with private repositories or limited public activity.
*   **Open Question:** Will the system support multi-language resume parsing in the initial release?
*   **Open Question:** Should the Weekly Missions integrate with external learning platforms (e.g., Coursera, Udemy) via API?