import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-skill-card',
  standalone: true,
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="skill-card stagger-item"
      [class.skill-card--hovered]="hovered()"
      (mouseenter)="hovered.set(true)"
      (mouseleave)="hovered.set(false)"
      (focusin)="hovered.set(true)"
      (focusout)="onFocusOut($event)"
      tabindex="0"
      [attr.aria-describedby]="'skill-card-desc-' + skillId()"
    >
      <span class="skill-card__name">{{ nameKey() | translate }}</span>
      <div class="skill-card__description" [id]="'skill-card-desc-' + skillId()">
        <p>{{ descriptionKey() | translate }}</p>
      </div>
    </div>
  `,
  styles: `
    .skill-card {
      padding: 1rem 1.25rem;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      cursor: default;
      transition: border-color var(--transition-base), transform var(--transition-base),
        box-shadow var(--transition-base);
      outline: none;

      &:hover,
      &:focus-visible,
      &--hovered {
        border-color: var(--accent-from);
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12);
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

    .skill-card__description {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows var(--transition-base), margin-top var(--transition-base);
      margin-top: 0;
      overflow: hidden;
      border-radius: var(--radius-sm);
    }

    .skill-card__description p {
      overflow: hidden;
      font-size: 0.8125rem;
      line-height: 1.55;
      color: var(--text-secondary);
      min-height: 0;
      padding: 0;
      transition: padding var(--transition-base), background var(--transition-base);
    }

    .skill-card--hovered .skill-card__description {
      grid-template-rows: 1fr;
      margin-top: 0.875rem;
    }

    .skill-card--hovered .skill-card__description p {
      padding: 0.75rem 0.875rem;
      background: var(--tooltip-bg);
      background-color: var(--tooltip-bg);
      border: 1px solid var(--tooltip-border);
      border-radius: var(--radius-sm);
      box-shadow: var(--tooltip-shadow);
      font-family: var(--font-body);
      color: var(--tooltip-text);
    }
  `,
})
export class SkillCardComponent {
  readonly skillId = input.required<string>();
  readonly nameKey = input.required<string>();
  readonly descriptionKey = input.required<string>();

  protected readonly hovered = signal(false);

  protected onFocusOut(event: FocusEvent): void {
    const related = event.relatedTarget as Node | null;
    if (!related || !(event.currentTarget as HTMLElement).contains(related)) {
      this.hovered.set(false);
    }
  }
}
