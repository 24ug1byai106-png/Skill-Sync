# SkillPilot AI Backend

SkillPilot AI is an AI Career Operating System: students upload resumes and certificates, connect GitHub, choose career goals, and receive continuously updated career DNA, skill gaps, readiness scores, roadmaps, weekly missions, mentor guidance, and project recommendations.

## Stack

- FastAPI with async endpoints
- Python 3.13
- SQLAlchemy 2 async with PostgreSQL/Supabase
- Alembic migrations
- Pydantic V2 validation
- Supabase Auth JWT and Storage
- Groq `llama-3.3-70b-versatile`
- LangGraph workflow orchestration
- Redis rate limiting
- Judge0 coding submissions
- Docker and Railway deployment

## Local Setup

1. Create an environment file:

```bash
cp .env.example .env
```

2. Start Postgres, Redis, and the API:

```bash
docker compose up --build
```

3. Run migrations:

```bash
docker compose exec api alembic upgrade head
```

4. Open Swagger:

```text
http://localhost:8000/docs
```

## Important Environment Variables

`DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `GROQ_API_KEY`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `JUDGE0_URL`, `REDIS_URL`.

## API Surface

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET|PUT /api/v1/profiles/me`
- `POST|GET /api/v1/career/goals`
- `POST /api/v1/career/analyze`
- `POST /api/v1/resume/upload`
- `POST /api/v1/resume/{resume_id}/analyze`
- `POST /api/v1/resume/certificates`
- `POST /api/v1/github/connect`
- `POST /api/v1/github/{account_id}/analyze`
- `GET /api/v1/roadmaps`
- `GET /api/v1/missions/weekly`
- `PUT /api/v1/missions/{mission_id}/progress`
- `POST /api/v1/mentor/chat`
- `GET /api/v1/dashboard`
- `POST /api/v1/judge0/submissions`
- `GET /api/v1/judge0/submissions/{submission_id}`
- `GET /api/v1/notifications`
- `PUT /api/v1/notifications/{notification_id}/read`
- `PUT /api/v1/notifications/read-all`
- `GET /api/v1/projects`
- `GET /api/v1/projects/recommendations`

## Security Notes

The API verifies Supabase JWTs, enforces student/admin roles through dependencies, validates request bodies with Pydantic, validates file MIME type and size before storage upload, uses SQLAlchemy parameterization, emits security headers, applies Redis-backed rate limiting, and centralizes error responses.

## Migrations

```bash
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```

The initial migration creates all requested tables with UUID primary keys, timestamps, soft-delete columns, foreign keys, cascade behavior, indexes, and RLS-compatible ownership columns.

## Tests

```bash
pytest
```
