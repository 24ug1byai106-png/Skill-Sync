import React, { useEffect, useRef, useState } from 'react';

// Floating texts pool
const FLOATING_TEXTS = [
  "ENCODING...", "DECODING...", "SYNCHRONIZING...", "PARSING...",
  "ANALYZING...", "MATCH FOUND", "AI READY", "OCR ACTIVE",
  "INDEXING...", "TOKENIZING...", "VECTORIZING...", "NEURAL LINK",
  "CAREER DNA", "SYNC COMPLETE"
];

// Helper to get random number
const rnd = (min, max) => Math.random() * (max - min) + min;

export default function GlobalAIAmbience({ activeTab }) {
  const canvasRef = useRef(null);
  const [floatingWords, setFloatingWords] = useState([]);

  // --- Floating Text Logic ---
  useEffect(() => {
    // Generate floating text strings periodically
    const interval = setInterval(() => {
      setFloatingWords(prev => {
        // Keep 3-5 texts max
        if (prev.length >= 5) return prev;
        
        const newWord = {
          id: Math.random().toString(36).substring(2),
          text: FLOATING_TEXTS[Math.floor(Math.random() * FLOATING_TEXTS.length)],
          x: rnd(10, 80), // percentage
          y: rnd(10, 80), // percentage
          duration: rnd(8, 15), // seconds
          opacity: rnd(0.02, 0.06) // keep very low
        };
        
        return [...prev, newWord];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Remove words after their duration
  useEffect(() => {
    if (floatingWords.length === 0) return;
    const timeouts = floatingWords.map(word => 
      setTimeout(() => {
        setFloatingWords(prev => prev.filter(w => w.id !== word.id));
      }, word.duration * 1000)
    );
    return () => timeouts.forEach(clearTimeout);
  }, [floatingWords]);

  // --- Canvas Rendering Logic ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let animationFrameId;
    let width, height;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Setup global state variables
    const particles = Array.from({ length: 40 }).map(() => ({
      x: rnd(0, width), y: rnd(0, height),
      vx: rnd(-0.5, 0.5), vy: rnd(-0.5, 0.5),
      size: rnd(1, 3)
    }));

    let time = 0;

    const draw = () => {
      time += 0.01;
      
      // Clear canvas with total transparency
      ctx.clearRect(0, 0, width, height);

      // We apply global alpha to ensure nothing exceeds 8%
      ctx.globalAlpha = 0.08;

      // 1. GLOBAL BACKGROUND (Grid)
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 0.5;
      const gridSize = 100;
      for (let x = (time * 10) % gridSize; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = (time * 10) % gridSize; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // 2. Global Particles & Neural lines
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;

        ctx.fillStyle = '#00E5FF';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#8A2BE2';
            ctx.lineWidth = 1 - (dist / 150);
            ctx.stroke();
          }
        }
      });

      // 3. Radar Pulse every 10-15s (simulated with mod)
      const radarCycle = time % 12; // 12 second cycle
      if (radarCycle < 4) {
        const radius = (radarCycle / 4) * Math.max(width, height);
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#00F5D4';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 4. PAGE-SPECIFIC EFFECTS
      ctx.save();
      ctx.translate(width / 2, height / 2); // center

      switch(activeTab) {
        case 'dashboard': {
          // Floating analytics numbers
          ctx.font = '24px monospace';
          ctx.fillStyle = '#00E5FF';
          ctx.textAlign = 'center';
          ctx.fillText(`M: ${Math.floor(Math.sin(time) * 100)}%`, Math.cos(time) * 300, Math.sin(time) * 200);
          ctx.fillText(`CPU: ${Math.floor(Math.random() * 100)}%`, Math.sin(time*0.5) * 400, Math.cos(time*0.5) * 300);
          break;
        }
        case 'career_dna': {
          // Animated DNA Strands (Double Helix)
          for (let i = -20; i < 20; i++) {
            const y = i * 20;
            const x1 = Math.sin(time * 2 + i * 0.2) * 100;
            const x2 = Math.sin(time * 2 + i * 0.2 + Math.PI) * 100;
            ctx.fillStyle = '#00F5D4';
            ctx.beginPath(); ctx.arc(x1, y, 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#8A2BE2';
            ctx.beginPath(); ctx.arc(x2, y, 4, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
          }
          break;
        }
        case 'resume': {
          // Parsing... OCR Active Scan lines
          const scanY = (Math.sin(time) * 300);
          ctx.fillStyle = '#00E5FF';
          ctx.fillRect(-400, scanY, 800, 4);
          ctx.fillStyle = 'rgba(0, 229, 255, 0.2)';
          ctx.fillRect(-400, scanY - 50, 800, 50);
          break;
        }
        case 'github': {
          // Git Commits / Branch Graph
          ctx.strokeStyle = '#8A2BE2';
          ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(-200, -300); ctx.lineTo(-200, 300); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-200, 0); ctx.bezierCurveTo(-50, 0, -50, 200, 100, 200); ctx.stroke();
          ctx.fillStyle = '#00F5D4';
          ctx.beginPath(); ctx.arc(-200, Math.sin(time) * 200, 10, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(100, 200, 10, 0, Math.PI*2); ctx.fill();
          break;
        }
        case 'projects': {
          // Architecture Flowchart
          ctx.strokeStyle = '#00E5FF';
          ctx.lineWidth = 2;
          ctx.strokeRect(-150, -100, 100, 60);
          ctx.strokeRect(50, 100, 100, 60);
          ctx.beginPath(); ctx.moveTo(-100, -40); ctx.lineTo(-100, 130); ctx.lineTo(50, 130); ctx.stroke();
          // moving packet
          ctx.fillStyle = '#FF007F';
          ctx.beginPath(); ctx.arc(-100 + (Math.sin(time)*50+50), 130, 5, 0, Math.PI*2); ctx.fill();
          break;
        }
        case 'readiness':
        case 'skill_gap': {
          // Circular radar scans / rings
          for (let r = 1; r <= 3; r++) {
            ctx.beginPath();
            ctx.arc(0, 0, r * 100, 0, (Math.PI * 2) * (Math.sin(time + r) * 0.5 + 0.5));
            ctx.strokeStyle = '#00F5D4';
            ctx.lineWidth = 4;
            ctx.stroke();
          }
          break;
        }
        case 'roadmap': {
          // Timeline nodes
          ctx.strokeStyle = '#8A2BE2';
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(-300, 0); ctx.lineTo(300, 0); ctx.stroke();
          for(let i=-2; i<=2; i++) {
             ctx.fillStyle = (time%2 > Math.abs(i)*0.5) ? '#00E5FF' : '#333';
             ctx.beginPath(); ctx.arc(i*120, 0, 15, 0, Math.PI*2); ctx.fill();
          }
          break;
        }
        case 'settings': {
          // Encryption gears/rings
          ctx.rotate(time * 0.5);
          for(let i=0; i<8; i++) {
            ctx.rotate(Math.PI / 4);
            ctx.fillStyle = '#00E5FF';
            ctx.fillRect(80, -5, 20, 10);
          }
          ctx.beginPath(); ctx.arc(0, 0, 80, 0, Math.PI*2); ctx.lineWidth=4; ctx.strokeStyle='#8A2BE2'; ctx.stroke();
          break;
        }
        case 'mentor': {
          // AI reasoning particles
          for(let i=0; i<10; i++) {
            ctx.fillStyle = '#FF007F';
            ctx.beginPath(); ctx.arc(Math.sin(time*2+i)*100, Math.cos(time*3+i)*100, 4, 0, Math.PI*2); ctx.fill();
          }
          break;
        }
        case 'coding': {
          ctx.font = '16px monospace';
          ctx.fillStyle = '#00F5D4';
          ctx.textAlign = 'left';
          const codeSnippet = [
            "function train_model(data) {",
            "  const tensor = tf.tensor(data);",
            "  model.fit(tensor, { epochs: 100 });",
            "  return model;",
            "}"
          ];
          const lines = Math.floor((time * 2) % 6);
          for(let i=0; i<lines; i++) {
            ctx.fillText(codeSnippet[i] || "", -200, i * 25);
          }
          break;
        }
        case 'certificates': {
          // Hexagons
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            ctx.lineTo(100 * Math.cos(i * Math.PI / 3 + time), 100 * Math.sin(i * Math.PI / 3 + time));
          }
          ctx.closePath();
          ctx.strokeStyle = '#00E5FF';
          ctx.lineWidth = 2;
          ctx.stroke();
          break;
        }
        default: {
          // Generic fallback rotating hex code
          ctx.font = '32px monospace';
          ctx.fillStyle = '#8A2BE2';
          ctx.textAlign = 'center';
          ctx.fillText(`0x${Math.floor(Math.random()*16777215).toString(16).toUpperCase()}`, Math.sin(time)*100, Math.cos(time)*100);
          break;
        }
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [activeTab]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden'
    }}>
      {/* Canvas Layer */}
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Floating Text Layer */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        {floatingWords.map(word => (
          <div 
            key={word.id} 
            style={{
              position: 'absolute',
              top: `${word.y}%`,
              left: `${word.x}%`,
              color: 'var(--neon-cyan)',
              fontFamily: 'monospace',
              fontSize: '12px',
              letterSpacing: '2px',
              opacity: word.opacity, // Very subtle, max 8%
              animation: `floatText ${word.duration}s linear forwards`,
              textShadow: '0 0 4px var(--neon-cyan)'
            }}
          >
            {word.text}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes floatText {
          0% { transform: translateY(20px) scale(0.9); opacity: 0; }
          20% { opacity: ${rnd(0.04, 0.08)}; }
          80% { opacity: ${rnd(0.04, 0.08)}; }
          100% { transform: translateY(-20px) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
