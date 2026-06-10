import { Routes } from '@angular/router';

import { HomeComponent } from '@features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Mikheil Mamniashvili — Senior Frontend Engineer',
    data: {
      seo: {
        title: 'Senior Frontend Engineer',
        description:
          'Mikheil Mamniashvili — Senior Frontend Engineer with 6+ years in Angular, TypeScript, and micro-frontend architecture. Delivered 10+ applications across SaaS, fintech, gambling, and construction at Syniotec and Singular.',
        path: '/',
        personSchema: true,
      },
    },
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('@features/contact/contact.component').then((m) => m.ContactComponent),
    title: 'Contact — Mikheil Mamniashvili',
    data: {
      seo: {
        title: 'Contact',
        description:
          'Get in touch with Mikheil Mamniashvili — Senior Frontend Engineer available for remote opportunities.',
        path: '/contact',
        personSchema: true,
      },
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
