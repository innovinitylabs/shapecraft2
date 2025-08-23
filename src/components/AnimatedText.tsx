'use client';

import { useEffect, useRef } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export default function AnimatedText({ text, className = "", speed = 50 }: AnimatedTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 1;
        this.maxLife = Math.random() * 50 + 50;
        this.color = `hsl(${Math.random() * 60 + 200}, 70%, 60%)`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.vy += 0.05; // Gravity
      }

      draw() {
        if (!ctx) return;
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Text animation
    let particles: Particle[] = [];
    let animationId: number;
    let charIndex = 0;
    let lastTime = 0;

    const animate = (currentTime: number) => {
      if (!ctx) return;
      
      if (currentTime - lastTime > speed) {
        if (charIndex < text.length) {
          // Create particles for current character
          const char = text[charIndex];
          const metrics = ctx.measureText(char);
          const x = charIndex * 60 + 50;
          const y = 100;

          for (let i = 0; i < 5; i++) {
            particles.push(new Particle(x + Math.random() * metrics.width, y));
          }

          charIndex++;
          lastTime = currentTime;
        }
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles = particles.filter(particle => {
        particle.update();
        particle.draw();
        return particle.life > 0;
      });

      // Draw text
      ctx.save();
      ctx.font = 'bold 48px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      
      // Draw completed text
      const completedText = text.substring(0, charIndex);
      ctx.fillText(completedText, canvas.width / 2, 100);

      // Draw remaining text with lower opacity
      const remainingText = text.substring(charIndex);
      ctx.globalAlpha = 0.3;
      ctx.fillText(remainingText, canvas.width / 2 + charIndex * 60, 100);
      ctx.restore();

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [text, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-32 ${className}`}
      style={{ width: '100%', height: '128px' }}
    />
  );
}
