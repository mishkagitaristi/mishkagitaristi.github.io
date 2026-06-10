import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppShellComponent } from '@layout/app-shell/app-shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-shell />`,
  styles: `:host { display: block; }`,
})
export class App {}
