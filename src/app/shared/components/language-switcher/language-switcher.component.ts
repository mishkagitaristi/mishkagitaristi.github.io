import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="lang-switcher"
      (click)="languageService.toggleLanguage()"
      [attr.aria-label]="'Switch language to ' + (languageService.language() === 'en' ? 'Georgian' : 'English')"
    >
      {{ languageService.language() === 'en' ? 'KA' : 'EN' }}
    </button>
  `,
  styles: `
    .lang-switcher {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      height: 40px;
      padding: 0 0.75rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
      background: var(--bg-elevated);
      cursor: pointer;
      font-size: 0.8125rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: var(--text-primary);
      transition: background var(--transition-fast), border-color var(--transition-fast);

      &:hover {
        background: var(--bg-glass);
        border-color: var(--border-medium);
      }

      &:focus-visible {
        outline: 2px solid var(--accent-from);
        outline-offset: 2px;
      }
    }
  `,
})
export class LanguageSwitcherComponent {
  protected readonly languageService = inject(LanguageService);
}
