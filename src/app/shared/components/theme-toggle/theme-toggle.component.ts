import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="theme-toggle"
      (click)="themeService.toggleTheme()"
      [attr.aria-label]="themeService.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      @if (themeService.theme() === 'dark') {
        <span aria-hidden="true">☀️</span>
      } @else {
        <span aria-hidden="true">🌙</span>
      }
    </button>
  `,
  styles: `
    .theme-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
      background: var(--bg-elevated);
      cursor: pointer;
      font-size: 1.125rem;
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
export class ThemeToggleComponent {
  protected readonly themeService = inject(ThemeService);
}
