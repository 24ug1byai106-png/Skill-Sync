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

    // Mouse coordinates
    let mouse = { x: width / 2, y: height / 2 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Matrix particles & hex streams
    const chars = '01ABCDEF01010101010101';
    const numParticles = 75;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 0.5 + Math.random() * 1.5,
      size: 10 + Math.random() * 6,
      text: chars[Math.floor(Math.random() * chars.length)],
      opacity: 0.2 + Math.random() * 0.6,
      isHex: Math.random() > 0.6,
      hexVal: `0x${Math.floor(Math.random() * 255).toString(16).toUpperCase()}`
    }));

    // Draw grid lines
    const drawGrid = (t) => {
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 60;

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
    };

    let time = 0;
    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Background radial gradient
      const bgGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 600);
      bgGrad.addColorStop(0, 'rgba(0, 229, 255, 0.07)');
      bgGrad.addColorStop(0.5, 'rgba(138, 43, 226, 0.04)');
      bgGrad.addColorStop(1, 'rgba(3, 5, 9, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      drawGrid(time);

      // Render matrix code streams
      ctx.font = '12px "JetBrains Mono", monospace';
      particles.forEach((p) => {
        p.y += p.speed;
        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = p.isHex ? 'rgba(138, 43, 226, ' + p.opacity + ')' : 'rgba(0, 229, 255, ' + p.opacity + ')';
        ctx.fillText(p.isHex ? p.hexVal : p.text, p.x, p.y);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
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
