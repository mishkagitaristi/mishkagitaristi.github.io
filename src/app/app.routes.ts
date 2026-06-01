import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Mikheil Mamniashvili — Senior Frontend Engineer',
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then((m) => m.ContactComponent),
    title: 'Contact — Mikheil Mamniashvili',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
