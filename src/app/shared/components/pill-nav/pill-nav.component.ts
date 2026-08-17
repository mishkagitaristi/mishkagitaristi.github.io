import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';

import { NavItem } from '@core/models/nav.model';
import { SectionScrollService } from '@core/services/section-scroll.service';
import { NavLinkComponent } from '@shared/components/nav-link/nav-link.component';

@Component({
  selector: 'app-pill-nav',
  standalone: true,
  imports: [NavLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="pill-nav" aria-label="Main navigation">
      <div class="pill-nav__track" #track>
        <div
          class="pill-nav__indicator"
          [class.pill-nav__indicator--ready]="indicatorReady()"
          [style.transform]="indicatorTransform()"
          [style.width.px]="indicatorWidth()"
        ></div>
        @for (item of items(); track item.id) {
          <app-nav-link
            class="pill-nav__item"
            [item]="item"
            linkClass="pill-nav__link"
            activeClass="pill-nav__link--active"
            [activeOverride]="isActive(item)"
            (navigated)="navigated.emit()"
          />
        }
      </div>
    </nav>
  `,
  styles: `
    .pill-nav__track {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.125rem;
      padding: 0.25rem;
      border-radius: var(--radius-pill);
      background: var(--nav-pill-bg);
      border: 1px solid var(--nav-pill-border);
      box-shadow: var(--shadow-sm);
    }

    .pill-nav__indicator {
      position: absolute;
      top: 0.25rem;
      left: 0;
      height: calc(100% - 0.5rem);
      border-radius: var(--radius-pill);
      background: var(--nav-pill-indicator);
      border: 1px solid var(--nav-pill-indicator-border);
      box-shadow: var(--nav-pill-indicator-shadow);
      pointer-events: none;
      opacity: 0;
      transition:
        transform 380ms cubic-bezier(0.34, 1.2, 0.64, 1),
        width 380ms cubic-bezier(0.34, 1.2, 0.64, 1),
        opacity 200ms ease;

      &--ready {
        opacity: 1;
      }
    }

    .pill-nav__item {
      position: relative;
      z-index: 1;
    }

    :host ::ng-deep .pill-nav__link {
      display: block;
      padding: 0.4375rem 0.875rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-secondary);
      border-radius: var(--radius-pill);
      white-space: nowrap;
      transition: color var(--transition-fast);

      &:hover {
        color: var(--text-primary);
      }

      &.pill-nav__link--active {
        color: var(--text-primary);
      }
    }
  `,
})
export class PillNavComponent implements AfterViewInit {
  readonly items = input.required<readonly NavItem[]>();
  readonly navigated = output<void>();

  private readonly sectionScroll = inject(SectionScrollService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly trackRef = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly linkRefs = viewChildren(NavLinkComponent);

  protected readonly indicatorLeft = signal(0);
  protected readonly indicatorWidth = signal(0);
  protected readonly indicatorReady = signal(false);

  protected readonly indicatorTransform = () =>
    `translateX(${this.indicatorLeft()}px)`;

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    effect(() => {
      this.sectionScroll.activeNavId();
      this.items();
      requestAnimationFrame(() => this.updateIndicator());
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.updateIndicator();

    const resizeObserver = new ResizeObserver(() => this.updateIndicator());
    resizeObserver.observe(this.trackRef().nativeElement);
    this.destroyRef.onDestroy(() => resizeObserver.disconnect());

    const onResize = (): void => this.updateIndicator();
    window.addEventListener('resize', onResize);
    this.destroyRef.onDestroy(() => window.removeEventListener('resize', onResize));
  }

  protected isActive(item: NavItem): boolean {
    return this.sectionScroll.activeNavId() === item.id;
  }

  private updateIndicator(): void {
    if (!this.isBrowser) {
      return;
    }

    const track = this.trackRef()?.nativeElement;
    if (!track) {
      return;
    }

    const activeId = this.sectionScroll.activeNavId();
    const links = this.linkRefs();
    const activeIndex = this.items().findIndex((item) => item.id === activeId);
    const activeLink = links[activeIndex];
    const anchor = activeLink?.linkElement;

    if (!anchor || typeof anchor.getBoundingClientRect !== 'function') {
      this.indicatorReady.set(false);
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const linkRect = anchor.getBoundingClientRect();

    this.indicatorLeft.set(linkRect.left - trackRect.left);
    this.indicatorWidth.set(linkRect.width);
    this.indicatorReady.set(true);
  }
}
