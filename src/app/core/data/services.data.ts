import { ServiceItem } from '@core/models/portfolio.models';

export const SERVICES: ServiceItem[] = [
  {
    id: 'product',
    titleKey: 'services.items.product.title',
    descriptionKey: 'services.items.product.description',
    deliverableKeys: [
      'services.items.product.d1',
      'services.items.product.d2',
      'services.items.product.d3',
    ],
    icon: 'angular',
  },
  {
    id: 'modernization',
    titleKey: 'services.items.modernization.title',
    descriptionKey: 'services.items.modernization.description',
    deliverableKeys: [
      'services.items.modernization.d1',
      'services.items.modernization.d2',
      'services.items.modernization.d3',
    ],
    icon: 'performance',
  },
  {
    id: 'designSystem',
    titleKey: 'services.items.designSystem.title',
    descriptionKey: 'services.items.designSystem.description',
    deliverableKeys: [
      'services.items.designSystem.d1',
      'services.items.designSystem.d2',
      'services.items.designSystem.d3',
    ],
    icon: 'uiux',
  },
  {
    id: 'audit',
    titleKey: 'services.items.audit.title',
    descriptionKey: 'services.items.audit.description',
    deliverableKeys: [
      'services.items.audit.d1',
      'services.items.audit.d2',
      'services.items.audit.d3',
    ],
    icon: 'architecture',
  },
];

export const PROCESS_STEPS = [
  {
    id: 'discover',
    titleKey: 'process.steps.discover.title',
    descriptionKey: 'process.steps.discover.description',
  },
  {
    id: 'propose',
    titleKey: 'process.steps.propose.title',
    descriptionKey: 'process.steps.propose.description',
  },
  {
    id: 'build',
    titleKey: 'process.steps.build.title',
    descriptionKey: 'process.steps.build.description',
  },
  {
    id: 'support',
    titleKey: 'process.steps.support.title',
    descriptionKey: 'process.steps.support.description',
  },
] as const;

export const TESTIMONIALS = [
  {
    id: 'placeholder1',
    quoteKey: 'testimonials.items.placeholder1.quote',
    authorKey: 'testimonials.items.placeholder1.author',
    roleKey: 'testimonials.items.placeholder1.role',
  },
  {
    id: 'placeholder2',
    quoteKey: 'testimonials.items.placeholder2.quote',
    authorKey: 'testimonials.items.placeholder2.author',
    roleKey: 'testimonials.items.placeholder2.role',
  },
  {
    id: 'placeholder3',
    quoteKey: 'testimonials.items.placeholder3.quote',
    authorKey: 'testimonials.items.placeholder3.author',
    roleKey: 'testimonials.items.placeholder3.role',
  },
] as const;
