import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wizard-stepper',
  imports: [RouterLink],
  template: `
    <nav aria-label="Onboarding steps">
      <ol class="steps">
        @for (step of steps; track step.number) {
          <li
            class="step"
            [class.active]="step.number === active()"
            [class.done]="step.number < reached()"
          >
            @if (onboardingId() !== null && step.number <= reached()) {
              <a
                [routerLink]="['/onboardings', onboardingId(), step.path]"
                [attr.aria-current]="step.number === active() ? 'step' : null"
              >
                <span class="badge">{{ step.number }}</span>
                <span class="label">{{ step.label }}</span>
              </a>
            } @else {
              <span [attr.aria-current]="step.number === active() ? 'step' : null">
                <span class="badge">{{ step.number }}</span>
                <span class="label">{{ step.label }}</span>
              </span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `
    .steps {
      display: flex;
      list-style: none;
      margin: 16px 0;
      padding: 0;
      gap: 24px;
    }
    .step a,
    .step > span {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: inherit;
      text-decoration: none;
      opacity: 0.6;
    }
    .step.active > a,
    .step.active > span,
    .step.done > a {
      opacity: 1;
    }
    .step.active .label {
      font-weight: 700;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: 2px solid currentColor;
      border-radius: 50%;
      font-size: 0.85rem;
    }
    .step.active .badge {
      background: var(--mat-sys-primary, #3f51b5);
      border-color: var(--mat-sys-primary, #3f51b5);
      color: var(--mat-sys-on-primary, #fff);
    }
    @media (max-width: 480px) {
      .label {
        display: none;
      }
      .step.active .label {
        display: inline;
      }
    }
  `,
})
export class WizardStepperComponent {
  readonly active = input.required<number>();
  readonly onboardingId = input<number | null>(null);
  readonly reached = input(0);

  protected readonly steps = [
    { number: 1, label: 'Personal', path: 'personal' },
    { number: 2, label: 'Address', path: 'address' },
    { number: 3, label: 'Review', path: 'review' },
  ];
}