import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { INTERESTS } from '@core/data/interests.data';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-interests',
  standalone: true,
  imports: [TranslateModule, SectionHeadingComponent, GlassCardComponent, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="interests" class="section interests" aria-labelledby="interests-heading">
      <div class="container">
        <app-section-heading
          sectionId="interests-heading"
          labelKey="interests.label"
          titleKey="interests.title"
          subtitleKey="interests.subtitle"
        />

        <div class="interests__grid">
          @for (item of interests; track item.id) {
            <div appScrollReveal="up" [revealDelay]="$index * 80">
              <app-glass-card>
                <div class="interests__card">
                  <div class="interests__illustration">
                    <img
                      class="interests__image"
                      [src]="item.image"
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <h3 class="interests__title">{{ item.titleKey | translate }}</h3>
                  <p class="interests__description">{{ item.descriptionKey | translate }}</p>
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

    .interests__grid {
      display: grid;
      gap: 1.25rem;
      grid-template-columns: 1fr;
      max-width: 960px;
      margin-inline: auto;

      @include mixins.respond-to(md) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .interests__card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: 100%;
    }

    .interests__illustration {
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
      background: linear-gradient(145deg, #16131f 0%, #241f33 55%, #1a1628 100%);
      min-height: 200px;
      padding: 1rem;
    }

    .interests__image {
      display: block;
      width: 100%;
      max-height: 180px;
      height: auto;
      object-fit: contain;
    }

    .interests__title {
      font-size: 1.0625rem;
    }

    .interests__description {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }
  `,
})
export class InterestsComponent {
  protected readonly interests = INTERESTS;
}
