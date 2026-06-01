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
      text-align: center;
      margin-bottom: 3rem;
      max-width: 640px;
      margin-inline: auto;
    }

    .section-heading__label {
      display: inline-block;
      font-family: var(--font-body);
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent-from);
      margin-bottom: 0.75rem;
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
