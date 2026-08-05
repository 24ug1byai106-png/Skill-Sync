import React, { useEffect, useRef } from 'react';

export default function SciFiBackground() {
  const canvasRef = useRef(null);

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

    let radarAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Tactical HUD Grid
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 50;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Radar Sweep Line
      radarAngle += 0.005;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.max(width, height) * 0.8;

      const gradient = ctx.createConicGradient(radarAngle, cx, cy);
      gradient.addColorStop(0, 'rgba(0, 229, 255, 0.08)');
      gradient.addColorStop(0.1, 'rgba(0, 229, 255, 0.02)');
      gradient.addColorStop(0.2, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Topographic tactical circles
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.03)';
      ctx.lineWidth = 1;
      [200, 400, 600, 800].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}
