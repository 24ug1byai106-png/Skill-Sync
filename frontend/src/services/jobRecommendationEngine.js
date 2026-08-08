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

