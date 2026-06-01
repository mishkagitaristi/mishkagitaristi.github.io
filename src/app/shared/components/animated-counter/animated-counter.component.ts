import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-animated-counter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="counter" [attr.aria-label]="value() + (suffix() ?? '')">
      {{ displayValue() }}{{ suffix() }}
    </span>
  `,
  styles: `
    .counter {
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      font-weight: 700;
      letter-spacing: -0.03em;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `,
})
export class AnimatedCounterComponent implements OnInit, OnDestroy {
  readonly target = input.required<number>();
  readonly suffix = input<string>();
  readonly duration = input(2000);

  protected readonly displayValue = signal(0);

  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;
  private animated = false;

  protected value(): number {
    return this.target();
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.displayValue.set(this.target());
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !this.animated) {
          this.animated = true;
          this.animateCount();
          this.observer?.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private animateCount(): void {
    const target = this.target();
    const duration = this.duration();
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.displayValue.set(Math.round(target * eased));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }
}
