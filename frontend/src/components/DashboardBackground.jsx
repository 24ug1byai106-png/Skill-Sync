import React, { useEffect, useRef, useState } from 'react';

const terminalLogsList = [
  "> Initializing AI Core...",
  "> Loading Neural Network (Groq Llama 3.3 70B)...",
  "> Ingesting ATS Resume PDF & Certificates...",
  "> Synchronizing GitHub Commits @vishnukaranth...",
  "> Analyzing Technical Skill Competency Matrix...",
  "> Calculating Career Readiness Index...",
  "> Building Dynamic 12-Week Learning Roadmap...",
  "> System Ready. AI Operating System Active."
];

const morseCodes = [
  "... --- ...",
  ".- ..",
  "-.-.",
  ".- .-. . . .",
  ".. -. - . .-.. .-.. .. --. . -. -.-. ."
];

const encodingStates = [
  "ENCODING...",
  "DECODING...",
  "PARSING...",
  "VALIDATING...",
  "SYNCHRONIZING...",
  "COMPILING...",
  "TOKENIZING...",
  "VECTORIZING...",
  "INDEXING...",
  "MATCH FOUND",
  "SUCCESS"
];

export default function DashboardBackground() {
  const canvasRef = useRef(null);
  
  // Terminal Typing Log State
  const [typedLogs, setTypedLogs] = useState([terminalLogsList[0]]);
  const [stateBadge, setStateBadge] = useState(encodingStates[0]);

  // Terminal Typing Loop
  useEffect(() => {
    let logIdx = 1;
    const logInterval = setInterval(() => {
      setTypedLogs(prev => {
        const next = [...prev, terminalLogsList[logIdx % terminalLogsList.length]];
        return next.slice(-4);
      });
      logIdx++;
    }, 2800);

    let stateIdx = 0;
    const stateInterval = setInterval(() => {
      setStateBadge(encodingStates[stateIdx % encodingStates.length]);
      stateIdx++;
    }, 3200);

    return () => {
      clearInterval(logInterval);
      clearInterval(stateInterval);
    };
  }, []);

  // 60 FPS HTML5 Canvas Background Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles & Energy Packets
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2
    }));

    // Circuit Nodes & Links
    const nodes = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height
    }));

    // Energy Packets traveling along node links
    const energyPackets = Array.from({ length: 8 }, () => ({
      from: Math.floor(Math.random() * nodes.length),
      to: Math.floor(Math.random() * nodes.length),
      progress: Math.random()
    }));

    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);

    let radarAngle = 0;
    const render = () => {
      radarAngle += 0.008;
      ctx.clearRect(0, 0, width, height);

      // Parallax Grid Offset
      const gridOffsetY = (scrollY * 0.15) % 40;

      // 1. Blueprint Grid Pattern
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 50;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = -gridOffsetY; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Circuit Node Links
      ctx.strokeStyle = 'rgba(138, 43, 226, 0.08)';
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < Math.min(i + 3, nodes.length); j++) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y - scrollY * 0.05);
          ctx.lineTo(nodes[j].x, nodes[j].y - scrollY * 0.05);
          ctx.stroke();
        }
      }

      // 3. Moving Energy Packets
      energyPackets.forEach((ep) => {
        ep.progress += 0.006;
        if (ep.progress >= 1) {
          ep.progress = 0;
          ep.from = Math.floor(Math.random() * nodes.length);
          ep.to = Math.floor(Math.random() * nodes.length);
        }
        const n1 = nodes[ep.from];
        const n2 = nodes[ep.to];
        const px = n1.x + (n2.x - n1.x) * ep.progress;
        const py = (n1.y + (n2.y - n1.y) * ep.progress) - scrollY * 0.05;

        ctx.fillStyle = '#00F5D4';
        ctx.shadowColor = '#00F5D4';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 4. Floating Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Radar Sweep Line (Top-Right HUD Corner)
      const rx = width - 120;
      const ry = 120;
      const rRad = 70;

      ctx.save();
      ctx.translate(rx, ry);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, rRad, 0, Math.PI * 2);
      ctx.stroke();

      ctx.rotate(radarAngle);
      const sweepGrad = ctx.createConicGradient(0, 0, 0);
      sweepGrad.addColorStop(0, 'rgba(0, 229, 255, 0.18)');
      sweepGrad.addColorStop(0.2, 'transparent');
      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.arc(0, 0, rRad, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      
      {/* 60 FPS Canvas Background */}
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

      {/* DIGITAL CODE & TELEMETRY OVERLAY LAYERS */}
      
      {/* Left Code Column: Binary, Assembly, Registers */}
      <div style={{
        position: 'absolute',
        top: '100px',
        left: '20px',
        fontFamily: 'var(--font-code)',
        fontSize: '0.68rem',
        color: 'rgba(0, 229, 255, 0.22)',
        lineHeight: 1.6,
        userSelect: 'none'
      }}>
        <div>0 1 0 1 1 0 0 1  0 1 0 0 1 0 1 0</div>
        <div>0x000001 [RAX:0x7FFE] MOV RBX, RCX</div>
        <div>PUSH RDX • CALL 0x0042A1 • NOP</div>
        <div>SYS-00041 • AI-CORE-03 • NODE-14</div>
        <div style={{ color: 'rgba(138, 43, 226, 0.25)', marginTop: '8px' }}>
          GET /api/v1/dashboard 200 OK<br />
          POST /api/v1/github/sync 200 OK<br />
          GET /career-dna 200 OK
        </div>
      </div>

      {/* Right Telemetry Column: Hex Values, Machine Code, Neural Logs */}
      <div style={{
        position: 'absolute',
        top: '180px',
        right: '25px',
        fontFamily: 'var(--font-code)',
        fontSize: '0.68rem',
        color: 'rgba(138, 43, 226, 0.25)',
        textAlign: 'right',
        lineHeight: 1.6,
        userSelect: 'none'
      }}>
        <div>0x2F  0xA4  0x1D  0xFF  0x9C</div>
        <div>B8 89 FF 90 • CMP RAX, 0x00</div>
        <div>AI Core Active • Sync Complete</div>
        <div>Career DNA Generated • Skill Gap Computed</div>
        <div style={{ color: 'rgba(0, 245, 212, 0.2)', marginTop: '8px' }}>
          Roadmap Generated • Mission Updated
        </div>
      </div>

      {/* FLOATING SUBTLE SCI-FI TYPING TERMINAL WINDOW (Bottom Left) */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '30px',
        padding: '12px 18px',
        borderRadius: '10px',
        background: 'rgba(3, 6, 13, 0.65)',
        border: '1px solid rgba(0, 229, 255, 0.15)',
        backdropFilter: 'blur(12px)',
        fontFamily: 'var(--font-code)',
        fontSize: '0.72rem',
        color: '#38bdf8',
        maxWidth: '380px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        userSelect: 'none'
      }}>
        <div style={{ fontSize: '0.65rem', color: 'var(--cyber-blue)', fontWeight: 700, letterSpacing: '0.5px', borderBottom: '1px solid rgba(0,229,255,0.1)', paddingBottom: '4px', marginBottom: '2px' }}>
          SKILLSYNC_AI_KERNEL_MONITOR.sh
        </div>
        {typedLogs.map((log, idx) => (
          <div key={idx} style={{ color: idx === typedLogs.length - 1 ? '#00F5D4' : 'rgba(148, 163, 184, 0.7)' }}>
            {log}
          </div>
        ))}
      </div>

      {/* MORSE CODE & ENCODING STATE BADGE (Bottom Right) */}
      <div style={{
        position: 'absolute',
        bottom: '35px',
        right: '35px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '6px',
        fontFamily: 'var(--font-code)',
        userSelect: 'none'
      }}>
        {/* Encoding State Badge */}
        <div style={{
          padding: '4px 10px',
          borderRadius: '20px',
          background: 'rgba(0, 229, 255, 0.08)',
          border: '1px solid rgba(0, 229, 255, 0.25)',
          fontSize: '0.68rem',
          color: 'var(--cyber-blue)',
          fontWeight: 700,
          letterSpacing: '1px'
        }}>
          {stateBadge}
        </div>

        {/* Decorative Morse Code Sequence */}
        <div style={{ fontSize: '0.65rem', color: 'rgba(138, 43, 226, 0.35)', letterSpacing: '2px' }}>
          {morseCodes[0]} • {morseCodes[1]} • {morseCodes[2]}
        </div>
      </div>

      {/* HUD CORNER BRACKETS (Framing elements) */}
      <div style={{ position: 'absolute', top: '15px', left: '15px', width: '20px', height: '20px', borderTop: '2px solid rgba(0, 229, 255, 0.3)', borderLeft: '2px solid rgba(0, 229, 255, 0.3)' }} />
      <div style={{ position: 'absolute', top: '15px', right: '15px', width: '20px', height: '20px', borderTop: '2px solid rgba(0, 229, 255, 0.3)', borderRight: '2px solid rgba(0, 229, 255, 0.3)' }} />
      <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '20px', height: '20px', borderBottom: '2px solid rgba(0, 229, 255, 0.3)', borderLeft: '2px solid rgba(0, 229, 255, 0.3)' }} />
      <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '20px', height: '20px', borderBottom: '2px solid rgba(0, 229, 255, 0.3)', borderRight: '2px solid rgba(0, 229, 255, 0.3)' }} />

    </div>
  );
}
