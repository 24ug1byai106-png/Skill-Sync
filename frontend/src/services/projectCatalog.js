// Comprehensive Structured Project Catalog (25+ Production-Grade Projects)
// Spanning Backend, Frontend, Full Stack, AI/ML, DevOps, Security, Cloud, Data Engineering, and SRE

export const PROJECT_CATALOG = [
  {
    id: 'realtime_collab',
    title: 'Real-Time Collaborative Workspace & Document Engine',
    roles: ['Software Engineer', 'Full Stack Developer', 'Backend Developer', 'Frontend Developer'],
    category: 'Full Stack / Real-Time Systems',
    difficulty: 'Intermediate',
    timeline: '2.5 Weeks',
    technologies: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'Redis', 'PostgreSQL'],
    skill_gap_tags: ['WebSockets', 'Redis', 'Real-Time Systems', 'System Design', 'State Synchronization'],
    base_why_build: 'When multiple users edit documents simultaneously (like Google Docs), race conditions occur. Building this teaches operational transformation, WebSocket pub/sub, and distributed cache synchronization.',
    base_knowledge: [
      'WebSocket protocol handling and real-time socket connection management.',
      'Redis Pub/Sub channels for multi-server message broadcasting.',
      'Conflict-free Replicated Data Types (CRDT) for concurrent state updates.'
    ],
    database_design: 'PostgreSQL storing document versions with Redis Pub/Sub handling active socket room subscriptions.',
    base_resume_bullet: 'Engineered real-time collaborative document platform supporting multi-user concurrent editing with WebSockets and Redis Pub/Sub.'
  },
  {
    id: 'microservices_ecommerce',
    title: 'Distributed Microservices E-Commerce API',
    roles: ['Backend Developer', 'Software Engineer', 'Full Stack Developer', 'Staff Software Engineer'],
    category: 'Backend / Distributed Systems',
    difficulty: 'Advanced',
    timeline: '3 Weeks',
    technologies: ['Python (FastAPI)', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'Kubernetes'],
    skill_gap_tags: ['Microservices', 'Kafka', 'Kubernetes', 'FastAPI', 'Redis', 'System Architecture'],
    base_why_build: 'High-traffic e-commerce backends crash when built as single monoliths. Building this teaches microservices decoupling, Kafka event streaming, and Kubernetes container orchestration.',
    base_knowledge: [
      'Asynchronous RESTful microservice communication in FastAPI.',
      'Apache Kafka event topic publishing and asynchronous consumer loops.',
      'Containerization with Docker Compose and local Kubernetes deployment.'
    ],
    database_design: 'Decoupled per-service PostgreSQL schema with PG_UUID keys and Redis memory caching.',
    base_resume_bullet: 'Architected distributed e-commerce microservices backend handling 10,000+ requests/min using FastAPI, Kafka event streams, and Kubernetes.'
  },
  {
    id: 'ai_code_reviewer',
    title: 'AI Automated Code Review & Security Scanner',
    roles: ['AI Engineer', 'Machine Learning Engineer', 'Backend Developer', 'Software Engineer'],
    category: 'AI / LLM Systems',
    difficulty: 'Intermediate',
    timeline: '2 Weeks',
    technologies: ['Python', 'FastAPI', 'LangChain', 'OpenAI', 'Vector Databases', 'Git'],
    skill_gap_tags: ['LangChain', 'Vector Databases', 'OpenAI', 'Python', 'REST API'],
    base_why_build: 'Engineering teams waste hours on routine PR reviews. Building this AI assistant automates syntax checking, vulnerability scanning, and performance optimization suggestions.',
    base_knowledge: [
      'Prompt engineering techniques and AST (Abstract Syntax Tree) code analysis.',
      'LangChain agent orchestration for multi-step automated refactoring.',
      'Integrating GitHub Webhooks with FastAPI backend workers.'
    ],
    database_design: 'Vector database (Pinecone/Qdrant) storing embeddings of clean coding standards and vulnerability patterns.',
    base_resume_bullet: 'Developed AI automated code review tool integrating GitHub webhooks and LangChain to audit pull requests for security vulnerabilities.'
  },
  {
    id: 'task_queue_engine',
    title: 'High-Throughput Distributed Task Queue',
    roles: ['Backend Developer', 'Software Engineer', 'DevOps Engineer', 'SRE'],
    category: 'Backend / Infrastructure',
    difficulty: 'Advanced',
    timeline: '2 Weeks',
    technologies: ['Python', 'Redis', 'PostgreSQL', 'Docker', 'Linux', 'AsyncIO'],
    skill_gap_tags: ['Redis', 'Distributed Systems', 'AsyncIO', 'Task Queues', 'Docker'],
    base_why_build: 'Long-running background tasks (like video encoding or report generation) block web servers. Building this worker queue teaches background processing and graceful failure retries.',
    base_knowledge: [
      'Designing dead-letter queues (DLQ) and exponential backoff retry algorithms.',
      'Redis RPOPLPUSH / BLMOVE atomic primitives for queue locking.',
      'Process monitoring and worker thread concurrency tuning.'
    ],
    database_design: 'Redis list datastructures serving as high-speed task queues paired with PostgreSQL execution audit logs.',
    base_resume_bullet: 'Built distributed asynchronous task queue in Python using Redis and AsyncIO, processing 5,000+ background jobs per minute with automated retries.'
  },
  {
    id: 'devops_deploy_dash',
    title: 'DevOps Cloud Deployment & Container Dashboard',
    roles: ['DevOps Engineer', 'Cloud Engineer', 'Platform Engineer', 'Software Engineer'],
    category: 'Cloud / DevOps',
    difficulty: 'Intermediate',
    timeline: '2 Weeks',
    technologies: ['React', 'TypeScript', 'Docker', 'Kubernetes', 'AWS', 'Tailwind'],
    skill_gap_tags: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'DevOps'],
    base_why_build: 'Managing Docker containers and cloud infrastructure requires visual clarity. Building this platform gives you hands-on experience with cloud telemetry, metrics, and CI/CD pipelines.',
    base_knowledge: [
      'Querying Kubernetes API endpoints for pod telemetry and container health.',
      'AWS CloudWatch and EC2 metric visualization in custom UI charts.',
      'Building Docker health checking and deployment automation pipelines.'
    ],
    database_design: 'Client-side dashboard state fed by Prometheus metrics collector and AWS SDK streams.',
    base_resume_bullet: 'Created DevOps container dashboard monitoring Kubernetes pod telemetry and AWS cloud deployment status in real time.'
  },
  {
    id: 'expense_saas',
    title: 'Multi-Tenant Financial Expense Management SaaS',
    roles: ['Full Stack Developer', 'Software Engineer', 'Frontend Developer'],
    category: 'Full Stack / Product',
    difficulty: 'Intermediate',
    timeline: '2 Weeks',
    technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind', 'Prisma'],
    skill_gap_tags: ['Next.js', 'PostgreSQL', 'TypeScript', 'Full Stack', 'REST API'],
    base_why_build: 'SaaS platforms require isolation between company accounts. Building this financial manager teaches multi-tenant data schemas, server-side rendering, and Stripe subscription billing.',
    base_knowledge: [
      'Next.js App Router and Server Components for fast page loading.',
      'Database tenant isolation using PostgreSQL row-level security.',
      'Financial transaction auditing and analytical chart rendering.'
    ],
    database_design: 'Multi-tenant relational database model with organization tenant keys and strict foreign key constraints.',
    base_resume_bullet: 'Designed multi-tenant expense tracking SaaS with Next.js App Router, Prisma ORM, and PostgreSQL multi-tenant isolation.'
  },
  {
    id: 'job_tracker_platform',
    title: 'AI-Powered Job Application & Resume Matcher',
    roles: ['Full Stack Developer', 'Software Engineer', 'AI Engineer'],
    category: 'Full Stack / AI Applications',
    difficulty: 'Beginner',
    timeline: '1.5 Weeks',
    technologies: ['React', 'TypeScript', 'Python', 'FastAPI', 'Tailwind'],
    skill_gap_tags: ['React', 'FastAPI', 'Python', 'REST API'],
    base_why_build: 'Job hunters struggle to organize application status. Building this tracker gives you practical skills in drag-and-drop Kanban boards, local storage sync, and REST API integration.',
    base_knowledge: [
      'Building interactive drag-and-drop Kanban interfaces in React.',
      'Parsing unstructured job description text to extract matching keywords.',
      'Implementing persistent client-side state with REST API fallbacks.'
    ],
    database_design: 'Relational table structure mapping user applications to companies, interview rounds, and follow-up dates.',
    base_resume_bullet: 'Built job application tracker application featuring drag-and-drop Kanban board and automated keyword match telemetry.'
  },
  {
    id: 'url_shortener_scale',
    title: 'High-Scale Distributed URL Shortener & Analytics',
    roles: ['Backend Developer', 'Software Engineer', 'System Architect'],
    category: 'Backend / Systems Architecture',
    difficulty: 'Intermediate',
    timeline: '1.5 Weeks',
    technologies: ['Python (FastAPI)', 'Redis', 'PostgreSQL', 'Docker', 'Base62'],
    skill_gap_tags: ['System Design', 'Redis', 'PostgreSQL', 'Caching', 'FastAPI'],
    base_why_build: 'Services like Bitly process millions of redirects per second. Building this system teaches Base62 hashing algorithms, cache-aside read strategy, and sub-millisecond lookup latency.',
    base_knowledge: [
      'Base62 encoding and unique 64-bit ID generation algorithms (Snowflake).',
      'Implementing Cache-Aside pattern with Redis for 99% cache hit ratios.',
      'Asynchronous click analytics logging using non-blocking queue workers.'
    ],
    database_design: 'PostgreSQL database holding original URLs and click metrics with Redis memory key-value cache for active redirects.',
    base_resume_bullet: 'Engineered scalable URL shortener API handling sub-5ms redirects using FastAPI, Base62 encoding, and Redis caching.'
  },
  {
    id: 'realtime_chat_app',
    title: 'Encrypted Real-Time Chat & Voice Channel Engine',
    roles: ['Full Stack Developer', 'Frontend Developer', 'Backend Developer'],
    category: 'Full Stack / WebSockets',
    difficulty: 'Intermediate',
    timeline: '2 Weeks',
    technologies: ['React', 'Node.js', 'WebSockets', 'WebRTC', 'MongoDB', 'Redis'],
    skill_gap_tags: ['WebSockets', 'WebRTC', 'Redis', 'Node.js', 'Real-Time Systems'],
    base_why_build: 'Applications like Discord combine text chat with peer-to-peer WebRTC voice audio. Building this teaches WebSocket handshake protocols and real-time peer media streams.',
    base_knowledge: [
      'WebSocket bi-directional frame communication and room management.',
      'WebRTC ICE candidate exchange and P2P peer connection signaling.',
      'Redis adapter scaling for multi-instance Socket.io nodes.'
    ],
    database_design: 'Document store mapping channels, messages, and room states with Redis pub/sub for instant message delivery.',
    base_resume_bullet: 'Developed real-time chat and WebRTC audio platform supporting instant messaging and low-latency peer-to-peer communication.'
  },
  {
    id: 'api_gateway_limiter',
    title: 'High-Performance API Gateway with Rate Limiting',
    roles: ['Backend Developer', 'DevOps Engineer', 'Software Engineer'],
    category: 'Security / Infrastructure',
    difficulty: 'Advanced',
    timeline: '2 Weeks',
    technologies: ['Python (FastAPI)', 'Redis', 'JWT', 'Docker', 'NGINX'],
    skill_gap_tags: ['Security', 'Redis', 'Rate Limiting', 'JWT', 'System Design'],
    base_why_build: 'Enterprise cloud systems use API Gateways (Kong, AWS API Gateway) to authenticate, rate limit, and route incoming public requests to internal microservices.',
    base_knowledge: [
      'Sliding window and token bucket rate limiting algorithms using Redis Lua scripts.',
      'JWT payload validation and cryptographic header verification middleware.',
      'Reverse proxy routing and HTTP header manipulation.'
    ],
    database_design: 'Redis in-memory store tracking rate limit counters and revoked JWT blacklists with sub-millisecond TTLs.',
    base_resume_bullet: 'Architected API Gateway with Redis sliding-window rate limiting and JWT authentication filtering 1,000+ requests/sec.'
  },
  {
    id: 'event_booking_platform',
    title: 'High-Concurrency Event Ticketing Platform',
    roles: ['Backend Developer', 'Full Stack Developer', 'Software Engineer'],
    category: 'Backend / High Concurrency',
    difficulty: 'Advanced',
    timeline: '2.5 Weeks',
    technologies: ['Java (Spring Boot)', 'Python', 'PostgreSQL', 'Redis', 'Kafka'],
    skill_gap_tags: ['High Concurrency', 'Distributed Locking', 'PostgreSQL', 'Redis', 'System Architecture'],
    base_why_build: 'When concert tickets go on sale, thousands try to buy the same seat at once. Building this teaches row-level database locking and Redis distributed locks to prevent overselling.',
    base_knowledge: [
      'Pessimistic vs Optimistic database concurrency locking in SQL.',
      'Redis Redlock algorithm for distributed seat reservation locks.',
      'Idempotent order checkout processing.'
    ],
    database_design: 'PostgreSQL database schema with strict ACID transaction isolation levels for seat reservations.',
    base_resume_bullet: 'Built high-concurrency ticket reservation engine handling simultaneous seat claims using PostgreSQL optimistic locking and Redis distributed locks.'
  },
  {
    id: 'cloud_file_storage',
    title: 'S3-Compatible Cloud File Storage System',
    roles: ['Cloud Engineer', 'Backend Developer', 'Software Engineer'],
    category: 'Cloud / Storage Systems',
    difficulty: 'Intermediate',
    timeline: '2 Weeks',
    technologies: ['Python', 'FastAPI', 'AWS S3', 'Docker', 'PostgreSQL'],
    skill_gap_tags: ['AWS S3', 'FastAPI', 'Docker', 'Cloud Storage', 'Python'],
    base_why_build: 'Cloud applications rely on object storage (AWS S3) for media files. Building this teaches multipart chunked file uploads, pre-signed upload URLs, and CDN media delivery.',
    base_knowledge: [
      'Stream processing large file uploads in chunks without memory exhaustion.',
      'Generating secure time-limited AWS S3 pre-signed upload/download URLs.',
      'Metadata indexing and duplicate file deduplication hashing.'
    ],
    database_design: 'PostgreSQL metadata table mapping user file paths, MIME types, chunk hashes, and AWS S3 object keys.',
    base_resume_bullet: 'Implemented S3-compatible cloud object storage service supporting chunked multipart uploads and secure pre-signed URLs.'
  },
  {
    id: 'online_judge_exec',
    title: 'Isolated Sandbox Online Code Execution Engine',
    roles: ['Software Engineer', 'Backend Developer', 'DevOps Engineer'],
    category: 'Backend / Security Sandbox',
    difficulty: 'Advanced',
    timeline: '2.5 Weeks',
    technologies: ['Python', 'FastAPI', 'Docker', 'Linux', 'Redis', 'PostgreSQL'],
    skill_gap_tags: ['Docker', 'Linux Admin', 'Security', 'FastAPI', 'System Architecture'],
    base_why_build: 'Platforms like LeetCode and HackerRank execute user code safely. Building this teaches Linux cgroups, Docker container isolation, and CPU/memory sandbox constraints.',
    base_knowledge: [
      'Spawning ephemeral Docker sandbox containers with resource limits.',
      'Linux process termination, memory ceiling enforcement, and timeout traps.',
      'Securing execution environments against malicious system calls.'
    ],
    database_design: 'PostgreSQL storing problem test cases and submission logs, with Redis caching pass/fail status.',
    base_resume_bullet: 'Engineered secure online code execution engine spawning containerized Linux sandboxes to evaluate user code safely.'
  },
  {
    id: 'project_mgmt_saas',
    title: 'Kanban & Agile Project Management SaaS',
    roles: ['Full Stack Developer', 'Frontend Developer', 'Software Engineer'],
    category: 'Full Stack / Product',
    difficulty: 'Intermediate',
    timeline: '2 Weeks',
    technologies: ['React', 'TypeScript', 'Tailwind', 'Node.js', 'MongoDB'],
    skill_gap_tags: ['React', 'TypeScript', 'MongoDB', 'Node.js', 'Tailwind'],
    base_why_build: 'Tools like Trello and Jira manage complex task pipelines. Building this teaches nested drag-and-drop state, optimistic UI updates, and REST API state management.',
    base_knowledge: [
      'Implementing smooth drag-and-drop list reordering with React Beautiful DnD.',
      'Optimistic state updates for instant visual feedback before API response.',
      'Complex document population and query indexing in MongoDB.'
    ],
    database_design: 'MongoDB document collection storing boards, columns, cards, member permissions, and task activity logs.',
    base_resume_bullet: 'Created full-stack Agile project management platform with drag-and-drop Kanban boards and optimistic UI state sync.'
  },
  {
    id: 'recommender_system',
    title: 'Real-Time Content & Product Recommendation Engine',
    roles: ['Data Scientist', 'Machine Learning Engineer', 'AI Engineer'],
    category: 'AI / Data Science',
    difficulty: 'Advanced',
    timeline: '2.5 Weeks',
    technologies: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'FastAPI', 'Redis'],
    skill_gap_tags: ['Machine Learning', 'Python', 'Scikit-Learn', 'FastAPI', 'Redis'],
    base_why_build: 'E-commerce and streaming giants (Netflix, Amazon) rely on recommendation engines to increase engagement. Building this teaches collaborative filtering, vector cosine similarity, and ML inference deployment.',
    base_knowledge: [
      'Building User-Item interaction matrixes with Pandas & SciPy.',
      'Cosine similarity algorithms and matrix factorization (SVD).',
      'Deploying lightweight ML inference APIs cached with Redis.'
    ],
    database_design: 'PostgreSQL storing user interaction history with Redis caching pre-computed recommendation vectors.',
    base_resume_bullet: 'Developed machine learning recommendation engine using collaborative filtering and cosine similarity, serving sub-10ms predictions via FastAPI.'
  },
  {
    id: 'notification_service',
    title: 'Multi-Channel Event Notification Microservice',
    roles: ['Backend Developer', 'Software Engineer', 'DevOps Engineer'],
    category: 'Backend / Messaging',
    difficulty: 'Intermediate',
    timeline: '2 Weeks',
    technologies: ['Python (FastAPI)', 'RabbitMQ', 'Redis', 'PostgreSQL', 'Docker'],
    skill_gap_tags: ['RabbitMQ', 'FastAPI', 'Redis', 'Message Queues', 'Docker'],
    base_why_build: 'Apps need to send emails, SMS, and push notifications reliably. Building this microservice teaches message broker queues, template rendering, and delivery tracking.',
    base_knowledge: [
      'RabbitMQ exchange routing (Direct, Topic, Fanout) for notification queues.',
      'Handling worker failures with exponential retry strategies.',
      'Template compilation and dynamic payload substitution.'
    ],
    database_design: 'PostgreSQL storing dispatch logs and delivery status with Redis tracking throttle rates per recipient.',
    base_resume_bullet: 'Architected multi-channel notification microservice using FastAPI and RabbitMQ queues to dispatch email and push notifications.'
  },
  {
    id: 'inventory_mgmt_system',
    title: 'Distributed Inventory & Supply Chain System',
    roles: ['Backend Developer', 'Software Engineer', 'Full Stack Developer'],
    category: 'Backend / Business Systems',
    difficulty: 'Intermediate',
    timeline: '2 Weeks',
    technologies: ['Python', 'PostgreSQL', 'SQLAlchemy', 'Docker', 'Redis'],
    skill_gap_tags: ['PostgreSQL', 'SQL', 'Docker', 'Python', 'System Architecture'],
    base_why_build: 'Warehouse supply chains require accurate stock tracking across multiple fulfillment centers. Building this teaches SQL transactions, stock reservation locking, and audit trails.',
    base_knowledge: [
      'Complex SQL joins, indexing, and transactional isolation levels.',
      'Stock allocation and automatic re-order trigger algorithms.',
      'Designing REST APIs with OpenAPI specifications.'
    ],
    database_design: 'Normalized relational schema with foreign key constraints, composite indexes, and audit log tables.',
    base_resume_bullet: 'Engineered inventory management backend with PostgreSQL and SQLAlchemy handling multi-warehouse stock allocations.'
  },
  {
    id: 'payment_gateway_sim',
    title: 'Transactional Payment Gateway & Idempotency Engine',
    roles: ['Backend Developer', 'Software Engineer', 'Cyber Security Engineer'],
    category: 'Security / Payment Infrastructure',
    difficulty: 'Advanced',
    timeline: '2 Weeks',
    technologies: ['Python (FastAPI)', 'PostgreSQL', 'Redis', 'Cryptography', 'Docker'],
    skill_gap_tags: ['Security', 'Cryptography', 'PostgreSQL', 'Redis', 'System Design'],
    base_why_build: 'Fintech companies require double-entry bookkeeping ledgers and idempotent API design so network glitches never charge a customer twice.',
    base_knowledge: [
      'Implementing Idempotency Key validation via Redis cache headers.',
      'Double-entry ledger accounting principles in relational databases.',
      'AES-256 payload encryption for sensitive payment tokens.'
    ],
    database_design: 'Immutable financial transaction ledger table with cryptographic hash verification keys.',
    base_resume_bullet: 'Built secure payment gateway simulator featuring idempotency key verification and double-entry transaction ledgers.'
  },
  {
    id: 'social_media_backend',
    title: 'High-Scale Social Feed Graph & Activity Stream',
    roles: ['Backend Developer', 'Software Engineer', 'System Architect'],
    category: 'Backend / Data Modeling',
    difficulty: 'Advanced',
    timeline: '2.5 Weeks',
    technologies: ['Python', 'PostgreSQL', 'Redis', 'Docker', 'FastAPI'],
    skill_gap_tags: ['Redis', 'PostgreSQL', 'System Design', 'Caching', 'FastAPI'],
    base_why_build: 'Platforms like Twitter/X render timeline feeds for millions of users. Building this teaches Fan-Out-On-Write vs Fan-Out-On-Read feed caching architectures.',
    base_knowledge: [
      'Fan-Out strategy algorithms for active vs celebrity user posts.',
      'Redis sorted sets (ZSET) for timelines ordered by timestamps.',
      'Paginated feed querying with cursor-based pagination.'
    ],
    database_design: 'PostgreSQL graph relationship tables for followers paired with Redis Sorted Sets for dynamic user feeds.',
    base_resume_bullet: 'Designed scalable social feed backend using FastAPI and Redis Sorted Sets, delivering sub-20ms timeline updates.'
  },
  {
    id: 'doc_mgmt_platform',
    title: 'AI Document Management & Semantic Search Platform',
    roles: ['AI Engineer', 'Machine Learning Engineer', 'Full Stack Developer'],
    category: 'AI / RAG Systems',
    difficulty: 'Intermediate',
    timeline: '2 Weeks',
    technologies: ['Python', 'FastAPI', 'LangChain', 'Vector Databases', 'React'],
    skill_gap_tags: ['RAG', 'Vector Databases', 'LangChain', 'FastAPI', 'Python'],
    base_why_build: 'Companies have thousands of PDF contracts and manuals. Building this RAG system enables employees to search documents using natural language questions.',
    base_knowledge: [
      'Chunking PDF text documents and generating vector embeddings.',
      'Vector similarity search using Pinecone / Qdrant.',
      'Connecting retrieval results to LLM context windows.'
    ],
    database_design: 'Vector database storing text embeddings alongside PostgreSQL document metadata records.',
    base_resume_bullet: 'Built enterprise document management platform with RAG architecture and vector search, enabling instant natural language document Q&A.'
  },
  {
    id: 'rag_knowledge_base',
    title: 'Enterprise RAG Knowledge Base & Agent System',
    roles: ['AI Engineer', 'AI Solutions Architect', 'LLM Systems Specialist'],
    category: 'AI / Multi-Agent',
    difficulty: 'Advanced',
    timeline: '3 Weeks',
    technologies: ['Python', 'LangGraph', 'LangChain', 'OpenAI', 'Vector Databases', 'FastAPI'],
    skill_gap_tags: ['LangGraph', 'RAG', 'Vector Databases', 'OpenAI', 'System Architecture'],
    base_why_build: 'Single LLM prompts fail on complex enterprise tasks. Building a multi-agent LangGraph workflow teaches stateful agent routing, retrieval validation, and fallback loops.',
    base_knowledge: [
      'Designing stateful multi-agent directed graphs using LangGraph.',
      'Corrective RAG (CRAG) and self-reflective query refinement.',
      'Managing long-term vector database index pipelines.'
    ],
    database_design: 'Vector database store paired with PostgreSQL for agent state checkpointing and conversation memory.',
    base_resume_bullet: 'Architected multi-agent enterprise RAG system using LangGraph and vector search, improving query accuracy by 35%.'
  },
  {
    id: 'zero_trust_auth',
    title: 'Zero-Trust Auth Microservice with MFA & Vault',
    roles: ['Cyber Security Engineer', 'Backend Developer', 'Software Engineer'],
    category: 'Security / Auth',
    difficulty: 'Intermediate',
    timeline: '2 Weeks',
    technologies: ['Python', 'FastAPI', 'JWT', 'Cryptography', 'Redis', 'PostgreSQL'],
    skill_gap_tags: ['Security', 'Cryptography', 'JWT', 'Redis', 'FastAPI'],
    base_why_build: 'Traditional passwords are no longer enough. Building a Zero-Trust system teaches multi-factor TOTP authentication, rotating refresh tokens, and password hashing.',
    base_knowledge: [
      'TOTP (Time-Based One-Time Password) algorithm generation with QR codes.',
      'Bcrypt / Argon2 password hashing algorithms.',
      'JWT token revocation lists using Redis in-memory storage.'
    ],
    database_design: 'PostgreSQL credential store with bcrypt hashes and Redis blacklist for revoked access tokens.',
    base_resume_bullet: 'Built zero-trust authentication service featuring JWT token rotation, TOTP multi-factor authentication, and bcrypt password security.'
  },
  {
    id: 'sre_observability',
    title: 'SRE Metrics Aggregator & Alerting Engine',
    roles: ['Site Reliability Engineer (SRE)', 'DevOps Engineer', 'Backend Developer'],
    category: 'SRE / Observability',
    difficulty: 'Advanced',
    timeline: '2.5 Weeks',
    technologies: ['Go', 'Python', 'Prometheus', 'Grafana', 'Docker', 'Linux'],
    skill_gap_tags: ['Prometheus', 'Grafana', 'Linux Systems', 'Docker', 'SRE'],
    base_why_build: 'SRE teams prevent costly server downtime. Building this aggregator teaches telemetry scraping, latency SLI/SLO calculations, and automated incident alert triggers.',
    base_knowledge: [
      'Prometheus metric exposition formats and PromQL query writing.',
      'Calculating Service Level Indicators (SLIs) and Error Budgets.',
      'Configuring automated PagerDuty / Slack webhook alerting rules.'
    ],
    database_design: 'Time-series database store paired with Prometheus metrics collector.',
    base_resume_bullet: 'Engineered SRE observability pipeline scraping Prometheus telemetry and triggering automated alerting rules for uptime monitoring.'
  },
  {
    id: 'llm_agent_orchestrator',
    title: 'Autonomous Multi-Agent AI Workflow Orchestrator',
    roles: ['LLM Systems Specialist', 'AI Engineer', 'AI Solutions Architect'],
    category: 'AI / Multi-Agent',
    difficulty: 'Advanced',
    timeline: '3 Weeks',
    technologies: ['Python', 'LangGraph', 'Transformers', 'FastAPI', 'Docker', 'Redis'],
    skill_gap_tags: ['LangGraph', 'HuggingFace Transformers', 'Python', 'FastAPI', 'System Architecture'],
    base_why_build: 'Autonomous AI agents must plan, execute code, and reflect on errors self-sufficiently. Building this teaches agentic control loops and tool execution sandboxes.',
    base_knowledge: [
      'Multi-agent task decomposition and communication handoffs.',
      'Function calling and tool invocation schema definitions.',
      'Managing agent memory state across multi-turn reasoning loops.'
    ],
    database_design: 'Redis state store tracking active agent memory loops paired with PostgreSQL task execution histories.',
    base_resume_bullet: 'Built autonomous multi-agent AI orchestrator using LangGraph and Python, enabling automated tool calling and multi-step task execution.'
  },
  {
    id: 'component_library_system',
    title: 'Reusable UI Component Library & Design Tokens',
    roles: ['Frontend Developer', 'Software Engineer', 'Full Stack Developer'],
    category: 'Frontend / Design System',
    difficulty: 'Intermediate',
    timeline: '1.5 Weeks',
    technologies: ['React', 'TypeScript', 'Storybook', 'Tailwind', 'CSS Modules'],
    skill_gap_tags: ['React', 'TypeScript', 'Tailwind CSS', 'Responsive UI Design'],
    base_why_build: 'Top tech companies use internal design systems (like Google Material UI). Building this teaches modular React component packaging, Storybook testing, and CSS design tokens.',
    base_knowledge: [
      'Packaging reusable React UI components with strict TypeScript interface props.',
      'Documenting and visually testing UI components using Storybook.',
      'Creating dynamic theme tokens for Dark Mode and Neon Color Accents.'
    ],
    database_design: 'NPM package bundle exporting design tokens and modular UI components.',
    base_resume_bullet: 'Architected reusable React component library documented with Storybook, standardizing UI design tokens across engineering teams.'
  }
];
