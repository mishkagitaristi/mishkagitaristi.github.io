import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-section-heading',
  standalone: true,
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section-heading">
      @if (labelKey()) {
        <span class="section-heading__label">{{ labelKey() | translate }}</span>
      }
      <h2 class="section-heading__title" [id]="sectionId()">{{ titleKey() | translate }}</h2>
      @if (subtitleKey()) {
        <p class="section-heading__subtitle">{{ subtitleKey()! | translate }}</p>
      }
    </div>
  `,
  styles: `
    .section-heading {
      text-align: left;
      margin-bottom: 3.5rem;
      max-width: 720px;
    }

    .section-heading__label {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: var(--font-mono);
      font-size: 0.8125rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.12em;

      color: var(--accent-from);
      margin-bottom: 0.875rem;

      &::after {
        content: '';
        flex: 0 0 48px;
        height: 1px;
        background: linear-gradient(90deg, var(--accent-from), transparent);
      }
    }

    .section-heading__title {
      font-family: var(--font-display);
      margin-bottom: 1rem;
    }

    .section-heading__subtitle {
      font-family: var(--font-body);
      color: var(--text-secondary);
      font-size: 1.0625rem;
      line-height: 1.7;
    }
  `,
})
export class SectionHeadingComponent {
  readonly sectionId = input.required<string>();
  readonly titleKey = input.required<string>();
  readonly subtitleKey = input<string>();
  readonly labelKey = input<string>();
}
