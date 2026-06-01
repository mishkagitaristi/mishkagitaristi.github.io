import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-glass-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="glass-card" [class.glass-card--hover]="hoverable()"><ng-content /></div>`,
  styles: `
    @use 'styles/mixins';

    .glass-card {
      @include mixins.glass-card;
      padding: 1.5rem;

      &--hover {
        transition: transform var(--transition-base), box-shadow var(--transition-base),
          border-color var(--transition-base);

        &:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--border-medium);
        }
      }
    }
  `,
})
export class GlassCardComponent {
  readonly hoverable = input(true);
}
