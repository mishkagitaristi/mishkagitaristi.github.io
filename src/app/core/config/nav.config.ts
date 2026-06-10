import { NavItem } from '@core/models/nav.model';

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'home', labelKey: 'nav.home', route: '/', fragment: undefined },
  { id: 'about', labelKey: 'nav.about', route: '/', fragment: 'about' },
  { id: 'experience', labelKey: 'nav.experience', route: '/', fragment: 'experience' },
  { id: 'education', labelKey: 'nav.education', route: '/', fragment: 'education' },
  { id: 'skills', labelKey: 'nav.skills', route: '/', fragment: 'skills' },
  { id: 'projects', labelKey: 'nav.projects', route: '/', fragment: 'projects' },
  { id: 'contact', labelKey: 'nav.contact', route: '/contact', fragment: undefined },
];
