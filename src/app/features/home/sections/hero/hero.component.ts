import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { PERSON } from '../../../../core/data/portfolio.data';
import { heroEnter } from '../../../../shared/animations/portfolio.animations';
import { AnchorLinkDirective } from '../../../../shared/directives/anchor-link.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, TranslateModule, AnchorLinkDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [heroEnter],
  template: `
    <section class="hero" aria-labelledby="hero-heading" @heroEnter>
      <div class="hero__bg" aria-hidden="true">
        <div class="hero__gradient hero__gradient--1"></div>
        <div class="hero__gradient hero__gradient--2"></div>
        <div class="hero__gradient hero__gradient--3"></div>
        <div class="hero__particles">
          @for (p of particles; track p) {
            <span
              class="hero__particle"
              [style.left.%]="p.x"
              [style.top.%]="p.y"
              [style.animation-delay.s]="p.delay"
            ></span>
          }
        </div>
      </div>

      <div class="hero__content container">
        <p class="hero__greeting hero-animate">{{ 'hero.greeting' | translate }}</p>
        <h1 id="hero-heading" class="hero__name hero-animate">{{ person.name }}</h1>
        <p class="hero__title hero-animate text-gradient">{{ 'hero.title' | translate }}</p>
        <p class="hero__subtitle hero-animate">{{ 'hero.subtitle' | translate }}</p>

        <div class="hero__actions hero-animate">
          <a routerLink="/" fragment="skills" appAnchorLink="skills" class="hero__btn hero__btn--primary">
            {{ 'hero.ctaSkills' | translate }}
          </a>
          <a routerLink="/contact" class="hero__btn hero__btn--secondary">
            {{ 'hero.ctaContact' | translate }}
          </a>
        </div>
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

    .hero__particles {
      position: absolute;
      inset: 0;
    }

    .hero__particle {
      position: absolute;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: var(--particle-color);
      animation: float 4s ease-in-out infinite;
    }

    .hero__content {
      position: relative;
      z-index: 1;
      max-width: 720px;
    }

    .hero__greeting {
      font-family: var(--font-body);
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--accent-from);
      margin-bottom: 1rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .hero__name {
      font-family: var(--font-display);
      margin-bottom: 0.5rem;
    }

    .hero__title {
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 600;
      margin-bottom: 1.25rem;
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
  `,
})
export class HeroComponent {
  protected readonly person = PERSON;

  protected readonly particles = Array.from({ length: 30 }, (_, i) => ({
    x: (i * 17 + 7) % 100,
    y: (i * 23 + 11) % 100,
    delay: (i % 5) * 0.8,
  }));
}
