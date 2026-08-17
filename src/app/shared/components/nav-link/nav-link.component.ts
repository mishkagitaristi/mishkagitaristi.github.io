import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  viewChild,
  ElementRef,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { NavItem } from '@core/models/nav.model';
import { SectionScrollService } from '@core/services/section-scroll.service';
import { AnchorLinkDirective } from '@shared/directives/anchor-link.directive';

@Component({
  selector: 'app-nav-link',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule, AnchorLinkDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (item().fragment) {
      <a
        #link
        [class]="resolvedLinkClass()"
        routerLink="/"
        [fragment]="item().fragment"
        [appAnchorLink]="item().fragment!"
        [routerLinkActive]="useRouterActive() ? activeClass() : ''"
        [style.animation-delay.ms]="animationDelayMs()"
        (click)="onNavigate()"
      >
        {{ item().labelKey | translate }}
      </a>
    } @else if (item().route === '/contact') {
      <a
        #link
        [class]="resolvedLinkClass()"
        routerLink="/contact"
        [routerLinkActive]="useRouterActive() ? activeClass() : ''"
        [style.animation-delay.ms]="animationDelayMs()"
        (click)="onNavigate()"
      >
        {{ item().labelKey | translate }}
      </a>
    } @else {
      <a
        #link
        [class]="resolvedLinkClass()"
        routerLink="/"
        [routerLinkActive]="useRouterActive() ? activeClass() : ''"
        [routerLinkActiveOptions]="{ exact: true }"
        [style.animation-delay.ms]="animationDelayMs()"
        (click)="onNavigate()"
      >
        {{ item().labelKey | translate }}
      </a>
    }
  `,
})
export class NavLinkComponent {
  private readonly linkRef = viewChild<ElementRef<HTMLAnchorElement>>('link');
  private readonly sectionScroll = inject(SectionScrollService);

  readonly item = input.required<NavItem>();
  readonly linkClass = input.required<string>();
  readonly activeClass = input('');
  readonly activeOverride = input<boolean | undefined>(undefined);
  readonly animationDelayMs = input<number | undefined>();

  readonly navigated = output<void>();

  protected readonly resolvedLinkClass = computed(() => {
    const classes = [this.linkClass()];
    if (this.activeOverride() === true && this.activeClass()) {
      classes.push(this.activeClass());
    }
    return classes.join(' ');
  });

  protected useRouterActive(): boolean {
    return this.activeOverride() === undefined;
  }

  get linkElement(): HTMLElement | undefined {
    return this.linkRef()?.nativeElement;
  }

  onNavigate(): void {
    const navItem = this.item();
    if (navItem.route === '/contact') {
      this.sectionScroll.setActive('contact');
    } else if (!navItem.fragment && navItem.route === '/') {
      this.sectionScroll.setActive('home');
    }
    this.navigated.emit();
  }
}
