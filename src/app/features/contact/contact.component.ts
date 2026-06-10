import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { PERSON } from '@core/config/person.config';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import { slideInUp, routeFade } from '@shared/animations/portfolio.animations';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [TranslateModule, GlassCardComponent, SectionHeadingComponent, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInUp, routeFade],
  host: { '[@routeFade]': '' },
  template: `
    <section class="contact-page section" aria-labelledby="contact-page-heading" @slideInUp>
      <div class="container contact-page__inner">
        <app-section-heading
          sectionId="contact-page-heading"
          labelKey="contact.label"
          titleKey="contact.title"
          subtitleKey="contact.subtitle"
        />

        <div class="contact-page__grid">
          <div appScrollReveal="up">
            <app-glass-card>
              <div class="contact-card">
                <h2 class="contact-card__heading">{{ 'contact.info' | translate }}</h2>
                <dl class="contact-card__list">
                  <div class="contact-card__item">
                    <dt>{{ 'contact.name' | translate }}</dt>
                    <dd>{{ person.name }}</dd>
                  </div>
                  <div class="contact-card__item">
                    <dt>{{ 'contact.emailLabel' | translate }}</dt>
                    <dd>
                      <a [href]="'mailto:' + person.email">{{ person.email }}</a>
                    </dd>
                  </div>
                  <div class="contact-card__item">
                    <dt>{{ 'contact.phoneLabel' | translate }}</dt>
                    <dd>
                      <a [href]="'tel:' + person.phone.replace(/\s/g, '')">{{ person.phone }}</a>
                    </dd>
                  </div>
                </dl>
              </div>
            </app-glass-card>
          </div>

          <div appScrollReveal="up" [revealDelay]="150">
            <app-glass-card>
              <div class="contact-card">
                <h2 class="contact-card__heading">{{ 'contact.social' | translate }}</h2>
                <div class="contact-card__social">
                  <a
                    [href]="person.linkedin"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="contact-card__social-link"
                  >
                    <span class="contact-card__social-icon" aria-hidden="true">in</span>
                    LinkedIn
                  </a>
                  <a
                    [href]="person.github"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="contact-card__social-link"
                  >
                    <span class="contact-card__social-icon" aria-hidden="true">&lt;/&gt;</span>
                    GitHub
                  </a>
                  <a [href]="'mailto:' + person.email" class="contact-card__social-link">
                    <span class="contact-card__social-icon" aria-hidden="true">@</span>
                    Email
                  </a>
                </div>
                <p class="contact-card__availability">{{ 'contact.availability' | translate }}</p>
              </div>
            </app-glass-card>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    @use 'styles/mixins';

    .contact-page__inner {
      max-width: 900px;
    }

    .contact-page__grid {
      display: grid;
      gap: 1.5rem;

      @include mixins.respond-to(md) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .contact-card__heading {
      font-size: 1.125rem;
      margin-bottom: 1.5rem;
    }

    .contact-card__list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .contact-card__item {
      dt {
        font-size: 0.8125rem;
        color: var(--text-muted);
        margin-bottom: 0.25rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      dd {
        font-size: 1rem;

        a {
          color: var(--accent-from);
          transition: opacity var(--transition-fast);

          &:hover {
            opacity: 0.8;
          }
        }
      }
    }

    .contact-card__social {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .contact-card__social-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: var(--radius-md);
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      font-weight: 500;
      transition: border-color var(--transition-fast), transform var(--transition-fast);

      &:hover {
        border-color: var(--accent-from);
        transform: translateX(4px);
      }
    }

    .contact-card__social-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      background: var(--accent-gradient);
      color: #fff;
      font-size: 0.875rem;
      font-weight: 700;
    }

    .contact-card__availability {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.9375rem;
      line-height: 1.6;
    }
  `,
})
export class ContactComponent {
  protected readonly person = PERSON;
}
