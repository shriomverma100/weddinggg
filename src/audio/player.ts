// ─────────────────────────────────────────────────────────────
// Background music for the invitation.
//   1. Plays the track at TRACK_URL (put the MP3 in public/music/) — softly, looped, fading in.
//   2. If that file is missing or can't play, falls back to the generated Bhupali ambience.
// Same API either way: start / stop / toggle / onChange / pauseForHidden.
// ─────────────────────────────────────────────────────────────
import { synth } from './ambient';

const TRACK_URL = '/music/namo-namo-flute.mp3';
// Only this part of the track plays (seconds): 0:09 → 2:45, looping with a soft cross-fade.
const SEG_START = 9;
const SEG_END = 165;
const LOOP_FADE = 3; // fade out over the last 3 s, fade back in from the start point
const TRACK_LEVEL = 0.38; // soft: sits under the experience, never over it
const FADE_IN = 4;
const FADE_OUT = 0.8;

class MusicPlayer {
  private audio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private fileFailed = false;
  private fading = false;
  private usingSynth = false;
  private listeners = new Set<(on: boolean) => void>();
  playing = false;

  constructor() {
    if (typeof window === 'undefined') return;
    const a = new Audio();
    a.src = TRACK_URL;
    a.loop = false;
    a.preload = 'metadata'; // don't compete with the page's first load; streams once the guest taps
    // Segment looping: fade out just before SEG_END, jump back to SEG_START, fade in again.
    a.addEventListener('timeupdate', () => {
      if (!this.playing || this.usingSynth) return;
      const t = a.currentTime;
      if (t >= SEG_END || t < SEG_START - 0.5) {
        a.currentTime = SEG_START;
        this.fading = false;
        this.ramp(TRACK_LEVEL, LOOP_FADE);
      } else if (!this.fading && t >= SEG_END - LOOP_FADE) {
        this.fading = true;
        this.ramp(0, SEG_END - t);
      }
    });
    a.addEventListener('ended', () => {
      if (!this.playing || this.usingSynth) return;
      a.currentTime = SEG_START;
      this.fading = false;
      void a.play().then(() => this.ramp(TRACK_LEVEL, LOOP_FADE));
    });
    a.addEventListener('error', () => {
      this.fileFailed = true;
      // the guest already tapped "open" before the file turned out to be missing → switch over seamlessly
      if (this.playing && !this.usingSynth) this.startSynth();
    });
    this.audio = a;
    synth.onChange((on) => {
      if (!this.usingSynth) return;
      this.playing = on;
      this.emit();
    });
  }

  onChange(fn: (on: boolean) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  private emit() {
    this.listeners.forEach((fn) => fn(this.playing));
  }

  private startSynth() {
    this.usingSynth = true;
    synth.start();
  }

  /** Route the <audio> through Web Audio so the volume fade works on iPhones too (they ignore audio.volume). */
  private wire() {
    if (this.ctx || !this.audio) return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.gain = this.ctx.createGain();
    this.gain.gain.value = 0;
    this.ctx.createMediaElementSource(this.audio).connect(this.gain).connect(this.ctx.destination);
  }

  private ramp(to: number, secs: number) {
    if (this.ctx && this.gain) {
      const now = this.ctx.currentTime;
      this.gain.gain.cancelScheduledValues(now);
      this.gain.gain.setValueAtTime(this.gain.gain.value, now);
      this.gain.gain.linearRampToValueAtTime(to, now + secs);
    } else if (this.audio) {
      this.audio.volume = to;
    }
  }

  start() {
    if (this.playing) return;
    if (this.fileFailed || !this.audio) {
      this.startSynth();
      return;
    }
    this.usingSynth = false;
    this.wire();
    void this.ctx?.resume();
    this.playing = true;
    this.emit();
    const a = this.audio;
    if (a.currentTime < SEG_START || a.currentTime >= SEG_END - LOOP_FADE) a.currentTime = SEG_START;
    this.fading = false;
    a.play().then(
      () => this.ramp(TRACK_LEVEL, FADE_IN),
      () => {
        // file missing / blocked → generated music instead
        this.fileFailed = true;
        this.playing = false;
        this.startSynth();
      },
    );
  }

  stop() {
    if (!this.playing) return;
    if (this.usingSynth) {
      synth.stop();
      return;
    }
    this.playing = false;
    this.emit();
    this.ramp(0, FADE_OUT);
    const a = this.audio;
    window.setTimeout(() => !this.playing && a?.pause(), FADE_OUT * 1000 + 50);
  }

  toggle() {
    if (this.playing) this.stop();
    else this.start();
  }

  pauseForHidden(hidden: boolean) {
    if (this.usingSynth) {
      synth.pauseForHidden(hidden);
      return;
    }
    if (!this.playing || !this.audio) return;
    if (hidden) this.audio.pause();
    else void this.ctx?.resume().then(() => this.audio?.play().catch(() => {}));
  }
}

export const music = new MusicPlayer();
