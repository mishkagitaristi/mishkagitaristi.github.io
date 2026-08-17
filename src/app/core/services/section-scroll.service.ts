import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  Injectable,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { NAV_ITEMS } from '@core/config/nav.config';

const HOME_SECTION_IDS = NAV_ITEMS.filter((item) => item.fragment).map(
  (item) => item.fragment!,
);

@Injectable({ providedIn: 'root' })
export class SectionScrollService {
  readonly activeNavId = signal<string>('home');

  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private ticking = false;

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.syncFromRoute(this.router.url);
    this.updateFromScroll();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.syncFromRoute(event.urlAfterRedirects);
        this.updateFromScroll();
      });

    const onScroll = (): void => {
      if (this.ticking) {
        return;
      }
      this.ticking = true;
      requestAnimationFrame(() => {
        this.updateFromScroll();
        this.ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
  }

  setActive(navId: string): void {
    this.activeNavId.set(navId);
  }

  private syncFromRoute(url: string): void {
    const path = url.split('#')[0].split('?')[0] || '/';
    if (path === '/contact') {
      this.activeNavId.set('contact');
      return;
    }

    const fragment = url.split('#')[1];
    if (fragment) {
      const navItem = NAV_ITEMS.find((item) => item.fragment === fragment);
      if (navItem) {
        this.activeNavId.set(navItem.id);
      }
    }
  }

  private updateFromScroll(): void {
    const path = this.router.url.split('#')[0].split('?')[0] || '/';
    if (path === '/contact') {
      this.activeNavId.set('contact');
      return;
    }

    const headerOffset =
      parseInt(
        getComputedStyle(this.document.documentElement).getPropertyValue(
          '--header-height',
        ),
        10,
      ) || 72;
    const scrollLine = headerOffset + 48;

    for (let i = HOME_SECTION_IDS.length - 1; i >= 0; i--) {
      const id = HOME_SECTION_IDS[i];
      const section = this.document.getElementById(id);
      if (!section) {
        continue;
      }

      const top = section.getBoundingClientRect().top;
      if (top <= scrollLine) {
        const navItem = NAV_ITEMS.find((item) => item.fragment === id);
        this.activeNavId.set(navItem?.id ?? id);
        return;
      }
    }

    this.activeNavId.set('home');
  }
}
