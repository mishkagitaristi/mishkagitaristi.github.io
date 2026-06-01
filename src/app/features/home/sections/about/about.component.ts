import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ABOUT_HIGHLIGHTS, CAREER_TIMELINE } from '../../../../core/data/portfolio.data';
import { SectionHeadingComponent } from '../../../../shared/components/section-heading/section-heading.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TranslateModule, SectionHeadingComponent, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="about" class="section about" aria-labelledby="about-heading">
      <div class="container">
        <app-section-heading
          sectionId="about-heading"
          labelKey="about.label"
          titleKey="about.title"
          subtitleKey="about.subtitle"
        />

        <div class="about__grid">
          <div class="about__highlights" appScrollReveal="left">
            <ul class="about__list">
              @for (key of highlights; track key) {
                <li class="about__item">
                  <span class="about__bullet" aria-hidden="true"></span>
                  {{ key | translate }}
                </li>
              }
            </ul>
          </div>

          <div class="about__timeline" appScrollReveal="right">
            <h3 class="about__timeline-title">{{ 'about.journeyTitle' | translate }}</h3>
            <div class="timeline">
              @for (node of timeline; track node.id; let last = $last) {
                <div class="timeline__item" appScrollReveal="up" [revealDelay]="$index * 100">
                  <div class="timeline__marker" [class.timeline__marker--last]="last">
                    <span class="timeline__dot"></span>
                  </div>
                  <div class="timeline__content">
                    <span class="timeline__year">{{ node.yearKey | translate }}</span>
                    <h4 class="timeline__title">{{ node.titleKey | translate }}</h4>
                    <p class="timeline__description">{{ node.descriptionKey | translate }}</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    @use 'styles/mixins';

    .about__grid {
      display: grid;
      gap: 3rem;

      @include mixins.respond-to(lg) {
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
      }
    }

    .about__list {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }

    .about__item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      color: var(--text-secondary);
      font-size: 0.9375rem;
      line-height: 1.6;
    }

    .about__bullet {
      flex-shrink: 0;
      width: 6px;
      height: 6px;
      margin-top: 0.5rem;
      border-radius: 50%;
      background: var(--accent-gradient);
    }

    .about__timeline-title {
      font-size: 1.125rem;
      margin-bottom: 1.5rem;
    }

    .timeline__item {
      display: flex;
      gap: 1.25rem;
    }

    .timeline__marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 16px;
      flex-shrink: 0;

      &::after {
        content: '';
        flex: 1;
        width: 2px;
        background: var(--border-medium);
        margin-top: 0.5rem;
      }

      &--last::after {
        display: none;
      }
    }

    .timeline__dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--accent-gradient);
      box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
    }

    .timeline__content {
      padding-bottom: 2rem;
    }

    .timeline__year {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--accent-from);
      letter-spacing: 0.05em;
    }

    .timeline__title {
      font-size: 1rem;
      margin: 0.25rem 0 0.375rem;
    }

    .timeline__description {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }
  `,
})
export class AboutComponent {
  protected readonly highlights = ABOUT_HIGHLIGHTS;
  protected readonly timeline = CAREER_TIMELINE;
}
