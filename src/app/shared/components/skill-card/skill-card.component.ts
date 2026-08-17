import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-skill-card',
  standalone: true,
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="skill-card stagger-item"
      tabindex="0"
      [attr.aria-describedby]="'skill-card-desc-' + skillId()"
    >
      <span class="skill-card__name">{{ nameKey() | translate }}</span>
      <p class="skill-card__description" role="tooltip" [id]="'skill-card-desc-' + skillId()">
        {{ descriptionKey() | translate }}
      </p>
    </div>
  `,
  styles: `
    .skill-card {
      position: relative;
      padding: 1rem 1.25rem;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      cursor: default;
      outline: none;
      transition: border-color var(--transition-base), transform var(--transition-base),
        box-shadow var(--transition-base);

      // Hover may only ever change paint, never size. These cards sit in a CSS
      // grid, so growing one grows its whole row and pushes the rest of the
      // page down — which is why the description below is out of flow.
      &:hover,
      &:focus-visible,
      &:focus-within {
        z-index: 3;
        border-color: var(--accent-from);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px var(--accent-glow);
      }

      &:focus-visible {
        outline: 2px solid var(--accent-from);
        outline-offset: 2px;
      }
    }

    .skill-card__name {
      display: block;
      font-family: var(--font-display);
      font-size: 0.9375rem;
      font-weight: 600;
    }

    // Floating popover, anchored under the card and taken out of flow so
    // revealing it cannot affect layout. Kept at opacity 0 rather than
    // visibility or display none so aria-describedby still resolves for
    // screen readers while it is hidden.
    .skill-card__description {
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 0;
      right: 0;
      z-index: 3;
      padding: 0.75rem 0.875rem;
      font-family: var(--font-body);
      font-size: 0.8125rem;
      line-height: 1.55;
      color: var(--tooltip-text);
      background: var(--tooltip-bg);
      border: 1px solid var(--tooltip-border);
      border-radius: var(--radius-sm);
      box-shadow: var(--tooltip-shadow);
      opacity: 0;
      transform: translateY(-4px);
      pointer-events: none;
      transition: opacity var(--transition-base), transform var(--transition-base);
    }

    .skill-card:hover .skill-card__description,
    .skill-card:focus-visible .skill-card__description,
    .skill-card:focus-within .skill-card__description {
      opacity: 1;
      transform: translateY(0);
    }
  `,
})
export class SkillCardComponent {
  readonly skillId = input.required<string>();
  readonly nameKey = input.required<string>();
  readonly descriptionKey = input.required<string>();
}
