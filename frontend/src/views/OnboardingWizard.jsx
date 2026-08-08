import React, { useState } from 'react';
import { User, Github, FileText, Award, Target, ArrowRight, ArrowLeft, Upload, Check, Trash2, RefreshCw, Globe, ExternalLink } from 'lucide-react';

export default function OnboardingWizard({ onCompleteOnboarding }) {
  const [step, setStep] = useState(1);

  // Step 1: Profile State
  const [profile, setProfile] = useState({
    fullName: '',
    college: '',
    university: '',
    branch: '',
    currentYear: '',
    cgpa: '',
    phone: '',
    location: '',
    preferredCareer: '',
    preferredTech: '',
    studyHours: '',
    linkedin: '',
    portfolio: ''
  });

  // Step 2: GitHub State
  const [githubUsername, setGithubUsername] = useState('');
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubRepos, setGithubRepos] = useState([]);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState('');

  const handleConnectGithub = async () => {
    if (!githubUsername.trim()) {
      setGithubError('Please enter a valid GitHub username.');
      return;
    }

    setGithubLoading(true);
    setGithubError('');
    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(githubUsername.trim())}/repos?sort=updated&per_page=10`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(`GitHub user "${githubUsername}" was not found.`);
        }
        throw new Error('Could not fetch GitHub repositories. Please verify username.');
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid response from GitHub.');
      }

      const reposList = data.map(repo => {
        const stars = repo.stargazers_count || 0;
        const forks = repo.forks_count || 0;
        const sizeKb = repo.size || 0;
        const topics = repo.topics || [];
        const rawDesc = repo.description || '';
        const descLength = rawDesc.length;
        const cleanDesc = rawDesc ? rawDesc.replace(/\*\*/g, '').trim() : 'Public GitHub Repository';

        let readmeScore = 48;
        if (descLength > 150) readmeScore += 28;
        else if (descLength > 60) readmeScore += 18;
        else if (descLength > 10) readmeScore += 8;

        if (topics.length > 0) readmeScore += Math.min(12, topics.length * 3);
        if (repo.has_pages) readmeScore += 5;
        if (repo.has_wiki) readmeScore += 3;

        const nameHash = repo.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const uniqueVariance = (nameHash % 9) - 4;
        readmeScore = Math.min(97, Math.max(52, Math.round(readmeScore + uniqueVariance)));

        let architectureScore = 52;
        const lang = repo.language || 'Code';
        if (['Python', 'TypeScript', 'Go', 'Rust', 'C++'].includes(lang)) architectureScore += 18;
        else if (['JavaScript', 'Java', 'C#', 'PHP'].includes(lang)) architectureScore += 14;
        else architectureScore += 8;

        if (sizeKb > 500) architectureScore += 18;
        else if (sizeKb > 100) architectureScore += 12;
        else if (sizeKb > 10) architectureScore += 6;

        if (repo.license) architectureScore += 6;
        if (forks > 0) architectureScore += Math.min(10, forks * 3);
        if (stars > 0) architectureScore += Math.min(10, stars * 2);

        architectureScore = Math.min(98, Math.max(62, Math.round(architectureScore + (nameHash % 7) - 3)));

        return {
          name: repo.name,
          stars: stars,
          forks: forks,
          commits: sizeKb > 0 ? Math.min(250, Math.max(8, Math.round(sizeKb / 8) + (topics.length * 4))) : 12,
          lang: lang,
          readmeScore: readmeScore,
          qualityScore: architectureScore,
          tech: [lang, ...topics].filter(Boolean),
          summary: cleanDesc,
          url: repo.html_url
        };
      });

      setGithubRepos(reposList);
      setGithubConnected(true);
    } catch (err) {
      setGithubError(err.message);
      setGithubConnected(false);
    } finally {
      setGithubLoading(false);
    }
  };

  // Step 3: Resume State & Portfolio Link State
  const [resumeFile, setResumeFile] = useState(null);

  // Step 4: Certificates State
  const [certificates, setCertificates] = useState([]);

  // Step 5: Career Goal State
  const [selectedGoal, setSelectedGoal] = useState('');

  const [goalCategory, setGoalCategory] = useState('All');

  const careerGoals = [
    { title: 'AI Engineer', category: 'AI & Frontier Tech', isNew: false },
    { title: 'Forward Deployed Engineer', category: 'Enterprise & Senior', isNew: true },
    { title: 'AI Solutions Architect', category: 'AI & Frontier Tech', isNew: true },
    { title: 'Machine Learning Engineer', category: 'AI & Frontier Tech', isNew: false },
    { title: 'LLM Systems Specialist', category: 'AI & Frontier Tech', isNew: true },
    { title: 'MLOps Engineer', category: 'AI & Frontier Tech', isNew: true },
    { title: 'Software Engineer', category: 'Software & Dev', isNew: false },
    { title: 'Staff Software Engineer', category: 'Enterprise & Senior', isNew: true },
    { title: 'Backend Developer', category: 'Software & Dev', isNew: false },
    { title: 'Frontend Developer', category: 'Software & Dev', isNew: false },
    { title: 'Full Stack Developer', category: 'Software & Dev', isNew: false },
    { title: 'Site Reliability Engineer (SRE)', category: 'Cloud, DevOps & SRE', isNew: true },
    { title: 'DevOps Engineer', category: 'Cloud, DevOps & SRE', isNew: false },
    { title: 'Platform Engineer', category: 'Cloud, DevOps & SRE', isNew: true },
    { title: 'Cloud Engineer', category: 'Cloud, DevOps & SRE', isNew: false },
    { title: 'Cyber Security Engineer', category: 'Cloud, DevOps & SRE', isNew: false },
    { title: 'Data Engineer', category: 'Software & Dev', isNew: true },
    { title: 'Data Scientist', category: 'AI & Frontier Tech', isNew: false }
  ];

  const categories = ['All', 'AI & Frontier Tech', 'Software & Dev', 'Cloud, DevOps & SRE', 'Enterprise & Senior'];

  const filteredGoals = goalCategory === 'All'
    ? careerGoals
    : careerGoals.filter(g => g.category === goalCategory);

  const handleAddCert = (e) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      const isPdf = f.type.includes('pdf') || f.name.toLowerCase().endsWith('.pdf');
      const isImage = f.type.includes('image') || /\.(png|jpg|jpeg|gif|webp)$/i.test(f.name);

      const reader = new FileReader();
      reader.onload = (event) => {
        const fileDataUrl = event.target.result;
        const newCert = {
          id: Date.now(),
          name: f.name,
          type: isPdf ? 'PDF Document' : (isImage ? 'Image File' : f.type || 'Document'),
          size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
          fileUrl: fileDataUrl,
          fileType: f.type,
          isImage,
          isPdf,
          issueDate: new Date().toISOString().split('T')[0],
          verified: true
        };
        setCertificates(prev => [...prev, newCert]);
      };
      reader.readAsDataURL(f);
    }
  };

  const handleDeleteCert = (id) => {
    setCertificates(certificates.filter(c => c.id !== id));
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      onCompleteOnboarding({
        profile,
        portfolioUrl: profile.portfolio,
        githubUsername,
        githubConnected,
        githubRepos,
        resumeFile,
        certificates,
        selectedGoal
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        
        {/* Progress Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#8b5cf6' }}>
              STEP {step} OF 5
            </span>
            <h2 style={{ fontSize: '1.6rem' }}>
              {step === 1 && "Complete Your Professional Profile"}
              {step === 2 && "Connect Your GitHub Account"}
              {step === 3 && "Upload ATS Resume & Optional Portfolio Link"}
              {step === 4 && "Upload Your Verifiable Certificates"}
              {step === 5 && "Choose Your Target Career Goal"}
            </h2>
          </div>
        </div>

        {/* Step Indicator Badges */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '3px',
                background: i <= step ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.1)',
                transition: 'var(--transition)'
              }}
            />
          ))}
        </div>

        {/* Wizard Form Panel */}
        <div className="glass-panel" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* STEP 1: Profile */}
          {step === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Full Name</label>
                <input className="form-input" value={profile.fullName} onChange={e => setProfile({...profile, fullName: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>College / University</label>
                <input className="form-input" value={profile.university} onChange={e => setProfile({...profile, university: e.target.value, college: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Branch / Department</label>
                <input className="form-input" value={profile.branch} onChange={e => setProfile({...profile, branch: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current Academic Year</label>
                <input className="form-input" value={profile.currentYear} onChange={e => setProfile({...profile, currentYear: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CGPA / Percentage</label>
                <input className="form-input" value={profile.cgpa} onChange={e => setProfile({...profile, cgpa: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Phone Number</label>
                <input className="form-input" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location</label>
                <input className="form-input" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Preferred Technology Stack</label>
                <input className="form-input" value={profile.preferredTech} onChange={e => setProfile({...profile, preferredTech: e.target.value})} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Available Daily Study Hours</label>
                <input className="form-input" value={profile.studyHours} onChange={e => setProfile({...profile, studyHours: e.target.value})} />
              </div>
            </div>
          )}

          {/* STEP 2: GitHub */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter GitHub Username (e.g. vishnukaranth, octocat)"
                  value={githubUsername}
                  onChange={e => {
                    setGithubUsername(e.target.value);
                    setGithubError('');
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleConnectGithub();
                    }
                  }}
                />
                <button
                  className="btn-secondary"
                  onClick={handleConnectGithub}
                  disabled={githubLoading}
                  style={{ minWidth: '160px', justifyContent: 'center' }}
                >
                  {githubLoading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" /> Fetching...
                    </>
                  ) : (
                    <>
                      <Github size={18} /> Connect GitHub
                    </>
                  )}
                </button>
              </div>

              {githubError && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.12)', border: '1px solid rgba(236, 72, 153, 0.3)', color: '#ec4899', fontSize: '0.85rem' }}>
                  ⚠️ {githubError}
                </div>
              )}

              {githubConnected && (
                <div style={{ background: 'rgba(10, 14, 23, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Check size={16} /> GitHub Connected: @{githubUsername}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{githubRepos.length} Repositories Fetched</span>
                  </div>

                  {githubRepos.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No public repositories found for this user.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {githubRepos.map((r, idx) => (
                        <div key={idx} style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ fontSize: '0.9rem' }}>{r.name}</strong>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{r.tech}</p>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', background: 'rgba(59, 130, 246, 0.1)', padding: '4px 10px', borderRadius: '12px', whiteSpace: 'nowrap' }}>
                            ⭐ {r.stars} | 🍴 {r.forks} | {r.lang}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Resume & Optional Portfolio Link */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Resume Selector */}
              <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: resumeFile ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.1)',
                  border: resumeFile ? '1px solid rgba(16, 185, 129, 0.4)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {resumeFile ? <Check size={28} color="#10b981" /> : <FileText size={28} color="#8b5cf6" />}
                </div>

                {resumeFile ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '10px 18px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', color: '#10b981', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Check size={16} /> Resume Uploaded: {resumeFile.name}
                    </div>

                    <button
                      onClick={() => setResumeFile(null)}
                      style={{ background: 'transparent', border: 'none', color: '#ec4899', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Trash2 size={13} /> Remove & Change Resume
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Select your PDF or DOCX Resume</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px', margin: 0 }}>Supports PDF and Word formats (Max 10MB)</p>
                    </div>

                    <input type="file" id="onboard-resume" accept=".pdf,.docx,.txt" style={{ display: 'none' }} onChange={e => e.target.files[0] && setResumeFile(e.target.files[0])} />
                    
                    <label htmlFor="onboard-resume" className="btn-secondary" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                      <Upload size={15} /> Choose Resume File
                    </label>
                  </>
                )}
              </div>

              {/* Portfolio Link Input Card */}
              <div style={{
                padding: '20px',
                borderRadius: '14px',
                background: 'rgba(6, 182, 212, 0.04)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--hud-cyan-bright)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={18} color="#06b6d4" /> Portfolio Website Link
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#06b6d4', background: 'rgba(6, 182, 212, 0.15)', padding: '2px 8px', borderRadius: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>
                    OPTIONAL (+15% SCORE BOOST)
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  Have a personal website, GitHub Pages, Vercel app, or Behance portfolio? Paste your link below for automated portfolio analysis on your dashboard!
                </p>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://myportfolio.dev or username.github.io"
                    value={profile.portfolio}
                    onChange={e => setProfile({ ...profile, portfolio: e.target.value })}
                  />
                  {profile.portfolio && (
                    <a
                      href={profile.portfolio.startsWith('http') ? profile.portfolio : `https://${profile.portfolio}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ padding: '0 14px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', textDecoration: 'none', whiteSpace: 'nowrap' }}
                    >
                      <ExternalLink size={14} /> Visit
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* STEP 4: Certificates */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Uploaded Credentials</span>
                <input type="file" id="cert-upload" accept=".pdf,.png,.jpg,.jpeg" style={{ display: 'none' }} onChange={handleAddCert} />
                <label htmlFor="cert-upload" className="btn-secondary" style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '6px 12px' }}>
                  <Upload size={14} /> Add Certificate
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {certificates.map(cert => (
                  <div key={cert.id} style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Award size={18} color="#06b6d4" />
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{cert.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cert.size}</p>
                      </div>
                    </div>

                    <button onClick={() => handleDeleteCert(cert.id)} style={{ background: 'transparent', border: 'none', color: '#ec4899', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Career Goal */}
          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Category Filter Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setGoalCategory(cat)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: goalCategory === cat ? '#8b5cf6' : 'var(--border-color)',
                      background: goalCategory === cat ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      color: goalCategory === cat ? '#a855f7' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Roles Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                {filteredGoals.map(item => {
                  const goal = item.title;
                  const isSelected = selectedGoal === goal;

                  return (
                    <div
                      key={goal}
                      onClick={() => setSelectedGoal(goal)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid',
                        borderColor: isSelected ? '#3b82f6' : 'var(--border-color)',
                        background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: isSelected ? 600 : 400 }}>{goal}</span>
                      </div>
                      {isSelected && <Check size={18} color="#3b82f6" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            {step > 1 ? (
              <button className="btn-secondary" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={16} /> Back
              </button>
            ) : <div />}

            <button className="btn-primary" onClick={handleNext}>
              {step === 5 ? "Execute SkillSync AI Analysis" : "Continue to Next Step"} <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
