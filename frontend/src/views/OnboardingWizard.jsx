import React, { useState } from 'react';
import { User, Github, FileText, Award, Target, ArrowRight, ArrowLeft, Upload, Check, Trash2, RefreshCw } from 'lucide-react';

export default function OnboardingWizard({ onCompleteOnboarding }) {
  const [step, setStep] = useState(1);

  // Step 1: Profile State
  const [profile, setProfile] = useState({
    fullName: 'Vishnu Karanth',
    college: 'School of Engineering',
    university: 'State Technological University',
    branch: 'Computer Science & Engineering',
    currentYear: '4th Year (Senior)',
    cgpa: '8.8 / 10',
    phone: '+91 9876543210',
    location: 'Bangalore, India',
    preferredCareer: 'Backend Engineer',
    preferredTech: 'Python, FastAPI, PostgreSQL, Docker',
    studyHours: '4 Hours / Day',
    linkedin: 'https://linkedin.com/in/vishnukaranth',
    portfolio: 'https://vishnukaranth.dev'
  });

  // Step 2: GitHub State
  const [githubUsername, setGithubUsername] = useState('vishnukaranth');
  const [githubConnected, setGithubConnected] = useState(true);
  const [githubRepos, setGithubRepos] = useState([
    { name: 'skill-pilot-backend', stars: 24, forks: 6, lang: 'Python', tech: 'FastAPI, Docker, PostgreSQL' },
    { name: 'ai-career-agent', stars: 42, forks: 12, lang: 'TypeScript', tech: 'React, Vite, Supabase' },
    { name: 'distributed-cache-engine', stars: 15, forks: 3, lang: 'Go', tech: 'Redis, gRPC' }
  ]);

  // Step 3: Resume State
  const [resumeFile, setResumeFile] = useState({ name: 'Vishnu_Karanth_Resume_Backend_Engineer.pdf' });

  // Step 4: Certificates State
  const [certificates, setCertificates] = useState([
    { id: 1, name: 'AWS_Certified_Developer.pdf', type: 'application/pdf', size: '1.2 MB' },
    { id: 2, name: 'Docker_Kubernetes_Mastery.png', type: 'image/png', size: '850 KB' }
  ]);

  // Step 5: Career Goal State
  const [selectedGoal, setSelectedGoal] = useState('Backend Developer');

  const careerGoals = [
    'AI Engineer',
    'Machine Learning Engineer',
    'Software Engineer',
    'Backend Developer',
    'Frontend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Cloud Engineer',
    'Cyber Security Engineer',
    'Data Scientist'
  ];

  const handleAddCert = (e) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setCertificates([...certificates, { id: Date.now(), name: f.name, type: f.type, size: '1.1 MB' }]);
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
        githubUsername,
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
              {step === 3 && "Upload Your ATS Resume"}
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
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>College / Department</label>
                <input className="form-input" value={profile.college} onChange={e => setProfile({...profile, college: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>University</label>
                <input className="form-input" value={profile.university} onChange={e => setProfile({...profile, university: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Branch / Major</label>
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
              <div>
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
                  placeholder="Enter GitHub Username"
                  value={githubUsername}
                  onChange={e => setGithubUsername(e.target.value)}
                />
                <button className="btn-secondary" onClick={() => setGithubConnected(true)}>
                  <Github size={18} /> Connect GitHub
                </button>
              </div>

              {githubConnected && (
                <div style={{ background: 'rgba(10, 14, 23, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Check size={16} /> GitHub Connected: @{githubUsername}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3 Repositories Fetched</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {githubRepos.map((r, idx) => (
                      <div key={idx} style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '0.9rem' }}>{r.name}</strong>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.tech}</p>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                          ⭐ {r.stars} | {r.lang}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Resume */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={32} color="#8b5cf6" />
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem' }}>{resumeFile ? resumeFile.name : "Select your PDF or DOCX Resume"}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Supports PDF and Word formats (Max 10MB)</p>
              </div>

              <input type="file" id="onboard-resume" accept=".pdf,.docx" style={{ display: 'none' }} onChange={e => e.target.files[0] && setResumeFile(e.target.files[0])} />
              
              <label htmlFor="onboard-resume" className="btn-secondary" style={{ cursor: 'pointer' }}>
                <Upload size={16} /> Choose Resume File
              </label>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {careerGoals.map(goal => (
                <div
                  key={goal}
                  onClick={() => setSelectedGoal(goal)}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: selectedGoal === goal ? '#3b82f6' : 'var(--border-color)',
                    background: selectedGoal === goal ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'var(--transition)'
                  }}
                >
                  <span style={{ fontSize: '0.925rem', fontWeight: selectedGoal === goal ? 600 : 400 }}>{goal}</span>
                  {selectedGoal === goal && <Check size={18} color="#3b82f6" />}
                </div>
              ))}
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
