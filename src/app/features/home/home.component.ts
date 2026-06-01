import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { SeoService } from '../../core/services/seo.service';
import { routeFade } from '../../shared/animations/portfolio.animations';
import { HeroComponent } from './sections/hero/hero.component';
import { AboutComponent } from './sections/about/about.component';
import { ExperienceComponent } from './sections/experience/experience.component';
import { SkillsComponent } from './sections/skills/skills.component';
import { ProjectsComponent } from './sections/projects/projects.component';
import { ExpertiseComponent } from './sections/expertise/expertise.component';
import { StatisticsComponent } from './sections/statistics/statistics.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    SkillsComponent,
    ProjectsComponent,
    ExpertiseComponent,
    StatisticsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routeFade],
  host: { '[@routeFade]': '' },
  template: `
    <app-hero />
    <app-about />
    <app-experience />
    <app-skills />
    @defer (on viewport) {
      <app-projects />
    } @placeholder {
      <div class="defer-placeholder" aria-hidden="true"></div>
    }
    <app-expertise />
    @defer (on viewport) {
      <app-statistics />
    } @placeholder {
      <div class="defer-placeholder" aria-hidden="true"></div>
    }
  `,
  styles: `
    .defer-placeholder {
      min-height: 400px;
    }
  `,
})
export class HomeComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Senior Frontend Engineer',
      description:
        'Mikheil Mamniashvili — Senior Frontend Engineer specializing in Angular, enterprise applications, fintech, and scalable web solutions.',
      path: '/',
    });
    this.seo.setPersonSchema();
  }
}
