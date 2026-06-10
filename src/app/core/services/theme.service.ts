import { DOCUMENT } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

import { Theme } from '@core/models/app.types';
import { readStoredValue, writeStoredValue } from '@core/utils/storage.util';

const STORAGE_KEY = 'portfolio-theme';
const VALID_THEMES = ['dark', 'light'] as const;

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly theme = signal<Theme>('dark');

  init(): void {
    const stored = readStoredValue(STORAGE_KEY, VALID_THEMES, 'dark', this.platformId);
    this.theme.set(stored);
    this.applyTheme(stored);
  }

  toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.applyTheme(theme);
    writeStoredValue(STORAGE_KEY, theme, this.platformId);
  }

  private applyTheme(theme: Theme): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}
