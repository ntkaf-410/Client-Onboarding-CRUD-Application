import { DatePipe } from '@angular/common';
import { Component, effect, inject, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { stepPath } from '../../../core/utils/wizard-steps';
import { OnboardingSummaryComponent } from '../summary/onboarding-summary.component';
import { WizardStore } from '../wizard/wizard-store.service';

@Component({
  selector: 'app-onboarding-detail',
  imports: [DatePipe, RouterLink, MatButtonModule, OnboardingSummaryComponent],
  template: `
    @if (store.onboarding(); as onboarding) {
      @if (onboarding.status === 'SUBMITTED') {
        <p class="submitted">
          Submitted on {{ onboarding.submittedAt | date: 'dd MMM yyyy, HH:mm' }}
        </p>
        <app-onboarding-summary [onboarding]="onboarding" />
        <div class="actions">
          <a mat-stroked-button routerLink="/onboardings">Back to the list</a>
        </div>
      }
    }
  `,
  styles: `
    .submitted {
      margin: 0;
      opacity: 0.75;
    }
    .actions {
      margin-top: 16px;
    }
  `,
})
export class OnboardingDetailComponent {
  protected readonly store = inject(WizardStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.store.activeStep.set(3);
    this.store.ensureLoaded(Number(this.route.snapshot.paramMap.get('id')));

    effect(() => {
      const onboarding = this.store.onboarding();
      if (onboarding?.status === 'DRAFT') {
        untracked(
          () =>
            void this.router.navigate(
              ['/onboardings', onboarding.id, stepPath(onboarding.currentStep)],
              { replaceUrl: true },
            ),
        );
      }
    });
  }
}