import React, { useCallback, useEffect, useRef, useState } from 'react';
import { WEDDING_DATE_ISO, formatDate, formatTime, formatWeekday } from '../data/content';

const BRUSH_RADIUS = 16; // smaller brush = a longer, more satisfying scratch
const REVEAL_AT = 0.55; // fraction of the card that must be scratched
const CELL = 10; // coverage grid cell size (px) — avoids expensive getImageData reads

export const ScratchToReveal: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const grid = useRef<{ cols: number; rows: number; hit: Uint8Array; count: number }>({
    cols: 0,
    rows: 0,
    hit: new Uint8Array(0),
    count: 0,
  });
  const sizeRef = useRef({ w: 0, h: 0 });
  const lastBuzz = useRef(0);
  const progressRaf = useRef(0);
  const [progress, setProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const revealedRef = useRef(false);

  const paintSurface = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || revealedRef.current) return;

    const { width: w, height: h } = container.getBoundingClientRect();
    if (!w || !h) return;
    sizeRef.current = { w, h };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';

    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#EFE6D4');
    g.addColorStop(0.45, '#E3D3B3');
    g.addColorStop(0.55, '#EADDC3');
    g.addColorStop(1, '#D9C59F');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // fine foil grain
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    for (let i = 0; i < (w * h) / 90; i++) ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);

    ctx.strokeStyle = 'rgba(140,111,67,0.45)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10.5, 10.5, w - 21, h - 21);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#34342E';
    ctx.font = 'italic 24px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('Scratch to Reveal', w / 2, h / 2 - 12);
    ctx.fillStyle = '#8C6F43';
    ctx.font = '600 11px "Montserrat", sans-serif';
    ctx.letterSpacing = '0.25em';
    ctx.fillText('THE DATE', w / 2, h / 2 + 18);
    ctx.letterSpacing = '0px';

    const cols = Math.ceil(w / CELL);
    const rows = Math.ceil(h / CELL);
    grid.current = { cols, rows, hit: new Uint8Array(cols * rows), count: 0 };
    setProgress(0);
  }, []);

  useEffect(() => {
    // Wait for web fonts so the canvas text renders in the right typeface.
    let cancelled = false;
    (document.fonts?.ready ?? Promise.resolve()).then(() => !cancelled && paintSurface());
    paintSurface();

    // Only repaint on real width changes — mobile URL-bar show/hide changes height and must not wipe progress.
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      if (grid.current.count === 0) paintSurface();
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(progressRaf.current);
    };
  }, [paintSurface]);

  const markCoverage = (x: number, y: number) => {
    const gr = grid.current;
    const r = BRUSH_RADIUS;
    const c0 = Math.max(0, Math.floor((x - r) / CELL));
    const c1 = Math.min(gr.cols - 1, Math.floor((x + r) / CELL));
    const r0 = Math.max(0, Math.floor((y - r) / CELL));
    const r1 = Math.min(gr.rows - 1, Math.floor((y + r) / CELL));
    for (let row = r0; row <= r1; row++) {
      for (let col = c0; col <= c1; col++) {
        const cx = col * CELL + CELL / 2 - x;
        const cy = row * CELL + CELL / 2 - y;
        if (cx * cx + cy * cy <= r * r) {
          const i = row * gr.cols + col;
          if (!gr.hit[i]) {
            gr.hit[i] = 1;
            gr.count++;
          }
        }
      }
    }
  };

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setIsRevealed(true);
    setProgress(1);
    navigator.vibrate?.([12, 40, 18]);
    window.dispatchEvent(new CustomEvent('petal-burst', { detail: { intensity: 0.35 } }));
  }, []);

  const scratchTo = (x: number, y: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = BRUSH_RADIUS * 2;

    const from = lastPoint.current;
    ctx.beginPath();
    if (from) {
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      // mark coverage along the segment
      const dist = Math.hypot(x - from.x, y - from.y);
      const steps = Math.max(1, Math.ceil(dist / (BRUSH_RADIUS / 2)));
      for (let s = 1; s <= steps; s++) markCoverage(from.x + ((x - from.x) * s) / steps, from.y + ((y - from.y) * s) / steps);
    } else {
      ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      markCoverage(x, y);
    }
    lastPoint.current = { x, y };
  };

  const scheduleProgress = () => {
    if (progressRaf.current) return;
    progressRaf.current = requestAnimationFrame(() => {
      progressRaf.current = 0;
      const gr = grid.current;
      const p = gr.hit.length ? gr.count / gr.hit.length : 0;
      setProgress(Math.min(1, p / REVEAL_AT));
      if (p >= REVEAL_AT) reveal();
    });
  };

  const localPoint = (e: { clientX: number; clientY: number }) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealedRef.current) return;
    drawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    lastPoint.current = null;
    const p = localPoint(e);
    scratchTo(p.x, p.y);
    scheduleProgress();
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || revealedRef.current) return;
    // Coalesced events give every touch sample between frames → smooth, gap-free strokes.
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent];
    for (const ev of events.length ? events : [e.nativeEvent]) {
      const p = localPoint(ev);
      scratchTo(p.x, p.y);
    }
    const now = performance.now();
    if (now - lastBuzz.current > 90) {
      lastBuzz.current = now;
      navigator.vibrate?.(4);
    }
    scheduleProgress();
  };

  const onUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = false;
    lastPoint.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const date = formatDate(WEDDING_DATE_ISO);

  return (
    <section className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] mx-auto py-6 px-4">
      <div
        ref={containerRef}
        className="relative w-full min-h-[190px] bg-white rounded-2xl border border-[#DDDCD3] shadow-xs select-none overflow-hidden flex flex-col items-center justify-center p-6 text-center"
      >
        <div className={`flex flex-col items-center ${isRevealed ? 'date-pop' : ''}`}>
          <div className="w-10 h-0.5 bg-[#C9AE82] mb-3 rounded-full" />
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#8C6F43] font-semibold mb-2">
            Save the Date
          </p>
          <h2 className="font-serif text-4xl sm:text-[42px] text-[#34342E] tracking-tight font-normal leading-tight">
            {date}
          </h2>
          <p className="font-sans text-[11.5px] tracking-[0.12em] text-[#6F786C] mt-2">
            {formatWeekday(WEDDING_DATE_ISO)} · {formatTime(WEDDING_DATE_ISO)}
          </p>
          <div className="w-6 h-px bg-[#D8C5A5] mt-3" />
        </div>

        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && reveal()}
          tabIndex={isRevealed ? -1 : 0}
          role="button"
          aria-label={`Scratch to reveal the date. The date is ${date}.`}
          className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-700 ease-out ${
            isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Progress feedback: seeing the bar fill keeps guests scratching (goal-gradient effect) */}
      <div
        className={`mt-3 flex flex-col items-center gap-2 transition-opacity duration-500 ${isRevealed ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden={isRevealed}
      >
        <div className="w-32 h-[3px] rounded-full bg-[#ECE7DC] overflow-hidden">
          <div
            className="h-full w-full bg-[#C9AE82] origin-left transition-transform duration-150 ease-out"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
        <p className="font-sans text-[11px] tracking-wide text-[#8A8173]">
          {progress === 0 ? 'Scratch the card with your finger' : progress < 0.7 ? 'Keep going…' : 'Almost there!'}
        </p>
      </div>
    </section>
  );
};
