import { ExperienceItem } from '@core/models/portfolio.models';

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 'syniotec',
    companyKey: 'experience.syniotec.company',
    roleKey: 'experience.syniotec.role',
    periodKey: 'experience.syniotec.period',
    locationKey: 'experience.syniotec.location',
    responsibilityKeys: [
      'experience.syniotec.items.angular',
      'experience.syniotec.items.legacy',
      'experience.syniotec.items.storybook',
      'experience.syniotec.items.testing',
      'experience.syniotec.items.uiux',
      'experience.syniotec.items.planning',
      'experience.syniotec.items.mfe',
      'experience.syniotec.items.library',
      'experience.syniotec.items.collaboration',
      'experience.syniotec.items.reviews',
      'experience.syniotec.items.mentoring',
      'experience.syniotec.items.uml',
      'experience.syniotec.items.modern',
    ],
  },
  {
    id: 'singular',
    companyKey: 'experience.singular.company',
    roleKey: 'experience.singular.role',
    periodKey: 'experience.singular.period',
    locationKey: 'experience.singular.location',
    responsibilityKeys: [
      'experience.singular.items.sportsbook',
      'experience.singular.items.mobile',
      'experience.singular.items.mentoring',
      'experience.singular.items.reviews',
      'experience.singular.items.performance',
      'experience.singular.items.structure',
      'experience.singular.items.team',
    ],
  },
];
