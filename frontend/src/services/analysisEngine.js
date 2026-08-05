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
    'langgraph', 'kafka', 'graphql', 'rest api', 'microservices', 'ci/cd', 'bash', 'system design'
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
  const profile = userData.profile || {};
  const goal = userData.selectedGoal || profile.preferredCareer || 'AI Engineer';
  const roleConfig = ROLE_REQUIREMENTS[goal] || ROLE_REQUIREMENTS['AI Engineer'];

  // Collect text sources for parsing
  const techStackText = profile.preferredTech || '';
  const branchText = profile.branch || '';
  const resumeText = userData.resumeText || (userData.resumeFile ? userData.resumeFile.name : '');
  const certsList = userData.certificates || [];
  const reposList = userData.githubRepos || [];
  const isGithubConnected = Boolean(userData.githubConnected || reposList.length > 0);

  // Extract text from repos
  const reposText = reposList.map(r => `${r.name} ${r.tech || ''} ${r.lang || ''} ${r.summary || ''}`).join(' ');

  // Combine all text sources to extract skills
  const combinedText = `${techStackText} ${branchText} ${resumeText} ${reposText} ${certsList.map(c => c.name).join(' ')}`;
  const extractedSkills = Array.from(new Set(extractSkillsFromText(combinedText)));

  // Identify Matched vs Missing Skills for target role
  const requiredSkills = roleConfig.required;
  const matchedSkills = requiredSkills.filter(skill => extractedSkills.includes(skill));
  const missingSkills = requiredSkills.filter(skill => !extractedSkills.includes(skill));

  // 1. Resume ATS Score Calculation
  const skillRatio = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) : 0;
  const hasResume = Boolean(resumeText && resumeText.length > 5);
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

  // 5. Overall Placement Readiness Score
  const hasAnyData = hasResume || isGithubConnected || certsList.length > 0 || extractedSkills.length > 0;
  let overallReadiness = 0;
  
  if (hasAnyData) {
    overallReadiness = Math.round((atsScore * 0.35) + (githubScore * 0.25) + (projectScore * 0.20) + (certScore * 0.20));
    overallReadiness = Math.min(99, Math.max(20, overallReadiness));
  } else {
    overallReadiness = 0;
  }

  // Display Name mappings
  const getDisplayName = (s) => roleConfig.displayNames[s] || (s.charAt(0).toUpperCase() + s.slice(1));

  return {
    targetGoal: goal,
    overallReadiness: overallReadiness,
    atsScore: atsScore,
    githubScore: githubScore,
    projectScore: projectScore,
    codingScore: codingScore,
    certScore: certScore,
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
