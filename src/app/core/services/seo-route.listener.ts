import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { SeoConfig, SeoService } from '@core/services/seo.service';

export interface RouteSeoConfig extends SeoConfig {
  personSchema?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SeoRouteListener {
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  init(): void {
    this.applySeoFromRoute();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.applySeoFromRoute());
  }

  private applySeoFromRoute(): void {
    const seo = this.findRouteSeo(this.router.routerState.root);

    if (!seo) {
      return;
    }

    const { personSchema, ...config } = seo;
    this.seo.update(config);

    if (personSchema) {
      this.seo.setPersonSchema();
    }
  }

  private findRouteSeo(route: ActivatedRoute): RouteSeoConfig | undefined {
    let current: ActivatedRoute | null = route;

    while (current) {
      const seo = current.snapshot.data['seo'] as RouteSeoConfig | undefined;

      if (seo) {
        return seo;
      }

      current = current.firstChild;
    }

    return undefined;
  }
}
