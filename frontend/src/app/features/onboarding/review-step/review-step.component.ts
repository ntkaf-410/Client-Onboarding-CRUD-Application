import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AppError } from '../../../core/models/app-error.model';
import { NotificationService } from '../../../shared/notification.service';
import { OnboardingApiService } from '../services/onboarding-api.service';
import { OnboardingSummaryComponent } from '../summary/onboarding-summary.component';
import { WizardStore } from '../wizard/wizard-store.service';

interface MissingItem {
  message: string;
  step: 'personal' | 'address';
}

@Component({
  selector: 'app-review-step',
  imports: [RouterLink, MatButtonModule, MatProgressSpinnerModule, OnboardingSummaryComponent],
  templateUrl: './review-step.component.html',
  styleUrl: './review-step.component.scss',
})
export class ReviewStepComponent {
  private readonly api = inject(OnboardingApiService);
  protected readonly store = inject(WizardStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notify = inject(NotificationService);

  protected readonly onboardingId = Number(this.route.snapshot.paramMap.get('id'));
  protected readonly saving = signal(false);
  protected readonly serverMissing = signal<string[]>([]);

  protected readonly missing = computed<MissingItem[]>(() => {
    const onboarding = this.store.onboarding();
    if (!onboarding) {
      return [];
    }
    const items: MissingItem[] = [];
    const need = (value: unknown, label: string, step: MissingItem['step']) => {
      if (value === null || value === undefined || String(value).trim() === '') {
        items.push({ message: `${label} is required`, step });
      }
    };

    const p = onboarding.personal;
    need(p.title, 'Title', 'personal');
    need(p.firstName, 'First name', 'personal');
    need(p.lastName, 'Last name', 'personal');
    need(p.dateOfBirth, 'Date of birth', 'personal');
    need(p.gender, 'Gender', 'personal');
    need(p.maritalStatus, 'Marital status', 'personal');
    need(p.nationality, 'Nationality', 'personal');
    need(p.idType, 'ID type', 'personal');
    need(p.idNumber, 'ID number', 'personal');
    need(p.email, 'Email', 'personal');
    need(p.mobileNumber, 'Mobile number', 'personal');
    need(p.employmentStatus, 'Employment status', 'personal');
    if (p.idType === 'PASSPORT' || p.idType === 'DRIVERS_LICENCE') {
      need(p.idExpiryDate, 'ID expiry date', 'personal');
    }

    const residential = onboarding.addresses.find((a) => a.addressType === 'RESIDENTIAL');
    if (!residential) {
      items.push({ message: 'A residential address is required', step: 'address' });
    } else {
      need(residential.addressLine1, 'Address line 1', 'address');
      need(residential.city, 'City / town', 'address');
      need(residential.country, 'Country', 'address');
      need(residential.residentialStatus, 'Residential status', 'address');
    }
    return items;
  });

  protected readonly canSubmit = computed(
    () => !!this.store.onboarding() && this.missing().length === 0 && !this.saving(),
  );

  constructor() {
    this.store.activeStep.set(3);
    this.store.ensureLoaded(this.onboardingId);

    effect(() => {
      const onboarding = this.store.onboarding();
      if (onboarding?.status === 'SUBMITTED') {
        untracked(() => void this.router.navigate(['/onboardings', onboarding.id], { replaceUrl: true }));
      }
    });
  }

  protected back(): void {
    void this.router.navigate(['/onboardings', this.onboardingId, 'address']);
  }

  protected submit(): void {
    const onboarding = this.store.onboarding();
    if (!onboarding || !this.canSubmit()) {
      return;
    }
    this.saving.set(true);
    this.serverMissing.set([]);

    this.api
      .submitOnboarding(onboarding.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          const name = `${onboarding.personal.firstName} ${onboarding.personal.lastName}`;
          this.notify.success(`Onboarding submitted for ${name}`);
          void this.router.navigate(['/onboardings']);
        },
        error: (err: unknown) => this.handleError(err),
      });
  }

  private handleError(err: unknown): void {
    if (err instanceof AppError && err.kind === 'business-rule') {
      this.notify.error(err.message);
      if (err.fieldErrors.length > 0) {
        // BR-04: the API lists what is missing
        this.serverMissing.set(err.fieldErrors.map((e) => e.message));
      } else {
        this.store.reset();
        this.store.ensureLoaded(this.onboardingId);
      }
      return;
    }
    if (err instanceof AppError && err.kind === 'not-found') {
      this.notify.error(err.message);
      void this.router.navigate(['/onboardings']);
      return;
    }
    this.notify.errorFrom(err);
  }
}