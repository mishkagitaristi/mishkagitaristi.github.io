import {
  animate,
  style,
  transition,
  trigger,
  query,
  stagger,
  group,
} from '@angular/animations';

export const routeFade = trigger('routeFade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
]);

export const heroEnter = trigger('heroEnter', [
  transition(':enter', [
    query(
      '.hero-animate',
      [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        stagger(100, [
          animate(
            '600ms cubic-bezier(0.16, 1, 0.3, 1)',
            style({ opacity: 1, transform: 'translateY(0)' }),
          ),
        ]),
      ],
      { optional: true },
    ),
  ]),
]);

export const slideInUp = trigger('slideInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(24px)' }),
    animate(
      '500ms cubic-bezier(0.16, 1, 0.3, 1)',
      style({ opacity: 1, transform: 'translateY(0)' }),
    ),
  ]),
]);

export const cardStagger = trigger('cardStagger', [
  transition(':enter', [
    query(
      '.stagger-item',
      [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        stagger(80, [
          animate(
            '400ms cubic-bezier(0.16, 1, 0.3, 1)',
            style({ opacity: 1, transform: 'translateY(0)' }),
          ),
        ]),
      ],
      { optional: true },
    ),
  ]),
]);

export const expandCollapse = trigger('expandCollapse', [
  transition(':enter', [
    style({ height: 0, opacity: 0, overflow: 'hidden' }),
    group([
      animate('300ms ease-out', style({ height: '*' })),
      animate('250ms 50ms ease-out', style({ opacity: 1 })),
    ]),
  ]),
  transition(':leave', [
    group([
      animate('200ms ease-in', style({ opacity: 0 })),
      animate('250ms ease-in', style({ height: 0, overflow: 'hidden' })),
    ]),
  ]),
]);

export const menuSlide = trigger('menuSlide', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(100%)' }),
    animate('350ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateX(0)' })),
  ]),
  transition(':leave', [
    animate('250ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' })),
  ]),
]);

export const timelineReveal = trigger('timelineReveal', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-20px)' }),
    animate(
      '500ms cubic-bezier(0.16, 1, 0.3, 1)',
      style({ opacity: 1, transform: 'translateX(0)' }),
    ),
  ]),
]);
