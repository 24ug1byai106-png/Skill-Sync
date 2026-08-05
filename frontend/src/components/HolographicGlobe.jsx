import React, { useEffect, useRef } from 'react';
import { ShieldAlert, Target } from 'lucide-react';

export default function HolographicGlobe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    const size = 420;
    canvas.width = size;
    canvas.height = size;

    const radius = 130;
    const numPoints = 350;
    const points = [];

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

      angleY += 0.007;

      const projected = [];
      points.forEach((p) => {
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

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

      projected.sort((a, b) => b.z - a.z);

      // Draw HUD lines
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.16)';
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i += 7) {
        for (let j = i + 1; j < Math.min(i + 4, projected.length); j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 45) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw node dots (Cyan + Amber)
      projected.forEach((p, idx) => {
        const alpha = Math.max(0.15, (p.z + radius) / (2 * radius));
        const isAmber = idx % 10 === 0;
        ctx.fillStyle = isAmber ? `rgba(255, 159, 28, ${alpha})` : `rgba(0, 229, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.scale * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Orbital Rings
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleY * 0.4);

      ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, radius + 20, (radius + 20) * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 159, 28, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 0, radius + 40, (radius + 40) * 0.25, Math.PI / 4, 0, Math.PI * 2);
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
      <canvas ref={canvasRef} style={{ display: 'block', filter: 'drop-shadow(0 0 20px rgba(0, 229, 255, 0.4))' }} />

      {/* Orbiting HUD Telemetry Widgets */}
      <div className="hud-panel" style={{
        position: 'absolute',
        top: '20px',
        left: '-30px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.75rem'
      }}>
        <span className="telemetry-dot telemetry-dot-cyan" />
        <div>
          <span style={{ color: 'var(--hud-cyan-bright)', fontWeight: 700, letterSpacing: '1px' }}>[SYS_TELEMETRY]</span>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0 }}>LLAMA 3.3 70B ACTIVE</p>
        </div>
      </div>

      <div className="hud-panel hud-panel-amber" style={{
        position: 'absolute',
        bottom: '40px',
        right: '-30px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.75rem'
      }}>
        <ShieldAlert size={16} color="var(--hud-amber)" />
        <div>
          <span style={{ color: 'var(--hud-amber-bright)', fontWeight: 700, letterSpacing: '1px' }}>[GAP_WARNING]</span>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0 }}>4 TARGET ROLE SKILL GAPS</p>
        </div>
      </div>

      <div className="hud-panel" style={{
        position: 'absolute',
        top: '170px',
        right: '-40px',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.75rem'
      }}>
        <Target size={14} color="var(--hud-cyan-bright)" />
        <span style={{ color: 'var(--hud-cyan-bright)', fontWeight: 700 }}>PLACEMENT SCORE: 78.5%</span>
      </div>

    </div>
  );
}
