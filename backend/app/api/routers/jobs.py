from fastapi import APIRouter, Query
from typing import List, Dict, Any, Optional
from app.services.job_service import JobSearchService

router = APIRouter()

@router.get("/search")
async def search_jobs(
    role: Optional[str] = Query(None, description="Target career role e.g. Software Engineer"),
    keywords: Optional[str] = Query(None, description="Search terms, skills or company"),
    location: Optional[str] = Query(None, description="Location preference e.g. Bengaluru"),
    work_mode: Optional[str] = Query(None, description="Remote / Hybrid / On-site"),
    experience: Optional[str] = Query(None, description="Experience filter"),
    date_posted: Optional[str] = Query(None, description="Date filter e.g. today, 3days, 7days")
) -> Dict[str, Any]:
    """
    Server-side search endpoint querying job aggregators or verified live feed.
    """
    jobs = await JobSearchService.search_jobs(
        role=role,
        keywords=keywords,
        location=location,
        work_mode=work_mode,
        experience=experience,
        date_posted=date_posted
    )
    return {
        "success": True,
        "total": len(jobs),
        "query": {
            "role": role,
            "keywords": keywords,
            "location": location,
            "work_mode": work_mode
        },
        "jobs": jobs
    }

@router.get("/linkedin-posts")
async def get_linkedin_posts(
    role: Optional[str] = Query(None, description="Target career role e.g. AI/ML Engineer")
) -> Dict[str, Any]:
    """
    Returns live startup recruiter and founder LinkedIn hiring posts matched to role.
    """
    posts = await JobSearchService.get_linkedin_posts(role=role)
    return {
        "success": True,
        "total": len(posts),
        "role": role,
        "posts": posts
    }

