import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  afterNextRender,
  inject,
  input,
  viewChild,
} from '@angular/core';

type StringState = 'idle' | 'bent' | 'vibrating';

interface PluckString {
  /** Vertical position as a fraction of canvas height. */
  yRatio: number;
  /** Open-string frequency in Hz (bass tuning E1–A1–D2–G2). */
  freq: number;
  lineWidth: number;
  state: StringState;
  grabX: number;
  offset: number;
  amplitude: number;
  releasedAt: number;
  visualFreq: number;
}

const MAX_BEND = 48;
const DAMPING = 2.2;

@Component({
  selector: 'app-bass-strings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas class="strings-canvas" aria-hidden="true"></canvas>`,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      display: block;
      pointer-events: none;
    }

    .strings-canvas {
      width: 100%;
      height: 100%;
    }
  `,
})
export class BassStringsComponent {
  readonly soundEnabled = input(false);

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  private ctx: CanvasRenderingContext2D | null = null;
  private strings: PluckString[] = [];
  private rafId = 0;
  private prevPointer: { x: number; y: number } | null = null;
  private reducedMotion = false;
  private audioCtx: AudioContext | null = null;
  private colors = { idle: 'rgba(255,255,255,0.16)', active: 'rgba(255,180,84,0.75)' };

  constructor() {
    afterNextRender(() => this.init());
  }

  private init(): void {
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) {
      return;
    }

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.strings = [
      { yRatio: 0.62, freq: 98.0, lineWidth: 1.6, ...this.restState(3.8) },
      { yRatio: 0.72, freq: 73.42, lineWidth: 2.1, ...this.restState(3.2) },
      { yRatio: 0.82, freq: 55.0, lineWidth: 2.6, ...this.restState(2.6) },
      { yRatio: 0.92, freq: 41.2, lineWidth: 3.2, ...this.restState(2.1) },
    ];

    this.zone.runOutsideAngular(() => {
      const onMove = (e: PointerEvent) => this.onPointerMove(e);
      const onLeave = () => this.releaseAll();
      const onResize = () => {
        this.resize();
        this.draw(performance.now());
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      window.addEventListener('resize', onResize);

      const themeObserver = new MutationObserver(() => {
        this.readColors();
        this.draw(performance.now());
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });

      this.destroyRef.onDestroy(() => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerdown', onMove);
        document.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('resize', onResize);
        themeObserver.disconnect();
        cancelAnimationFrame(this.rafId);
        this.audioCtx?.close();
      });

      this.resize();
      this.readColors();
      this.draw(performance.now());
    });
  }

  private restState(visualFreq: number) {
    return {
      state: 'idle' as StringState,
      grabX: 0,
      offset: 0,
      amplitude: 0,
      releasedAt: 0,
      visualFreq,
    };
  }

  private resize(): void {
    const canvas = this.canvasRef().nativeElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private readColors(): void {
    const style = getComputedStyle(document.documentElement);
    this.colors = {
      idle: style.getPropertyValue('--string-color').trim() || this.colors.idle,
      active: style.getPropertyValue('--string-active-color').trim() || this.colors.active,
    };
  }

  private onPointerMove(e: PointerEvent): void {
    const rect = this.canvasRef().nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
    const prev = this.prevPointer;
    this.prevPointer = { x, y };

    if (!inside) {
      this.releaseAll();
      return;
    }

    for (const s of this.strings) {
      const sy = s.yRatio * rect.height;

      if (s.state === 'bent') {
        const offset = y - sy;
        if (Math.abs(offset) >= MAX_BEND) {
          this.release(s, Math.sign(offset) * MAX_BEND);
        } else {
          s.offset = offset;
          s.grabX = x;
        }
        continue;
      }

      const crossed = prev && (prev.y - sy) * (y - sy) < 0;
      if (crossed && !this.reducedMotion) {
        s.state = 'bent';
        s.grabX = x;
        s.offset = y - sy;
      }
    }

    this.ensureLoop();
  }

  private releaseAll(): void {
    for (const s of this.strings) {
      if (s.state === 'bent') {
        this.release(s, s.offset);
      }
    }
    this.prevPointer = null;
    this.ensureLoop();
  }

  private release(s: PluckString, amplitude: number): void {
    if (Math.abs(amplitude) < 3) {
      s.state = 'idle';
      s.offset = 0;
      return;
    }
    s.state = 'vibrating';
    s.amplitude = amplitude;
    s.releasedAt = performance.now();
    if (this.soundEnabled()) {
      this.playPluck(s.freq, Math.abs(amplitude) / MAX_BEND);
    }
  }

  private ensureLoop(): void {
    if (this.rafId) {
      return;
    }
    const tick = (now: number) => {
      this.rafId = 0;
      const active = this.step(now);
      this.draw(now);
      if (active) {
        this.rafId = requestAnimationFrame(tick);
      }
    };
    this.rafId = requestAnimationFrame(tick);
  }

  /** Advances vibration state; returns true while any string still moves. */
  private step(now: number): boolean {
    let active = false;
    for (const s of this.strings) {
      if (s.state === 'bent') {
        active = true;
      } else if (s.state === 'vibrating') {
        const t = (now - s.releasedAt) / 1000;
        const envelope = Math.abs(s.amplitude) * Math.exp(-DAMPING * t);
        if (envelope < 0.4) {
          s.state = 'idle';
          s.offset = 0;
        } else {
          s.offset = s.amplitude * Math.exp(-DAMPING * t) * Math.cos(2 * Math.PI * s.visualFreq * t);
          active = true;
        }
      }
    }
    return active;
  }

  private draw(_now: number): void {
    const ctx = this.ctx;
    if (!ctx) {
      return;
    }
    const rect = this.canvasRef().nativeElement.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    for (const s of this.strings) {
      const sy = s.yRatio * rect.height;
      const activeString = s.state !== 'idle';
      ctx.beginPath();
      ctx.lineWidth = s.lineWidth;
      ctx.strokeStyle = activeString ? this.colors.active : this.colors.idle;
      ctx.shadowBlur = activeString ? 12 : 0;
      ctx.shadowColor = this.colors.active;
      ctx.moveTo(0, sy);
      if (activeString) {
        // Control point doubled so the curve itself passes through ~offset.
        ctx.quadraticCurveTo(s.grabX, sy + s.offset * 2, rect.width, sy);
      } else {
        ctx.lineTo(rect.width, sy);
      }
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }

  /** Karplus–Strong plucked-string synthesis — no audio assets needed. */
  private playPluck(freq: number, velocity: number): void {
    try {
      this.audioCtx ??= new AudioContext();
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
      const sr = ctx.sampleRate;
      const buffer = ctx.createBuffer(1, Math.floor(sr * 1.8), sr);
      const data = buffer.getChannelData(0);
      const period = Math.max(2, Math.round(sr / freq));
      const ring = new Float32Array(period);
      for (let i = 0; i < period; i++) {
        ring[i] = Math.random() * 2 - 1;
      }
      let idx = 0;
      for (let i = 0; i < data.length; i++) {
        const next = (idx + 1) % period;
        ring[idx] = 0.997 * 0.5 * (ring[idx] + ring[next]);
        data[i] = ring[idx];
        idx = next;
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = 0.12 + 0.18 * Math.min(velocity, 1);
      src.connect(gain).connect(ctx.destination);
      src.start();
    } catch {
      // Audio is a progressive enhancement — never let it break the page.
    }
  }
}
