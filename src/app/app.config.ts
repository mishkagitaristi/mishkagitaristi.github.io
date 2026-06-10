import { ApplicationConfig, provideAppInitializer, inject } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { LanguageService } from '@core/services/language.service';
import { SeoRouteListener } from '@core/services/seo-route.listener';
import { ThemeService } from '@core/services/theme.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withViewTransitions(),
    ),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
    }),
    provideAppInitializer(() => {
      inject(LanguageService).init();
      inject(ThemeService).init();
      inject(SeoRouteListener).init();
    }),
  ],
};
