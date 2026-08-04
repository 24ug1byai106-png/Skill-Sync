from fastapi import APIRouter

from app.admin.router import router as admin_router
from app.analytics.router import router as analytics_router
from app.api.routers import auth, career, dashboard, github, health, judge0, mentor, missions, notifications, profiles, projects, resume, roadmaps
from app.files.router import router as files_router
from app.monitoring.router import router as monitoring_router
from app.realtime.router import router as realtime_router
from app.reports.router import router as reports_router
from app.search.router import router as search_router

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(monitoring_router, prefix="/monitoring", tags=["monitoring"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(career.router, prefix="/career", tags=["career"])
api_router.include_router(resume.router, prefix="/resume", tags=["resume"])
api_router.include_router(github.router, prefix="/github", tags=["github"])
api_router.include_router(roadmaps.router, prefix="/roadmaps", tags=["roadmaps"])
api_router.include_router(missions.router, prefix="/missions", tags=["missions"])
api_router.include_router(mentor.router, prefix="/mentor", tags=["mentor"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(judge0.router, prefix="/judge0", tags=["judge0"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(admin_router, prefix="/admin", tags=["admin"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["analytics"])
api_router.include_router(search_router, prefix="/search", tags=["search"])
api_router.include_router(files_router, prefix="/files", tags=["files"])
api_router.include_router(reports_router, prefix="/reports", tags=["reports"])
api_router.include_router(realtime_router, prefix="/realtime", tags=["realtime"])

