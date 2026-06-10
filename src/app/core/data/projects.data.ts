import { Project } from '@core/models/portfolio.models';

export const PROJECTS: Project[] = [
  {
    id: 'fintech',
    titleKey: 'projects.fintech.title',
    descriptionKey: 'projects.fintech.description',
    detailsKey: 'projects.fintech.details',
    tags: ['Angular', 'TypeScript', 'RxJS', 'SCSS'],
    images: [
      'assets/images/projects/fintech-1.svg',
      'assets/images/projects/fintech-2.svg',
    ],
  },
  {
    id: 'enterprise',
    titleKey: 'projects.enterprise.title',
    descriptionKey: 'projects.enterprise.description',
    detailsKey: 'projects.enterprise.details',
    tags: ['Angular', 'REST API', 'NgRx', 'Enterprise'],
    images: [
      'assets/images/projects/enterprise-1.svg',
      'assets/images/projects/enterprise-2.svg',
    ],
  },
  {
    id: 'construction',
    titleKey: 'projects.construction.title',
    descriptionKey: 'projects.construction.description',
    detailsKey: 'projects.construction.details',
    tags: ['Angular', 'TypeScript', 'Maps', 'Real-time'],
    images: [
      'assets/images/projects/construction-1.svg',
      'assets/images/projects/construction-2.svg',
    ],
  },
  {
    id: 'monitoring',
    titleKey: 'projects.monitoring.title',
    descriptionKey: 'projects.monitoring.description',
    detailsKey: 'projects.monitoring.details',
    tags: ['Angular', 'WebSockets', 'Charts', 'Dashboard'],
    images: [
      'assets/images/projects/monitoring-1.svg',
      'assets/images/projects/monitoring-2.svg',
    ],
  },
];
