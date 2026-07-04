import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { PERSON } from '@core/config/person.config';
import { heroEnter } from '@shared/animations/portfolio.animations';
import { AnchorLinkDirective } from '@shared/directives/anchor-link.directive';

import { BassStringsComponent } from './bass-strings.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, TranslateModule, AnchorLinkDirective, BassStringsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [heroEnter],
  template: `
    <section class="hero" aria-labelledby="hero-heading" @heroEnter>
      <div class="hero__bg" aria-hidden="true">
        <div class="hero__gradient hero__gradient--1"></div>
        <div class="hero__gradient hero__gradient--2"></div>
        <div class="hero__gradient hero__gradient--3"></div>
      </div>
      <app-bass-strings [soundEnabled]="soundOn()" />

      <div class="hero__content container">
        <p class="hero__badge hero-animate">
          <span class="hero__badge-dot" aria-hidden="true"></span>
          {{ 'hero.availability' | translate }}
        </p>
        <h1 id="hero-heading" class="hero__name hero-animate">{{ person.name }}</h1>
        <p class="hero__headline hero-animate">
          {{ 'hero.headlineStart' | translate }}
          <span class="text-gradient">{{ 'hero.headlineAccent' | translate }}</span>
        </p>
        <p class="hero__subtitle hero-animate">{{ 'hero.subtitle' | translate }}</p>

        <div class="hero__actions hero-animate">
          <a routerLink="/contact" class="hero__btn hero__btn--primary">
            {{ 'hero.ctaStart' | translate }}
          </a>
          <a
            routerLink="/"
            fragment="work"
            appAnchorLink="work"
            class="hero__btn hero__btn--secondary"
          >
            {{ 'hero.ctaWork' | translate }}
          </a>
        </div>
      </div>

      <div class="hero__strings-ui hero-animate">
        <span class="hero__hint mono-label">{{ 'hero.pluckHint' | translate }}</span>
        <button
          type="button"
          class="hero__sound-toggle"
          (click)="toggleSound()"
          [attr.aria-pressed]="soundOn()"
          [attr.aria-label]="'hero.soundToggle' | translate"
        >
          {{ soundOn() ? '🔊' : '🔇' }}
        </button>
      </div>
    </section>
  `,
  styles: `
    @use 'styles/mixins';

    .hero {
      position: relative;
      min-height: calc(100vh - var(--header-height));
      display: flex;
      align-items: center;
      overflow: hidden;
    }

    .hero__bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .hero__gradient {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      animation: gradientShift 12s ease-in-out infinite;

      &--1 {
        width: 60%;
        height: 60%;
        top: -10%;
        right: -10%;
        background: var(--hero-gradient-1);
      }

      &--2 {
        width: 50%;
        height: 50%;
        bottom: -10%;
        left: -5%;
        background: var(--hero-gradient-2);
        animation-delay: -4s;
      }

      &--3 {
        width: 40%;
        height: 40%;
        top: 40%;
        left: 30%;
        background: var(--hero-gradient-3);
        animation-delay: -8s;
      }
    }

    .hero__content {
      position: relative;
      z-index: 1;
      max-width: 760px;
      padding-bottom: clamp(4rem, 12vh, 8rem);
    }

    .hero__badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.875rem;
      margin-bottom: 1.5rem;
      font-family: var(--font-mono);
      font-size: 0.8125rem;
      letter-spacing: 0.04em;
      color: var(--text-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: 999px;
      background: var(--bg-glass);
    }

    .hero__badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-alt);
      animation: pulse-glow 2s ease-in-out infinite;
    }

    .hero__name {
      font-family: var(--font-display);
      margin-bottom: 0.75rem;
    }

    .hero__headline {
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 3.2vw, 2.25rem);
      font-weight: 600;
      line-height: 1.25;
      letter-spacing: -0.02em;
      margin-bottom: 1.25rem;
      max-width: 640px;
    }

    .hero__subtitle {
      font-family: var(--font-body);
      font-size: clamp(1rem, 2vw, 1.125rem);
      color: var(--text-secondary);
      line-height: 1.7;
      max-width: 600px;
      margin-bottom: 2.5rem;
    }

    .hero__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .hero__btn {
      @include mixins.button-base;

      &--primary {
        @include mixins.button-primary;
      }

      &--secondary {
        @include mixins.button-secondary;
      }
    }

    .hero__strings-ui {
      position: absolute;
      left: clamp(1rem, 4vw, 2rem);
      bottom: 1.25rem;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .hero__hint {
      color: var(--text-muted);
      font-size: 0.75rem;
      text-transform: none;
      letter-spacing: 0.03em;
    }

    .hero__sound-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      font-size: 1rem;
      background: var(--bg-glass);
      border: 1px solid var(--border-subtle);
      border-radius: 50%;
      cursor: pointer;
      transition: border-color var(--transition-fast), transform var(--transition-fast);

      &:hover {
        border-color: var(--accent-from);
        transform: scale(1.05);
      }

      &:focus-visible {
        outline: 2px solid var(--accent-from);
        outline-offset: 2px;
      }
    }

    @media (pointer: coarse) {
      .hero__hint {
        display: none;
      }
    }
  `,
})
export class HeroComponent {
  protected readonly person = PERSON;
  protected readonly soundOn = signal(false);

  protected toggleSound(): void {
    this.soundOn.update((v) => !v);
  }
}
