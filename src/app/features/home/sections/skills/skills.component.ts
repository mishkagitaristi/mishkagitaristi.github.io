import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SKILL_GROUPS } from '@core/data/skills.data';
import { cardStagger } from '@shared/animations/portfolio.animations';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { SkillCardComponent } from '@shared/components/skill-card/skill-card.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [TranslateModule, SectionHeadingComponent, SkillCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [cardStagger],
  template: `
    <section id="skills" class="section skills" aria-labelledby="skills-heading" @cardStagger>
      <div class="container">
        <app-section-heading
          sectionId="skills-heading"
          labelKey="skills.label"
          titleKey="skills.title"
          subtitleKey="skills.subtitle"
        />

        <div class="skills__groups">
          @for (group of skillGroups; track group.id) {
            <div class="skills__group">
              <h3 class="skills__group-title">{{ group.titleKey | translate }}</h3>
              @if (group.display === 'tags') {
                <div class="skills__tags">
                  @for (skill of group.skills; track skill.id) {
                    <span class="skills__tag">{{ skill.nameKey | translate }}</span>
                  }
                </div>
              } @else {
                <div class="skills__grid">
                  @for (skill of group.skills; track skill.id) {
                    <app-skill-card
                      [skillId]="skill.id"
                      [nameKey]="skill.nameKey"
                      [descriptionKey]="skill.descriptionKey"
                    />
                  }
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    @use 'styles/mixins';

    .skills__groups {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    .skills__group-title {
      font-size: 1.125rem;
      margin-bottom: 1.25rem;
      color: var(--text-secondary);
    }

    .skills__grid {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: 1fr;

      @include mixins.respond-to(sm) {
        grid-template-columns: repeat(2, 1fr);
      }

      @include mixins.respond-to(lg) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .skills__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.625rem;
    }

    .skills__tag {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-full, 9999px);
      transition: border-color var(--transition-base), color var(--transition-base);

      &:hover {
        border-color: var(--accent-from);
        color: var(--accent-from);
      }
    }
  `,
})
export class SkillsComponent {
  protected readonly skillGroups = SKILL_GROUPS;
}
