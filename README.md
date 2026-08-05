# 🚀 SkillSync AI — Holographic Career OS HUD v3.0

> **Empowering Students to Bridge Skill Gaps, Build Verified Project Proof, and Master Placement Preparation with AI.**

![SkillSync AI](https://img.shields.io/badge/SkillSync-AI--v3.0-00e5ff?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Groq Llama 3.3 70B](https://img.shields.io/badge/AI_Engine-Groq_Llama_3.3_70B-f59e0b?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Installation & Local Setup](#-installation--local-setup)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔮 Overview

**SkillSync AI** is an end-to-end, futuristic **Career OS HUD** built specifically for computer science and engineering students. It continuously ingests student resumes, GitHub repositories, and coding activity to compute a **Career DNA & Placement Readiness Score**. 

Through interactive **Weekly AI Missions**, **Code Playgrounds**, and a **24/7 AI Career Mentor**, students systematically close skill gaps, build production-grade projects, and prepare for top-tier tech company interviews.

---

## ✨ Key Features

### 🧬 1. Career DNA & Placement Readiness Matrix
- Multi-dimensional skill score calculation (0–100%).
- Real-time radar matrix evaluating **Backend System Design**, **DSA & Problem Solving**, **DevOps & Cloud**, and **Full-Stack Architecture**.

### 📄 2. Resume Intelligence & AI Resume Builder
- Instant PDF/Text resume parsing with ATS keyword matching.
- Auto-generates high-impact bullet points using the **Google XYZ Formula** (*"Accomplished X, measured by Y, by implementing Z"*).

### 🐙 3. GitHub Repository Intelligence
- Deep code analysis of student GitHub repos.
- Evaluates commit frequency, code architecture complexity, language distribution, and documentation quality.

### 🎯 4. Weekly AI Missions & 4-Tier Interactive Verification
- AI-assigned weekly learning & preparation missions.
- **4 Interactive Verification Modes**:
  1. 📚 **Online Course Certificate**: File upload + AI credential audit hash verification.
  2. 📝 **AI Knowledge Check**: Dynamic 3-question quiz with instant AI grading and rationale explanations.
  3. 💻 **Built Something (Project Proof)**: Text description + screenshot proof analyzed by AI code evaluator.
  4. 🎯 **Already Know This**: 5-minute timed skill assessment with live score validation.

### 🔥 5. Achievements & LeetCode-Style Monthly Streak HUD
- 31-day activity heatmap calendar grid to track daily login activity.
- Unlockable skill badges (*FastAPI Architect*, *Docker Master*, *Streak Master*) with XP rewards.

### 💻 6. Clean Code Playground (Judge0 Execution)
- Multi-language sandbox supporting **Python**, **Java**, **C++**, **JavaScript**, **Go**, and **Rust**.
- Live code execution stream (stdout), memory usage stats, and execution timing.

### 🤖 7. 24/7 AI Career Mentor
- Context-aware AI mentor powered by **Groq Llama 3.3 70B**.
- Dynamic prompt support for **Mock Technical Interviews** and **Project Architecture Advice**.

---

## 🛠 Tech Stack

### **Frontend**
- **Framework**: React 18 + Vite
- **Styling**: Cyberpunk Holographic HUD design system with Vanilla CSS Variables & Glassmorphism
- **Icons**: Lucide React
- **Authentication**: Supabase Auth

### **Backend**
- **Framework**: FastAPI (Python 3.11)
- **AI Model**: Groq API (`llama-3.3-70b-versatile`)
- **Database**: PostgreSQL (Supabase)
- **Cache / Async Queue**: Redis & Celery
- **Code Execution Engine**: Judge0 Sandbox REST API

---

## ⚙️ Installation & Local Setup

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.10+)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/24ug1byai106-png/Skill-Sync.git
cd Skill-Sync
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:5173`.

### 3. Backend Setup
```bash
cd ../backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
The backend API documentation will be available at `http://localhost:8000/docs`.

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# Application Settings
PROJECT_NAME="SkillSync AI"
DEBUG=True

# Database (Supabase / PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillsync"
SUPABASE_URL="https://your-supabase-url.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"

# AI Model Credentials
GROQ_API_KEY="your-groq-api-key"
GROQ_MODEL="llama-3.3-70b-versatile"

# Judge0 Execution Engine
JUDGE0_API_URL="http://localhost:2358"
```

---

## 📂 Project Structure

```
Skill-Sync/
├── frontend/                  # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI HUD Components
│   │   │   ├── SkillSyncLogo.jsx
│   │   │   ├── VerifyMissionModal.jsx
│   │   │   ├── MonthlyStreakHUD.jsx
│   │   │   ├── AIResumeBuilder.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── views/             # Core Application Views
│   │   │   ├── DashboardView.jsx
│   │   │   ├── CareerDnaView.jsx
│   │   │   ├── ResumeView.jsx
│   │   │   ├── GithubView.jsx
│   │   │   ├── MissionsView.jsx
│   │   │   ├── Judge0View.jsx
│   │   │   └── MentorView.jsx
│   │   ├── services/          # API & Supabase Integrations
│   │   └── index.css          # Core Cyberpunk Design System
│   └── package.json
├── backend/                   # FastAPI REST API Backend
│   ├── app/
│   │   ├── analytics/         # Readiness Matrix & DNA Engine
│   │   ├── groq/              # Groq AI Service Wrapper
│   │   ├── judge0/            # Code Sandbox Execution Service
│   │   ├── mentor/            # AI Career Mentor Router
│   │   ├── missions/          # Weekly Missions & Verification
│   │   ├── resume/            # Resume Intelligence & Parser
│   │   └── main.py            # FastAPI Entry Point
│   └── requirements.txt
├── create_supabase_schema.sql # Database DDL Schema
├── run.bat                    # Windows One-Click Start Script
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve SkillSync AI:

1. Fork the Project Repository.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  <b>Made with ❤️ for Students preparing for Tech Placements & Careers.</b>
</p>
