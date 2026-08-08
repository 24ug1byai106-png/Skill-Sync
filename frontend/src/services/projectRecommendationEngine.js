import { PROJECT_CATALOG } from './projectCatalog';
import { computeCareerAnalysis } from './analysisEngine';

/**
 * Core Personalization, Ranking & Controlled Randomization Engine for Projects
 */
export function generatePersonalizedProjects(userData = {}, history = [], count = 3, currentDisplayedIds = []) {
  const analysis = computeCareerAnalysis(userData);
  const targetRole = analysis.targetGoal || userData.selectedGoal || userData.profile?.preferredCareer || 'Software Engineer';
  const fullName = userData.profile?.fullName || 'Candidate';
  const firstName = fullName.split(' ')[0] || 'Candidate';

  // 1. Extract Candidate Telemetry
  const knownSkills = (analysis.matchedSkills || []).map(s => s.toLowerCase());
  const missingSkills = (analysis.missingSkills || []).map(s => s.toLowerCase());
  const repoNames = (userData.githubRepos || []).map(r => (r.name || r.title || '').toLowerCase());

  // 2. Score Every Project in Catalog
  const scoredProjects = PROJECT_CATALOG.map(project => {
    let score = 50; // Base score

    // Vector A: Target Role Relevance (+35 exact, +15 partial)
    const roleMatches = project.roles.some(r => r.toLowerCase() === targetRole.toLowerCase());
    if (roleMatches) {
      score += 35;
    } else {
      const partialRoleMatch = project.roles.some(r => 
        r.toLowerCase().includes(targetRole.toLowerCase()) || targetRole.toLowerCase().includes(r.toLowerCase())
      );
      if (partialRoleMatch) score += 15;
    }

    // Vector B: Skill Gap Relevance (+25 for each matched skill gap closed)
    const matchedGapTags = project.skill_gap_tags.filter(tag => 
      missingSkills.some(gap => gap.includes(tag.toLowerCase()) || tag.toLowerCase().includes(gap))
    );
    score += (matchedGapTags.length * 25);

    // Vector C: Known Skill Compatibility (+10 for each known tech used)
    const matchedKnownTech = project.technologies.filter(tech =>
      knownSkills.some(ks => ks.includes(tech.toLowerCase()) || tech.toLowerCase().includes(ks))
    );
    score += (matchedKnownTech.length * 10);

    // Vector D: Recency & History Penalties
    if (currentDisplayedIds.includes(project.id)) {
      score -= 100; // Strong penalty for currently displayed
    }

    const pastMatch = history.find(h => h.project_id === project.id);
    if (pastMatch) {
      const daysAgo = (Date.now() - new Date(pastMatch.recommended_at).getTime()) / (1000 * 60 * 60 * 24);
      if (daysAgo < 7) {
        score -= 50; // Recommended within last 7 days
      } else if (daysAgo < 30) {
        score -= 20; // Recommended within last 30 days
      }
    }

    // Vector E: Controlled Randomization Noise (±5 points for tie-breaking)
    const noise = (Math.random() * 10) - 5;
    score += noise;

    return {
      ...project,
      calculatedScore: score,
      matchedGapTags,
      matchedKnownTech
    };
  });

  // 3. Filter & Rank Top Candidates
  const sortedCandidates = scoredProjects
    .filter(p => p.calculatedScore > 0)
    .sort((a, b) => b.calculatedScore - a.calculatedScore);

  // Take top candidates for selection pool (e.g. top 10)
  const topPool = sortedCandidates.slice(0, Math.max(10, count * 3));

  // 4. Select Candidate Trio with Category Diversity
  const selectedProjects = [];
  const usedCategories = new Set();

  // First pass: Pick top scoring projects from distinct categories
  for (const proj of topPool) {
    if (selectedProjects.length >= count) break;
    const catGroup = proj.category.split('/')[0].trim();
    if (!usedCategories.has(catGroup)) {
      selectedProjects.push(proj);
      usedCategories.add(catGroup);
    }
  }

  // Second pass: If less than count, fill remaining slots with highest remaining scores
  if (selectedProjects.length < count) {
    for (const proj of topPool) {
      if (selectedProjects.length >= count) break;
      if (!selectedProjects.some(p => p.id === proj.id)) {
        selectedProjects.push(proj);
      }
    }
  }

  // Fallback if catalog pool is small
  if (selectedProjects.length < count) {
    for (const proj of PROJECT_CATALOG) {
      if (selectedProjects.length >= count) break;
      if (!selectedProjects.some(p => p.id === proj.id)) {
        selectedProjects.push(proj);
      }
    }
  }

  // 5. Personalize Content for Each Selected Project
  return selectedProjects.map((proj, idx) => {
    // Dynamic Personalized "WHY BUILD THIS PROJECT?"
    let whyBuildText = '';
    const knownStr = proj.matchedKnownTech.length > 0 ? proj.matchedKnownTech.join(' & ') : 'modern tools';
    const gapStr = proj.matchedGapTags.length > 0 ? proj.matchedGapTags.join(' & ') : (missingSkills[0] || 'System Architecture');

    if (proj.matchedGapTags.length > 0) {
      whyBuildText = `Recommended for ${firstName} because your profile shows solid foundations in ${knownStr}, but your SkillSync gap telemetry highlights limited experience with ${gapStr}. Building this project directly bridges these gaps for ${targetRole} positions.`;
    } else {
      whyBuildText = `Selected specifically for your target role (${targetRole}). ${proj.base_why_build}`;
    }

    // Dynamic Personalized "WHAT KNOWLEDGE YOU WILL LEARN"
    const personalizedKnowledge = proj.base_knowledge.map(item => {
      // Highlight gap tag if present
      const matched = proj.skill_gap_tags.find(tag => item.toLowerCase().includes(tag.toLowerCase()));
      if (matched) {
        return `${item} (Closes your identified '${matched}' skill gap).`;
      }
      return item;
    });

    // Dynamic Personalized "RESUME BULLET POINT YOU CAN WRITE"
    const techFormatted = proj.technologies.slice(0, 3).join(', ');
    const personalizedResumeBullet = proj.base_resume_bullet || `Built ${proj.title} using ${techFormatted}, optimizing backend latency and system reliability for enterprise workloads.`;

    return {
      id: proj.id,
      rankNumber: idx + 1,
      difficulty: proj.difficulty,
      title: proj.title,
      timeline: proj.timeline,
      category: proj.category,
      tech_stack: proj.technologies,
      why_build: whyBuildText,
      knowledge_gained: personalizedKnowledge,
      database_design: proj.database_design,
      resume_bullet: personalizedResumeBullet,
      score: Math.round(proj.calculatedScore)
    };
  });
}
