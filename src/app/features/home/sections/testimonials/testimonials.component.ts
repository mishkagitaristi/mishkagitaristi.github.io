import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { TESTIMONIALS } from '@core/data/services.data';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [TranslateModule, SectionHeadingComponent, GlassCardComponent, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="testimonials" class="section testimonials" aria-labelledby="testimonials-heading">
      <div class="container">
        <app-section-heading
          sectionId="testimonials-heading"
          labelKey="testimonials.label"
          titleKey="testimonials.title"
          subtitleKey="testimonials.subtitle"
        />

        <div class="testimonials__grid">
          @for (t of testimonials; track t.id) {
            <div appScrollReveal="up" [revealDelay]="$index * 100">
              <app-glass-card>
                <figure class="testimonials__card">
                  <span class="testimonials__mark" aria-hidden="true">&ldquo;</span>
                  <blockquote class="testimonials__quote">{{ t.quoteKey | translate }}</blockquote>
                  <figcaption class="testimonials__author">
                    <span class="testimonials__name">{{ t.authorKey | translate }}</span>
                    <span class="testimonials__role">{{ t.roleKey | translate }}</span>
                  </figcaption>
                </figure>
              </app-glass-card>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    @use 'styles/mixins';

    .testimonials__grid {
      display: grid;
      gap: 1.25rem;
      grid-template-columns: 1fr;
      max-width: 900px;
      margin-inline: auto;

      @include mixins.respond-to(md) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .testimonials__card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: 100%;
    }

    .testimonials__mark {
      font-family: var(--font-display);
      font-size: 3rem;
      line-height: 0.5;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .testimonials__quote {
      font-size: 1rem;
      color: var(--text-secondary);
      line-height: 1.75;
      flex: 1;
    }

    .testimonials__author {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .testimonials__name {
      font-weight: 600;
      font-size: 0.9375rem;
    }

    .testimonials__role {
      font-size: 0.8125rem;
      color: var(--text-muted);
    }
  `,
})
export class TestimonialsComponent {
  protected readonly testimonials = TESTIMONIALS;
}
