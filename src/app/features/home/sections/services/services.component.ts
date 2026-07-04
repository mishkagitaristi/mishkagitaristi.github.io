import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SERVICES } from '@core/data/services.data';
import { getExpertiseIcon } from '@core/data/expertise.icons';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    SectionHeadingComponent,
    GlassCardComponent,
    ScrollRevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="services" class="section services" aria-labelledby="services-heading">
      <div class="container">
        <app-section-heading
          sectionId="services-heading"
          labelKey="services.label"
          titleKey="services.title"
          subtitleKey="services.subtitle"
        />

        <div class="services__grid">
          @for (item of services; track item.id) {
            <div appScrollReveal="up" [revealDelay]="$index * 80">
              <app-glass-card>
                <div class="services__card">
                  <div class="services__icon" [innerHTML]="getIcon(item.icon)" aria-hidden="true"></div>
                  <h3 class="services__title">{{ item.titleKey | translate }}</h3>
                  <p class="services__description">{{ item.descriptionKey | translate }}</p>
                  <ul class="services__deliverables">
                    @for (d of item.deliverableKeys; track d) {
                      <li>{{ d | translate }}</li>
                    }
                  </ul>
                </div>
              </app-glass-card>
            </div>
          }
        </div>

        <p class="services__cta" appScrollReveal="up">
          {{ 'services.ctaLead' | translate }}
          <a routerLink="/contact" class="services__cta-link">{{ 'services.ctaLink' | translate }}</a>
        </p>
      </div>
    </section>
  `,
  styles: `
    @use 'styles/mixins';

    .services__grid {
      display: grid;
      gap: 1.25rem;
      grid-template-columns: 1fr;

      @include mixins.respond-to(sm) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .services__card {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      height: 100%;
    }

    .services__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      padding: 11px;
      margin-bottom: 0.25rem;
      color: var(--accent-from);
      background: var(--accent-tint);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-md);

      ::ng-deep svg {
        width: 100%;
        height: 100%;
      }
    }

    .services__title {
      font-size: 1.125rem;
    }

    .services__description {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      line-height: 1.65;
    }

    .services__deliverables {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-top: 0.25rem;

      li {
        position: relative;
        padding-left: 1.25rem;
        font-size: 0.875rem;
        color: var(--text-secondary);

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.55em;
          width: 0.375rem;
          height: 0.375rem;
          border-radius: 50%;
          background: var(--accent-gradient);
        }
      }
    }

    .services__cta {
      margin-top: 2.5rem;
      text-align: center;
      color: var(--text-secondary);
      font-size: 1.0625rem;
    }

    .services__cta-link {
      color: var(--accent-from);
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 4px;

      &:hover {
        color: var(--accent-to);
      }
    }
  `,
})
export class ServicesComponent {
  protected readonly services = SERVICES;

  // Icons are static strings from our own source, so bypassing
  // sanitization is safe — without it Angular strips the <svg> markup.
  private readonly sanitizer = inject(DomSanitizer);
  private readonly iconCache = new Map<string, SafeHtml>();

  protected getIcon(name: string): SafeHtml {
    let icon = this.iconCache.get(name);
    if (!icon) {
      icon = this.sanitizer.bypassSecurityTrustHtml(getExpertiseIcon(name));
      this.iconCache.set(name, icon);
    }
    return icon;
  }
}
