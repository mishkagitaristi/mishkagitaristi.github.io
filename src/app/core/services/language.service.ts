import { DOCUMENT } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Language } from '@core/models/app.types';
import { readStoredValue, writeStoredValue } from '@core/utils/storage.util';

const STORAGE_KEY = 'portfolio-language';
const VALID_LANGUAGES = ['en', 'ka'] as const;

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly language = signal<Language>('en');

  init(): void {
    this.translate.addLangs(['en', 'ka']);
    this.translate.setDefaultLang('en');

    const lang = readStoredValue(STORAGE_KEY, VALID_LANGUAGES, 'en', this.platformId);
    this.setLanguage(lang);
  }

  setLanguage(lang: Language): void {
    this.language.set(lang);
    this.translate.use(lang);
    this.document.documentElement.lang = lang;
    writeStoredValue(STORAGE_KEY, lang, this.platformId);
  }

  toggleLanguage(): void {
    this.setLanguage(this.language() === 'en' ? 'ka' : 'en');
  }
}
