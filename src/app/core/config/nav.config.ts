import { NavItem } from '@core/models/nav.model';

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'home', labelKey: 'nav.home', route: '/', fragment: undefined },
  { id: 'services', labelKey: 'nav.services', route: '/', fragment: 'services' },
  { id: 'work', labelKey: 'nav.work', route: '/', fragment: 'work' },
  { id: 'about', labelKey: 'nav.about', route: '/', fragment: 'about' },
  { id: 'experience', labelKey: 'nav.experience', route: '/', fragment: 'experience' },
  { id: 'skills', labelKey: 'nav.skills', route: '/', fragment: 'skills' },
  { id: 'contact', labelKey: 'nav.contact', route: '/contact', fragment: undefined },
];
