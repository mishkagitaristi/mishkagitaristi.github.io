import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  Injector,
  PLATFORM_ID,
  afterNextRender,
  inject,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';

import { NAV_ITEMS } from '@core/config/nav.config';
import { SectionScrollService } from '@core/services/section-scroll.service';

@Injectable({ providedIn: 'root' })
export class AnchorScrollService {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly injector = inject(Injector);
  private readonly sectionScroll = inject(SectionScrollService);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Handle direct visits and reloads with a hash fragment.
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
      )
      .subscribe(() => {
        const fragment = this.fragmentFromUrl(this.router.url);
        if (fragment && this.isHomePath(this.router.url)) {
          this.scheduleScrollTo(fragment, true);
        }
      });
  }

  goTo(route: string, fragment: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const navItem = NAV_ITEMS.find((item) => item.fragment === fragment);
    if (navItem) {
      this.sectionScroll.setActive(navItem.id);
    }

    const normalizedRoute = route || '/';
    const currentPath = this.pathFromUrl(this.router.url);
    const onSameRoute =
      currentPath === normalizedRoute ||
      (normalizedRoute === '/' && (currentPath === '' || currentPath === '/'));

    const afterNavigate = (): void => {
      this.scheduleScrollTo(fragment, !onSameRoute);
    };

    if (onSameRoute) {
      void this.router
        .navigate([normalizedRoute], { fragment, replaceUrl: true })
        .then(afterNavigate);
      return;
    }

    void this.router.navigate([normalizedRoute], { fragment }).then(afterNavigate);
  }

  private scheduleScrollTo(fragment: string, crossRoute: boolean): void {
    const run = (): void => this.scrollTo(fragment);

    if (crossRoute) {
      afterNextRender(() => run(), { injector: this.injector });
    } else {
      requestAnimationFrame(() => run());
    }

    // Layout can shift after route transitions, deferred blocks, and animations.
    for (const delay of crossRoute ? [100, 250, 450, 700] : [80, 200, 400]) {
      setTimeout(() => run(), delay);
    }
  }

  private scrollTo(fragment: string, attempt = 0): void {
    const el = this.document.getElementById(fragment);
    if (!el) {
      if (attempt < 50) {
        setTimeout(() => this.scrollTo(fragment, attempt + 1), 50);
      }
      return;
    }

    this.scrollElementIntoView(el);
  }

  private scrollElementIntoView(el: HTMLElement): void {
    const offset = this.getScrollOffset();
    const scrollY = window.scrollY;
    const elementTop = el.getBoundingClientRect().top + scrollY;
    const elementBottom = elementTop + el.offsetHeight;
    const maxScroll = Math.max(
      0,
      this.document.documentElement.scrollHeight - window.innerHeight,
    );
    const viewportHeight = window.innerHeight;
    const availableHeight = viewportHeight - offset;

    let target = elementTop - offset;

    // Near the page bottom: keep the section heading visible below the header
    // and show as much of the section as the viewport allows.
    if (target > maxScroll) {
      target = maxScroll;
    }

    const headingTopAfterScroll = elementTop - target;
    if (headingTopAfterScroll < offset) {
      target = Math.max(0, elementTop - offset);
    }

    // When the section fits in the viewport, avoid overscrolling past it.
    if (el.offsetHeight <= availableHeight) {
      const minScrollToFit = elementBottom - viewportHeight;
      target = Math.max(target, minScrollToFit);
    }

    target = Math.min(Math.max(0, target), maxScroll);

    window.scrollTo({ top: target, behavior: 'smooth' });
  }

  private getScrollOffset(): number {
    const headerHeight =
      parseInt(
        getComputedStyle(this.document.documentElement).getPropertyValue(
          '--header-height',
        ),
        10,
      ) || 72;

    return headerHeight + 16;
  }

  private pathFromUrl(url: string): string {
    return url.split('#')[0].split('?')[0] || '/';
  }

  private fragmentFromUrl(url: string): string | undefined {
    return url.split('#')[1]?.split('?')[0];
  }

  private isHomePath(url: string): boolean {
    const path = this.pathFromUrl(url);
    return path === '/' || path === '';
  }
}
