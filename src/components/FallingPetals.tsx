import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  flip: number;
  flipSpeed: number;
  color: string;
  gravity: number;
}

// Warm luxury palette: champagne, muted gold, light gold, ivory, rose-gold, taupe
const COLORS = ['201,174,130', '189,162,118', '216,197,165', '241,239,231', '226,186,168', '169,157,141'];

// One shared petal outline, built once (unit size) and scaled per petal — far cheaper than rebuilding paths each frame.
const PETAL_PATH = (() => {
  if (typeof Path2D === 'undefined') return null;
  const p = new Path2D();
  p.moveTo(0, -1);
  p.bezierCurveTo(0.6, -0.4, 0.7, 0.6, 0, 1);
  p.bezierCurveTo(-0.7, 0.6, -0.6, -0.4, 0, -1);
  return p;
})();

const makeBurst = (width: number, height: number, multiplier: number): Petal[] => {
  const base = width < 640 ? 40 : width < 1024 ? 55 : 70;
  const count = Math.round(base * multiplier);
  const boost = width > 500 ? 1.2 : 1;
  const out: Petal[] = [];
  for (const side of [-1, 1]) {
    for (let i = 0; i < count; i++) {
      const alpha = 0.6 + Math.random() * 0.4;
      out.push({
        x: side < 0 ? -25 + Math.random() * 20 : width + 25 - Math.random() * 20,
        y: height * 0.2 + Math.random() * height * 0.55,
        size: 9 + Math.random() * 12,
        vx: -side * (9 + Math.random() * 16) * boost,
        vy: -(5 + Math.random() * 11),
        gravity: 0.16 + Math.random() * 0.08,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.1,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.04 + Math.random() * 0.05,
        color: `rgba(${COLORS[(Math.random() * COLORS.length) | 0]},${alpha.toFixed(2)})`,
      });
    }
  }
  return out;
};

export const FallingPetals: React.FC<{ isOpened: boolean }> = ({ isOpened }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petals = useRef<Petal[]>([]);
  const startLoop = useRef<() => void>(() => {});
  const hasBurst = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (reduced || !canvas || !ctx || !PETAL_PATH) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const frame = (t: number) => {
      // Normalise to 60fps steps so motion speed is identical on 60/90/120Hz screens.
      const dt = last ? Math.min((t - last) / 16.667, 3) : 1;
      last = t;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const list = petals.current;
      let alive = 0;
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        p.vx *= Math.pow(0.965, dt);
        p.vy += p.gravity * dt;
        if (p.vy > 2.4) p.vy = 1.8 + Math.random() * 0.4;
        p.x += (p.vx + Math.sin(p.angle * 1.5) * 0.8) * dt;
        p.y += p.vy * dt;
        p.angle += p.spin * dt;
        p.flip += p.flipSpeed * dt;
        if (p.y > h + 35) continue; // petals end once they fall — no infinite recycling

        const cos = Math.cos(p.angle) * p.size * dpr;
        const sin = Math.sin(p.angle) * p.size * dpr;
        const f = Math.cos(p.flip);
        ctx.setTransform(cos, sin, -sin * f, cos * f, p.x * dpr, p.y * dpr);
        ctx.fillStyle = p.color;
        ctx.fill(PETAL_PATH);
        list[alive++] = p;
      }
      list.length = alive;

      // Stop the loop entirely when nothing is on screen → zero idle CPU/GPU cost.
      if (alive > 0) raf = requestAnimationFrame(frame);
      else {
        raf = 0;
        last = 0;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    startLoop.current = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onBurst = (e: Event) => {
      const intensity = (e as CustomEvent<{ intensity?: number }>).detail?.intensity ?? 0.5;
      petals.current.push(...makeBurst(w, h, intensity));
      startLoop.current();
    };
    window.addEventListener('petal-burst', onBurst);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('petal-burst', onBurst);
      cancelAnimationFrame(raf);
      startLoop.current = () => {};
    };
  }, []);

  useEffect(() => {
    if (!isOpened || hasBurst.current) return;
    hasBurst.current = true;
    const fire = (m: number) => {
      petals.current.push(...makeBurst(window.innerWidth, window.innerHeight, m));
      startLoop.current();
    };
    fire(1);
    const t1 = setTimeout(() => fire(0.8), 150);
    const t2 = setTimeout(() => fire(0.7), 320);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isOpened]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[60] w-full h-full" aria-hidden="true" />;
};
