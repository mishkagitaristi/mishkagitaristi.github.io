import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { EXPERTISE } from '@core/data/expertise.data';
import { getExpertiseIcon } from '@core/data/expertise.icons';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-expertise',
  standalone: true,
  imports: [TranslateModule, SectionHeadingComponent, GlassCardComponent, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="expertise" class="section expertise" aria-labelledby="expertise-heading">
      <div class="container">
        <app-section-heading
          sectionId="expertise-heading"
          labelKey="expertise.label"
          titleKey="expertise.title"
        />

        <div class="expertise__grid">
          @for (item of expertise; track item.id) {
            <div appScrollReveal="up" [revealDelay]="$index * 80">
              <app-glass-card>
                <div class="expertise__card">
                  <div class="expertise__icon" [innerHTML]="getIcon(item.icon)" aria-hidden="true"></div>
                  <h3 class="expertise__title">{{ item.titleKey | translate }}</h3>
                  <p class="expertise__description">{{ item.descriptionKey | translate }}</p>
                </div>
              </app-glass-card>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    @use 'styles/mixins';

    .expertise__grid {
      display: grid;
      gap: 1.25rem;
      grid-template-columns: 1fr;

      @include mixins.respond-to(sm) {
        grid-template-columns: repeat(2, 1fr);
      }

      @include mixins.respond-to(lg) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .expertise__card {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .expertise__icon {
      width: 40px;
      height: 40px;
      color: var(--accent-from);

      :deep(svg) {
        width: 100%;
        height: 100%;
      }
    }

    .expertise__title {
      font-size: 1.0625rem;
    }

    .expertise__description {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }
  `,
})
export class ExpertiseComponent {
  protected readonly expertise = EXPERTISE;
  protected readonly getIcon = getExpertiseIcon;
}
