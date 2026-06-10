import { Directive, HostListener, inject, input } from '@angular/core';

import { AnchorScrollService } from '@core/services/anchor-scroll.service';

@Directive({
  selector: 'a[appAnchorLink]',
  standalone: true,
})
export class AnchorLinkDirective {
  private readonly anchorScroll = inject(AnchorScrollService);

  readonly appAnchorLink = input.required<string>();
  readonly anchorRoute = input('/', { alias: 'anchorRoute' });

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault();
    this.anchorScroll.goTo(this.anchorRoute(), this.appAnchorLink());
  }
}
