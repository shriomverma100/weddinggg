// ─────────────────────────────────────────────────────────────
// Soft generative background music (Web Audio, no audio file):
//   • tanpura-style drone  (Pa · Sa · Sa · low Sa, plucked in a slow cycle)
//   • a warm sustained pad on Sa + Pa
//   • a slow flute/bell melody wandering through Raag Bhupali (Sa Re Ga Pa Dha)
// Everything runs through a soft reverb + echo, at a gentle volume.
// Must be started from a user gesture (browsers block autoplay with sound).
// ─────────────────────────────────────────────────────────────

const SA = 146.83; // D3
const ratio = (semis: number) => Math.pow(2, semis / 12);
// Bhupali: Sa Re Ga Pa Dha → 0 2 4 7 9 semitones; melody spans Sa (D4) to Ga' (F#5)
const SCALE = [0, 2, 4, 7, 9, 12, 14, 16].map((s) => SA * 2 * ratio(s));
const REST_DEGREES = [0, 3, 5]; // phrases come to rest on Sa, Pa or upper Sa

const MASTER_LEVEL = 0.42;

class AmbientMusic {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private wet!: GainNode;
  private timer = 0;
  private nextDrone = 0;
  private droneStep = 0;
  private nextNote = 0;
  private degree = 0;
  private phraseLeft = 0;
  private pad: OscillatorNode[] = [];
  private listeners = new Set<(on: boolean) => void>();
  playing = false;

  onChange(fn: (on: boolean) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  private emit() {
    this.listeners.forEach((fn) => fn(this.playing));
  }

  private build() {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return false;
    const ctx = new AC();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0;
    // gentle top-end roll-off so nothing sounds sharp on phone speakers
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 3800;
    this.master.connect(tone).connect(ctx.destination);

    // reverb: generated impulse response (decaying stereo noise)
    const len = Math.round(ctx.sampleRate * 3.2);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    const verb = ctx.createConvolver();
    verb.buffer = ir;
    const verbGain = ctx.createGain();
    verbGain.gain.value = 0.55;
    verb.connect(verbGain).connect(this.master);

    // soft echo
    const delay = ctx.createDelay(2);
    delay.delayTime.value = 0.42;
    const fb = ctx.createGain();
    fb.gain.value = 0.28;
    const damp = ctx.createBiquadFilter();
    damp.type = 'lowpass';
    damp.frequency.value = 2200;
    delay.connect(damp).connect(fb).connect(delay);
    damp.connect(verb);

    this.wet = ctx.createGain();
    this.wet.gain.value = 1;
    this.wet.connect(verb);
    this.wet.connect(delay);

    // sustained pad: Sa + Pa + upper Sa, breathing slowly
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 700;
    const padGain = ctx.createGain();
    padGain.gain.value = 0.05;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 0.02;
    lfo.connect(lfoDepth).connect(padGain.gain);
    lfo.start();
    padFilter.connect(padGain);
    padGain.connect(this.master);
    padGain.connect(this.wet);
    for (const [f, type, det] of [
      [SA, 'triangle', -4],
      [SA * 1.5, 'sine', 3],
      [SA * 2, 'sine', 0],
    ] as const) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = f;
      o.detune.value = det;
      o.connect(padFilter);
      o.start();
      this.pad.push(o);
    }
    this.pad.push(lfo);
    return true;
  }

  /** One tanpura pluck: two slightly detuned saws through a closing low-pass (the "jawari" shimmer). */
  private pluck(f: number, t: number) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.045, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 4.2);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.Q.value = 3;
    lp.frequency.setValueAtTime(2400, t);
    lp.frequency.exponentialRampToValueAtTime(380, t + 3.5);
    lp.connect(g);
    g.connect(this.master);
    g.connect(this.wet);
    for (const det of [-5, 6]) {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      o.detune.value = det;
      o.connect(lp);
      o.start(t);
      o.stop(t + 4.4);
    }
  }

  /** A soft flute-like note: sine + faint overtone, slow breath attack, gentle vibrato. */
  private note(f: number, t: number, dur: number) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.07, t + 0.14);
    g.gain.setTargetAtTime(0.045, t + 0.2, 0.4);
    g.gain.setTargetAtTime(0.0001, t + dur, 0.35);
    g.connect(this.master);
    g.connect(this.wet);

    const vib = ctx.createOscillator();
    vib.frequency.value = 4.8;
    const vibDepth = ctx.createGain();
    vibDepth.gain.setValueAtTime(0, t);
    vibDepth.gain.linearRampToValueAtTime(f * 0.004, t + 0.6);
    vib.connect(vibDepth);

    const end = t + dur + 1.8;
    for (const [mult, lvl, type] of [
      [1, 1, 'sine'],
      [2, 0.12, 'sine'],
      [3, 0.04, 'triangle'],
    ] as const) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = f * mult;
      vibDepth.connect(o.frequency);
      const lg = ctx.createGain();
      lg.gain.value = lvl;
      o.connect(lg).connect(g);
      o.start(t);
      o.stop(end);
    }
    vib.start(t);
    vib.stop(end);
  }

  private schedule = () => {
    const ctx = this.ctx;
    if (!ctx) return;
    const horizon = ctx.currentTime + 1.2;

    // drone cycle: Pa · Sa' · Sa' · Sa (low)
    const droneNotes = [SA * 0.75, SA, SA, SA / 2];
    while (this.nextDrone < horizon) {
      this.pluck(droneNotes[this.droneStep % 4], this.nextDrone);
      this.droneStep++;
      this.nextDrone += this.droneStep % 4 === 0 ? 1.9 : 1.25;
    }

    // melody: short phrases that wander stepwise, then rest
    while (this.nextNote < horizon) {
      if (this.phraseLeft <= 0) {
        this.phraseLeft = 4 + Math.floor(Math.random() * 4);
        this.nextNote += 2.4 + Math.random() * 2.6; // breathing space between phrases
        continue;
      }
      const lastOfPhrase = this.phraseLeft === 1;
      if (lastOfPhrase) {
        this.degree = REST_DEGREES.reduce((a, b) => (Math.abs(b - this.degree) < Math.abs(a - this.degree) ? b : a));
      } else {
        const step = [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)];
        this.degree = Math.max(0, Math.min(SCALE.length - 1, this.degree + step));
      }
      const dur = lastOfPhrase ? 2.2 : [0.55, 0.8, 0.8, 1.1, 1.5][Math.floor(Math.random() * 5)];
      this.note(SCALE[this.degree], this.nextNote, dur);
      this.nextNote += dur + 0.05;
      this.phraseLeft--;
    }
  };

  start() {
    if (this.playing) return;
    if (!this.ctx && !this.build()) return;
    const ctx = this.ctx!;
    void ctx.resume();
    const now = ctx.currentTime;
    if (this.nextDrone < now) this.nextDrone = now + 0.1;
    if (this.nextNote < now) this.nextNote = now + 2.5; // let the drone settle before the melody enters
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(MASTER_LEVEL, now + 4);
    this.schedule();
    this.timer = window.setInterval(this.schedule, 300);
    this.playing = true;
    this.emit();
  }

  stop() {
    if (!this.playing || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + 0.8);
    window.clearInterval(this.timer);
    this.playing = false;
    this.emit();
    window.setTimeout(() => !this.playing && void ctx.suspend(), 900);
  }

  toggle() {
    if (this.playing) this.stop();
    else this.start();
  }

  /** Pause while the tab is hidden; resume when the guest comes back. */
  pauseForHidden(hidden: boolean) {
    if (!this.ctx || !this.playing) return;
    if (hidden) {
      window.clearInterval(this.timer);
      void this.ctx.suspend();
    } else {
      void this.ctx.resume().then(() => {
        const now = this.ctx!.currentTime;
        this.nextDrone = Math.max(this.nextDrone, now + 0.1);
        this.nextNote = Math.max(this.nextNote, now + 0.5);
        window.clearInterval(this.timer);
        this.timer = window.setInterval(this.schedule, 300);
      });
    }
  }
}

export const synth = new AmbientMusic();
