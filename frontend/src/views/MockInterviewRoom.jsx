import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, Volume2, VolumeX, MessageSquare, 
  Square, Play, RefreshCw, X, ShieldAlert, Sparkles, CheckCircle2, ChevronRight, AlertTriangle
} from 'lucide-react';
import { saveInterviewSession } from '../services/supabase';
import { saveUserAnalysis } from '../services/analysisEngine';

// Phase names for 7-step technical interview flow
const PHASES = [
  { id: 1, name: 'Introduction', label: 'Candidate Introduction & Setup' },
  { id: 2, name: 'Resume Architecture', label: 'Resume & Project Walkthrough' },
  { id: 3, name: 'Technical Fundamentals', label: 'Core Technical Assessment' },
  { id: 4, name: 'Problem Solving', label: 'Practical Problem Solving' },
  { id: 5, name: 'System Architecture', label: 'System Design & Scalability' },
  { id: 6, name: 'Skill Gap Deep Dive', label: 'Targeted Skill Gap Analysis' },
  { id: 7, name: 'Behavioral & Wrap Up', label: 'Leadership & Final Questions' }
];

export default function MockInterviewRoom({ userData = {}, onUpdateUserData }) {
  // Candidate Profile Context
  const fullName = userData.profile?.fullName || 'Candidate';
  const firstName = fullName.split(' ')[0] || 'Candidate';
  const targetRole = userData.selectedGoal || userData.profile?.preferredCareer || 'AI / Software Engineer';
  const githubRepos = userData.githubRepos || [];
  const topRepo = githubRepos.length > 0 ? (githubRepos[0]?.name || githubRepos[0]?.title) : 'SkillSync AI Platform';
  const missingSkills = userData.skill_gap_summary?.missing_skills || userData.skillGap?.missing_skills || ['System Design', 'SQL Optimization', 'Distributed Caching'];

  // Media Permissions & Stream State
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [showTranscript, setShowTranscript] = useState(true);
  const [hasCameraAccess, setHasCameraAccess] = useState(false);

  // Countdown & Room State
  const [countdown, setCountdown] = useState(3);
  const [isRoomStarted, setIsRoomStarted] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // AI & Interview Phase State
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [aiState, setAiState] = useState('THINKING'); // 'SPEAKING' | 'LISTENING' | 'THINKING'
  const [currentAiQuestion, setCurrentAiQuestion] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [candidateInputText, setCandidateInputText] = useState('');

  // Speech Recognition & Synthesis Refs
  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const isListeningRef = useRef(false);

  // Evaluation Metrics State
  const [evalScores, setEvalScores] = useState({
    technical: 78,
    problemSolving: 80,
    communication: 75,
    projectKnowledge: 85,
    confidence: 72
  });

  // ----------------------------------------------------
  // 1. Media Stream Setup (Webcam / Mic)
  // ----------------------------------------------------
  useEffect(() => {
    let activeStream = null;

    async function initMedia() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          activeStream = s;
          setStream(s);
          setHasCameraAccess(true);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        }
      } catch (err) {
        console.warn("Camera/Mic access unavailable or denied. Using high-tech fallback card:", err);
        setHasCameraAccess(false);
      }
    }

    initMedia();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Update video element on stream change
  useEffect(() => {
    if (videoRef.current && stream && cameraEnabled) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, cameraEnabled]);

  // Toggle Video Tracks
  const toggleCamera = () => {
    if (stream) {
      const vTracks = stream.getVideoTracks();
      vTracks.forEach(t => (t.enabled = !cameraEnabled));
    }
    setCameraEnabled(!cameraEnabled);
  };

  // Toggle Mic Tracks
  const toggleMic = () => {
    if (stream) {
      const aTracks = stream.getAudioTracks();
      aTracks.forEach(t => (t.enabled = !micEnabled));
    }
    setMicEnabled(!micEnabled);
  };

  // ----------------------------------------------------
  // 2. Countdown & Timer
  // ----------------------------------------------------
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !isRoomStarted) {
      setIsRoomStarted(true);
      startInterviewFlow();
    }
    return () => clearInterval(timer);
  }, [countdown, isRoomStarted]);

  useEffect(() => {
    let interval;
    if (isRoomStarted) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRoomStarted]);

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ----------------------------------------------------
  // 3. Question Generation Engine (Personalized Context)
  // ----------------------------------------------------
  const generatePersonalizedQuestion = (phaseIdx, userResponse = '') => {
    const lowerResp = userResponse.toLowerCase();

    // Check for user asking to repeat
    if (lowerResp.includes('repeat') || lowerResp.includes('pardon') || lowerResp.includes('again')) {
      return `Of course! I asked: ${currentAiQuestion}`;
    }

    // Phase 1: Introduction
    if (phaseIdx === 0) {
      return `Hello ${firstName}! Welcome to your SkillSync AI technical interview for the ${targetRole} position. I have reviewed your profile and resume. We'll proceed through technical, architectural, and problem-solving rounds. Are you ready to begin?`;
    }

    // Phase 2: Resume & Project Architecture
    if (phaseIdx === 1) {
      return `Great! I noticed on your profile that you worked on '${topRepo}'. Walk me through the high-level architecture of this project and explain how you handled backend scalability or data flow.`;
    }

    // Phase 3: Technical Fundamentals
    if (phaseIdx === 2) {
      if (targetRole.toLowerCase().includes('ai') || targetRole.toLowerCase().includes('machine learning')) {
        return `Excellent explanation. Let's move into ML fundamentals: Can you explain how you prevent overfitting in a complex machine learning model, and when you would prefer L1 over L2 regularization?`;
      }
      return `Very clear. Let's delve into technical fundamentals: Explain the difference between process-based and thread-based concurrency, and how event loops like Node.js or Python's AsyncIO handle asynchronous I/O operations without blocking.`;
    }

    // Phase 4: Problem Solving
    if (phaseIdx === 3) {
      return `Suppose your production system receives a sudden 10x spike in concurrent API requests, causing database latency to jump from 50ms to 4000ms. What is your step-by-step diagnostic and mitigation strategy?`;
    }

    // Phase 5: System Architecture
    if (phaseIdx === 4) {
      const gapTech = missingSkills[0] || 'System Design';
      return `Now let's test system design and architecture. How would you design a fault-tolerant, high-throughput caching layer using Redis and PostgreSQL to prevent cache stampedes (thundering herd problem)?`;
    }

    // Phase 6: Skill Gap Deep Dive
    if (phaseIdx === 5) {
      const gapSkill = missingSkills[1] || missingSkills[0] || 'SQL Indexing';
      return `According to your SkillSync AI skill-gap telemetry, '${gapSkill}' is an area marked for growth. Explain how you would optimize slow relational SQL queries using B-Tree indexing and query execution plan analysis.`;
    }

    // Phase 7: Behavioral & Final Question
    if (phaseIdx === 6) {
      return `Final question: Describe a scenario where you disagreed with a technical design decision or faced a critical production bug right before deployment. How did you resolve it and what did you learn?`;
    }

    return `Thank you for those detailed responses! That concludes all technical assessment phases. Click 'END INTERVIEW' below to view your full performance analysis report.`;
  };

  // ----------------------------------------------------
  // 4. Voice Speech Synthesis & Recognition
  // ----------------------------------------------------
  const speakText = (text) => {
    if (!speakerEnabled || typeof window === 'undefined') return;

    if (synthRef.current) {
      synthRef.current.cancel(); // Stop any active audio
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select natural English voice if available
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => {
        setAiState('SPEAKING');
      };

      utterance.onend = () => {
        setAiState('LISTENING');
        startSpeechRecognition();
      };

      utterance.onerror = () => {
        setAiState('LISTENING');
        startSpeechRecognition();
      };

      synthRef.current.speak(utterance);
    } else {
      // Fallback timing if TTS unavailable
      setAiState('SPEAKING');
      setTimeout(() => {
        setAiState('LISTENING');
        startSpeechRecognition();
      }, 3500);
    }
  };

  // Web Speech Recognition
  const startSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Web SpeechRecognition API not supported in browser. User can type input.");
      return;
    }

    if (isListeningRef.current && recognitionRef.current) {
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        isListeningRef.current = true;
      };

      recognition.onresult = (event) => {
        let transcriptText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcriptText += event.results[i][0].transcript;
        }
        setCandidateInputText(transcriptText);
      };

      recognition.onerror = (err) => {
        console.warn("Speech recognition error:", err);
        isListeningRef.current = false;
      };

      recognition.onend = () => {
        isListeningRef.current = false;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Failed to start speech recognition:", e);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      isListeningRef.current = false;
    }
  };

  // ----------------------------------------------------
  // 5. Core Interview Progression Handler
  // ----------------------------------------------------
  const startInterviewFlow = () => {
    const q1 = generatePersonalizedQuestion(0);
    setCurrentAiQuestion(q1);
    addTranscriptItem('ai', q1);
    speakText(q1);
  };

  const addTranscriptItem = (sender, text) => {
    setTranscript(prev => [...prev, {
      id: Date.now() + Math.random(),
      sender, // 'ai' | 'user'
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }]);
  };

  const handleAnswerSubmit = (candidateAnswerText) => {
    const answer = candidateAnswerText || candidateInputText;
    if (!answer.trim() || aiState === 'THINKING') return;

    stopSpeechRecognition();
    if (synthRef.current) synthRef.current.cancel();

    // 1. Append Candidate Answer to Transcript
    addTranscriptItem('user', answer);
    setCandidateInputText('');
    setAiState('THINKING');

    // 2. Adjust internal real-time evaluation scores based on response length & quality
    const answerLen = answer.length;
    setEvalScores(prev => ({
      technical: Math.min(98, Math.max(65, prev.technical + (answerLen > 80 ? 2 : -1))),
      problemSolving: Math.min(96, Math.max(60, prev.problemSolving + (answerLen > 100 ? 3 : 0))),
      communication: Math.min(95, Math.max(60, prev.communication + (answerLen > 40 ? 2 : -2))),
      projectKnowledge: Math.min(99, Math.max(70, prev.projectKnowledge + 1)),
      confidence: Math.min(95, Math.max(60, prev.confidence + (answerLen > 50 ? 2 : -1)))
    }));

    // 3. Transition to next Phase after small thinking delay
    setTimeout(() => {
      let nextPhaseIdx = currentPhaseIndex + 1;
      if (nextPhaseIdx >= PHASES.length) {
        nextPhaseIdx = PHASES.length - 1;
      }
      setCurrentPhaseIndex(nextPhaseIdx);

      const nextQuestion = generatePersonalizedQuestion(nextPhaseIdx, answer);
      setCurrentAiQuestion(nextQuestion);
      addTranscriptItem('ai', nextQuestion);
      speakText(nextQuestion);
    }, 1400);
  };

  // ----------------------------------------------------
  // 6. Complete Interview & Navigate to Results
  // ----------------------------------------------------
  const handleConfirmEndInterview = async () => {
    setShowEndModal(false);

    // Compute final overall weighted score
    const overall = Math.round(
      (evalScores.technical * 0.3) +
      (evalScores.problemSolving * 0.25) +
      (evalScores.communication * 0.15) +
      (evalScores.projectKnowledge * 0.15) +
      (evalScores.confidence * 0.15)
    );

    const sessionData = {
      interviewId: `int_${Date.now()}`,
      targetRole,
      startTime: new Date(Date.now() - timerSeconds * 1000).toISOString(),
      endTime: new Date().toISOString(),
      questions: PHASES.map((p, idx) => ({ phase: p.name, question: generatePersonalizedQuestion(idx) })),
      answers: transcript.filter(t => t.sender === 'user').map(t => t.text),
      transcript,
      technicalScore: evalScores.technical,
      problemSolvingScore: evalScores.problemSolving,
      communicationScore: evalScores.communication,
      projectScore: evalScores.projectKnowledge,
      confidenceScore: evalScores.confidence,
      overallScore: overall,
      strengths: [
        `Strong grasp of ${targetRole} technical concepts and workflow logic`,
        `Solid communication and step-by-step problem breakdown`,
        `Good architectural understanding of project '${topRepo}'`
      ],
      weaknesses: [
        `System design scaling under high-concurrency burst loads (${missingSkills[0] || 'System Architecture'})`,
        `Relational SQL query index tuning and execution plan analysis (${missingSkills[1] || 'SQL Optimization'})`
      ],
      recommendations: [
        `Complete the 3-part System Design & Redis Caching masterclass in Roadmap`,
        `Solve 5 LeetCode SQL & Database Indexing challenges`,
        `Practice STAR-method answer structure for high-pressure system interviews`
      ]
    };

    // Save to local storage
    const updatedUserData = {
      ...userData,
      lastInterviewSession: sessionData,
      // Update Skill gap state to reflect interview discoveries
      skill_gap_summary: {
        ...(userData.skill_gap_summary || {}),
        missing_skills: Array.from(new Set([...missingSkills, 'System Architecture', 'SQL Indexing'])),
        last_interview_score: overall
      }
    };

    if (onUpdateUserData) {
      onUpdateUserData(updatedUserData);
    } else {
      saveUserAnalysis(updatedUserData);
    }

    // Persist to Supabase
    await saveInterviewSession(sessionData);

    // Redirect to results page
    window.location.pathname = '/mock-interview/results';
  };

  // Progress Percentage calculation
  const progressPercent = Math.min(100, Math.round(((currentPhaseIndex + 1) / PHASES.length) * 100));

  // ----------------------------------------------------
  // 7. Render UI
  // ----------------------------------------------------
  return (
    <div style={{
      minHeight: '100vh',
      background: '#06080C',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      fontFamily: "'Share Tech Mono', monospace",
      overflow: 'hidden'
    }}>
      
      {/* Background Cyber Grid */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(0, 229, 255, 0.08) 0%, transparent 70%), repeating-linear-gradient(90deg, rgba(0, 229, 255, 0.02) 0, rgba(0, 229, 255, 0.02) 1px, transparent 1px, transparent 40px)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* TOP BAR */}
      <header style={{
        height: '64px',
        borderBottom: '1px solid rgba(0, 229, 255, 0.25)',
        background: 'rgba(10, 14, 23, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Brand & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '6px',
              background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.2) 0%, rgba(0, 229, 255, 0.05) 100%)',
              border: '1px solid #00E5FF', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Sparkles size={18} color="#00E5FF" />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00E5FF', letterSpacing: '1px' }}>
              SKILLSYNC <span style={{ color: '#FF9F1C' }}>AI</span>
            </span>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'rgba(0, 229, 255, 0.2)' }} />
          <div style={{ fontSize: '0.9rem', color: '#cbd5e1', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#00E5FF' }}>✦</span> AI TECHNICAL INTERVIEW
          </div>
        </div>

        {/* Status, Timer, Demo Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            padding: '4px 10px', borderRadius: '4px',
            background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.4)',
            color: '#00E5FF', fontSize: '0.75rem', letterSpacing: '1px'
          }}>
            DEMO INTERVIEW MODE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '20px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981', animation: 'pulse 1.5s infinite' }} />
            <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700 }}>LIVE</span>
          </div>

          <div style={{ fontSize: '1rem', color: '#00E5FF', fontWeight: 700, letterSpacing: '2px', background: 'rgba(0,0,0,0.5)', padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(0,229,255,0.3)' }}>
            ⏱ {formatTimer(timerSeconds)}
          </div>

          <button
            onClick={() => setShowEndModal(true)}
            style={{
              padding: '8px 16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.5)',
              color: '#EF4444', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
          >
            <X size={16} /> EXIT INTERVIEW
          </button>
        </div>
      </header>

      {/* PROGRESS TRACKER BAR */}
      <div style={{
        background: 'rgba(13, 17, 26, 0.9)',
        borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 9
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, maxWidth: '600px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', minWidth: '150px' }}>
            INTERVIEW PROGRESS
          </span>
          <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(0,229,255,0.2)' }}>
            <div style={{
              width: `${progressPercent}%`, height: '100%',
              background: 'linear-gradient(90deg, #00E5FF 0%, #FF9F1C 100%)',
              boxShadow: '0 0 12px #00E5FF', transition: 'width 0.4s ease'
            }} />
          </div>
          <span style={{ fontSize: '0.85rem', color: '#00E5FF', fontWeight: 700, minWidth: '45px' }}>
            {progressPercent}%
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>ROUND {currentPhaseIndex + 1}/7:</span>
          <span style={{
            fontSize: '0.85rem', color: '#FF9F1C', background: 'rgba(255, 159, 28, 0.15)',
            border: '1px solid rgba(255, 159, 28, 0.4)', padding: '4px 12px', borderRadius: '4px', fontWeight: 700
          }}>
            {PHASES[currentPhaseIndex].name}
          </span>
        </div>
      </div>

      {/* MAIN BODY AREA */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', zIndex: 1, overflow: 'hidden' }}>

        {/* INTERVIEWER CENTER STAGE */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', position: 'relative' }}>
          
          {/* AI INTERVIEWER AVATAR WITH RADAR WAVEFORM RING */}
          <div style={{ position: 'relative', width: '260px', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Outer Rotating Radar Audio Waveform Rings */}
            <div style={{
              position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
              border: `2px dashed ${aiState === 'SPEAKING' ? '#00E5FF' : aiState === 'LISTENING' ? '#FF9F1C' : 'rgba(0, 229, 255, 0.3)'}`,
              boxShadow: aiState === 'SPEAKING' ? '0 0 30px rgba(0, 229, 255, 0.4)' : aiState === 'LISTENING' ? '0 0 30px rgba(255, 159, 28, 0.4)' : 'none',
              animation: aiState === 'SPEAKING' ? 'spin 6s linear infinite' : 'spin 12s linear infinite',
              transition: 'all 0.3s ease'
            }} />

            <div style={{
              position: 'absolute', width: '82%', height: '82%', borderRadius: '50%',
              border: `1px solid ${aiState === 'SPEAKING' ? 'rgba(0, 229, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)'}`,
              animation: aiState === 'SPEAKING' ? 'pulse 2s infinite' : 'none'
            }} />

            {/* AI Avatar Central Core */}
            <div style={{
              width: '180px', height: '180px', borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #0d1726 0%, #050a12 100%)',
              border: `2px solid ${aiState === 'SPEAKING' ? '#00E5FF' : aiState === 'LISTENING' ? '#FF9F1C' : 'rgba(0, 229, 255, 0.4)'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px rgba(0, 229, 255, 0.25)', position: 'relative', zIndex: 2
            }}>
              <Sparkles size={48} color={aiState === 'SPEAKING' ? '#00E5FF' : aiState === 'LISTENING' ? '#FF9F1C' : '#94a3b8'} />
              <span style={{ marginTop: '10px', fontSize: '0.75rem', color: '#00E5FF', letterSpacing: '2px', fontWeight: 800 }}>
                SKILLSYNC AI
              </span>
            </div>
          </div>

          {/* AI STATUS BADGE INDICATOR */}
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{
              padding: '8px 20px', borderRadius: '20px',
              background: aiState === 'SPEAKING' ? 'rgba(0, 229, 255, 0.15)' : aiState === 'LISTENING' ? 'rgba(255, 159, 28, 0.15)' : 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${aiState === 'SPEAKING' ? '#00E5FF' : aiState === 'LISTENING' ? '#FF9F1C' : 'rgba(255,255,255,0.2)'}`,
              color: aiState === 'SPEAKING' ? '#00E5FF' : aiState === 'LISTENING' ? '#FF9F1C' : '#cbd5e1',
              fontSize: '0.9rem', fontWeight: 800, letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              {aiState === 'SPEAKING' && <span style={{ color: '#00E5FF' }}>● AI IS SPEAKING</span>}
              {aiState === 'LISTENING' && <span style={{ color: '#FF9F1C' }}>◉ LISTENING TO CANDIDATE</span>}
              {aiState === 'THINKING' && <span style={{ color: '#cbd5e1' }}>◌ ANALYZING RESPONSE</span>}
            </div>
          </div>

          {/* CURRENT QUESTION DISPLAY CARD */}
          <div className="hud-panel" style={{
            marginTop: '28px', maxWidth: '780px', width: '100%', padding: '24px',
            borderRadius: '12px', background: 'rgba(13, 17, 26, 0.95)', border: '1px solid rgba(0, 229, 255, 0.4)',
            boxShadow: '0 0 30px rgba(0, 229, 255, 0.15)', textAlign: 'center', minHeight: '120px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '2px', marginBottom: '8px' }}>
              AI INTERVIEW QUESTION:
            </span>
            <p style={{ fontSize: '1.1rem', color: '#ffffff', lineHeight: '1.6', margin: 0, fontFamily: 'inherit' }}>
              "{currentAiQuestion || 'Initializing SkillSync AI technical interview engine...'}"
            </p>
          </div>

          {/* CANDIDATE VOICE / TEXT RESPONSE INPUT BAR */}
          <div style={{ marginTop: '20px', maxWidth: '780px', width: '100%', display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder={aiState === 'LISTENING' ? "Speak into your microphone or type your technical answer..." : "AI is speaking..."}
              value={candidateInputText}
              onChange={(e) => setCandidateInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnswerSubmit()}
              style={{
                flex: 1, padding: '14px 18px', background: 'rgba(10, 14, 23, 0.9)',
                border: '1px solid rgba(0, 229, 255, 0.3)', borderRadius: '8px', color: '#fff',
                fontSize: '0.95rem', fontFamily: "'Share Tech Mono', monospace", outline: 'none'
              }}
            />
            <button
              onClick={() => handleAnswerSubmit()}
              disabled={!candidateInputText.trim() || aiState === 'THINKING'}
              style={{
                padding: '0 24px', background: candidateInputText.trim() ? 'linear-gradient(135deg, #00E5FF 0%, #3b82f6 100%)' : 'rgba(255,255,255,0.1)',
                border: 'none', borderRadius: '8px', color: candidateInputText.trim() ? '#000' : '#64748b',
                fontWeight: 800, cursor: candidateInputText.trim() ? 'pointer' : 'not-allowed', fontSize: '0.9rem'
              }}
            >
              SUBMIT ANSWER ➔
            </button>
          </div>

          {/* FLOATING CANDIDATE CAMERA CARD */}
          <div style={{
            position: 'absolute', bottom: '24px', right: '24px', width: '220px', height: '140px',
            borderRadius: '10px', overflow: 'hidden', border: '1px solid #00E5FF',
            background: 'rgba(10, 14, 23, 0.95)', boxShadow: '0 0 20px rgba(0, 229, 255, 0.25)',
            display: 'flex', flexDirection: 'column', zIndex: 5
          }}>
            {hasCameraAccess && cameraEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', background: 'rgba(15, 23, 42, 0.95)', color: '#00E5FF'
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0, 229, 255, 0.15)',
                  border: '1px solid #00E5FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1rem'
                }}>
                  {firstName.charAt(0)}
                </div>
                <span style={{ marginTop: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>CAMERA OFF</span>
              </div>
            )}
            <div style={{
              position: 'absolute', bottom: '6px', left: '8px', right: '8px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: '0.7rem', color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px'
            }}>
              <span>YOU ({firstName})</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {micEnabled ? <Mic size={12} color="#10B981" /> : <MicOff size={12} color="#EF4444" />}
                {cameraEnabled ? <Video size={12} color="#10B981" /> : <VideoOff size={12} color="#EF4444" />}
              </div>
            </div>
          </div>

        </div>

        {/* COLLAPSIBLE LIVE TRANSCRIPT SIDEBAR */}
        {showTranscript && (
          <div style={{
            width: '360px', borderLeft: '1px solid rgba(0, 229, 255, 0.25)',
            background: 'rgba(10, 14, 23, 0.95)', display: 'flex', flexDirection: 'column',
            position: 'relative', zIndex: 5
          }}>
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.9rem', color: '#00E5FF', fontWeight: 800, letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} /> LIVE TRANSCRIPT
              </span>
              <button
                onClick={() => setShowTranscript(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {transcript.map((item) => (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: item.sender === 'ai' ? '#00E5FF' : '#FF9F1C', fontWeight: 700 }}>
                      {item.sender === 'ai' ? 'AI INTERVIEWER' : 'YOU (CANDIDATE)'}
                    </span>
                    <span style={{ color: '#64748b' }}>{item.time}</span>
                  </div>
                  <div style={{
                    padding: '10px 14px', borderRadius: '8px',
                    background: item.sender === 'ai' ? 'rgba(0, 229, 255, 0.08)' : 'rgba(255, 159, 28, 0.08)',
                    border: `1px solid ${item.sender === 'ai' ? 'rgba(0, 229, 255, 0.3)' : 'rgba(255, 159, 28, 0.3)'}`,
                    fontSize: '0.85rem', color: '#e2e8f0', lineHeight: '1.5'
                  }}>
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* BOTTOM CONTROL BAR */}
      <footer style={{
        height: '72px', borderTop: '1px solid rgba(0, 229, 255, 0.25)',
        background: 'rgba(10, 14, 23, 0.98)', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 32px', position: 'relative', zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={toggleMic}
            style={{
              padding: '10px 18px', borderRadius: '8px',
              background: micEnabled ? 'rgba(0, 229, 255, 0.15)' : 'rgba(239, 68, 68, 0.2)',
              border: `1px solid ${micEnabled ? '#00E5FF' : '#EF4444'}`,
              color: micEnabled ? '#00E5FF' : '#EF4444', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700
            }}
          >
            {micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
            {micEnabled ? 'MIC ON' : 'MIC MUTED'}
          </button>

          <button
            onClick={toggleCamera}
            style={{
              padding: '10px 18px', borderRadius: '8px',
              background: cameraEnabled ? 'rgba(0, 229, 255, 0.15)' : 'rgba(239, 68, 68, 0.2)',
              border: `1px solid ${cameraEnabled ? '#00E5FF' : '#EF4444'}`,
              color: cameraEnabled ? '#00E5FF' : '#EF4444', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700
            }}
          >
            {cameraEnabled ? <Video size={18} /> : <VideoOff size={18} />}
            {cameraEnabled ? 'CAMERA ON' : 'CAMERA OFF'}
          </button>

          <button
            onClick={() => setSpeakerEnabled(!speakerEnabled)}
            style={{
              padding: '10px 18px', borderRadius: '8px',
              background: speakerEnabled ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 159, 28, 0.2)',
              border: `1px solid ${speakerEnabled ? '#00E5FF' : '#FF9F1C'}`,
              color: speakerEnabled ? '#00E5FF' : '#FF9F1C', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700
            }}
          >
            {speakerEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {speakerEnabled ? 'SPEAKER ON' : 'SPEAKER MUTED'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            style={{
              padding: '10px 18px', borderRadius: '8px',
              background: showTranscript ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(0, 229, 255, 0.4)', color: '#00E5FF', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700
            }}
          >
            <MessageSquare size={18} /> {showTranscript ? 'HIDE TRANSCRIPT' : 'SHOW TRANSCRIPT'}
          </button>

          <button
            onClick={() => setShowEndModal(true)}
            style={{
              padding: '10px 24px', background: 'linear-gradient(135deg, #EF4444 0%, #b91c1c 100%)',
              border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 800, cursor: 'pointer',
              fontSize: '0.9rem', letterSpacing: '1px', boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)'
            }}
          >
            END INTERVIEW 🛑
          </button>
        </div>
      </footer>

      {/* 3-SECOND COUNTDOWN OVERLAY ON ROOM INITIALIZATION */}
      {countdown > 0 && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(6, 8, 12, 0.95)', backdropFilter: 'blur(10px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            padding: '36px', borderRadius: '16px', background: 'rgba(13, 17, 26, 0.95)',
            border: '1px solid #00E5FF', textAlign: 'center', boxShadow: '0 0 40px rgba(0, 229, 255, 0.3)'
          }}>
            <h2 style={{ color: '#00E5FF', fontSize: '1.5rem', marginBottom: '12px' }}>
              INITIALIZING SKILLSYNC AI INTERVIEW ROOM
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '24px' }}>
              Target Role: <strong style={{ color: '#FF9F1C' }}>{targetRole}</strong>
            </p>
            <div style={{
              fontSize: '4.5rem', fontWeight: 800, color: '#00E5FF',
              textShadow: '0 0 30px #00E5FF', margin: '20px 0'
            }}>
              {countdown}
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Calibrating Speech Recognition & Audio Telemetry...
            </p>
          </div>
        </div>
      )}

      {/* END INTERVIEW CONFIRMATION MODAL */}
      {showEndModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="hud-panel" style={{
            maxWidth: '480px', width: '100%', padding: '32px', borderRadius: '12px',
            background: 'rgba(13, 17, 26, 0.98)', border: '1px solid #FF9F1C',
            boxShadow: '0 0 40px rgba(255, 159, 28, 0.3)', textAlign: 'center'
          }}>
            <AlertTriangle size={48} color="#FF9F1C" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ color: '#FF9F1C', fontSize: '1.4rem', margin: '0 0 12px' }}>
              END INTERVIEW SESSION?
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
              Your current interview progress and technical responses will be analyzed to generate your comprehensive performance score card.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowEndModal(false)}
                style={{
                  padding: '12px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 700
                }}
              >
                CONTINUE INTERVIEW
              </button>
              <button
                onClick={handleConfirmEndInterview}
                style={{
                  padding: '12px 24px', background: 'linear-gradient(135deg, #FF9F1C 0%, #d97706 100%)',
                  border: 'none', borderRadius: '6px', color: '#000', fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(255, 159, 28, 0.4)'
                }}
              >
                GENERATE ANALYSIS REPORT ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Animation Keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
