from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.extensions import RoleSkillCatalog

ROLE_CATALOG: dict[str, dict[str, object]] = {
    "AI Engineer": {
        "required_skills": ["Python", "Machine Learning", "Deep Learning", "LLMs", "Prompt Engineering", "Vector Databases", "APIs"],
        "preferred_skills": ["LangChain", "LangGraph", "RAG", "MLOps", "Evaluation"],
        "tools": ["Git", "Docker", "PostgreSQL", "Redis", "Hugging Face"],
        "frameworks": ["FastAPI", "PyTorch", "TensorFlow", "Scikit-learn"],
        "certifications": ["AWS Machine Learning Specialty", "Google Professional ML Engineer"],
        "difficulty": "advanced",
        "estimated_learning_weeks": 32,
    },
    "Machine Learning Engineer": {
        "required_skills": ["Python", "Statistics", "Feature Engineering", "Model Training", "Model Deployment", "SQL"],
        "preferred_skills": ["MLOps", "Experiment Tracking", "Data Pipelines"],
        "tools": ["MLflow", "Docker", "Kubernetes", "Git", "Airflow"],
        "frameworks": ["Scikit-learn", "PyTorch", "TensorFlow", "XGBoost"],
        "certifications": ["Google Professional ML Engineer"],
        "difficulty": "advanced",
        "estimated_learning_weeks": 30,
    },
    "Backend Engineer": {
        "required_skills": ["Python", "APIs", "SQL", "PostgreSQL", "System Design", "Testing", "Authentication"],
        "preferred_skills": ["FastAPI", "Redis", "Docker", "Message Queues"],
        "tools": ["Git", "Docker", "Postman", "Linux"],
        "frameworks": ["FastAPI", "Django", "SQLAlchemy"],
        "certifications": ["AWS Developer Associate"],
        "difficulty": "intermediate",
        "estimated_learning_weeks": 20,
    },
    "Frontend Engineer": {
        "required_skills": ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Accessibility", "Testing"],
        "preferred_skills": ["Next.js", "State Management", "Design Systems"],
        "tools": ["Git", "Vite", "Playwright", "Figma"],
        "frameworks": ["React", "Next.js", "Tailwind CSS"],
        "certifications": ["Meta Front-End Developer"],
        "difficulty": "intermediate",
        "estimated_learning_weeks": 18,
    },
    "Full Stack Engineer": {
        "required_skills": ["JavaScript", "Python", "React", "APIs", "SQL", "Authentication", "Deployment"],
        "preferred_skills": ["Next.js", "FastAPI", "Docker", "Redis"],
        "tools": ["Git", "Docker", "PostgreSQL", "Vercel"],
        "frameworks": ["React", "Next.js", "FastAPI", "SQLAlchemy"],
        "certifications": ["AWS Developer Associate"],
        "difficulty": "intermediate",
        "estimated_learning_weeks": 24,
    },
    "Cloud Engineer": {
        "required_skills": ["Linux", "Networking", "AWS", "IAM", "Containers", "Monitoring", "Terraform"],
        "preferred_skills": ["Kubernetes", "CI/CD", "Security"],
        "tools": ["AWS", "Terraform", "Docker", "CloudWatch"],
        "frameworks": ["Kubernetes", "Serverless"],
        "certifications": ["AWS Solutions Architect Associate"],
        "difficulty": "intermediate",
        "estimated_learning_weeks": 22,
    },
    "DevOps Engineer": {
        "required_skills": ["Linux", "CI/CD", "Docker", "Kubernetes", "Monitoring", "Scripting", "Cloud"],
        "preferred_skills": ["Terraform", "Security", "Incident Response"],
        "tools": ["GitHub Actions", "Docker", "Kubernetes", "Prometheus", "Grafana"],
        "frameworks": ["Terraform", "Helm"],
        "certifications": ["Certified Kubernetes Administrator"],
        "difficulty": "advanced",
        "estimated_learning_weeks": 26,
    },
    "Cyber Security Engineer": {
        "required_skills": ["Networking", "Linux", "OWASP", "Threat Modeling", "Incident Response", "Python"],
        "preferred_skills": ["Cloud Security", "SIEM", "Penetration Testing"],
        "tools": ["Burp Suite", "Wireshark", "Nmap", "Splunk"],
        "frameworks": ["MITRE ATT&CK", "NIST"],
        "certifications": ["Security+", "CEH"],
        "difficulty": "advanced",
        "estimated_learning_weeks": 28,
    },
    "Data Scientist": {
        "required_skills": ["Python", "Statistics", "SQL", "Data Visualization", "Machine Learning", "Experimentation"],
        "preferred_skills": ["Deep Learning", "Storytelling", "Product Analytics"],
        "tools": ["Jupyter", "Pandas", "Tableau", "Power BI"],
        "frameworks": ["Scikit-learn", "PyTorch"],
        "certifications": ["Google Data Analytics Professional"],
        "difficulty": "intermediate",
        "estimated_learning_weeks": 24,
    },
    "Data Engineer": {
        "required_skills": ["SQL", "Python", "ETL", "Data Modeling", "Warehousing", "Spark", "Airflow"],
        "preferred_skills": ["Streaming", "Cloud Data Platforms", "dbt"],
        "tools": ["Airflow", "Spark", "Kafka", "Snowflake", "BigQuery"],
        "frameworks": ["dbt", "PySpark"],
        "certifications": ["Google Professional Data Engineer"],
        "difficulty": "advanced",
        "estimated_learning_weeks": 26,
    },
    "Software Engineer": {
        "required_skills": ["Programming", "Data Structures", "Algorithms", "Git", "Testing", "APIs", "Databases"],
        "preferred_skills": ["System Design", "Cloud", "Debugging"],
        "tools": ["Git", "Linux", "Docker"],
        "frameworks": ["FastAPI", "React", "Spring Boot"],
        "certifications": ["AWS Cloud Practitioner"],
        "difficulty": "intermediate",
        "estimated_learning_weeks": 20,
    },
    "System Engineer": {
        "required_skills": ["Linux", "Networking", "Scripting", "Monitoring", "Troubleshooting", "Security Basics"],
        "preferred_skills": ["Cloud", "Automation", "Virtualization"],
        "tools": ["Bash", "PowerShell", "Ansible", "Nagios"],
        "frameworks": ["ITIL"],
        "certifications": ["CompTIA Linux+", "RHCSA"],
        "difficulty": "intermediate",
        "estimated_learning_weeks": 18,
    },
}


async def ensure_role_catalog(session: AsyncSession) -> None:
    for role, data in ROLE_CATALOG.items():
        existing = (await session.execute(select(RoleSkillCatalog).where(RoleSkillCatalog.role == role))).scalar_one_or_none()
        if existing:
            continue
        session.add(RoleSkillCatalog(role=role, **data))
    await session.flush()


async def get_role_catalog(session: AsyncSession, role: str) -> RoleSkillCatalog:
    await ensure_role_catalog(session)
    normalized = role.lower()
    catalog = (
        await session.execute(select(RoleSkillCatalog).where(RoleSkillCatalog.role.ilike(normalized), RoleSkillCatalog.deleted_at.is_(None)))
    ).scalar_one_or_none()
    if catalog is None:
        catalog = (
            await session.execute(select(RoleSkillCatalog).where(RoleSkillCatalog.role.ilike(f"%{normalized}%"), RoleSkillCatalog.deleted_at.is_(None)))
        ).scalar_one()
    return catalog
