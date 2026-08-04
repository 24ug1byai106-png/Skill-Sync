import React, { useEffect, useRef } from 'react';
import { Cpu, Activity, TrendingUp } from 'lucide-react';

export default function HolographicGlobe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    const size = 440;
    canvas.width = size;
    canvas.height = size;

    const radius = 135;
    const numPoints = 400;
    const points = [];

    // Generate 3D sphere points using Fibonacci lattice
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      points.push({ x: x * radius, y: y * radius, z: z * radius });
    }

    let angleY = 0;
    let angleX = 0.2;

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2 - 10;

      angleY += 0.008;

      // Project 3D points onto 2D canvas
      const projected = [];
      points.forEach((p) => {
        // Rotate Y
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        // Rotate X
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        const scale = 300 / (300 + z2);
        projected.push({
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2,
          scale
        });
      });

      // Sort points by depth z
      projected.sort((a, b) => b.z - a.z);

      // Draw node connections (neural lines)
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.14)';
      ctx.lineWidth = 0.7;
      for (let i = 0; i < projected.length; i += 6) {
        for (let j = i + 1; j < Math.min(i + 4, projected.length); j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 50) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw globe node dots
      projected.forEach((p) => {
        const alpha = Math.max(0.15, (p.z + radius) / (2 * radius));
        ctx.fillStyle = p.z > 0 ? `rgba(0, 229, 255, ${alpha})` : `rgba(138, 43, 226, ${alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.scale * 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw orbital HUD rings
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleY * 0.5);

      ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, radius + 25, (radius + 25) * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(138, 43, 226, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 0, radius + 45, (radius + 45) * 0.25, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* 3D Rotating Globe Canvas */}
      <canvas ref={canvasRef} style={{ display: 'block', filter: 'drop-shadow(0 0 30px rgba(0, 229, 255, 0.4))' }} />

      {/* Holographic Projector Base */}
      <div style={{
        width: '320px',
        height: '40px',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(0, 229, 255, 0.4) 0%, rgba(138, 43, 226, 0.2) 50%, transparent 80%)',
        border: '1px solid var(--border-cyber)',
        boxShadow: '0 0 35px rgba(0, 229, 255, 0.5)',
        marginTop: '-30px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '60px',
          background: 'linear-gradient(to top, rgba(0, 229, 255, 0.2), transparent)',
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Orbiting Floating Glass Telemetry Cards */}
      <div className="holo-panel floating-panel" style={{
        position: 'absolute',
        top: '20px',
        left: '-40px',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.8rem',
        animationDelay: '0s'
      }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00F5D4', boxShadow: '0 0 10px #00F5D4' }} />
        <div>
          <strong style={{ color: '#00E5FF' }}>AI CORE ONLINE</strong>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Groq Llama 3.3 70B Active</p>
        </div>
      </div>

      <div className="holo-panel floating-panel" style={{
        position: 'absolute',
        bottom: '70px',
        right: '-40px',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.8rem',
        animationDelay: '2s'
      }}>
        <Activity size={18} color="#8A2BE2" />
        <div>
          <strong style={{ color: '#c084fc' }}>12,450+ STUDENTS</strong>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Career DNA Synchronized</p>
        </div>
      </div>

      <div className="holo-panel floating-panel" style={{
        position: 'absolute',
        top: '180px',
        right: '-30px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.75rem',
        animationDelay: '1s'
      }}>
        <TrendingUp size={16} color="#10b981" />
        <span style={{ color: '#10b981', fontWeight: 700 }}>94.2% Placement Match</span>
      </div>

    </div>
  );
}
