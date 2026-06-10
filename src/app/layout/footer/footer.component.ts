import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { PERSON } from '@core/config/person.config';
import { LanguageSwitcherComponent } from '@shared/components/language-switcher/language-switcher.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule, ThemeToggleComponent, LanguageSwitcherComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="footer__inner container">
        <div class="footer__brand">
          <p class="footer__name">{{ person.name }}</p>
          <p class="footer__title">{{ 'footer.title' | translate }}</p>
        </div>

        <div class="footer__links">
          <a [href]="person.github" target="_blank" rel="noopener noreferrer" class="footer__link">
            GitHub
          </a>
          <a [href]="person.linkedin" target="_blank" rel="noopener noreferrer" class="footer__link">
            LinkedIn
          </a>
          <a [href]="'mailto:' + person.email" class="footer__link">Email</a>
        </div>

        <div class="footer__actions">
          <app-language-switcher />
          <app-theme-toggle />
        </div>

        <p class="footer__copyright">
          &copy; {{ year }} {{ person.name }}. {{ 'footer.rights' | translate }}
        </p>
      </div>
    </footer>
  `,
  styles: `
    @use 'styles/mixins';

    .footer {
      border-top: 1px solid var(--border-subtle);
      padding: 3rem 0 2rem;
      background: var(--bg-secondary);
    }

    .footer__inner {
      display: grid;
      gap: 2rem;
      text-align: center;

      @include mixins.respond-to(md) {
        grid-template-columns: 1fr auto auto;
        text-align: left;
        align-items: center;
      }
    }

    .footer__name {
      font-weight: 600;
      font-size: 1.0625rem;
    }

    .footer__title {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .footer__links {
      display: flex;
      gap: 1.5rem;
      justify-content: center;

      @include mixins.respond-to(md) {
        justify-content: flex-start;
      }
    }

    .footer__link {
      font-size: 0.875rem;
      color: var(--text-secondary);
      transition: color var(--transition-fast);

      &:hover {
        color: var(--accent-from);
      }
    }

    .footer__actions {
      display: flex;
      gap: 0.5rem;
      justify-content: center;

      @include mixins.respond-to(md) {
        justify-content: flex-end;
      }
    }

    .footer__copyright {
      grid-column: 1 / -1;
      text-align: center;
      font-size: 0.8125rem;
      color: var(--text-muted);
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-subtle);
    }
  `,
})
export class FooterComponent {
  protected readonly person = PERSON;
  protected readonly year = new Date().getFullYear();
}
