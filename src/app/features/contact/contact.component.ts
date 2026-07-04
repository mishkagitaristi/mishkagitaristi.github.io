import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CONTACT_FORM } from '@core/config/contact.config';
import { PERSON } from '@core/config/person.config';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import { slideInUp, routeFade } from '@shared/animations/portfolio.animations';

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    GlassCardComponent,
    SectionHeadingComponent,
    ScrollRevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInUp, routeFade],
  host: { '[@routeFade]': '' },
  template: `
    <section class="contact-page section" aria-labelledby="contact-page-heading" @slideInUp>
      <div class="container contact-page__inner">
        <app-section-heading
          sectionId="contact-page-heading"
          labelKey="contact.label"
          titleKey="contact.title"
          subtitleKey="contact.subtitle"
        />

        <div class="contact-page__grid">
          <div appScrollReveal="up" class="contact-page__form-col">
            <app-glass-card>
              <div class="contact-card">
                <h2 class="contact-card__heading">{{ 'contact.form.title' | translate }}</h2>

                @if (status() === 'sent') {
                  <div class="contact-form__success" role="status">
                    <p class="contact-form__success-title">
                      {{ 'contact.form.successTitle' | translate }}
                    </p>
                    <p>{{ 'contact.form.successBody' | translate }}</p>
                  </div>
                } @else {
                  <form class="contact-form" [formGroup]="form" (ngSubmit)="submit()">
                    <div class="contact-form__row">
                      <div class="contact-form__field">
                        <label for="cf-name">{{ 'contact.form.name' | translate }}</label>
                        <input
                          id="cf-name"
                          type="text"
                          formControlName="name"
                          autocomplete="name"
                          [attr.aria-invalid]="invalid('name')"
                        />
                        @if (invalid('name')) {
                          <span class="contact-form__error">{{
                            'contact.form.required' | translate
                          }}</span>
                        }
                      </div>
                      <div class="contact-form__field">
                        <label for="cf-email">{{ 'contact.form.email' | translate }}</label>
                        <input
                          id="cf-email"
                          type="email"
                          formControlName="email"
                          autocomplete="email"
                          [attr.aria-invalid]="invalid('email')"
                        />
                        @if (invalid('email')) {
                          <span class="contact-form__error">{{
                            'contact.form.invalidEmail' | translate
                          }}</span>
                        }
                      </div>
                    </div>

                    <div class="contact-form__field">
                      <label for="cf-company">
                        {{ 'contact.form.company' | translate }}
                        <span class="contact-form__optional">{{
                          'contact.form.optional' | translate
                        }}</span>
                      </label>
                      <input
                        id="cf-company"
                        type="text"
                        formControlName="company"
                        autocomplete="organization"
                      />
                    </div>

                    <div class="contact-form__field">
                      <label for="cf-message">{{ 'contact.form.message' | translate }}</label>
                      <textarea
                        id="cf-message"
                        rows="5"
                        formControlName="message"
                        [attr.aria-invalid]="invalid('message')"
                      ></textarea>
                      @if (invalid('message')) {
                        <span class="contact-form__error">{{
                          'contact.form.required' | translate
                        }}</span>
                      }
                    </div>

                    <!-- Honeypot — hidden from humans, catches bots. -->
                    <input
                      type="text"
                      formControlName="botcheck"
                      class="contact-form__honeypot"
                      tabindex="-1"
                      autocomplete="off"
                      aria-hidden="true"
                    />

                    @if (status() === 'error') {
                      <p class="contact-form__error contact-form__error--global" role="alert">
                        {{ 'contact.form.error' | translate }}
                        <a [href]="'mailto:' + person.email">{{ person.email }}</a>
                      </p>
                    }

                    <button type="submit" class="contact-form__submit" [disabled]="status() === 'sending'">
                      {{
                        (status() === 'sending' ? 'contact.form.sending' : 'contact.form.submit')
                          | translate
                      }}
                    </button>
                  </form>
                }
              </div>
            </app-glass-card>
          </div>

          <div class="contact-page__side">
            <div appScrollReveal="up" [revealDelay]="100">
              <app-glass-card>
                <div class="contact-card">
                  <h2 class="contact-card__heading">{{ 'contact.social' | translate }}</h2>
                  <div class="contact-card__social">
                    <a
                      [href]="person.linkedin"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="contact-card__social-link"
                    >
                      <span class="contact-card__social-icon" aria-hidden="true">in</span>
                      LinkedIn
                    </a>
                    <a
                      [href]="person.github"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="contact-card__social-link"
                    >
                      <span class="contact-card__social-icon" aria-hidden="true">&lt;/&gt;</span>
                      GitHub
                    </a>
                    <a [href]="'mailto:' + person.email" class="contact-card__social-link">
                      <span class="contact-card__social-icon" aria-hidden="true">@</span>
                      {{ person.email }}
                    </a>
                    <a [href]="'tel:' + phoneHref" class="contact-card__social-link">
                      <span class="contact-card__social-icon" aria-hidden="true">☏</span>
                      {{ person.phone }}
                    </a>
                  </div>
                  <p class="contact-card__availability">{{ 'contact.availability' | translate }}</p>
                </div>
              </app-glass-card>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    @use 'styles/mixins';

    .contact-page__inner {
      max-width: 1000px;
    }

    .contact-page__grid {
      display: grid;
      gap: 1.5rem;
      align-items: start;

      @include mixins.respond-to(md) {
        grid-template-columns: 3fr 2fr;
      }
    }

    .contact-card__heading {
      font-size: 1.125rem;
      margin-bottom: 1.5rem;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .contact-form__row {
      display: grid;
      gap: 1.25rem;

      @include mixins.respond-to(sm) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .contact-form__field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;

      label {
        font-size: 0.875rem;
        font-weight: 500;
      }

      input,
      textarea {
        font-family: var(--font-body);
        font-size: 0.9375rem;
        color: var(--text-primary);
        padding: 0.75rem 0.875rem;
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        background: var(--bg-primary);
        transition: border-color var(--transition-fast);
        resize: vertical;

        &:focus {
          outline: none;
          border-color: var(--accent-from);
        }

        &[aria-invalid='true'] {
          border-color: #e5484d;
        }
      }
    }

    .contact-form__optional {
      color: var(--text-muted);
      font-weight: 400;
      font-size: 0.8125rem;
    }

    .contact-form__error {
      font-size: 0.8125rem;
      color: #e5484d;

      &--global {
        font-size: 0.9375rem;

        a {
          color: var(--accent-from);
          text-decoration: underline;
        }
      }
    }

    .contact-form__honeypot {
      position: absolute;
      left: -9999px;
      width: 1px;
      height: 1px;
      opacity: 0;
    }

    .contact-form__submit {
      @include mixins.button-primary;
      align-self: flex-start;

      &:disabled {
        opacity: 0.6;
        cursor: wait;
      }
    }

    .contact-form__success {
      padding: 1.5rem;
      border: 1px solid var(--accent-alt);
      border-radius: var(--radius-md);
      background: var(--bg-elevated);
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .contact-form__success-title {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 1.0625rem;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .contact-page__side {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .contact-card__social {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .contact-card__social-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: var(--radius-md);
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      font-weight: 500;
      font-size: 0.9375rem;
      overflow-wrap: anywhere;
      transition: border-color var(--transition-fast), transform var(--transition-fast);

      &:hover {
        border-color: var(--accent-from);
        transform: translateX(4px);
      }
    }

    .contact-card__social-icon {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      background: var(--accent-gradient);
      color: var(--accent-contrast);
      font-size: 0.875rem;
      font-weight: 700;
    }

    .contact-card__availability {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.9375rem;
      line-height: 1.6;
    }
  `,
})
export class ContactComponent {
  protected readonly person = PERSON;
  protected readonly phoneHref = PERSON.phone.replace(/\s/g, '');
  protected readonly status = signal<FormStatus>('idle');

  private readonly http = inject(HttpClient);
  private readonly translate = inject(TranslateService);
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    message: ['', Validators.required],
    botcheck: [''],
  });

  protected invalid(control: 'name' | 'email' | 'message'): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || c.dirty);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    if (value.botcheck) {
      return;
    }

    if (!CONTACT_FORM.accessKey) {
      this.openMailFallback(value);
      return;
    }

    this.status.set('sending');
    this.http
      .post(CONTACT_FORM.endpoint, {
        access_key: CONTACT_FORM.accessKey,
        subject: `Portfolio inquiry from ${value.name}`,
        name: value.name,
        email: value.email,
        company: value.company || undefined,
        message: value.message,
      })
      .subscribe({
        next: () => this.status.set('sent'),
        error: () => this.status.set('error'),
      });
  }

  /** No delivery key configured yet — hand off to the visitor's mail client. */
  private openMailFallback(value: { name: string; company: string; message: string }): void {
    const subject = encodeURIComponent(`Project inquiry — ${value.name}`);
    const company = value.company ? `\nCompany: ${value.company}` : '';
    const body = encodeURIComponent(`${value.message}\n\n— ${value.name}${company}`);
    window.location.href = `mailto:${PERSON.email}?subject=${subject}&body=${body}`;
    this.status.set('sent');
  }
}
