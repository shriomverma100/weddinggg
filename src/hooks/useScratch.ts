import React, { useCallback, useEffect, useRef, useState } from 'react';

const CELL = 10; // coverage grid cell (px) — tracks scratched area without slow getImageData reads

interface Options {
  /** Draws the scratch surface. Keep it stable (module-level function). */
  paint: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  radius?: number;
  revealAt?: number;
  /** CSS font shorthands the surface uses, loaded before painting so text renders in the right typeface. */
  fonts?: string[];
  onReveal?: () => void;
}

export function useScratch({ paint, radius = 18, revealAt = 0.5, fonts = [], onReveal }: Options) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const grid = useRef({ cols: 0, rows: 0, hit: new Uint8Array(0), count: 0 });
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const raf = useRef(0);
  const buzz = useRef(0);
  const revealedRef = useRef(false);
  const onRevealRef = useRef(onReveal);
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    onRevealRef.current = onReveal;
  }, [onReveal]);

  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    const box = containerRef.current;
    if (!canvas || !box || revealedRef.current) return;
    const { width: w, height: h } = box.getBoundingClientRect();
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    paint(ctx, w, h);
    const cols = Math.ceil(w / CELL);
    const rows = Math.ceil(h / CELL);
    grid.current = { cols, rows, hit: new Uint8Array(cols * rows), count: 0 };
    setProgress(0);
  }, [paint]);

  const fontsKey = fonts.join('|');
  useEffect(() => {
    let cancelled = false;
    setup();
    const loads = fontsKey ? fontsKey.split('|').map((f) => document.fonts?.load(f).catch(() => [])) : [];
    Promise.all([...loads, document.fonts?.ready]).then(() => {
      if (!cancelled && grid.current.count === 0) setup();
    });

    // Repaint on size change only if untouched — never wipe a guest's progress.
    let lastW = 0;
    let lastH = 0;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (Math.abs(width - lastW) < 1 && Math.abs(height - lastH) < 1) return;
      lastW = width;
      lastH = height;
      if (grid.current.count === 0) setup();
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => {
      cancelled = true;
      ro.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, [setup, fontsKey]);

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    setProgress(1);
    navigator.vibrate?.([12, 40, 18]);
    onRevealRef.current?.();
  }, []);

  const mark = (x: number, y: number) => {
    const g = grid.current;
    const r = radius;
    const c0 = Math.max(0, Math.floor((x - r) / CELL));
    const c1 = Math.min(g.cols - 1, Math.floor((x + r) / CELL));
    const r0 = Math.max(0, Math.floor((y - r) / CELL));
    const r1 = Math.min(g.rows - 1, Math.floor((y + r) / CELL));
    for (let row = r0; row <= r1; row++) {
      for (let col = c0; col <= c1; col++) {
        const dx = col * CELL + CELL / 2 - x;
        const dy = row * CELL + CELL / 2 - y;
        if (dx * dx + dy * dy <= r * r) {
          const i = row * g.cols + col;
          if (!g.hit[i]) {
            g.hit[i] = 1;
            g.count++;
          }
        }
      }
    }
  };

  const scratchTo = (x: number, y: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    // Erase strength = source alpha, so use fully opaque colours (paint() may leave translucent ones set).
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = radius * 2;
    const from = last.current;
    ctx.beginPath();
    if (from) {
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      const steps = Math.max(1, Math.ceil(Math.hypot(x - from.x, y - from.y) / (radius / 2)));
      for (let s = 1; s <= steps; s++) mark(from.x + ((x - from.x) * s) / steps, from.y + ((y - from.y) * s) / steps);
    } else {
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      mark(x, y);
    }
    last.current = { x, y };
  };

  const scheduleProgress = () => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const g = grid.current;
      const p = g.hit.length ? g.count / g.hit.length : 0;
      setProgress(Math.min(1, p / revealAt));
      if (p >= revealAt) reveal();
    });
  };

  const point = (e: { clientX: number; clientY: number }) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const bind = {
    onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (revealedRef.current) return;
      drawing.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      last.current = null;
      const p = point(e);
      scratchTo(p.x, p.y);
      scheduleProgress();
    },
    onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current || revealedRef.current) return;
      const evs = e.nativeEvent.getCoalescedEvents?.() ?? [];
      for (const ev of evs.length ? evs : [e.nativeEvent]) {
        const p = point(ev);
        scratchTo(p.x, p.y);
      }
      const now = performance.now();
      if (now - buzz.current > 90) {
        buzz.current = now;
        navigator.vibrate?.(4);
      }
      scheduleProgress();
    },
    onPointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => {
      drawing.current = false;
      last.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    },
  };

  return { canvasRef, containerRef, progress, revealed, reveal, bind: { ...bind, onPointerCancel: bind.onPointerUp } };
}
