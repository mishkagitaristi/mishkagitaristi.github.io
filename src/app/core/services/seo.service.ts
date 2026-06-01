import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { PERSON } from '../data/portfolio.data';

export interface SeoConfig {
  title: string;
  description: string;
  path?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  private readonly baseUrl = 'https://mikheilmamniashvili.dev';
  private readonly defaultImage = `${this.baseUrl}/assets/images/og-image.svg`;

  update(config: SeoConfig): void {
    const fullTitle = `${config.title} | ${PERSON.name}`;
    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image', content: this.defaultImage });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });

    if (config.path) {
      this.updateCanonical(`${this.baseUrl}${config.path}`);
    }
  }

  setPersonSchema(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: PERSON.name,
      jobTitle: PERSON.title,
      email: PERSON.email,
      telephone: PERSON.phone,
      url: this.baseUrl,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Tbilisi',
        addressCountry: 'GE',
      },
      sameAs: [PERSON.linkedin, PERSON.github],
      knowsAbout: ['Angular', 'TypeScript', 'Frontend Development', 'Enterprise Applications'],
    };

    this.injectJsonLd('person-schema', schema);
  }

  private updateCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private injectJsonLd(id: string, data: object): void {
    let script = this.document.getElementById(id) as HTMLScriptElement | null;

    if (!script) {
      script = this.document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data);
  }
}
