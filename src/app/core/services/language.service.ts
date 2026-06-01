import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Language } from '../data/portfolio.data';

const STORAGE_KEY = 'portfolio-language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly language = signal<Language>('en');

  init(): void {
    this.translate.addLangs(['en', 'ka']);
    this.translate.setDefaultLang('en');

    const lang = this.readStoredLanguage();
    this.setLanguage(lang);
  }

  setLanguage(lang: Language): void {
    this.language.set(lang);
    this.translate.use(lang);
    this.document.documentElement.lang = lang;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }

  toggleLanguage(): void {
    this.setLanguage(this.language() === 'en' ? 'ka' : 'en');
  }

  private readStoredLanguage(): Language {
    if (!isPlatformBrowser(this.platformId)) {
      return 'en';
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'ka' ? 'ka' : 'en';
  }
}
