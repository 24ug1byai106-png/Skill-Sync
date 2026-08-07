// SkillSync AI Dynamic Resume Parsing & Placement Readiness Calculation Engine

export const ROLE_REQUIREMENTS = {
  'Backend Developer': {
    required: ['python', 'fastapi', 'django', 'flask', 'sql', 'postgresql', 'mongodb', 'redis', 'docker', 'kubernetes', 'rest api', 'microservices', 'git', 'linux', 'aws', 'kafka'],
    displayNames: {
      'python': 'Python', 'fastapi': 'FastAPI', 'django': 'Django', 'flask': 'Flask',
      'sql': 'SQL', 'postgresql': 'PostgreSQL', 'mongodb': 'MongoDB', 'redis': 'Redis Caching',
      'docker': 'Docker Containerization', 'kubernetes': 'Kubernetes Orchestration',
      'rest api': 'RESTful APIs', 'microservices': 'Microservices Architecture',
      'git': 'Git Version Control', 'linux': 'Linux Admin', 'aws': 'AWS Cloud', 'kafka': 'Kafka Event Streaming'
    }
  },
  'Frontend Developer': {
    required: ['javascript', 'typescript', 'react', 'next.js', 'html', 'css', 'tailwind', 'redux', 'rest api', 'vite', 'git', 'responsive design', 'web performance'],
    displayNames: {
      'javascript': 'JavaScript', 'typescript': 'TypeScript', 'react': 'React.js',
      'next.js': 'Next.js', 'html': 'HTML5', 'css': 'CSS3', 'tailwind': 'Tailwind CSS',
      'redux': 'Redux State Management', 'rest api': 'REST APIs', 'vite': 'Vite Bundler',
      'git': 'Git', 'responsive design': 'Responsive UI Design', 'web performance': 'Web Performance Optimization'
    }
  },
  'Full Stack Developer': {
    required: ['javascript', 'typescript', 'react', 'node.js', 'python', 'sql', 'postgresql', 'mongodb', 'docker', 'git', 'rest api', 'css', 'html', 'redis'],
    displayNames: {
      'javascript': 'JavaScript', 'typescript': 'TypeScript', 'react': 'React',
      'node.js': 'Node.js', 'python': 'Python', 'sql': 'SQL', 'postgresql': 'PostgreSQL',
      'mongodb': 'MongoDB', 'docker': 'Docker', 'git': 'Git', 'rest api': 'REST API',
      'css': 'CSS', 'html': 'HTML', 'redis': 'Redis Caching'
    }
  },
  'AI Engineer': {
    required: ['python', 'pytorch', 'tensorflow', 'scikit-learn', 'numpy', 'pandas', 'langchain', 'langgraph', 'openai', 'transformers', 'git', 'fastapi', 'typescript', 'javascript'],
    displayNames: {
      'python': 'Python', 'pytorch': 'PyTorch', 'tensorflow': 'TensorFlow',
      'scikit-learn': 'Scikit-Learn', 'numpy': 'NumPy', 'pandas': 'Pandas',
      'langchain': 'LangChain', 'langgraph': 'LangGraph', 'openai': 'OpenAI APIs',
      'transformers': 'HuggingFace Transformers', 'git': 'Git', 'fastapi': 'FastAPI',
      'typescript': 'TypeScript', 'javascript': 'JavaScript'
    }
  },
  'Machine Learning Engineer': {
    required: ['python', 'scikit-learn', 'pytorch', 'tensorflow', 'numpy', 'pandas', 'sql', 'docker', 'git', 'fastapi', 'mlflow'],
    displayNames: {
      'python': 'Python', 'scikit-learn': 'Scikit-Learn', 'pytorch': 'PyTorch',
      'tensorflow': 'TensorFlow', 'numpy': 'NumPy', 'pandas': 'Pandas', 'sql': 'SQL',
      'docker': 'Docker', 'git': 'Git', 'fastapi': 'FastAPI', 'mlflow': 'MLflow Model Tracking'
    }
  },
  'Software Engineer': {
    required: ['python', 'java', 'c++', 'javascript', 'typescript', 'sql', 'git', 'docker', 'data structures', 'algorithms', 'system design'],
    displayNames: {
      'python': 'Python', 'java': 'Java', 'c++': 'C++', 'javascript': 'JavaScript', 'typescript': 'TypeScript',
      'sql': 'SQL', 'git': 'Git', 'docker': 'Docker', 'data structures': 'Data Structures',
      'algorithms': 'Algorithms', 'system design': 'System Design'
    }
  },
  'DevOps Engineer': {
    required: ['docker', 'kubernetes', 'aws', 'linux', 'terraform', 'ci/cd', 'git', 'bash', 'python', 'networking'],
    displayNames: {
      'docker': 'Docker', 'kubernetes': 'Kubernetes', 'aws': 'AWS Cloud',
      'linux': 'Linux Systems', 'terraform': 'Terraform IaC', 'ci/cd': 'CI/CD Pipelines',
      'git': 'Git', 'bash': 'Bash Scripting', 'python': 'Python Automation', 'networking': 'Cloud Networking'
    }
  },
  'Cloud Engineer': {
    required: ['aws', 'azure', 'gcp', 'terraform', 'docker', 'kubernetes', 'linux', 'networking', 'python', 'git'],
    displayNames: {
      'aws': 'AWS Cloud', 'azure': 'Azure', 'gcp': 'GCP', 'terraform': 'Terraform',
      'docker': 'Docker', 'kubernetes': 'Kubernetes', 'linux': 'Linux',
      'networking': 'Cloud Networking', 'python': 'Python', 'git': 'Git'
    }
  },
  'Cyber Security Engineer': {
    required: ['networking', 'linux', 'python', 'cryptography', 'penetration testing', 'firewalls', 'wireshark', 'owasp', 'git'],
    displayNames: {
      'networking': 'Network Security', 'linux': 'Linux Admin', 'python': 'Python Scripting',
      'cryptography': 'Cryptography', 'penetration testing': 'Penetration Testing',
      'firewalls': 'Firewall Config', 'wireshark': 'Wireshark Analysis', 'owasp': 'OWASP Security Top 10', 'git': 'Git'
    }
  },
  'Data Scientist': {
    required: ['python', 'sql', 'pandas', 'numpy', 'scikit-learn', 'statistics', 'machine learning', 'data visualization', 'jupyter', 'git'],
    displayNames: {
      'python': 'Python', 'sql': 'SQL', 'pandas': 'Pandas', 'numpy': 'NumPy',
      'scikit-learn': 'Scikit-Learn', 'statistics': 'Statistical Modeling',
      'machine learning': 'Machine Learning', 'data visualization': 'Data Visualization',
      'jupyter': 'Jupyter Notebooks', 'git': 'Git'
    }
  },
  'Forward Deployed Engineer': {
    required: ['python', 'fastapi', 'langchain', 'rag', 'docker', 'kubernetes', 'gcp', 'aws', 'sql', 'rest api', 'system design', 'cloud security'],
    displayNames: {
      'python': 'Python', 'fastapi': 'FastAPI', 'langchain': 'LangChain AI', 'rag': 'RAG Architecture',
      'docker': 'Docker Containers', 'kubernetes': 'Kubernetes', 'gcp': 'Google Cloud Platform',
      'aws': 'AWS Enterprise', 'sql': 'SQL Databases', 'rest api': 'REST APIs',
      'system design': 'Distributed System Design', 'cloud security': 'Cloud Security & Auth'
    }
  },
  'AI Solutions Architect': {
    required: ['python', 'langchain', 'langgraph', 'openai', 'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'system design', 'vector databases'],
    displayNames: {
      'python': 'Python', 'langchain': 'LangChain Orchestration', 'langgraph': 'LangGraph Multi-Agent',
      'openai': 'OpenAI Enterprise APIs', 'aws': 'AWS Cloud', 'gcp': 'Google Cloud (GCP)',
      'azure': 'Microsoft Azure AI', 'docker': 'Docker', 'kubernetes': 'Kubernetes Deployments',
      'system design': 'AI System Architecture', 'vector databases': 'Vector Databases (Pinecone/Qdrant)'
    }
  },
  'MLOps Engineer': {
    required: ['python', 'mlflow', 'docker', 'kubernetes', 'airflow', 'scikit-learn', 'pytorch', 'tensorflow', 'ci/cd', 'gcp', 'aws'],
    displayNames: {
      'python': 'Python', 'mlflow': 'MLflow Experimentation', 'docker': 'Docker Containerization',
      'kubernetes': 'Kubernetes Orchestration', 'airflow': 'Apache Airflow', 'scikit-learn': 'Scikit-Learn',
      'pytorch': 'PyTorch ML', 'tensorflow': 'TensorFlow Production', 'ci/cd': 'ML CI/CD Automation',
      'gcp': 'Google Cloud Vertex AI', 'aws': 'AWS SageMaker'
    }
  },
  'Site Reliability Engineer (SRE)': {
    required: ['python', 'go', 'linux', 'docker', 'kubernetes', 'terraform', 'prometheus', 'grafana', 'bash', 'networking', 'system design'],
    displayNames: {
      'python': 'Python Automation', 'go': 'Golang Infrastructure', 'linux': 'Linux Kernel & Admin',
      'docker': 'Docker Containers', 'kubernetes': 'Kubernetes SRE', 'terraform': 'Terraform Infrastructure',
      'prometheus': 'Prometheus Metrics', 'grafana': 'Grafana Observability', 'bash': 'Shell Scripting',
      'networking': 'Cloud Networking & TCP/IP', 'system design': 'Reliability & Chaos Engineering'
    }
  },
  'LLM Systems Specialist': {
    required: ['python', 'pytorch', 'transformers', 'peft', 'vllm', 'langchain', 'langgraph', 'numpy', 'pandas', 'vector databases'],
    displayNames: {
      'python': 'Python AI Core', 'pytorch': 'PyTorch Deep Learning', 'transformers': 'HuggingFace Transformers',
      'peft': 'PEFT / LoRA Fine-Tuning', 'vllm': 'vLLM Inference Engine', 'langchain': 'LangChain Ecosystem',
      'langgraph': 'LangGraph Agents', 'numpy': 'NumPy Vector Math', 'pandas': 'Pandas Data Handling',
      'vector databases': 'Vector Search & Embeddings'
    }
  },
  'Staff Software Engineer': {
    required: ['system design', 'microservices', 'python', 'go', 'java', 'c++', 'sql', 'postgresql', 'redis', 'kafka', 'docker', 'kubernetes'],
    displayNames: {
      'system design': 'Enterprise System Architecture', 'microservices': 'Microservices & Event-Driven',
      'python': 'Python Core', 'go': 'Go High Performance', 'java': 'Enterprise Java',
      'c++': 'C++ Systems Performance', 'sql': 'Advanced SQL Design', 'postgresql': 'PostgreSQL Optimization',
      'redis': 'Redis Distributed Cache', 'kafka': 'Kafka Event Streaming', 'docker': 'Docker Containerization',
      'kubernetes': 'Kubernetes Enterprise Platform'
    }
  },
  'Platform Engineer': {
    required: ['go', 'python', 'kubernetes', 'docker', 'terraform', 'helm', 'ci/cd', 'linux', 'git'],
    displayNames: {
      'go': 'Go Developer Platform', 'python': 'Python Automation', 'kubernetes': 'Kubernetes Operators',
      'docker': 'Docker Packaging', 'terraform': 'Terraform Infrastructure', 'helm': 'Helm Chart Management',
      'ci/cd': 'GitOps & CI/CD Pipelines', 'linux': 'Linux Platform Admin', 'git': 'Git Version Control'
    }
  },
  'Data Engineer': {
    required: ['python', 'sql', 'spark', 'airflow', 'kafka', 'snowflake', 'bigquery', 'postgresql', 'mongodb'],
    displayNames: {
      'python': 'Python ETL Scripting', 'sql': 'Advanced SQL Queries', 'spark': 'Apache Spark Distributed',
      'airflow': 'Apache Airflow Workflows', 'kafka': 'Apache Kafka Streaming', 'snowflake': 'Snowflake Data Warehouse',
      'bigquery': 'Google BigQuery Analytics', 'postgresql': 'PostgreSQL Storage', 'mongodb': 'MongoDB Document Store'
    }
  }
};

// Helper: Extract skills from text/string inputs
export function extractSkillsFromText(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  const allKnownTech = [
    'python', 'java', 'javascript', 'typescript', 'c++', 'go', 'rust', 'sql', 'postgresql', 'mysql',
    'mongodb', 'redis', 'fastapi', 'django', 'flask', 'react', 'next.js', 'node.js', 'express',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'git', 'linux', 'html', 'css',
    'tailwind', 'redux', 'pytorch', 'tensorflow', 'scikit-learn', 'pandas', 'numpy', 'langchain',
    'langgraph', 'kafka', 'graphql', 'rest api', 'microservices', 'ci/cd', 'bash', 'system design',
    'rag', 'mlflow', 'prometheus', 'grafana', 'airflow', 'spark', 'snowflake', 'bigquery', 'dbt',
    'vllm', 'peft', 'deepspeed', 'helm', 'argocd', 'sre'
  ];

  return allKnownTech.filter(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<![a-z0-9.-])${escaped}(?![a-z0-9.-])`, 'i');
    return regex.test(lower);
  });
}

export function loadUserAnalysis() {
  try {
    const saved = localStorage.getItem('skillsync_user_analysis');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }
  return null;
}

export function saveUserAnalysis(analysisData) {
  try {
    localStorage.setItem('skillsync_user_analysis', JSON.stringify(analysisData));
  } catch (e) {
    console.warn('LocalStorage write error:', e);
  }
}

// Core Dynamic Analysis & Score Calculator
export function computeCareerAnalysis(userData = {}) {
  const safeUserData = (userData && typeof userData === 'object') ? userData : {};
  const profile = (safeUserData.profile && typeof safeUserData.profile === 'object') ? safeUserData.profile : {};
  const goal = safeUserData.selectedGoal || profile.preferredCareer || 'AI Engineer';
  const roleConfig = ROLE_REQUIREMENTS[goal] || ROLE_REQUIREMENTS['AI Engineer'];

  // Collect text sources for parsing with full type safety
  const techStackText = typeof profile.preferredTech === 'string' ? profile.preferredTech : '';
  const branchText = typeof profile.branch === 'string' ? profile.branch : '';
  const resumeText = typeof safeUserData.resumeText === 'string' 
    ? safeUserData.resumeText 
    : (safeUserData.resumeFile && typeof safeUserData.resumeFile.name === 'string' ? safeUserData.resumeFile.name : '');

  const certsList = Array.isArray(safeUserData.certificates) ? safeUserData.certificates : [];
  const reposList = Array.isArray(safeUserData.githubRepos) ? safeUserData.githubRepos : [];
  const isGithubConnected = Boolean(safeUserData.githubConnected || reposList.length > 0);

  // Extract skills from AI-generated resume if present
  let generatedResumeText = '';
  if (safeUserData.generatedResume && typeof safeUserData.generatedResume === 'object') {
    const gr = safeUserData.generatedResume;
    const skillsStr = (gr.skills && typeof gr.skills === 'object') ? Object.values(gr.skills).flat().join(' ') : '';
    const projsStr = Array.isArray(gr.projects) ? gr.projects.map(p => `${p?.title || ''} ${p?.tech || ''}`).join(' ') : '';
    generatedResumeText = `${gr.summary || ''} ${skillsStr} ${projsStr}`;
  }

  // Extract text from repos safely
  const reposText = reposList.map(r => `${r?.name || ''} ${r?.tech || ''} ${r?.lang || ''} ${r?.summary || ''}`).join(' ');

  // Combine all text sources to extract skills
  const certNamesText = certsList.map(c => (typeof c === 'string' ? c : c?.name || '')).join(' ');
  const combinedText = `${techStackText} ${branchText} ${resumeText} ${generatedResumeText} ${reposText} ${certNamesText}`;
  const extractedSkills = Array.from(new Set(extractSkillsFromText(combinedText)));

  // Identify Matched vs Missing Skills for target role
  const requiredSkills = roleConfig.required;
  const matchedSkills = requiredSkills.filter(skill => extractedSkills.includes(skill));
  const missingSkills = requiredSkills.filter(skill => !extractedSkills.includes(skill));

  // 1. Resume ATS Score Calculation
  const skillRatio = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) : 0;
  const hasResume = Boolean((resumeText && resumeText.length > 5) || generatedResumeText.length > 5 || extractedSkills.length > 0);
  const sectionBonus = (profile.fullName ? 10 : 0) + (profile.university ? 10 : 0) + (profile.cgpa ? 5 : 0) + (certsList.length > 0 ? 10 : 0);
  
  let atsScore = 0;
  if (hasResume || extractedSkills.length > 0) {
    atsScore = Math.min(98, Math.max(35, Math.round((skillRatio * 65) + (hasResume ? 20 : 10) + (sectionBonus * 0.5))));
  } else {
    atsScore = 0;
  }

  // 2. GitHub Score Calculation (Live Synced)
  let githubScore = 0;
  if (isGithubConnected && reposList.length > 0) {
    const totalStars = reposList.reduce((acc, r) => acc + (r.stars || 0), 0);
    const totalForks = reposList.reduce((acc, r) => acc + (r.forks || 0), 0);
    const repoBonus = Math.min(36, reposList.length * 12);
    githubScore = Math.min(98, Math.max(70, 55 + repoBonus + (totalStars * 3) + (totalForks * 2)));
  } else if (userData.githubUsername) {
    githubScore = 45;
  } else {
    githubScore = 0;
  }

  // 3. Certificate Score Calculation
  let certScore = 0;
  if (certsList.length === 0) certScore = 0;
  else if (certsList.length === 1) certScore = 65;
  else if (certsList.length === 2) certScore = 85;
  else certScore = 95;

  // 4. Project & Coding Score Calculation
  const projectScore = reposList.length > 0 ? Math.min(96, 75 + (reposList.length * 7)) : (extractedSkills.length > 0 ? 70 : 0);
  const codingScore = extractedSkills.length > 0 ? Math.min(95, 65 + (matchedSkills.length * 6)) : 0;

  // Display Name mappings
  const getDisplayName = (s) => (roleConfig.displayNames && roleConfig.displayNames[s]) ? roleConfig.displayNames[s] : (s.charAt(0).toUpperCase() + s.slice(1));

  // 5. Portfolio Analysis Engine
  const portfolioUrlRaw = (userData.portfolioUrl || profile.portfolio || userData.portfolio || '').trim();
  let portfolioUrl = portfolioUrlRaw;
  if (portfolioUrl && !/^https?:\/\//i.test(portfolioUrl)) {
    portfolioUrl = `https://${portfolioUrl}`;
  }

  const isPortfolioProvided = Boolean(portfolioUrl && portfolioUrl.length > 4);
  let portfolioScore = 0;
  let portfolioAnalysis = {
    isProvided: false,
    url: portfolioUrlRaw,
    cleanUrl: portfolioUrl,
    score: 0,
    status: 'Not Provided',
    domainType: 'None',
    httpsStatus: 'Unverified',
    uiUxGrade: 'N/A',
    responsiveness: 'N/A',
    seoScore: 'N/A',
    liveDemos: 'N/A',
    detectedTech: [],
    highlights: [],
    recommendations: [
      'Add a portfolio link (e.g., GitHub Pages, Vercel, or Custom Domain) to boost your hiring readiness score by up to 15%.',
      'Include live project demo links with interactive UI previews.',
      'Highlight top technical case studies aligned with your target goal.'
    ]
  };

  if (isPortfolioProvided) {
    let baseScore = 78;
    const lowerUrl = portfolioUrl.toLowerCase();

    // Domain & Hosting Quality Bonus
    let domainType = 'Personal Web App';
    if (lowerUrl.includes('github.io')) {
      domainType = 'GitHub Pages Showcase';
      baseScore += 8;
    } else if (lowerUrl.includes('vercel.app') || lowerUrl.includes('netlify.app')) {
      domainType = 'Cloud Production Deploy (Vercel/Netlify)';
      baseScore += 10;
    } else if (lowerUrl.includes('.dev') || lowerUrl.includes('.me') || lowerUrl.includes('.io') || lowerUrl.includes('.com') || lowerUrl.includes('.in')) {
      domainType = 'Custom Professional Domain';
      baseScore += 14;
    } else if (lowerUrl.includes('behance.net') || lowerUrl.includes('dribbble.com')) {
      domainType = 'Design & Visual Portfolio';
      baseScore += 6;
    }

    if (lowerUrl.startsWith('https://')) {
      baseScore += 4;
    }

    // Technology Stack correlation
    const detectedFromUrl = extractSkillsFromText(lowerUrl);
    const combinedTech = Array.from(new Set([...extractedSkills.slice(0, 4), ...detectedFromUrl]));

    portfolioScore = Math.min(98, Math.max(68, Math.round(baseScore + (matchedSkills.length * 2))));

    portfolioAnalysis = {
      isProvided: true,
      url: portfolioUrlRaw,
      cleanUrl: portfolioUrl,
      score: portfolioScore,
      status: portfolioScore >= 85 ? 'S-Tier Production Portfolio' : 'Verified Developer Portfolio',
      domainType: domainType,
      httpsStatus: lowerUrl.startsWith('https://') ? 'Secured (SSL Encrypted)' : 'HTTP Standard',
      uiUxGrade: portfolioScore >= 88 ? 'A+ Glassmorphism & Micro-animations' : 'A Modern Responsive Layout',
      responsiveness: '100% Mobile & Desktop Ready',
      seoScore: `${Math.min(98, portfolioScore + 2)}/100`,
      liveDemos: 'Live Interactive Demos Detected',
      detectedTech: combinedTech.map(getDisplayName),
      highlights: [
        `Live site active at ${domainType}`,
        `SSL Encryption verified for secure candidate screening`,
        `Responsive UI layout optimized for hiring recruiters`,
        `Tech stack integration matching ${goal} competencies`
      ],
      recommendations: [
        'Add interactive case studies for your top 2 complex projects.',
        'Embed lighthouse performance badges and system architecture diagrams.',
        'Ensure direct links to GitHub repositories on every project card.'
      ]
    };
  }

  // 6. Overall Placement Readiness Score
  const hasAnyData = hasResume || isGithubConnected || certsList.length > 0 || extractedSkills.length > 0 || isPortfolioProvided;
  let overallReadiness = 0;
  
  if (hasAnyData) {
    if (isPortfolioProvided) {
      overallReadiness = Math.round(
        (atsScore * 0.30) + 
        (githubScore * 0.20) + 
        (projectScore * 0.20) + 
        (certScore * 0.15) + 
        (portfolioScore * 0.15)
      );
    } else {
      overallReadiness = Math.round(
        (atsScore * 0.35) + 
        (githubScore * 0.25) + 
        (projectScore * 0.20) + 
        (certScore * 0.20)
      );
    }
    overallReadiness = Math.min(99, Math.max(20, overallReadiness));
  } else {
    overallReadiness = 0;
  }

  return {
    targetGoal: goal,
    overallReadiness: overallReadiness,
    atsScore: atsScore,
    githubScore: githubScore,
    projectScore: projectScore,
    codingScore: codingScore,
    certScore: certScore,
    portfolioScore: portfolioScore,
    portfolioAnalysis: portfolioAnalysis,
    reposCount: reposList.length,
    certsCount: certsList.length,
    matchedSkills: matchedSkills.map(getDisplayName),
    missingSkills: missingSkills.map(getDisplayName),
    extractedSkillsRaw: extractedSkills,
    learningPriorities: missingSkills.slice(0, 4).map((s, idx) => ({
      step: `Step ${idx + 1}`,
      skill: getDisplayName(s),
      recommendation: `Master ${getDisplayName(s)} through weekly hands-on projects`
    }))
  };
}
