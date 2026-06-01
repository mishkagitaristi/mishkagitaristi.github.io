import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { expandCollapse } from '../../animations/portfolio.animations';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [expandCollapse],
  template: `
    <article class="project-card stagger-item">
      <div class="project-card__carousel">
        <img
          [src]="images()[currentIndex()]"
          [alt]="titleKey() | translate"
          width="600"
          height="340"
          loading="lazy"
          class="project-card__image"
        />
        @if (images().length > 1) {
          <div class="project-card__controls">
            <button
              type="button"
              class="project-card__nav"
              (click)="prev()"
              aria-label="Previous image"
            >
              ‹
            </button>
            <div class="project-card__dots">
              @for (img of images(); track $index) {
                <button
                  type="button"
                  class="project-card__dot"
                  [class.project-card__dot--active]="$index === currentIndex()"
                  (click)="goTo($index)"
                  [attr.aria-label]="'Image ' + ($index + 1)"
                ></button>
              }
            </div>
            <button
              type="button"
              class="project-card__nav"
              (click)="next()"
              aria-label="Next image"
            >
              ›
            </button>
          </div>
        }
      </div>

      <div class="project-card__content">
        <h3 class="project-card__title">{{ titleKey() | translate }}</h3>
        <p class="project-card__description">{{ descriptionKey() | translate }}</p>

        <div class="project-card__tags">
          @for (tag of tags(); track tag) {
            <span class="project-card__tag">{{ tag }}</span>
          }
        </div>

        <button
          type="button"
          class="project-card__expand"
          (click)="toggleExpanded()"
          [attr.aria-expanded]="expanded()"
        >
          {{ expanded() ? ('projects.hideDetails' | translate) : ('projects.viewDetails' | translate) }}
          <span class="project-card__chevron" [class.project-card__chevron--open]="expanded()">›</span>
        </button>

        @if (expanded()) {
          <div class="project-card__details" @expandCollapse>
            <p>{{ detailsKey() | translate }}</p>
          </div>
        }
      </div>
    </article>
  `,
  styles: `
    @use 'styles/mixins';

    .project-card {
      @include mixins.glass-card;
      overflow: hidden;
      padding: 0;
      transition: transform var(--transition-base), box-shadow var(--transition-base);

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
      }
    }

    .project-card__carousel {
      position: relative;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      background: var(--bg-secondary);
    }

    .project-card__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .project-card__controls {
      position: absolute;
      inset: auto 0 0 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
    }

    .project-card__nav {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(8px);
      color: #fff;
      font-size: 1.25rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }

    .project-card__dots {
      display: flex;
      gap: 0.375rem;
    }

    .project-card__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      padding: 0;

      &--active {
        background: #fff;
      }
    }

    .project-card__content {
      padding: 1.5rem;
    }

    .project-card__title {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .project-card__description {
      color: var(--text-secondary);
      font-size: 0.9375rem;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .project-card__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .project-card__tag {
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.25rem 0.625rem;
      border-radius: var(--radius-sm);
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
    }

    .project-card__expand {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      background: none;
      border: none;
      color: var(--accent-from);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      padding: 0;

      &:hover {
        text-decoration: underline;
      }
    }

    .project-card__chevron {
      display: inline-block;
      transition: transform var(--transition-fast);
      transform: rotate(90deg);

      &--open {
        transform: rotate(-90deg);
      }
    }

    .project-card__details {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.9375rem;
      line-height: 1.7;
    }
  `,
})
export class ProjectCardComponent {
  readonly titleKey = input.required<string>();
  readonly descriptionKey = input.required<string>();
  readonly detailsKey = input.required<string>();
  readonly tags = input.required<string[]>();
  readonly images = input.required<string[]>();

  protected readonly currentIndex = signal(0);
  protected readonly expanded = signal(false);

  prev(): void {
    const len = this.images().length;
    this.currentIndex.update((i) => (i - 1 + len) % len);
  }

  next(): void {
    const len = this.images().length;
    this.currentIndex.update((i) => (i + 1) % len);
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
  }

  toggleExpanded(): void {
    this.expanded.update((v) => !v);
  }
}
