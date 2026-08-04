from typing import Any
from pydantic import BaseModel


class AnalyticsOverviewRead(BaseModel):
    dau: int
    wau: int
    mau: int
    total_users: int
    resume_upload_count: int
    github_connections: int
    mission_completion_rate: float
    average_career_score: float
    average_ai_usage_per_user: float
    roadmap_completion_rate: float
    coding_challenge_completion: int
    project_recommendation_count: int
