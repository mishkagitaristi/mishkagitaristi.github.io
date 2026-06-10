import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { NavItem } from '@core/models/nav.model';
import { AnchorLinkDirective } from '@shared/directives/anchor-link.directive';

@Component({
  selector: 'app-nav-link',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule, AnchorLinkDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (item().fragment) {
      <a
        [class]="linkClass()"
        routerLink="/"
        [fragment]="item().fragment"
        [appAnchorLink]="item().fragment!"
        [routerLinkActive]="activeClass()"
        [style.animation-delay.ms]="animationDelayMs()"
        (click)="onNavigate()"
      >
        {{ item().labelKey | translate }}
      </a>
    } @else if (item().route === '/contact') {
      <a
        [class]="linkClass()"
        routerLink="/contact"
        [routerLinkActive]="activeClass()"
        [style.animation-delay.ms]="animationDelayMs()"
        (click)="onNavigate()"
      >
        {{ item().labelKey | translate }}
      </a>
    } @else {
      <a
        [class]="linkClass()"
        routerLink="/"
        [routerLinkActive]="activeClass()"
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
  readonly item = input.required<NavItem>();
  readonly linkClass = input.required<string>();
  readonly activeClass = input('');
  readonly animationDelayMs = input<number | undefined>();

  readonly navigated = output<void>();

  onNavigate(): void {
    this.navigated.emit();
  }
}
