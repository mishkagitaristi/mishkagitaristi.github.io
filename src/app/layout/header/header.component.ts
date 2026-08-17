import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { NAV_ITEMS } from '@core/config/nav.config';
import { PERSON } from '@core/config/person.config';
import { personFirstName } from '@core/utils/person.util';
import { menuSlide } from '@shared/animations/portfolio.animations';
import { LanguageSwitcherComponent } from '@shared/components/language-switcher/language-switcher.component';
import { NavLinkComponent } from '@shared/components/nav-link/nav-link.component';
import { PillNavComponent } from '@shared/components/pill-nav/pill-nav.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    ThemeToggleComponent,
    LanguageSwitcherComponent,
    NavLinkComponent,
    PillNavComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [menuSlide],
  template: `
    <header
      class="header"
      [class.header--scrolled]="scrolled()"
      [class.header--menu-open]="menuOpen()"
    >
      <div class="header__inner container">
        <a routerLink="/" class="header__logo" (click)="closeMenu()">
          <span class="header__logo-name">{{ firstName }}</span>
          <span class="header__logo-dot">.</span>
        </a>

        <app-pill-nav class="header__nav" [items]="navItems" (navigated)="closeMenu()" />

        <div class="header__actions">
          <app-language-switcher />
          <app-theme-toggle />
          <button
            type="button"
            class="header__menu-btn"
            (click)="toggleMenu()"
            [attr.aria-expanded]="menuOpen()"
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <span class="header__hamburger" [class.header__hamburger--open]="menuOpen()">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      @if (menuOpen()) {
        <nav
          id="mobile-menu"
          class="header__mobile-menu"
          aria-label="Mobile navigation"
          @menuSlide
        >
          <div class="header__mobile-links">
            @for (item of navItems; track item.id; let i = $index) {
              <app-nav-link
                class="header__mobile-item"
                [item]="item"
                linkClass="header__mobile-link"
                [animationDelayMs]="i * 40"
                (navigated)="closeMenu()"
              />
            }
          </div>
          <div class="header__mobile-actions">
            <app-language-switcher />
            <app-theme-toggle />
          </div>
        </nav>
      }
    </header>
  `,
  styles: `
    @use 'styles/mixins';

    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      height: var(--header-height);
      transition: background var(--transition-base), backdrop-filter var(--transition-base),
        border-color var(--transition-base);
      border-bottom: 1px solid transparent;

      &--scrolled {
        background: var(--nav-bg-scrolled);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-bottom-color: var(--border-subtle);
      }

      &--menu-open {
        background: var(--bg-primary);
        border-bottom-color: var(--border-subtle);
      }
    }

    .header__inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }

    .header__logo {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      z-index: 101;
    }

    .header__logo-dot {
      color: var(--accent-from);
    }

    .header__nav {
      display: none;

      @include mixins.respond-to(lg) {
        display: block;
      }
    }

    .header__actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      z-index: 101;
    }

    .header__menu-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border: none;
      background: transparent;
      cursor: pointer;
      @include mixins.focus-ring;

      @include mixins.respond-to(lg) {
        display: none;
      }
    }

    .header__hamburger {
      display: flex;
      flex-direction: column;
      gap: 5px;
      width: 22px;

      span {
        display: block;
        height: 2px;
        background: var(--text-primary);
        border-radius: 1px;
        transition: transform var(--transition-base), opacity var(--transition-base);
      }

      &--open span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
      }

      &--open span:nth-child(2) {
        opacity: 0;
      }

      &--open span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
      }
    }

    .header__mobile-menu {
      position: fixed;
      inset: 0;
      top: var(--header-height);
      background: var(--bg-primary);
      display: flex;
      flex-direction: column;
      padding: 1.5rem clamp(1rem, 4vw, 2rem) 2rem;
      z-index: 99;
      overflow-y: auto;

      @include mixins.respond-to(lg) {
        display: none;
      }
    }

    .header__mobile-links {
      display: flex;
      flex-direction: column;
      counter-reset: nav;
    }

    .header__mobile-item {
      display: block;
      counter-increment: nav;
    }

    :host ::ng-deep .header__mobile-link {
      display: flex;
      align-items: baseline;
      gap: 0.875rem;
      width: 100%;
      padding: 1rem 0.25rem;
      font-family: var(--font-display);
      font-size: 1.375rem;
      font-weight: 600;
      color: var(--text-primary);
      border-bottom: 1px solid var(--border-subtle);
      animation: fadeInUp 0.35s ease-out both;
      transition: color var(--transition-fast);

      &::before {
        content: '0' counter(nav);
        font-family: var(--font-mono);
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--text-muted);
        letter-spacing: 0.06em;
      }

      &:active,
      &.header__mobile-link--active {
        color: var(--accent-from);

        &::before {
          color: var(--accent-from);
        }
      }
    }

    .header__mobile-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: auto;
      padding-top: 2rem;
    }
  `,
})
export class HeaderComponent {
  protected readonly navItems = NAV_ITEMS;
  protected readonly firstName = personFirstName(PERSON.name);

  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);

  private readonly document = inject(DOCUMENT);

  constructor() {
    // Lock page scroll behind the open mobile menu.
    effect(() => {
      this.document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.menuOpen() && window.innerWidth >= 1024) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
