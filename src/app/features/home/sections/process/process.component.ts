import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { PROCESS_STEPS } from '@core/data/services.data';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [TranslateModule, SectionHeadingComponent, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="process" class="section process" aria-labelledby="process-heading">
      <div class="container">
        <app-section-heading
          sectionId="process-heading"
          labelKey="process.label"
          titleKey="process.title"
          subtitleKey="process.subtitle"
        />

        <ol class="process__steps">
          @for (step of steps; track step.id) {
            <li class="process__step" appScrollReveal="up" [revealDelay]="$index * 100">
              <span class="process__number" aria-hidden="true">0{{ $index + 1 }}</span>
              <h3 class="process__step-title">{{ step.titleKey | translate }}</h3>
              <p class="process__step-description">{{ step.descriptionKey | translate }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: `
    @use 'styles/mixins';

    .process {
      background: var(--bg-secondary);
    }

    .process__steps {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: 1fr;
      counter-reset: step;

      @include mixins.respond-to(sm) {
        grid-template-columns: repeat(2, 1fr);
      }

      @include mixins.respond-to(lg) {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .process__step {
      position: relative;
      padding: 1.5rem;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      background: var(--bg-primary);
      transition: border-color var(--transition-base), transform var(--transition-base);

      &:hover {
        border-color: var(--accent-from);
        transform: translateY(-4px);
      }
    }

    .process__number {
      display: block;
      font-family: var(--font-mono);
      font-size: 2rem;
      font-weight: 500;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.75rem;
    }

    .process__step-title {
      font-size: 1.0625rem;
      margin-bottom: 0.5rem;
    }

    .process__step-description {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }
  `,
})
export class ProcessComponent {
  protected readonly steps = PROCESS_STEPS;
}
