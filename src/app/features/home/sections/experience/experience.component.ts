import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { EXPERIENCE } from '@core/data/experience.data';
import { timelineReveal } from '@shared/animations/portfolio.animations';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [TranslateModule, SectionHeadingComponent, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [timelineReveal],
  template: `
    <section id="experience" class="section experience" aria-labelledby="experience-heading">
      <div class="container">
        <app-section-heading
          sectionId="experience-heading"
          labelKey="experience.label"
          titleKey="experience.title"
          subtitleKey="experience.subtitle"
        />

        <div class="experience__timeline">
          <div class="experience__line" appScrollReveal="fade"></div>

          @for (item of experience; track item.id) {
            <article class="experience__item" appScrollReveal="left" [revealDelay]="$index * 150" @timelineReveal>
              <div class="experience__marker">
                <span class="experience__dot"></span>
              </div>
              <div class="experience__card">
                <div class="experience__header">
                  <div>
                    <h3 class="experience__company">{{ item.companyKey | translate }}</h3>
                    <p class="experience__role">{{ item.roleKey | translate }}</p>
                    @if (item.locationKey) {
                      <p class="experience__location">{{ item.locationKey | translate }}</p>
                    }
                  </div>
                  <span class="experience__period">{{ item.periodKey | translate }}</span>
                </div>
                <ul class="experience__list">
                  @for (key of item.responsibilityKeys; track key) {
                    <li class="experience__resp">{{ key | translate }}</li>
                  }
                </ul>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    @use 'styles/mixins';


    .experience__timeline {
      position: relative;
      max-width: 800px;
      margin-inline: auto;
    }

    .experience__line {
      position: absolute;
      left: 11px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(to bottom, var(--accent-from), var(--accent-to));
      opacity: 0.3;
    }

    .experience__item {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 2rem;
      position: relative;
    }

    .experience__marker {
      flex-shrink: 0;
      width: 24px;
      display: flex;
      justify-content: center;
      padding-top: 1.5rem;
    }

    .experience__dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--accent-gradient);
      border: 3px solid var(--bg-secondary);
      box-shadow: 0 0 16px rgba(99, 102, 241, 0.4);
    }

    .experience__card {
      flex: 1;
      @include mixins.glass-card;
      padding: 1.75rem;
    }

    .experience__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
    }

    .experience__company {
      font-size: 1.25rem;
    }

    .experience__role {
      color: var(--accent-from);
      font-size: 0.9375rem;
      font-weight: 500;
      margin-top: 0.25rem;
    }

    .experience__location {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    .experience__period {
      font-size: 0.8125rem;
      color: var(--text-muted);
      white-space: nowrap;
    }

    .experience__list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .experience__resp {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      padding-left: 1rem;
      position: relative;

      &::before {
        content: '→';
        position: absolute;
        left: 0;
        color: var(--accent-from);
        font-size: 0.75rem;
      }
    }
  `,
})
export class ExperienceComponent {
  protected readonly experience = EXPERIENCE;
}
