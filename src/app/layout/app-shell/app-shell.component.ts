import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a href="#main-content" class="skip-link">{{ 'a11y.skipToContent' | translate }}</a>
    <app-header />
    <main id="main-content" class="main">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: `
    .main {
      padding-top: var(--header-height);
      min-height: calc(100vh - var(--header-height));
    }
  `,
})
export class AppShellComponent {}
