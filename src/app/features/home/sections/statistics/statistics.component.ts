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

    .statistics {
      background: var(--bg-secondary);
    }

    .statistics__grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;

      @include mixins.respond-to(md) {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .statistics__item {
      text-align: center;
      padding: 2rem 1rem;
    }

    .statistics__label {
      margin-top: 0.75rem;
      font-size: 0.9375rem;
      color: var(--text-secondary);
    }
  `,
})
export class StatisticsComponent {
  protected readonly stats = STATS;
}
