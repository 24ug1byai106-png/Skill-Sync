-- SkillSync AI Supabase PostgreSQL Database Setup Schema Script
-- Copy and paste this script into your Supabase SQL Editor to create all required database tables!

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(320) UNIQUE NOT NULL,
    supabase_user_id UUID UNIQUE NOT NULL,
    role VARCHAR(32) DEFAULT 'student' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    university VARCHAR(200),
    degree VARCHAR(160),
    graduation_year INT,
    location VARCHAR(160),
    bio TEXT,
    profile_image_path VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- 3. Career Goals Table
CREATE TABLE IF NOT EXISTS public.career_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(180) NOT NULL,
    target_role VARCHAR(180) NOT NULL,
    target_industry VARCHAR(180),
    experience_level VARCHAR(80) DEFAULT 'entry',
    target_date DATE,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- 4. Career DNA Table
CREATE TABLE IF NOT EXISTS public.career_dna (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    career_goal_id UUID REFERENCES public.career_goals(id) ON DELETE SET NULL,
    strengths JSONB DEFAULT '[]'::jsonb NOT NULL,
    traits JSONB DEFAULT '{}'::jsonb NOT NULL,
    interests JSONB DEFAULT '[]'::jsonb NOT NULL,
    summary TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- 5. Resumes Table
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(160) NOT NULL,
    size_bytes INT NOT NULL,
    parsed_text TEXT,
    is_current BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- 6. Resume Parsed Content Table
CREATE TABLE IF NOT EXISTS public.resume_parsed_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE UNIQUE NOT NULL,
    skills JSONB DEFAULT '[]'::jsonb NOT NULL,
    projects JSONB DEFAULT '[]'::jsonb NOT NULL,
    education JSONB DEFAULT '[]'::jsonb NOT NULL,
    experience JSONB DEFAULT '[]'::jsonb NOT NULL,
    certificates JSONB DEFAULT '[]'::jsonb NOT NULL,
    achievements JSONB DEFAULT '[]'::jsonb NOT NULL,
    technical_skills JSONB DEFAULT '[]'::jsonb NOT NULL,
    soft_skills JSONB DEFAULT '[]'::jsonb NOT NULL,
    languages JSONB DEFAULT '[]'::jsonb NOT NULL,
    raw_text_hash VARCHAR(64) DEFAULT '' NOT NULL,
    parser_version VARCHAR(40) DEFAULT 'v1' NOT NULL,
    parse_metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- 7. Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255),
    issued_at DATE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(160) NOT NULL,
    size_bytes INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- 8. GitHub Accounts Table
CREATE TABLE IF NOT EXISTS public.github_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    github_user_id VARCHAR(120) NOT NULL,
    username VARCHAR(160) NOT NULL,
    access_token_encrypted TEXT,
    profile_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT uq_github_account_user_remote UNIQUE (user_id, github_user_id)
);

-- 9. GitHub Repositories Table
CREATE TABLE IF NOT EXISTS public.github_repositories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    github_account_id UUID REFERENCES public.github_accounts(id) ON DELETE CASCADE NOT NULL,
    external_id VARCHAR(120) NOT NULL,
    name VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    description TEXT,
    language VARCHAR(100),
    stars INT DEFAULT 0 NOT NULL,
    forks INT DEFAULT 0 NOT NULL,
    pushed_at TIMESTAMPTZ,
    topics JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT uq_github_repo_account_remote UNIQUE (github_account_id, external_id)
);

-- 10. Resume Analysis Table
CREATE TABLE IF NOT EXISTS public.resume_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
    score FLOAT NOT NULL,
    strengths JSONB DEFAULT '[]'::jsonb NOT NULL,
    weaknesses JSONB DEFAULT '[]'::jsonb NOT NULL,
    missing_keywords JSONB DEFAULT '[]'::jsonb NOT NULL,
    raw_analysis JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- 11. Skill Gap Table
CREATE TABLE IF NOT EXISTS public.skill_gap (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    career_goal_id UUID REFERENCES public.career_goals(id) ON DELETE SET NULL,
    required_skills JSONB DEFAULT '[]'::jsonb NOT NULL,
    current_skills JSONB DEFAULT '[]'::jsonb NOT NULL,
    missing_skills JSONB DEFAULT '[]'::jsonb NOT NULL,
    priority JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- 12. Career Readiness Table
CREATE TABLE IF NOT EXISTS public.career_readiness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    overall_score FLOAT NOT NULL,
    resume_score FLOAT DEFAULT 0 NOT NULL,
    github_score FLOAT DEFAULT 0 NOT NULL,
    skills_score FLOAT DEFAULT 0 NOT NULL,
    explanation TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- 13. Interview Sessions Table
CREATE TABLE IF NOT EXISTS public.interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    interview_id VARCHAR(120) NOT NULL,
    target_role VARCHAR(180) NOT NULL,
    start_time TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    end_time TIMESTAMPTZ,
    questions JSONB DEFAULT '[]'::jsonb NOT NULL,
    answers JSONB DEFAULT '[]'::jsonb NOT NULL,
    transcript JSONB DEFAULT '[]'::jsonb NOT NULL,
    technical_score FLOAT DEFAULT 0 NOT NULL,
    problem_solving_score FLOAT DEFAULT 0 NOT NULL,
    communication_score FLOAT DEFAULT 0 NOT NULL,
    project_score FLOAT DEFAULT 0 NOT NULL,
    confidence_score FLOAT DEFAULT 0 NOT NULL,
    overall_score FLOAT DEFAULT 0 NOT NULL,
    strengths JSONB DEFAULT '[]'::jsonb NOT NULL,
    weaknesses JSONB DEFAULT '[]'::jsonb NOT NULL,
    recommendations JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 14. Project Catalog Table
CREATE TABLE IF NOT EXISTS public.project_catalog (
    id VARCHAR(120) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    roles JSONB DEFAULT '[]'::jsonb NOT NULL,
    category VARCHAR(120) NOT NULL,
    difficulty VARCHAR(60) NOT NULL,
    technologies JSONB DEFAULT '[]'::jsonb NOT NULL,
    skill_gap_tags JSONB DEFAULT '[]'::jsonb NOT NULL,
    base_why_build TEXT NOT NULL,
    base_knowledge JSONB DEFAULT '[]'::jsonb NOT NULL,
    database_design TEXT NOT NULL,
    base_resume_bullet TEXT NOT NULL,
    timeline VARCHAR(60) DEFAULT '2 Weeks' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 15. Recommended Projects History Table
CREATE TABLE IF NOT EXISTS public.recommended_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    project_id VARCHAR(120) NOT NULL,
    recommended_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    dismissed BOOLEAN DEFAULT FALSE NOT NULL,
    score FLOAT DEFAULT 0 NOT NULL,
    recommendation_reason TEXT
);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_parsed_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gap ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_readiness ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommended_projects ENABLE ROW LEVEL SECURITY;

-- Allow public access for anon & authenticated roles during dev
CREATE POLICY "Users Access" ON public.users FOR ALL USING (true);

CREATE POLICY "Profiles Access" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Resumes Access" ON public.resumes FOR ALL USING (true);
CREATE POLICY "Certificates Access" ON public.certificates FOR ALL USING (true);
CREATE POLICY "Github Accounts Access" ON public.github_accounts FOR ALL USING (true);
CREATE POLICY "Interview Sessions Access" ON public.interview_sessions FOR ALL USING (true);
CREATE POLICY "Project Catalog Access" ON public.project_catalog FOR ALL USING (true);
CREATE POLICY "Recommended Projects Access" ON public.recommended_projects FOR ALL USING (true);



