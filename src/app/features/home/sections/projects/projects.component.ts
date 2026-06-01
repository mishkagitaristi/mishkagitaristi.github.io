import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { PROJECTS } from '../../../../core/data/portfolio.data';
import { ProjectCardComponent } from '../../../../shared/components/project-card/project-card.component';
import { SectionHeadingComponent } from '../../../../shared/components/section-heading/section-heading.component';
import { cardStagger } from '../../../../shared/animations/portfolio.animations';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [TranslateModule, SectionHeadingComponent, ProjectCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [cardStagger],
  template: `
    <section id="projects" class="section projects" aria-labelledby="projects-heading" @cardStagger>
      <div class="container">
        <app-section-heading
          sectionId="projects-heading"
          labelKey="projects.label"
          titleKey="projects.title"
          subtitleKey="projects.subtitle"
        />

        <div class="projects__grid">
          @for (project of projects; track project.id) {
            <app-project-card
              [titleKey]="project.titleKey"
              [descriptionKey]="project.descriptionKey"
              [detailsKey]="project.detailsKey"
              [tags]="project.tags"
              [images]="project.images"
            />
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .projects {
      background: var(--bg-secondary);
    }

    .projects__grid {
      display: grid;
      gap: 2rem;
      grid-template-columns: 1fr;

      @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `,
})
export class ProjectsComponent {
  protected readonly projects = PROJECTS;
}
