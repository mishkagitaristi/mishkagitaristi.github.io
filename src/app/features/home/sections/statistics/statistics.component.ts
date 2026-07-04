import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { STATS } from '@core/data/stats.data';
import { AnimatedCounterComponent } from '@shared/components/animated-counter/animated-counter.component';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [TranslateModule, SectionHeadingComponent, AnimatedCounterComponent, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="statistics" class="section statistics" aria-labelledby="stats-heading">
      <div class="container">
        <app-section-heading
          sectionId="stats-heading"
          labelKey="stats.label"
          titleKey="stats.title"
        />

        <div class="statistics__grid">
          @for (stat of stats; track stat.id) {
            <div class="statistics__item" appScrollReveal="up" [revealDelay]="$index * 100">
              <app-animated-counter [target]="stat.value" [suffix]="stat.suffix" />
              <p class="statistics__label">{{ stat.labelKey | translate }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    @use 'styles/mixins';

    .statistics__grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem 0;

      @include mixins.respond-to(md) {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .statistics__item {
      text-align: left;
      padding: 0.5rem 2rem;
      border-left: 1px solid var(--border-subtle);

      &:first-child {
        border-left-color: transparent;
        padding-left: 0;
      }

      @media (max-width: 767px) {
        &:nth-child(odd) {
          border-left-color: transparent;
          padding-left: 0;
        }
      }
    }

    .statistics__label {
      margin-top: 0.625rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
    }
  `,
})
export class StatisticsComponent {
  protected readonly stats = STATS;
}
