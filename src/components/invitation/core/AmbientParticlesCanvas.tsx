'use client';

import React, { useEffect, useRef } from 'react';
import type { AmbientEffect } from '@/types/invitation.types';

interface AmbientParticlesCanvasProps {
  effect: AmbientEffect;
  accentColor: string;
}

export function AmbientParticlesCanvas({
  effect,
  accentColor,
}: AmbientParticlesCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (effect === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = 28;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.8 + 1.2,
      vx: (Math.random() - 0.5) * 0.35,
      vy:
        effect === 'gold-sparkles' || effect === 'soft-stars'
          ? -Math.random() * 0.45 - 0.15
          : Math.random() * 0.5 + 0.2,
      alpha: Math.random() * 0.65 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.025;

        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha =
          p.alpha * (0.6 + 0.4 * Math.sin(p.phase));

        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle =
          effect === 'white-petals'
            ? '#FFFFFF'
            : effect === 'confetti'
              ? ['#FF6B6B', '#4ECDC4', '#FFE66D', accentColor][
                  Math.floor(p.r) % 4
                ]
              : accentColor;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [effect, accentColor]);

  if (effect === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20 h-full w-full"
      aria-hidden="true"
    />
  );
}
