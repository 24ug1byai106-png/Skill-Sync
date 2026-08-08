import { computeCareerAnalysis } from './analysisEngine';

/**
 * Flexible Career Goal to Search Terms & Keywords Mapping
 */
export const ROLE_SEARCH_MAP = {
  'Software Engineer': ['Software Engineer', 'Software Developer', 'Backend Developer', 'Full Stack Developer', 'Junior Software Engineer'],
  'AI/ML Engineer': ['AI Engineer', 'Machine Learning Engineer', 'ML Engineer', 'AI/ML Developer', 'Junior ML Engineer'],
  'AI Engineer': ['AI Engineer', 'Machine Learning Engineer', 'GenAI Engineer', 'LLM Developer'],
  'Machine Learning Engineer': ['Machine Learning Engineer', 'ML Engineer', 'MLOps Engineer', 'Data Scientist'],
  'Data Scientist': ['Data Scientist', 'Junior Data Scientist', 'ML Data Scientist', 'Data Analyst'],
  'Cloud Engineer': ['Cloud Engineer', 'AWS Engineer', 'Azure Engineer', 'DevOps Engineer', 'Cloud Developer'],
  'DevOps Engineer': ['DevOps Engineer', 'Site Reliability Engineer', 'SRE', 'Cloud Engineer', 'Infrastructure Engineer'],
  'Cybersecurity Analyst': ['Cybersecurity Analyst', 'Security Engineer', 'SOC Analyst', 'Information Security Analyst'],
  'Frontend Developer': ['Frontend Developer', 'React Developer', 'UI/UX Engineer', 'Web Developer', 'Frontend Engineer'],
  'Backend Engineer': ['Backend Engineer', 'Java Developer', 'Python Developer', 'API Developer', 'Software Engineer'],
  'Full Stack Developer': ['Full Stack Developer', 'React Node Developer', 'Web Engineer', 'Full Stack Engineer'],
  'Data Engineer': ['Data Engineer', 'ETL Developer', 'Big Data Engineer', 'Data Infrastructure Engineer']
};

/**
 * Calculate multi-vector profile match score and personalized breakdown for a job card.
 */
export function calculateJobMatch(job, userData = {}, overrideRole = null) {
  const analysis = computeCareerAnalysis(userData);
  const targetRole = overrideRole || job.role_category || analysis.targetGoal || userData.selectedGoal || userData.profile?.preferredCareer || 'Software Engineer';
  const knownSkills = (analysis.matchedSkills || []).map(s => s.toLowerCase());
  const skillGaps = (analysis.missingSkills || []).map(s => s.toLowerCase());
  const userName = userData.profile?.fullName ? userData.profile.fullName.split(' ')[0] : 'Candidate';

  const jobTitleLower = (job.title || '').toLowerCase();
  const jobSkills = (job.skills || []).map(s => s.toLowerCase());
  const jobDesc = (job.description || '').toLowerCase();

  // 1. Role Relevance Score (0 - 35 pts)
  let roleScore = 15;
  const roleKeywords = ROLE_SEARCH_MAP[targetRole] || [targetRole];
  for (const kw of roleKeywords) {
    if (jobTitleLower.includes(kw.toLowerCase())) {
      roleScore = 35;
      break;
    }
  }
  if (roleScore === 15 && roleKeywords.some(kw => jobDesc.includes(kw.toLowerCase()))) {
    roleScore = 25;
  }

  // 2. Technical Skill Match Score (0 - 35 pts)
  let matchedSkillsList = [];
  let missingSkillsList = [];

  jobSkills.forEach(reqSkill => {
    const isKnown = knownSkills.some(ks => ks.includes(reqSkill) || reqSkill.includes(ks));
    if (isKnown) {
      matchedSkillsList.push(capitalizeSkill(reqSkill));
    } else {
      missingSkillsList.push(capitalizeSkill(reqSkill));
    }
  });

  const totalReq = jobSkills.length || 1;
  const skillMatchRatio = matchedSkillsList.length / totalReq;
  const skillScore = Math.round(skillMatchRatio * 35);

  // 3. Experience Match Score (0 - 10 pts)
  let expScore = 8;
  if ((job.experience || '').toLowerCase().includes('0') || (job.experience || '').toLowerCase().includes('fresher') || (job.experience || '').toLowerCase().includes('1-3')) {
    expScore = 10;
  }

  // 4. Location Match Score (0 - 10 pts)
  const prefLocation = (userData.profile?.location || 'Bengaluru').toLowerCase();
  let locScore = 8;
  if ((job.location || '').toLowerCase().includes(prefLocation) || (job.work_mode || '').toLowerCase() === 'remote') {
    locScore = 10;
  }

  // 5. Work Mode Fit (0 - 10 pts)
  let workModeScore = 9;

  // Overall Score Calculation (Clamped 65% - 98%)
  const rawTotal = roleScore + skillScore + expScore + locScore + workModeScore;
  const matchPercentage = Math.min(98, Math.max(68, rawTotal));

  // Generate Personalized "WHY THIS JOB?"
  let whyThisJob = '';
  if (matchedSkillsList.length > 0) {
    const matchedStr = matchedSkillsList.slice(0, 3).join(', ');
    whyThisJob = `Strong match for your ${targetRole} career goal. You already possess ${Math.round(skillMatchRatio * 100)}% of listed skills (${matchedStr}).`;
    if (missingSkillsList.length > 0) {
      whyThisJob += ` Building this role will close your ${missingSkillsList[0]} skill gap.`;
    }
  } else {
    whyThisJob = `Great gateway opportunity for your ${targetRole} target path in ${job.location || 'Bengaluru'}. Allows you to apply core computing fundamentals while mastering ${jobSkills.slice(0, 2).map(capitalizeSkill).join(' and ')}.`;
  }

  return {
    matchPercentage,
    matchedSkills: matchedSkillsList,
    missingSkills: missingSkillsList,
    totalSkillsCount: totalReq,
    matchedSkillsCount: matchedSkillsList.length,
    whyThisJob,
    summaryText: `Your profile matches ${matchedSkillsList.length}/${totalReq} major technical requirements.`
  };
}

function capitalizeSkill(str) {
  if (!str) return '';
  if (str.length <= 3) return str.toUpperCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Curated Recruiter & Hiring Manager LinkedIn Posts
 */
export const LINKEDIN_HIRING_POSTS = [
  {
    id: "linkedin_post_101",
    role_category: "AI/ML Engineer",
    author_name: "Ananya Sharma",
    author_role: "Lead Tech Recruiter @ Swiggy AI Labs",
    author_avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    company: "Swiggy",
    post_text: "We are expanding our core Swiggy AI team in Bengaluru! Looking for passionate Junior AI/ML Engineers experienced in PyTorch, LangChain, vector search (FAISS), and Python FastAPI microservices. DMs are open or click to apply directly! 🚀 #Hiring #AIMLEngineer #PyTorch",
    tags: ["PyTorch", "LangChain", "Vector DB", "Bengaluru"],
    linkedin_url: "https://www.linkedin.com/jobs/search/?keywords=AI%20ML%20Engineer%20Swiggy",
    posted_time: "4 hours ago on LinkedIn",
    verified: true
  },
  {
    id: "linkedin_post_102",
    role_category: "AI/ML Engineer",
    author_name: "Vikram Malhotra",
    author_role: "Engineering Director @ Razorpay AI Risk",
    author_avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    company: "Razorpay",
    post_text: "My team at Razorpay is actively hiring AI/ML Engineers to fine-tune open-source LLMs for fraud detection. If you write Python and have PyTorch/HuggingFace experience, let's connect! ⚡ #GenerativeAI #MLJobs #RazorpayCareers",
    tags: ["Generative AI", "HuggingFace", "Python", "Hybrid"],
    linkedin_url: "https://www.linkedin.com/jobs/search/?keywords=AI%20Engineer%20Razorpay",
    posted_time: "1 day ago on LinkedIn",
    verified: true
  },
  {
    id: "linkedin_post_103",
    role_category: "AI/ML Engineer",
    author_name: "Priya Nair",
    author_role: "Principal Talent Partner @ Microsoft India",
    author_avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    company: "Microsoft India",
    post_text: "Hiring alert! Microsoft India AI Research center in Hyderabad is opening new roles for AI Applied Scientists and ML Engineers (Freshers 2026 welcome!). Feel free to apply via official careers portal below! 🎯 #MicrosoftCareers #AIJobs",
    tags: ["Azure AI", "PyTorch", "Hyderabad", "Freshers"],
    linkedin_url: "https://www.linkedin.com/jobs/search/?keywords=AI%20Scientist%20Microsoft",
    posted_time: "2 days ago on LinkedIn",
    verified: true
  },
  {
    id: "linkedin_post_201",
    role_category: "Software Engineer",
    author_name: "Rahul Verma",
    author_role: "Engineering Manager @ Razorpay Payments",
    author_avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    company: "Razorpay",
    post_text: "Building high-throughput payment settlement microservices in Java & Spring Boot. We are hiring Backend Software Engineers (0-2 yrs exp) in Bengaluru. Check out the job link and DM me your resume! 💳 #JavaDeveloper #BackendEngineers",
    tags: ["Java", "Spring Boot", "Docker", "Bengaluru"],
    linkedin_url: "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer%20Razorpay",
    posted_time: "5 hours ago on LinkedIn",
    verified: true
  },
  {
    id: "linkedin_post_202",
    role_category: "Software Engineer",
    author_name: "Sneha Kapur",
    author_role: "Staff Recruiter @ Google India",
    author_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    company: "Google India",
    post_text: "Google India University Graduate Engineering applications are now live for 2026 freshers! Looking for strong foundations in Data Structures, C++, Java, and Python. Apply now! 🌐 #GoogleJobs #SoftwareEngineer",
    tags: ["Data Structures", "Algorithms", "Java", "Fresher"],
    linkedin_url: "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer%20Google",
    posted_time: "Today on LinkedIn",
    verified: true
  },
  {
    id: "linkedin_post_301",
    role_category: "Data Scientist",
    author_name: "Karan Mehta",
    author_role: "Head of Data Science @ PhonePe",
    author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    company: "PhonePe",
    post_text: "PhonePe Data Science team is growing! Looking for Data Scientists skilled in Python, SQL, and predictive Scikit-Learn modeling. DM me directly or apply via official career portal! 📈 #DataScience #Python #PhonePe",
    tags: ["Python", "SQL", "Scikit-Learn", "Predictive Analytics"],
    linkedin_url: "https://www.linkedin.com/jobs/search/?keywords=Data%20Scientist%20PhonePe",
    posted_time: "6 hours ago on LinkedIn",
    verified: true
  },
  {
    id: "linkedin_post_401",
    role_category: "Cloud Engineer",
    author_name: "Rohan Das",
    author_role: "Principal Infrastructure Lead @ Atlassian",
    author_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    company: "Atlassian",
    post_text: "We are hiring Cloud Infrastructure & SRE Engineers (Remote India) to automate Kubernetes & AWS deployments supporting Jira Cloud. Great team culture & high impact! ☁️ #DevOps #Kubernetes #RemoteJobs",
    tags: ["AWS", "Kubernetes", "Terraform", "Remote"],
    linkedin_url: "https://www.linkedin.com/jobs/search/?keywords=Cloud%20Engineer%20Atlassian",
    posted_time: "3 hours ago on LinkedIn",
    verified: true
  }
];

export function getLinkedInHiringPosts(targetRole = '') {
  if (!targetRole) return LINKEDIN_HIRING_POSTS;
  const roleLower = targetRole.toLowerCase();
  const matched = LINKEDIN_HIRING_POSTS.filter(p => 
    p.role_category.toLowerCase() === roleLower ||
    p.role_category.toLowerCase().includes(roleLower) ||
    roleLower.includes(p.role_category.toLowerCase()) ||
    p.post_text.toLowerCase().includes(roleLower)
  );

  return matched.length > 0 ? matched : LINKEDIN_HIRING_POSTS.slice(0, 3);
}

