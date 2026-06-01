import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { EXPERTISE } from '../../../../core/data/portfolio.data';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { SectionHeadingComponent } from '../../../../shared/components/section-heading/section-heading.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

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
    .expertise__grid {
      display: grid;
      gap: 1.25rem;
      grid-template-columns: 1fr;

      @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1024px) {
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

  private readonly icons: Record<string, string> = {
    architecture: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/></svg>`,
    angular: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    enterprise: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>`,
    performance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    api: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 9l3 3-3 3M13 15h3M4 6h16v12H4z"/></svg>`,
    uiux: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
    markup: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>`,
    'problem-solving': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>`,
  };

  getIcon(name: string): string {
    return this.icons[name] ?? this.icons['problem-solving'];
  }
}
