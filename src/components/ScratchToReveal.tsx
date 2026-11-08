import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pointer } from 'lucide-react';
import { WEDDING_DATE_ISO } from '../data/content';
import { useContent, useLang } from '../i18n';

const BRUSH_RADIUS = 16; // smaller brush = a longer, more satisfying scratch
const REVEAL_AT = 0.55; // fraction of the card that must be scratched
const CELL = 10; // coverage grid cell size (px) — avoids expensive getImageData reads
const FLAKE_COLOURS = ['#C9AE82', '#D8C5A5', '#E9DCC0', '#B39363', '#F3EAD7'];

type Flake = { x: number; y: number; vx: number; vy: number; r: number; rot: number; vr: number; life: number; max: number; c: string };

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const ScratchToReveal: React.FC<{ onReveal?: () => void }> = ({ onReveal }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fxRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const fxCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const finger = useRef<{ x: number; y: number } | null>(null);
  const grid = useRef<{ cols: number; rows: number; hit: Uint8Array; count: number }>({
    cols: 0,
    rows: 0,
    hit: new Uint8Array(0),
    count: 0,
  });
  const sizeRef = useRef({ w: 0, h: 0 });
  const flakes = useRef<Flake[]>([]);
  const fxRaf = useRef(0);
  const lastBuzz = useRef(0);
  const milestone = useRef(0);
  const progressRaf = useRef(0);
  const [progress, setProgress] = useState(0);
  const [touched, setTouched] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const revealedRef = useRef(false);
  const { UI, fmt } = useContent();
  const { lang } = useLang();
  // the canvas paints outside React's render, so it reads the current wording from a ref
  const surfaceText = useRef({ title: UI.scratchTitle, sub: UI.scratchSub, lang });
  surfaceText.current = { title: UI.scratchTitle, sub: UI.scratchSub, lang };
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;

  // ── Gold-flake particle layer (runs only while something is moving) ──
  const runFx = useCallback(() => {
    if (fxRaf.current) return;
    let last = performance.now();
    const tick = (now: number) => {
      const ctx = fxCtxRef.current;
      const { w, h } = sizeRef.current;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!ctx) {
        fxRaf.current = 0;
        return;
      }
      ctx.clearRect(0, 0, w, h);

      // soft golden glow under the fingertip
      const f = finger.current;
      if (f && drawing.current && !revealedRef.current) {
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, BRUSH_RADIUS * 2.6);
        g.addColorStop(0, 'rgba(255,246,222,0.55)');
        g.addColorStop(0.5, 'rgba(216,197,165,0.22)');
        g.addColorStop(1, 'rgba(216,197,165,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, BRUSH_RADIUS * 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      const list = flakes.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.life += dt;
        if (p.life >= p.max) {
          list.splice(i, 1);
          continue;
        }
        p.vy += 520 * dt; // gravity
        p.vx *= 0.985;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        const a = 1 - p.life / p.max;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        // tiny diamond flake
        ctx.beginPath();
        ctx.moveTo(0, -p.r);
        ctx.lineTo(p.r * 0.6, 0);
        ctx.lineTo(0, p.r);
        ctx.lineTo(-p.r * 0.6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      if (list.length || drawing.current) fxRaf.current = requestAnimationFrame(tick);
      else {
        ctx.clearRect(0, 0, w, h);
        fxRaf.current = 0;
      }
    };
    fxRaf.current = requestAnimationFrame(tick);
  }, []);

  const spray = (x: number, y: number, dx: number, dy: number, n: number) => {
    if (reduceMotion()) return;
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * Math.PI * 2;
      const sp = 40 + Math.random() * 110;
      flakes.current.push({
        x: x + (Math.random() - 0.5) * BRUSH_RADIUS,
        y: y + (Math.random() - 0.5) * BRUSH_RADIUS,
        vx: Math.cos(ang) * sp + dx * 6,
        vy: Math.sin(ang) * sp - 90 + dy * 4,
        r: 1.6 + Math.random() * 2.6,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 14,
        life: 0,
        max: 0.45 + Math.random() * 0.45,
        c: FLAKE_COLOURS[(Math.random() * FLAKE_COLOURS.length) | 0],
      });
    }
    if (flakes.current.length > 260) flakes.current.splice(0, flakes.current.length - 260);
    runFx();
  };

  const paintSurface = useCallback(() => {
    const canvas = canvasRef.current;
    const fx = fxRef.current;
    const container = containerRef.current;
    if (!canvas || !fx || !container || revealedRef.current) return;

    const { width: w, height: h } = container.getBoundingClientRect();
    if (!w || !h) return;
    sizeRef.current = { w, h };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    for (const c of [canvas, fx]) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    }
    const ctx = canvas.getContext('2d');
    const fxCtx = fx.getContext('2d');
    if (!ctx || !fxCtx) return;
    ctxRef.current = ctx;
    fxCtxRef.current = fxCtx;
    fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
    const { title, sub, lang: l } = surfaceText.current;
    ctx.font =
      l === 'hi'
        ? '400 25px "Tiro Devanagari Hindi", Georgia, serif'
        : 'italic 500 27px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(title, w / 2, h / 2 - 12);
    ctx.fillStyle = '#8C6F43';
    ctx.font = l === 'hi' ? '400 14px "Tiro Devanagari Hindi", serif' : '600 11px "Cinzel", serif';
    ctx.letterSpacing = l === 'hi' ? '0.02em' : '0.25em'; // Devanagari words must stay joined
    ctx.fillText(sub, w / 2, h / 2 + 19);
    ctx.letterSpacing = '0px';

    const cols = Math.ceil(w / CELL);
    const rows = Math.ceil(h / CELL);
    grid.current = { cols, rows, hit: new Uint8Array(cols * rows), count: 0 };
    milestone.current = 0;
    setProgress(0);
  }, []);

  useEffect(() => {
    // Wait for web fonts so the canvas text renders in the right typeface.
    let cancelled = false;
    Promise.all([
      document.fonts?.load('italic 500 27px "Cormorant Garamond"').catch(() => []),
      document.fonts?.load('600 11px "Cinzel"').catch(() => []),
    ]).then(() => !cancelled && paintSurface());
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
      cancelAnimationFrame(fxRaf.current);
      fxRaf.current = 0;
    };
  }, [paintSurface]);

  // Language switched → repaint the foil in the new language (only if the guest hasn't started scratching).
  const firstLang = useRef(lang);
  useEffect(() => {
    if (lang === firstLang.current && lang === 'en') return;
    firstLang.current = lang;
    let cancelled = false;
    const repaint = () => !cancelled && !revealedRef.current && grid.current.count === 0 && paintSurface();
    if (lang === 'hi') {
      // the Devanagari font file only downloads on demand — wait for it so the canvas doesn't paint a fallback
      Promise.all([
        document.fonts?.load('400 25px "Tiro Devanagari Hindi"', 'खुरचें और देखें शुभ तिथि').catch(() => []),
      ]).then(repaint);
    }
    repaint();
    return () => {
      cancelled = true;
    };
  }, [lang, paintSurface]);

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
    drawing.current = false;
    setIsRevealed(true);
    setProgress(1);
    navigator.vibrate?.([12, 40, 18, 40, 28]);

    // celebratory burst of gold flakes from across the card
    const { w, h } = sizeRef.current;
    if (!reduceMotion()) {
      for (let i = 0; i < 90; i++) {
        flakes.current.push({
          x: w / 2 + (Math.random() - 0.5) * w * 0.8,
          y: h / 2 + (Math.random() - 0.5) * h * 0.5,
          vx: (Math.random() - 0.5) * 260,
          vy: -120 - Math.random() * 260,
          r: 1.8 + Math.random() * 3,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 16,
          life: 0,
          max: 0.8 + Math.random() * 0.7,
          c: FLAKE_COLOURS[(Math.random() * FLAKE_COLOURS.length) | 0],
        });
      }
      runFx();
    }
    window.dispatchEvent(new CustomEvent('petal-burst', { detail: { intensity: 0.35 } }));
    onRevealRef.current?.();
  }, [runFx]);

  const scratchTo = (x: number, y: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    // erase strength = source alpha, so use fully opaque colours (the paint step leaves translucent ones set)
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
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
      const shown = Math.min(1, p / REVEAL_AT);
      setProgress(shown);
      // a firmer haptic tick at every quarter — small rewards keep the guest scratching
      const q = Math.floor(shown * 4);
      if (q > milestone.current && q < 4) {
        milestone.current = q;
        navigator.vibrate?.(14);
      }
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
    setTouched(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    lastPoint.current = null;
    const p = localPoint(e);
    finger.current = p;
    scratchTo(p.x, p.y);
    spray(p.x, p.y, 0, 0, 6);
    navigator.vibrate?.(6);
    scheduleProgress();
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || revealedRef.current) return;
    const before = lastPoint.current;
    // Coalesced events give every touch sample between frames → smooth, gap-free strokes.
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent];
    for (const ev of events.length ? events : [e.nativeEvent]) {
      const p = localPoint(ev);
      scratchTo(p.x, p.y);
    }
    const p = lastPoint.current!;
    finger.current = p;
    const dx = before ? p.x - before.x : 0;
    const dy = before ? p.y - before.y : 0;
    // faster strokes throw more flakes
    spray(p.x, p.y, dx, dy, Math.min(5, 1 + Math.round(Math.hypot(dx, dy) / 8)));
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
    finger.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const date = fmt.date(WEDDING_DATE_ISO);
  const pct = Math.round(progress * 100);

  return (
    <section className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] mx-auto py-6 px-4">
      <div
        ref={containerRef}
        className={`relative w-full min-h-[190px] bg-white rounded-2xl border shadow-xs select-none overflow-hidden flex flex-col items-center justify-center px-3 py-6 text-center transition-[border-color,box-shadow] duration-700 ${
          isRevealed ? 'border-[#D8C5A5] scratch-revealed' : 'border-[#DDDCD3]'
        }`}
      >
        <div className={`relative flex flex-col items-center ${isRevealed ? 'date-pop' : ''}`}>
          <div className="w-10 h-0.5 bg-[#C9AE82] mb-3 rounded-full" />
          <p className="t-label text-[11px] mb-2">{UI.saveTheDate}</p>
          {/* always one line: scales with the phone width, caps at the desktop size */}
          <h2 className={`t-display whitespace-nowrap text-[clamp(26px,9vw,42px)] leading-tight ${isRevealed ? 'date-shine' : ''}`}>
            {date}
          </h2>
          <p className="t-detail text-[12px] mt-2">
            {fmt.weekday(WEDDING_DATE_ISO)} · {fmt.time(WEDDING_DATE_ISO)}
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
          aria-label={UI.scratchAria(date)}
          className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing transition-[opacity,transform,filter] duration-700 ease-out ${
            isRevealed ? 'opacity-0 scale-110 blur-[2px] pointer-events-none' : 'opacity-100'
          }`}
          style={{ touchAction: 'none' }}
        />

        {/* idle invitation to play: a foil shimmer sweep + a finger tracing a scratch path */}
        {!touched && !isRevealed && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl" aria-hidden="true">
            <div className="foil-sweep absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/55 to-transparent" />
            <div className="finger-hint absolute left-1/2 top-[68%]">
              <span className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-[#C9AE82]/30 finger-ripple" />
              <Pointer className="relative w-6 h-6 text-[#6F5A35] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" strokeWidth={1.6} />
            </div>
          </div>
        )}

        {/* gold flakes + fingertip glow */}
        <canvas ref={fxRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
      </div>

      {/* Progress feedback: seeing the bar fill keeps guests scratching (goal-gradient effect) */}
      <div
        className={`mt-3 flex flex-col items-center gap-2 transition-opacity duration-500 ${isRevealed ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden={isRevealed}
      >
        <div className="relative w-40 h-[4px] rounded-full bg-[#ECE7DC] overflow-hidden">
          <div
            className="h-full w-full rounded-full bg-gradient-to-r from-[#D8C5A5] via-[#C9AE82] to-[#B39363] origin-left transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
        <p className="t-detail text-[11px] tabular-nums">
          {progress === 0
            ? UI.scratchStart
            : progress < 0.5
              ? UI.keepGoing(pct)
              : progress < 0.8
                ? UI.halfway(pct)
                : UI.almost(pct)}
        </p>
      </div>
    </section>
  );
};
