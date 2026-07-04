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
          'Mikheil Mamniashvili — Senior Frontend Engineer. I design and build fast, polished Angular applications: new products, legacy modernization, design systems, and performance work. 6+ years across fintech, SaaS, iGaming, and construction.',
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
          'Tell me about your project — Mikheil Mamniashvili, Senior Frontend Engineer, available for new projects worldwide. Replies within 24 hours.',
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
