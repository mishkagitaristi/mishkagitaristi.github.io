import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AnchorScrollService {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  goTo(route: string, fragment: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const normalizedRoute = route || '/';
    const currentPath = this.router.url.split('#')[0].split('?')[0] || '/';
    const onSameRoute =
      currentPath === normalizedRoute ||
      (normalizedRoute === '/' && (currentPath === '' || currentPath === '/'));

    const scroll = (): void => this.scrollTo(fragment);

    if (onSameRoute) {
      void this.router.navigate([normalizedRoute], { fragment, replaceUrl: true }).then(scroll);
      return;
    }

    void this.router.navigate([normalizedRoute], { fragment }).then(scroll);
  }

  private scrollTo(fragment: string): void {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
}
