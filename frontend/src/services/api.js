const API_BASE = '/api/v1';

export async function fetchApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`API call to ${endpoint} failed, utilizing demonstration mock data:`, err);
  }
  return getMockData(endpoint);
}

function getMockData(endpoint) {
  if (endpoint.includes('/dashboard')) {
    return {
      career_readiness: 78.5,
      resume_score: 82.0,
      github_score: 75.0,
      coding_score: 80.0,
      skill_score: 77.0,
      mission_progress: 66.7,
      learning_streak: 12,
      roadmap_completion: 45.0,
      recent_activities: [
        { action: "Resume Analyzed", entity_type: "resume", created_at: "2026-08-04T10:15:00Z" },
        { action: "GitHub Account Connected", entity_type: "github", created_at: "2026-08-03T16:20:00Z" },
        { action: "Weekly Mission Completed", entity_type: "mission", created_at: "2026-08-02T14:10:00Z" },
      ],
      career_dna_summary: "Passionate Backend & Cloud Engineer with strong expertise in FastAPI, PostgreSQL, Docker, and Microservices.",
      skill_gap_summary: {
        missing_skills: ["Kubernetes", "AWS Lambda", "System Architecture", "Kafka"],
        priority: {
          priority_skills: ["Kubernetes", "AWS Lambda"],
          learning_order: ["Kubernetes", "AWS Lambda", "Kafka"],
          estimated_learning_time: "4 weeks"
        }
      },
      career_health: {
        career_health_status: "placement_ready",
        placement_ready_percent: 78.5,
        strength_areas: ["Python", "FastAPI", "PostgreSQL", "Docker", "REST APIs"]
      }
    };
  }
  if (endpoint.includes('/career/skill-gap')) {
    return {
      required_skills: ["Python", "FastAPI", "Docker", "PostgreSQL", "Kubernetes", "Redis", "AWS"],
      current_skills: ["Python", "FastAPI", "Docker", "PostgreSQL"],
      missing_skills: ["Kubernetes", "Redis", "AWS"],
      priority: {
        priority_skills: ["Kubernetes", "Redis"],
        learning_order: ["Redis", "Kubernetes", "AWS"],
        difficulty: "Intermediate",
        estimated_learning_time: "3 weeks"
      }
    };
  }
  if (endpoint.includes('/missions')) {
    return [
      { id: "m1", title: "Learn Docker & Containerization", week_start: "2026-08-01", objectives: ["Write Dockerfile", "Run Docker Compose"], status: "completed" },
      { id: "m2", title: "Deploy FastAPI Backend on Railway", week_start: "2026-08-08", objectives: ["Configure env vars", "Deploy container"], status: "in_progress" },
      { id: "m3", title: "Solve 5 LeetCode Medium DSA Problems", week_start: "2026-08-15", objectives: ["Binary Trees", "Dynamic Programming"], status: "pending" },
    ];
  }
  if (endpoint.includes('/projects/recommendations')) {
    return [
      {
        id: "p1",
        rank: 1,
        reason: "Matches your target goal for Backend Engineer & builds Kubernetes skills.",
        custom_project: {
          title: "Distributed Microservices E-Commerce API",
          description: "Production-ready backend architecture using FastAPI, Kafka, Redis, and PostgreSQL deployed on Kubernetes.",
          tech_stack: ["FastAPI", "PostgreSQL", "Redis", "Kafka", "Kubernetes", "Docker"],
          database_design: "Relational schema with PG_UUID keys, indexes on Order & Product tables.",
          folder_structure: "app/{api, core, models, services, workers}",
          api_design: "RESTful v1 endpoints with OpenAPI 3.0 specs.",
          timeline: "3 Weeks",
          difficulty: "Advanced",
          resume_description: "Architected scalable microservices backend handling 10k requests/min with Redis caching and Kafka event streams."
        }
      }
    ];
  }
  if (endpoint.includes('/judge0/coding-score')) {
    return { coding_score: 85.0, accepted_count: 17, total_submissions: 20 };
  }
  return {};
}
