import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { EDUCATION } from '@core/data/education.data';
import { timelineReveal } from '@shared/animations/portfolio.animations';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [TranslateModule, SectionHeadingComponent, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [timelineReveal],
  template: `
    <section id="education" class="section education" aria-labelledby="education-heading">
      <div class="container">
        <app-section-heading
          sectionId="education-heading"
          labelKey="education.label"
          titleKey="education.title"
          subtitleKey="education.subtitle"
        />

        <div class="education__list">
          @for (item of education; track item.id) {
            <article class="education__card" appScrollReveal="up" [revealDelay]="$index * 100" @timelineReveal>
              <div class="education__header">
                <div>
                  <h3 class="education__institution">{{ item.institutionKey | translate }}</h3>
                  <p class="education__credential">{{ item.credentialKey | translate }}</p>
                </div>
                <span class="education__period">{{ item.periodKey | translate }}</span>
              </div>
              @if (item.descriptionKey) {
                <p class="education__description">{{ item.descriptionKey | translate }}</p>
              }
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    @use 'styles/mixins';

    .education__list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 800px;
      margin-inline: auto;
    }

    .education__card {
      @include mixins.glass-card;
      padding: 1.75rem;
    }

    .education__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 0.75rem;
    }

    .education__institution {
      font-size: 1.25rem;
    }

    .education__credential {
      color: var(--accent-from);
      font-size: 0.9375rem;
      font-weight: 500;
      margin-top: 0.25rem;
    }

    .education__period {
      font-size: 0.8125rem;
      color: var(--text-muted);
      white-space: nowrap;
    }

    .education__description {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }
  `,
})
export class EducationComponent {
  protected readonly education = EDUCATION;
}
