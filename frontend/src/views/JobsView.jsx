import React, { useState, useEffect, useMemo } from 'react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Building2, 
  Clock, 
  DollarSign, 
  Layers, 
  ArrowRight, 
  X,
  Target,
  UserCheck,
  Linkedin,
  MessageSquare
} from 'lucide-react';
import { computeCareerAnalysis } from '../services/analysisEngine';
import { calculateJobMatch, ROLE_SEARCH_MAP, getLinkedInHiringPosts } from '../services/jobRecommendationEngine';
import { fetchApi } from '../services/api';
import { saveUserJob, getUserSavedJobs, updateJobStatus } from '../services/supabase';

const LOCATIONS_LIST = ['All Locations', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Mumbai', 'Delhi NCR', 'Remote', 'India'];
const WORK_MODES = ['All Modes', 'Remote', 'Hybrid', 'On-site'];
const POSTED_FILTERS = [
  { id: 'all', label: 'ALL' },
  { id: 'today', label: 'TODAY' },
  { id: '3days', label: 'LAST 3 DAYS' },
  { id: '7days', label: 'LAST 7 DAYS' }
];

export default function JobsView({ userData = {}, onUpdateUserData }) {
  const analysis = computeCareerAnalysis(userData);
  const targetRole = analysis.targetGoal || userData.selectedGoal || userData.profile?.preferredCareer || 'Software Engineer';
  const userLoc = userData.profile?.location || 'Bengaluru';

  // Filters State (Career Role locked to active profile target role)
  const selectedRole = targetRole;
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [workModeFilter, setWorkModeFilter] = useState('All Modes');
  const [postedDateFilter, setPostedDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState(null);

  // Jobs & Saved Jobs State
  const [rawJobs, setRawJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobsMap, setSavedJobsMap] = useState({});
  const [selectedDetailJob, setSelectedDetailJob] = useState(null);

  // Fetch Jobs from backend API endpoint
  useEffect(() => {
    let isMounted = true;
    async function loadJobs() {
      setLoading(true);
      const queryParams = new URLSearchParams({
        role: selectedRole,
        keywords: searchQuery,
        location: locationFilter !== 'All Locations' ? locationFilter : '',
        work_mode: workModeFilter !== 'All Modes' ? workModeFilter : ''
      });

      const res = await fetchApi(`/jobs/search?${queryParams.toString()}`);
      if (isMounted) {
        if (res && res.jobs) {
          setRawJobs(res.jobs);
        } else {
          setRawJobs([]);
        }
        setLoading(false);
      }
    }
    loadJobs();
    return () => { isMounted = false; };
  }, [selectedRole, searchQuery, locationFilter, workModeFilter]);

  // Load Saved Jobs from Supabase
  useEffect(() => {
    async function loadSaved() {
      const saved = await getUserSavedJobs();
      const map = {};
      saved.forEach(s => {
        map[s.job_id] = s.status || 'Saved';
      });
      setSavedJobsMap(map);
    }
    loadSaved();
  }, []);

  // Compute Processed Jobs with Personalization Matching
  const processedJobs = useMemo(() => {
    let result = rawJobs.map(j => {
      const match = calculateJobMatch(j, userData, selectedRole);
      return {
        ...j,
        matchInfo: match,
        saveStatus: savedJobsMap[j.id] || null
      };
    });

    // Filter by Company if selected
    if (selectedCompanyFilter) {
      result = result.filter(j => j.company.toLowerCase() === selectedCompanyFilter.toLowerCase());
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(j => 
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        (j.skills || []).some(s => s.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'match') {
      result.sort((a, b) => b.matchInfo.matchPercentage - a.matchInfo.matchPercentage);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (a.posted_at || '').localeCompare(b.posted_at || ''));
    }

    return result;
  }, [rawJobs, userData, savedJobsMap, selectedCompanyFilter, searchQuery, sortBy]);

  // Aggregate Companies Hiring
  const topHiringCompanies = useMemo(() => {
    const counts = {};
    const logos = {};
    rawJobs.forEach(j => {
      counts[j.company] = (counts[j.company] || 0) + 1;
      logos[j.company] = j.company_logo;
    });

    return Object.keys(counts).map(comp => ({
      name: comp,
      count: counts[comp],
      logo: logos[comp]
    })).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [rawJobs]);

  // Average Match Score
  const avgMatchScore = useMemo(() => {
    if (processedJobs.length === 0) return 85;
    const sum = processedJobs.reduce((acc, j) => acc + j.matchInfo.matchPercentage, 0);
    return Math.round(sum / processedJobs.length);
  }, [processedJobs]);

  // LinkedIn Recruiter Hiring Posts Feed
  const linkedInPosts = useMemo(() => getLinkedInHiringPosts(targetRole), [targetRole]);

  // Handlers for Save & Status Change
  const handleToggleSave = async (job) => {
    const currentStatus = savedJobsMap[job.id];
    if (currentStatus) {
      // Remove or set un-saved in local state
      const nextMap = { ...savedJobsMap };
      delete nextMap[job.id];
      setSavedJobsMap(nextMap);
      await updateJobStatus(job.id, 'Unsaved');
    } else {
      const nextMap = { ...savedJobsMap, [job.id]: 'Saved' };
      setSavedJobsMap(nextMap);
      await saveUserJob(job, 'Saved');
    }
  };

  const handleStatusChange = async (job, newStatus) => {
    const nextMap = { ...savedJobsMap, [job.id]: newStatus };
    setSavedJobsMap(nextMap);
    await saveUserJob(job, newStatus);
  };

  const handleBroadenSearch = () => {
    setLocationFilter('All Locations');
    setWorkModeFilter('All Modes');
    setSearchQuery('');
    setSelectedCompanyFilter(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Futuristic Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Briefcase color="var(--hud-cyan-bright)" size={26} />
            <h2 style={{ fontSize: '1.6rem', color: 'var(--hud-cyan-bright)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
              LIVE JOB OPPORTUNITIES
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
            Live opportunities matched to your career goal, skills, and profile telemetry.
          </p>
        </div>
      </div>

      {/* 2. Top Telemetry Bar */}
      <div className="hud-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', background: 'var(--bg-panel)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={16} color="var(--hud-cyan-bright)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: "'Share Tech Mono', monospace" }}>TARGET ROLE:</span>
            <strong style={{ fontSize: '0.88rem', color: 'var(--hud-cyan-bright)', fontFamily: "'Share Tech Mono', monospace" }}>
              {targetRole.toUpperCase()}
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color="var(--hud-amber-bright)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: "'Share Tech Mono', monospace" }}>PREFERRED LOCATION:</span>
            <strong style={{ fontSize: '0.88rem', color: 'var(--hud-amber-bright)', fontFamily: "'Share Tech Mono', monospace" }}>
              {userLoc.toUpperCase()}
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={16} color="#10B981" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: "'Share Tech Mono', monospace" }}>PROFILE MATCH:</span>
            <strong style={{ fontSize: '0.88rem', color: '#10B981', fontFamily: "'Share Tech Mono', monospace" }}>
              {avgMatchScore}% AVERAGE
            </strong>
          </div>

        </div>

        <div style={{ background: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--border-cyan)', padding: '6px 14px', fontSize: '0.8rem', color: 'var(--hud-cyan-bright)', fontFamily: "'Share Tech Mono', monospace" }}>
          ACTIVE OPPORTUNITIES: <strong>{processedJobs.length} FOUND</strong>
        </div>
      </div>

      {/* 3. COMPANIES HIRING FOR YOUR ROLE ("WHO IS HIRING?") */}
      {topHiringCompanies.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--hud-amber-bright)', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace", display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={16} /> COMPANIES HIRING FOR YOUR ROLE
            </span>
            {selectedCompanyFilter && (
              <button 
                onClick={() => setSelectedCompanyFilter(null)} 
                style={{ background: 'none', border: 'none', color: 'var(--hud-cyan-bright)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace" }}
              >
                ✖ CLEAR COMPANY FILTER ({selectedCompanyFilter})
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {topHiringCompanies.map(c => {
              const isSelected = selectedCompanyFilter === c.name;
              return (
                <div 
                  key={c.name}
                  onClick={() => setSelectedCompanyFilter(isSelected ? null : c.name)}
                  className="hud-panel"
                  style={{
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(0, 229, 255, 0.15)' : 'var(--bg-panel)',
                    borderColor: isSelected ? 'var(--hud-cyan-bright)' : 'var(--border-cyan)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-cyan)' }}>
                    <Building2 size={18} color="var(--hud-cyan-bright)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Share Tech Mono', monospace" }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--hud-cyan-bright)' }}>
                      {c.count} matching roles
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3.5 LIVE RECRUITER & TEAM HIRING POSTS (LINKEDIN INSIGHTS) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.84rem', color: '#0A66C2', fontWeight: 800, fontFamily: "'Share Tech Mono', monospace", display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Linkedin size={18} color="#0A66C2" /> LIVE RECRUITER & TEAM HIRING POSTS ({targetRole.toUpperCase()})
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: "'Share Tech Mono', monospace" }}>
            VERIFIED HIRING MANAGER SHOUTOUTS
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {linkedInPosts.map(post => (
            <div key={post.id} className="hud-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-panel)', borderLeft: '3px solid #0A66C2' }}>
              
              {/* Author Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={post.author_avatar} 
                  alt={post.author_name}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #0A66C2', objectFit: 'cover' }} 
                />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Share Tech Mono', monospace" }}>
                    {post.author_name}
                    <span style={{ background: 'rgba(10, 102, 194, 0.2)', color: '#0A66C2', padding: '1px 6px', fontSize: '0.68rem', borderRadius: '4px' }}>
                      ✓ VERIFIED RECRUITER
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--hud-cyan-bright)', fontFamily: "'Share Tech Mono', monospace" }}>
                    {post.author_role}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {post.posted_time}
                  </div>
                </div>
              </div>

              {/* Post Text */}
              <div style={{ background: '#07090E', padding: '12px 14px', border: '1px solid rgba(10, 102, 194, 0.3)', borderRadius: '4px' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  "{post.post_text}"
                </p>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{ background: 'rgba(0, 229, 255, 0.08)', border: '1px solid var(--border-cyan)', color: 'var(--hud-cyan-bright)', fontSize: '0.72rem', padding: '2px 8px', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Direct LinkedIn Action Link */}
              <a
                href={post.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'rgba(10, 102, 194, 0.15)',
                  border: '1px solid #0A66C2',
                  color: '#38bdf8',
                  padding: '8px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  fontFamily: "'Share Tech Mono', monospace",
                  marginTop: 'auto'
                }}
              >
                [ VIEW LINKEDIN POST & DM RECRUITER → ] <ExternalLink size={14} />
              </a>

            </div>
          ))}
        </div>
      </div>

      {/* 4. Filters & Search Controls Bar */}
      <div className="hud-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-panel)' }}>
        
        {/* Search Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Search jobs, companies or skills (e.g. Java, Python, Razorpay, Software Engineer)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ width: '100%', paddingLeft: '42px', fontSize: '0.88rem' }}
            />
          </div>
        </div>

        {/* Filter Selectors Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Fixed Target Role Pill (Locked to Candidate Profile) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: "'Share Tech Mono', monospace" }}>CAREER ROLE (LOCKED TO PROFILE):</label>
            <div style={{ padding: '6px 14px', fontSize: '0.82rem', background: 'rgba(0, 229, 255, 0.12)', border: '1px solid var(--border-cyan)', color: 'var(--hud-cyan-bright)', fontWeight: 800, fontFamily: "'Share Tech Mono', monospace", display: 'flex', alignItems: 'center', gap: '6px' }}>
              🔒 {targetRole.toUpperCase()}
            </div>
          </div>

          {/* Location Dropdown */}
          <div style={{ display: 'flex', flexDir: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: "'Share Tech Mono', monospace" }}>LOCATION:</label>
            <select 
              value={locationFilter} 
              onChange={(e) => setLocationFilter(e.target.value)}
              className="form-input"
              style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#07090E' }}
            >
              {LOCATIONS_LIST.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Work Mode Dropdown */}
          <div style={{ display: 'flex', flexDir: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: "'Share Tech Mono', monospace" }}>WORK MODE:</label>
            <select 
              value={workModeFilter} 
              onChange={(e) => setWorkModeFilter(e.target.value)}
              className="form-input"
              style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#07090E' }}
            >
              {WORK_MODES.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', flexDir: 'column', gap: '4px', marginLeft: 'auto' }}>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: "'Share Tech Mono', monospace" }}>SORT BY:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
              style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#07090E' }}
            >
              <option value="match">BEST MATCH (DEFAULT)</option>
              <option value="newest">NEWEST POSTINGS</option>
            </select>
          </div>

        </div>

      </div>

      {/* 5. JOB CARDS LIST */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--hud-cyan-bright)', fontFamily: "'Share Tech Mono', monospace" }}>
          CALCULATING LIVE PROFILE MATCHES FROM JOB AGGREGATOR...
        </div>
      ) : processedJobs.length === 0 ? (
        /* 6. NO JOBS FOUND STATE */
        <div className="hud-panel" style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', background: 'var(--bg-panel)' }}>
          <AlertTriangle color="var(--hud-amber-bright)" size={48} />
          <h3 style={{ fontSize: '1.3rem', color: 'var(--hud-amber-bright)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
            NO CURRENT MATCHES FOUND
          </h3>
          <p style={{ maxWidth: '540px', color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
            We couldn't find active <strong>{selectedRole}</strong> openings matching all your current filter choices. Try broadening your location or selecting related career roles.
          </p>
          <button 
            onClick={handleBroadenSearch} 
            className="btn-hud-cyan"
            style={{ padding: '10px 24px', fontSize: '0.85rem', fontWeight: 800, marginTop: '8px' }}
          >
            [ BROADEN SEARCH & RESET FILTERS ]
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {processedJobs.map((job) => {
            const isSaved = !!savedJobsMap[job.id];
            const currentStatus = savedJobsMap[job.id] || 'Saved';

            return (
              <div 
                key={job.id} 
                className="hud-panel" 
                style={{ 
                  padding: '24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '16px', 
                  background: 'var(--bg-panel)',
                  borderLeft: '4px solid var(--hud-cyan-bright)'
                }}
              >
                
                {/* Header Row: Company, Title, Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: '#000', border: '1px solid var(--border-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={24} color="var(--hud-cyan-bright)" />
                    </div>

                    <div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
                        {job.company.toUpperCase()}
                      </div>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--hud-cyan-bright)', margin: '2px 0 6px 0', fontFamily: "'Share Tech Mono', monospace" }}>
                        {job.title}
                      </h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: "'Share Tech Mono', monospace" }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} color="var(--hud-cyan-bright)" /> {job.location}
                        </span>
                        <span style={{ background: 'rgba(0, 229, 255, 0.1)', color: 'var(--hud-cyan-bright)', border: '1px solid var(--border-cyan)', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {job.work_mode}
                        </span>
                        <span>Exp: {job.experience}</span>
                        <span style={{ color: 'var(--hud-amber-bright)' }}>{job.salary}</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Match Badge */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10B981', color: '#10B981', padding: '6px 14px', fontSize: '0.9rem', fontWeight: 800, fontFamily: "'Share Tech Mono', monospace" }}>
                      {job.matchInfo.matchPercentage}% PROFILE MATCH
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: "'Share Tech Mono', monospace" }}>
                      Source: {job.source} · {job.posted_at}
                    </span>
                  </div>

                </div>

                {/* SKILL GAP CONNECTION: Matched Skills vs Skill Gaps */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(0, 0, 0, 0.4)', padding: '14px', border: '1px dashed var(--border-cyan)' }}>
                  
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700, marginBottom: '6px', fontFamily: "'Share Tech Mono', monospace" }}>
                      MATCHED SKILLS ({job.matchInfo.matchedSkillsCount}/{job.matchInfo.totalSkillsCount})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {job.matchInfo.matchedSkills.length > 0 ? (
                        job.matchInfo.matchedSkills.map(s => (
                          <span key={s} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 700 }}>
                            ✓ {s}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None matched yet</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--hud-amber-bright)', fontWeight: 700, marginBottom: '6px', fontFamily: "'Share Tech Mono', monospace" }}>
                      SKILL GAPS TO DEVELOP
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {job.matchInfo.missingSkills.length > 0 ? (
                        job.matchInfo.missingSkills.map(s => (
                          <span key={s} style={{ background: 'rgba(255, 159, 28, 0.1)', color: 'var(--hud-amber-bright)', border: '1px solid var(--border-amber)', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 700 }}>
                            ⚠ {s}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#10B981' }}>Full technical coverage!</span>
                      )}
                    </div>
                  </div>

                </div>

                {/* PERSONALIZED "WHY THIS JOB?" EXPLANATION */}
                <div style={{ background: 'rgba(0, 229, 255, 0.04)', padding: '12px 14px', borderLeft: '3px solid var(--hud-amber-bright)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--hud-amber-bright)', fontWeight: 700, marginBottom: '4px', fontFamily: "'Share Tech Mono', monospace", display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} /> WHY THIS JOB?
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {job.matchInfo.whyThisJob}
                  </p>
                </div>

                {/* ACTION BUTTONS ROW */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginTop: '4px' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* ♡ SAVE JOB BUTTON */}
                    <button 
                      onClick={() => handleToggleSave(job)}
                      style={{
                        background: isSaved ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                        border: '1px solid var(--border-cyan)',
                        color: isSaved ? 'var(--hud-cyan-bright)' : 'var(--text-secondary)',
                        padding: '6px 14px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: "'Share Tech Mono', monospace"
                      }}
                    >
                      {isSaved ? <BookmarkCheck size={16} color="var(--hud-cyan-bright)" /> : <Bookmark size={16} />}
                      {isSaved ? 'SAVED JOB' : '♡ SAVE JOB'}
                    </button>

                    {/* MANUAL STATUS TRACKER */}
                    {isSaved && (
                      <select 
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(job, e.target.value)}
                        className="form-input"
                        style={{ padding: '4px 8px', fontSize: '0.78rem', background: '#07090E', color: 'var(--hud-amber-bright)' }}
                      >
                        <option value="Saved">STATUS: SAVED</option>
                        <option value="Applied">STATUS: APPLIED</option>
                        <option value="Interview">STATUS: INTERVIEW</option>
                        <option value="Offer">STATUS: OFFER</option>
                        <option value="Rejected">STATUS: REJECTED</option>
                      </select>
                    )}

                    <button
                      onClick={() => setSelectedDetailJob(job)}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'var(--text-secondary)',
                        padding: '6px 12px',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        fontFamily: "'Share Tech Mono', monospace"
                      }}
                    >
                      [ DETAILS ]
                    </button>
                  </div>

                  {/* CRITICAL BUTTON: VIEW & APPLY -> Opens External Application Page in New Tab */}
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-hud-cyan"
                    style={{
                      padding: '10px 20px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      textDecoration: 'none',
                      boxShadow: '0 0 15px rgba(0, 229, 255, 0.25)'
                    }}
                  >
                    [ VIEW & APPLY → ] <ExternalLink size={15} />
                  </a>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 7. JOB DETAIL MODAL */}
      {selectedDetailJob && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="hud-panel" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', background: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
                  {selectedDetailJob.company.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--hud-cyan-bright)', margin: '4px 0', fontFamily: "'Share Tech Mono', monospace" }}>
                  {selectedDetailJob.title}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--hud-amber-bright)', fontFamily: "'Share Tech Mono', monospace" }}>
                  {selectedDetailJob.location} · {selectedDetailJob.work_mode} · {selectedDetailJob.salary}
                </div>
              </div>
              <button 
                onClick={() => setSelectedDetailJob(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ background: '#07090E', padding: '16px', border: '1px solid var(--border-cyan)' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--hud-cyan-bright)', margin: '0 0 8px 0', fontFamily: "'Share Tech Mono', monospace" }}>
                JOB DESCRIPTION & REQUIREMENTS
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {selectedDetailJob.description}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setSelectedDetailJob(null)}
                className="form-input"
                style={{ padding: '8px 16px', cursor: 'pointer' }}
              >
                Close
              </button>
              <a
                href={selectedDetailJob.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hud-cyan"
                style={{ padding: '10px 20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                [ VIEW ORIGINAL JOB & APPLY → ] <ExternalLink size={16} />
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
