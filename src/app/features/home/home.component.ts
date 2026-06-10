import { ChangeDetectionStrategy, Component } from '@angular/core';

import { routeFade } from '@shared/animations/portfolio.animations';
import { AboutComponent } from '@features/home/sections/about/about.component';
import { EducationComponent } from '@features/home/sections/education/education.component';
import { ExperienceComponent } from '@features/home/sections/experience/experience.component';
import { ExpertiseComponent } from '@features/home/sections/expertise/expertise.component';
import { InterestsComponent } from '@features/home/sections/interests/interests.component';
import { HeroComponent } from '@features/home/sections/hero/hero.component';
import { ProjectsComponent } from '@features/home/sections/projects/projects.component';
import { SkillsComponent } from '@features/home/sections/skills/skills.component';
import { StatisticsComponent } from '@features/home/sections/statistics/statistics.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    EducationComponent,
    SkillsComponent,
    ProjectsComponent,
    ExpertiseComponent,
    InterestsComponent,
    StatisticsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routeFade],
  host: { '[@routeFade]': '' },
  template: `
    <app-hero />
    <app-about />
    <app-experience />
    <app-education />
    <app-skills />
    @defer (on viewport) {
      <app-projects />
    } @placeholder {
      <div class="defer-placeholder" aria-hidden="true"></div>
    }
    <app-expertise />
    <app-interests />
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
export class HomeComponent {}
