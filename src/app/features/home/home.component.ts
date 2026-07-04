import { ChangeDetectionStrategy, Component } from '@angular/core';

import { routeFade } from '@shared/animations/portfolio.animations';
import { AboutComponent } from '@features/home/sections/about/about.component';
import { EducationComponent } from '@features/home/sections/education/education.component';
import { ExperienceComponent } from '@features/home/sections/experience/experience.component';
import { InterestsComponent } from '@features/home/sections/interests/interests.component';
import { HeroComponent } from '@features/home/sections/hero/hero.component';
import { ProcessComponent } from '@features/home/sections/process/process.component';
import { ProjectsComponent } from '@features/home/sections/projects/projects.component';
import { ServicesComponent } from '@features/home/sections/services/services.component';
import { SkillsComponent } from '@features/home/sections/skills/skills.component';
import { StatisticsComponent } from '@features/home/sections/statistics/statistics.component';
import { TestimonialsComponent } from '@features/home/sections/testimonials/testimonials.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    ServicesComponent,
    ProjectsComponent,
    StatisticsComponent,
    ProcessComponent,
    TestimonialsComponent,
    AboutComponent,
    ExperienceComponent,
    EducationComponent,
    SkillsComponent,
    InterestsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routeFade],
  host: { '[@routeFade]': '' },
  template: `
    <app-hero />
    <app-services />
    @defer (on viewport) {
      <app-projects />
    } @placeholder {
      <div class="defer-placeholder" aria-hidden="true"></div>
    }
    @defer (on viewport) {
      <app-statistics />
    } @placeholder {
      <div class="defer-placeholder" aria-hidden="true"></div>
    }
    <app-process />
    <app-testimonials />
    <app-about />
    <app-experience />
    <app-education />
    <app-skills />
    <app-interests />
  `,
  styles: `
    .defer-placeholder {
      min-height: 400px;
    }
  `,
})
export class HomeComponent {}
