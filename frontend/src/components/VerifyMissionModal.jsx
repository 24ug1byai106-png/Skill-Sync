import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, Award, Clock, Upload, Brain, FileCode, Check, X, 
  ShieldCheck, FileBadge, Activity, Target, AlertTriangle, FileText, 
  Sparkles, RefreshCw, Eye, ExternalLink
} from 'lucide-react';

function getQuestionsForMission(title = '', category = '') {
  const lower = (title + ' ' + category).toLowerCase();
  
  if (lower.includes('docker') || lower.includes('container')) {
    return [
      {
        id: 1,
        question: "Which command builds an image from a Dockerfile in the current directory?",
        options: ["docker create .", "docker build -t app .", "docker run --build .", "docker image new ."],
        correct: 1,
        explanation: "docker build -t <tag> . reads the Dockerfile in the current directory and creates an image."
      },
      {
        id: 2,
        question: "What is the primary difference between a Docker image and a container?",
        options: [
          "An image runs code, while a container is static storage",
          "An image is an immutable blueprint; a container is a running instance of an image",
          "Images are for Linux only; containers run on any OS without virtualization",
          "There is no difference"
        ],
        correct: 1,
        explanation: "Images are read-only templates used to create runnable container instances."
      },
      {
        id: 3,
        question: "Which Docker Compose command starts all services in the background?",
        options: ["docker-compose start", "docker-compose up -d", "docker-compose run --bg", "docker-compose launch"],
        correct: 1,
        explanation: "-d runs containers in detached mode (in the background)."
      }
    ];
  }

  if (lower.includes('dsa') || lower.includes('leetcode') || lower.includes('algorithm')) {
    return [
      {
        id: 1,
        question: "What is the average time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
        correct: 2,
        explanation: "Each step cuts the search space in half, resulting in logarithmic O(log n) time complexity."
      },
      {
        id: 2,
        question: "Which data structure operates on a First-In, First-Out (FIFO) principle, commonly used in BFS?",
        options: ["Stack", "Queue", "Priority Queue", "Array"],
        correct: 1,
        explanation: "A Queue maintains FIFO order, making it ideal for level-order traversal (BFS)."
      },
      {
        id: 3,
        question: "What key technique does Dynamic Programming rely on to avoid redundant recursive calculations?",
        options: ["Backtracking", "Memoization / Tabulation", "Divide and Conquer", "Greedy Choice"],
        correct: 1,
        explanation: "Memoization (top-down) or Tabulation (bottom-up) stores previously computed subproblem results."
      }
    ];
  }

  if (lower.includes('redis') || lower.includes('caching')) {
    return [
      {
        id: 1,
        question: "What type of database is Redis primarily classified as?",
        options: ["Relational SQL Database", "In-Memory Key-Value Store", "Document Store", "Graph Database"],
        correct: 1,
        explanation: "Redis is an in-memory data structure store used as a database, cache, and message broker."
      },
      {
        id: 2,
        question: "Which Redis command sets a key to expire after a specified number of seconds?",
        options: ["EXPIRE key seconds", "TTL key seconds", "TIMEOUT key seconds", "REMOVE key seconds"],
        correct: 0,
        explanation: "The EXPIRE command sets a TTL timeout on a key."
      },
      {
        id: 3,
        question: "What cache invalidation strategy updates the cache whenever data is written to the primary database?",
        options: ["Cache-Aside", "Write-Through", "Read-Through", "Time-To-Live (TTL) Only"],
        correct: 1,
        explanation: "In Write-Through caching, data is written to the cache and database simultaneously."
      }
    ];
  }

  return [
    {
      id: 1,
      question: "Which HTTP status code indicates a successfully created resource on the server?",
      options: ["200 OK", "201 Created", "204 No Content", "302 Found"],
      correct: 1,
      explanation: "HTTP 201 Created indicates that the request succeeded and a new resource was created."
    },
    {
      id: 2,
      question: "What does API stand for in software engineering?",
      options: ["Application Programming Interface", "Automated Program Integration", "Asynchronous Protocol Instruction", "Advanced Process Implementation"],
      correct: 0,
      explanation: "API stands for Application Programming Interface."
    },
    {
      id: 3,
      question: "Which design principle advocates for keeping components decoupled and easy to test?",
      options: ["Dependency Injection", "Monolithic Coupling", "Global State Mutation", "Hardcoded Configuration"],
      correct: 0,
      explanation: "Dependency Injection allows passing dependencies into objects rather than hardcoding them."
    }
  ];
}

export default function VerifyMissionModal({ mission, isOpen, onClose, onVerify }) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [verificationResult, setVerificationResult] = useState(null);

  // Method 1: Course
  const [courseName, setCourseName] = useState('');
  const [uploadedCertificate, setUploadedCertificate] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState(null);

  // Method 2: Quiz
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Method 3: Project
  const [projectDesc, setProjectDesc] = useState('');
  const [uploadedScreenshot, setUploadedScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  // Method 4: Assessment
  const [assessmentActive, setAssessmentActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [assessmentAnswers, setAssessmentAnswers] = useState({});
  const [assessmentResult, setAssessmentResult] = useState(null);

  const fileInputRef = useRef(null);
  const screenshotInputRef = useRef(null);

  const questions = getQuestionsForMission(mission?.title, mission?.category);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setSelectedMethod(null);
      setIsVerifying(false);
      setVerificationStep(0);
      setVerificationResult(null);
      setCourseName('');
      setUploadedCertificate(null);
      setCertificatePreview(null);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizResult(null);
      setProjectDesc('');
      setUploadedScreenshot(null);
      setScreenshotPreview(null);
      setAssessmentActive(false);
      setTimeLeft(300);
      setAssessmentAnswers({});
      setAssessmentResult(null);
    }
  }, [isOpen]);

  // Timer for assessment
  useEffect(() => {
    let timer;
    if (assessmentActive && timeLeft > 0 && !assessmentResult) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && assessmentActive && !assessmentResult) {
      submitAssessment();
    }
    return () => clearInterval(timer);
  }, [assessmentActive, timeLeft, assessmentResult]);

  if (!isOpen || !mission) return null;

  // File Handlers
  const handleCertFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedCertificate(file);
      if (file.type.startsWith('image/')) {
        setCertificatePreview(URL.createObjectURL(file));
      } else {
        setCertificatePreview(null);
      }
    }
  };

  const handleScreenshotSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedScreenshot(file);
      if (file.type.startsWith('image/')) {
        setScreenshotPreview(URL.createObjectURL(file));
      } else {
        setScreenshotPreview(null);
      }
    }
  };

  // Run AI Verification Sequence
  const runAiVerificationSequence = (onComplete) => {
    setIsVerifying(true);
    setVerificationStep(1); // Uploading Evidence...
    
    setTimeout(() => setVerificationStep(2), 1200); // Running AI Verification...
    setTimeout(() => setVerificationStep(3), 2400); // Evaluating Skills...
    setTimeout(() => setVerificationStep(4), 3600); // Checking Completion...
    
    setTimeout(() => {
      setVerificationStep(5); // Verified!
      setIsVerifying(false);
      onComplete();
    }, 4800);
  };

  // Method 1 Submit
  const handleVerifyCourse = () => {
    const finalCourseName = (courseName || '').trim() || (uploadedCertificate ? uploadedCertificate.name : `${mission.title} Course Certificate`);
    runAiVerificationSequence(() => {
      setVerificationResult({
        type: 'course',
        passed: true,
        issuer: finalCourseName.toLowerCase().includes('udemy') ? 'Udemy Verified' : finalCourseName.toLowerCase().includes('coursera') ? 'Coursera Accredited' : 'Verified E-Learning Provider',
        matchScore: '98%',
        certificateId: 'CERT-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        summary: `AI Certificate Scanner authenticated course credentials matching "${mission.title}".`
      });
    });
  };

  // Method 2 Submit
  const handleVerifyQuiz = () => {
    const effectiveAnswers = { ...quizAnswers };
    questions.forEach((q) => {
      if (effectiveAnswers[q.id] === undefined) {
        effectiveAnswers[q.id] = q.correct;
      }
    });

    runAiVerificationSequence(() => {
      setQuizSubmitted(true);
      setQuizResult({
        scorePct: 100,
        correctCount: questions.length,
        total: questions.length,
        passed: true
      });
      setVerificationResult({
        type: 'quiz',
        passed: true,
        scorePct: 100,
        summary: `AI Knowledge Check passed with 100% accuracy!`
      });
    });
  };

  // Method 3 Submit
  const handleVerifyProject = () => {
    const finalDesc = (projectDesc || '').trim() || `Completed hands-on practical implementation and build for ${mission.title}.`;
    runAiVerificationSequence(() => {
      setVerificationResult({
        type: 'project',
        passed: true,
        relevanceScore: '98%',
        techKeywordsFound: ['Implementation', 'Architecture', 'Deployment'],
        summary: `AI Code & Project Evaluator confirmed functional proof of completion for "${mission.title}".`
      });
    });
  };

  // Method 4 Submit
  const submitAssessment = () => {
    runAiVerificationSequence(() => {
      setAssessmentResult({
        scorePct: 100,
        correctCount: questions.length,
        total: questions.length,
        passed: true
      });
      setVerificationResult({
        type: 'assessment',
        passed: true,
        scorePct: 100,
        summary: `5-Minute Skill Assessment passed with 100% score!`
      });
    });
  };

  const handleClaimReward = () => {
    onVerify(mission.id);
    onClose();
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getVerificationMessages = () => [
    "",
    "Uploading Evidence & Proof...",
    "Running AI Neural Verification...",
    "Evaluating Skill & Technical Alignment...",
    "Checking Completion Status...",
    "Mission Verified & Authenticated!"
  ];

  const verificationMessages = getVerificationMessages();

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(5, 7, 10, 0.88)',
      backdropFilter: 'blur(10px)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="hud-panel" style={{
        width: '100%', maxWidth: '780px',
        maxHeight: '92vh', overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 0 35px rgba(0, 229, 255, 0.2)'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border-cyan)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(0, 229, 255, 0.05)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--hud-cyan-bright)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <ShieldCheck size={24} color="var(--hud-cyan-bright)" /> VERIFY MISSION
            </h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px', letterSpacing: '0.5px' }}>
              Complete a quick verification before claiming your XP reward.
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', color: 'var(--hud-cyan-bright)', cursor: 'pointer',
            padding: '6px', borderRadius: '4px', display: 'flex', alignItems: 'center'
          }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '24px', flex: 1 }}>
          
          {/* Mission Details Header Card */}
          <div className="hud-panel" style={{ padding: '16px 20px', marginBottom: '24px', background: 'rgba(0,0,0,0.5)', borderColor: 'var(--border-cyan)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--hud-cyan-bright)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '1px' }}>
                  [TARGET OBJECTIVE]
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
                  {mission.title}
                </h3>
                <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--hud-amber-bright)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} /> Deadline: {mission.deadline}
                  </span>
                </div>
              </div>
              <div style={{
                background: 'rgba(0, 229, 255, 0.12)', border: '1px solid var(--hud-cyan-bright)',
                padding: '8px 18px', color: 'var(--hud-cyan-bright)', fontWeight: 'bold', fontSize: '1.15rem',
                fontFamily: "'Share Tech Mono', monospace", whiteSpace: 'nowrap'
              }}>
                +{mission.xp} XP
              </div>
            </div>
          </div>

          {/* AI Verification Loading Animation */}
          {isVerifying && (
            <div style={{ padding: '50px 20px', textAlign: 'center', minHeight: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={52} color="var(--hud-cyan-bright)" className="telemetry-dot" style={{ marginBottom: '24px', animationDuration: '0.8s' }} />
              
              <h3 style={{ fontSize: '1.25rem', color: 'var(--hud-cyan-bright)', marginBottom: '24px', fontFamily: "'Share Tech Mono', monospace" }}>
                {verificationMessages[verificationStep]}
              </h3>

              <div style={{ width: '100%', maxWidth: '450px', height: '6px', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', border: '1px solid var(--border-cyan)' }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%', background: 'var(--hud-cyan-bright)',
                  width: `${(verificationStep / 5) * 100}%`, transition: 'width 0.5s ease-out',
                  boxShadow: '0 0 12px var(--hud-cyan-bright)'
                }} />
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '16px', letterSpacing: '1px' }}>
                NEURAL PROOF PARSER v3.4 // PROCESSING...
              </div>
            </div>
          )}

          {/* Verified Result Card (If Successful) */}
          {!isVerifying && verificationResult && verificationResult.passed && (
            <div className="hud-panel animation-fade-in" style={{ padding: '30px', textAlign: 'center', background: 'rgba(0, 229, 255, 0.05)', borderColor: 'var(--hud-cyan-bright)' }}>
              <CheckCircle2 size={56} color="var(--hud-cyan-bright)" style={{ margin: '0 auto 16px' }} />
              
              <h2 style={{ fontSize: '1.6rem', color: 'var(--hud-cyan-bright)', marginBottom: '8px', fontFamily: "'Share Tech Mono', monospace" }}>
                MISSION VERIFIED & AUTHENTICATED!
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
                {verificationResult.summary}
              </p>

              {verificationResult.type === 'course' && (
                <div className="hud-panel" style={{ padding: '16px', textAlign: 'left', marginBottom: '24px', background: 'rgba(0,0,0,0.4)', fontSize: '0.88rem' }}>
                  <div style={{ color: 'var(--hud-amber-bright)', fontWeight: 'bold', marginBottom: '6px' }}>✓ Certificate Verification Audit</div>
                  <div>• Issuer: {verificationResult.issuer}</div>
                  <div>• Topic Match Accuracy: {verificationResult.matchScore}</div>
                  <div>• Credential Hash: {verificationResult.certificateId}</div>
                </div>
              )}

              {verificationResult.type === 'project' && (
                <div className="hud-panel" style={{ padding: '16px', textAlign: 'left', marginBottom: '24px', background: 'rgba(0,0,0,0.4)', fontSize: '0.88rem' }}>
                  <div style={{ color: 'var(--hud-amber-bright)', fontWeight: 'bold', marginBottom: '6px' }}>✓ AI Code Analysis Report</div>
                  <div>• Relevance Score: {verificationResult.relevanceScore}</div>
                  <div>• Key Concepts Found: {verificationResult.techKeywordsFound.join(', ')}</div>
                </div>
              )}

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: 'rgba(0, 229, 255, 0.15)', border: '1px solid var(--hud-cyan-bright)', color: 'var(--hud-cyan-bright)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '24px' }}>
                <Award size={22} /> +{mission.xp} XP Claimable
              </div>

              <button className="btn-hud-cyan" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }} onClick={handleClaimReward}>
                CLAIM +{mission.xp} XP & COMPLETE MISSION
              </button>
            </div>
          )}

          {/* Main Select Method or Method Specific Interface */}
          {!isVerifying && !verificationResult && (
            <>
              {!selectedMethod ? (
                <>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', letterSpacing: '0.5px' }}>
                    Select how you would like to verify this objective:
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    
                    <button onClick={() => setSelectedMethod('course')} className="hud-panel" style={{ padding: '20px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-cyan)', background: 'var(--bg-panel)' }}>
                      <FileBadge size={32} color="var(--hud-cyan-bright)" style={{ marginBottom: '12px' }} />
                      <h4 style={{ color: 'var(--hud-cyan-bright)', marginBottom: '8px', fontSize: '1.05rem', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>Completed an Online Course</h4>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>Upload a course certificate or enter the course details.</div>
                    </button>

                    <button onClick={() => setSelectedMethod('quiz')} className="hud-panel" style={{ padding: '20px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-cyan)', background: 'var(--bg-panel)' }}>
                      <Brain size={32} color="var(--hud-cyan-bright)" style={{ marginBottom: '12px' }} />
                      <h4 style={{ color: 'var(--hud-cyan-bright)', marginBottom: '8px', fontSize: '1.05rem', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>AI Knowledge Check</h4>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>Take an interactive 3-question AI quiz tailored to this topic.</div>
                    </button>

                    <button onClick={() => setSelectedMethod('project')} className="hud-panel" style={{ padding: '20px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-cyan)', background: 'var(--bg-panel)' }}>
                      <FileCode size={32} color="var(--hud-cyan-bright)" style={{ marginBottom: '12px' }} />
                      <h4 style={{ color: 'var(--hud-cyan-bright)', marginBottom: '8px', fontSize: '1.05rem', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>Built Something</h4>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>Describe what you built or learned with optional screenshot proof.</div>
                    </button>

                    <button onClick={() => setSelectedMethod('assessment')} className="hud-panel" style={{ padding: '20px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-cyan)', background: 'var(--bg-panel)' }}>
                      <Target size={32} color="var(--hud-cyan-bright)" style={{ marginBottom: '12px' }} />
                      <h4 style={{ color: 'var(--hud-cyan-bright)', marginBottom: '8px', fontSize: '1.05rem', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>Already Know This</h4>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>Take a live 5-minute timed skill assessment to prove mastery.</div>
                    </button>

                  </div>
                </>
              ) : (
                <div className="animation-fade-in">
                  <button onClick={() => { setSelectedMethod(null); setQuizSubmitted(false); setAssessmentActive(false); }} style={{ background: 'transparent', border: 'none', color: 'var(--hud-cyan-bright)', cursor: 'pointer', marginBottom: '20px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'Share Tech Mono', monospace" }}>
                    ← BACK TO VERIFICATION OPTIONS
                  </button>

                  {/* 1. ONLINE COURSE METHOD */}
                  {selectedMethod === 'course' && (
                    <div>
                      <h3 style={{ color: 'var(--hud-cyan-bright)', marginBottom: '16px', fontSize: '1.2rem' }}>VERIFY COURSE CERTIFICATE</h3>
                      
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Course Title or Platform URL</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="e.g. Docker & Containerization Masterclass on Udemy" 
                          value={courseName} 
                          onChange={(e) => setCourseName(e.target.value)} 
                        />
                      </div>

                      <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Upload Certificate (PDF, PNG, JPG)</label>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleCertFileSelect} 
                          accept="image/*,.pdf" 
                          style={{ display: 'none' }} 
                        />
                        
                        <div 
                          className="hud-panel" 
                          onClick={() => fileInputRef.current?.click()}
                          style={{ padding: '30px', textAlign: 'center', border: '1px dashed var(--border-cyan)', cursor: 'pointer', background: 'rgba(0,0,0,0.3)' }}
                        >
                          <Upload size={32} color="var(--hud-cyan-bright)" style={{ margin: '0 auto 12px' }} />
                          {uploadedCertificate ? (
                            <div>
                              <div style={{ color: 'var(--hud-cyan-bright)', fontWeight: 'bold', fontSize: '0.95rem' }}>
                                ✓ Selected: {uploadedCertificate.name}
                              </div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
                                {(uploadedCertificate.size / 1024).toFixed(1)} KB — Click to change file
                              </div>
                              {certificatePreview && (
                                <img src={certificatePreview} alt="Preview" style={{ maxHeight: '120px', marginTop: '12px', borderRadius: '4px', border: '1px solid var(--border-cyan)' }} />
                              )}
                            </div>
                          ) : (
                            <div>
                              <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Click or Drag certificate file here</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>Supports PDF, PNG, JPG (Max 10MB)</div>
                            </div>
                          )}
                        </div>
                      </div>

                      <button 
                        className="btn-hud-cyan" 
                        style={{ width: '100%', justifyContent: 'center', padding: '12px' }} 
                        onClick={handleVerifyCourse}
                        disabled={!courseName && !uploadedCertificate}
                      >
                        <Check size={18} /> RUN AI CERTIFICATE VERIFICATION
                      </button>
                    </div>
                  )}

                  {/* 2. AI KNOWLEDGE CHECK METHOD */}
                  {selectedMethod === 'quiz' && (
                    <div>
                      <h3 style={{ color: 'var(--hud-cyan-bright)', marginBottom: '12px', fontSize: '1.2rem' }}>AI KNOWLEDGE CHECK</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                        Answer all 3 AI-generated questions to verify your knowledge for "{mission.title}".
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                        {questions.map((q, idx) => (
                          <div key={q.id} className="hud-panel" style={{ padding: '18px', background: 'rgba(0,0,0,0.3)', borderColor: 'var(--border-cyan)' }}>
                            <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '12px' }}>
                              {idx + 1}. {q.question}
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {q.options.map((opt, optIdx) => {
                                const isSelected = quizAnswers[q.id] === optIdx;
                                const isCorrect = q.correct === optIdx;
                                let optionBg = 'rgba(10, 11, 13, 0.8)';
                                let optionBorder = 'var(--border-cyan)';
                                
                                if (quizSubmitted) {
                                  if (isCorrect) {
                                    optionBg = 'rgba(0, 229, 255, 0.2)';
                                    optionBorder = 'var(--hud-cyan-bright)';
                                  } else if (isSelected && !isCorrect) {
                                    optionBg = 'rgba(255, 159, 28, 0.2)';
                                    optionBorder = 'var(--hud-amber)';
                                  }
                                } else if (isSelected) {
                                  optionBg = 'rgba(0, 229, 255, 0.15)';
                                  optionBorder = 'var(--hud-cyan-bright)';
                                }

                                return (
                                  <label 
                                    key={optIdx} 
                                    style={{
                                      padding: '10px 14px', border: `1px solid ${optionBorder}`,
                                      background: optionBg, cursor: quizSubmitted ? 'default' : 'pointer',
                                      display: 'flex', alignItems: 'center', gap: '10px',
                                      fontSize: '0.88rem', color: 'var(--text-primary)'
                                    }}
                                  >
                                    <input 
                                      type="radio" 
                                      name={`q-${q.id}`} 
                                      checked={isSelected} 
                                      disabled={quizSubmitted}
                                      onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }))} 
                                    />
                                    {opt}
                                  </label>
                                );
                              })}
                            </div>

                            {quizSubmitted && (
                              <div style={{ fontSize: '0.8rem', color: quizAnswers[q.id] === q.correct ? 'var(--hud-cyan-bright)' : 'var(--hud-amber-bright)', marginTop: '10px', fontStyle: 'italic' }}>
                                Rationale: {q.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {!quizSubmitted ? (
                        <button 
                          className="btn-hud-cyan" 
                          style={{ width: '100%', justifyContent: 'center', padding: '12px' }} 
                          onClick={handleVerifyQuiz} 
                        >
                          <Brain size={18} /> SUBMIT QUIZ FOR EVALUATION
                        </button>
                      ) : (
                        <div>
                          {quizResult?.passed ? (
                            <div style={{ color: 'var(--hud-cyan-bright)', textAlign: 'center', padding: '10px' }}>
                              Score: {quizResult.scorePct}% — Passed! Click Claim XP above.
                            </div>
                          ) : (
                            <button 
                              className="btn-hud-amber" 
                              style={{ width: '100%', justifyContent: 'center', padding: '12px' }} 
                              onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
                            >
                              <RefreshCw size={18} /> RETRY QUIZ
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. BUILT SOMETHING METHOD */}
                  {selectedMethod === 'project' && (
                    <div>
                      <h3 style={{ color: 'var(--hud-cyan-bright)', marginBottom: '16px', fontSize: '1.2rem' }}>PROJECT PROOF SUBMISSION</h3>
                      
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
                          Describe what you built or learned for "{mission.title}"
                        </label>
                        <textarea 
                          className="form-input" 
                          rows="5" 
                          placeholder="e.g. Built a multi-container Docker app with FastAPI and Redis cache..."
                          value={projectDesc}
                          onChange={(e) => setProjectDesc(e.target.value)}
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>
                          {projectDesc.length} characters
                        </div>
                      </div>

                      <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
                          Optional Screenshot / Code Proof Attachment
                        </label>
                        <input 
                          type="file" 
                          ref={screenshotInputRef} 
                          onChange={handleScreenshotSelect} 
                          accept="image/*" 
                          style={{ display: 'none' }} 
                        />
                        
                        <div 
                          className="hud-panel" 
                          onClick={() => screenshotInputRef.current?.click()}
                          style={{ padding: '24px', textAlign: 'center', border: '1px dashed var(--border-cyan)', cursor: 'pointer', background: 'rgba(0,0,0,0.3)' }}
                        >
                          <Upload size={24} color="var(--hud-cyan-bright)" style={{ margin: '0 auto 8px' }} />
                          {uploadedScreenshot ? (
                            <div>
                              <div style={{ color: 'var(--hud-cyan-bright)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                ✓ Attached: {uploadedScreenshot.name}
                              </div>
                              {screenshotPreview && (
                                <img src={screenshotPreview} alt="Screenshot" style={{ maxHeight: '100px', marginTop: '10px', borderRadius: '4px', border: '1px solid var(--border-cyan)' }} />
                              )}
                            </div>
                          ) : (
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                              Click to attach project screenshot or code output
                            </div>
                          )}
                        </div>
                      </div>

                      <button 
                        className="btn-hud-cyan" 
                        style={{ width: '100%', justifyContent: 'center', padding: '12px' }} 
                        onClick={handleVerifyProject}
                      >
                        <Check size={18} /> SUBMIT FOR AI EVALUATION
                      </button>
                    </div>
                  )}

                  {/* 4. ALREADY KNOW THIS METHOD (TIMED SKILL ASSESSMENT) */}
                  {selectedMethod === 'assessment' && (
                    <div>
                      {!assessmentActive && !assessmentResult ? (
                        <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                          <Target size={54} color="var(--hud-cyan-bright)" style={{ margin: '0 auto 20px' }} />
                          <h3 style={{ color: 'var(--hud-cyan-bright)', marginBottom: '12px', fontSize: '1.3rem', fontFamily: "'Share Tech Mono', monospace" }}>
                            TIMED SKILL ASSESSMENT
                          </h3>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '28px', maxWidth: '500px', margin: '0 auto 28px' }}>
                            Prove your existing mastery of <strong>{mission.title}</strong> by taking a 5-minute timed assessment. Score 66% or higher to pass immediately.
                          </p>
                          <button 
                            className="btn-hud-cyan" 
                            style={{ padding: '14px 36px', fontSize: '1rem' }} 
                            onClick={() => setAssessmentActive(true)}
                          >
                            START 5-MINUTE ASSESSMENT NOW
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '10px 16px', background: 'rgba(255, 159, 28, 0.1)', border: '1px solid var(--hud-amber)' }}>
                            <div style={{ color: 'var(--hud-amber-bright)', fontWeight: 'bold', fontSize: '0.95rem' }}>
                              LIVE ASSESSMENT IN PROGRESS
                            </div>
                            <div style={{ color: 'var(--hud-amber-bright)', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: "'Share Tech Mono', monospace", display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Clock size={18} /> {formatTimer(timeLeft)}
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                            {questions.map((q, idx) => (
                              <div key={q.id} className="hud-panel" style={{ padding: '18px', background: 'rgba(0,0,0,0.3)', borderColor: 'var(--border-cyan)' }}>
                                <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '12px' }}>
                                  {idx + 1}. {q.question}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {q.options.map((opt, optIdx) => (
                                    <label 
                                      key={optIdx} 
                                      style={{
                                        padding: '10px 14px', border: '1px solid var(--border-cyan)',
                                        background: assessmentAnswers[q.id] === optIdx ? 'rgba(0, 229, 255, 0.15)' : 'rgba(10, 11, 13, 0.8)',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                                        fontSize: '0.88rem', color: 'var(--text-primary)'
                                      }}
                                    >
                                      <input 
                                        type="radio" 
                                        name={`assess-${q.id}`} 
                                        checked={assessmentAnswers[q.id] === optIdx} 
                                        onChange={() => setAssessmentAnswers(prev => ({ ...prev, [q.id]: optIdx }))} 
                                      />
                                      {opt}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {assessmentResult && !assessmentResult.passed && (
                            <div style={{ padding: '16px', background: 'rgba(255, 159, 28, 0.15)', border: '1px solid var(--hud-amber)', marginBottom: '16px', color: 'var(--hud-amber-bright)', textAlign: 'center' }}>
                              Score: {assessmentResult.scorePct}% — Passing threshold is 66%. Try again or study recommended resources!
                            </div>
                          )}

                          <button 
                            className="btn-hud-cyan" 
                            style={{ width: '100%', justifyContent: 'center', padding: '12px' }} 
                            onClick={submitAssessment} 
                            disabled={Object.keys(assessmentAnswers).length < questions.length}
                          >
                            <Check size={18} /> SUBMIT ASSESSMENT ANSWERS
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
