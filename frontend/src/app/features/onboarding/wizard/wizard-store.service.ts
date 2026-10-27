import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppError } from '../../../core/models/app-error.model';
import { Onboarding } from '../../../core/models/onboarding.model';
import { OnboardingApiService } from '../services/onboarding-api.service';
import { AddressFormValue } from '../../../core/models/address-form.model';

@Injectable()
export class WizardStore {
  private readonly api = inject(OnboardingApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly onboarding = signal<Onboarding | null>(null);
  readonly activeStep = signal(1);
  readonly loading = signal(false);
  readonly error = signal<AppError | null>(null);
  readonly addressDraft = signal<AddressFormValue | null>(null);

  ensureLoaded(id: number): void {
    if (this.onboarding()?.id === id) {
      return;
    }
    this.addressDraft.set(null);
    this.onboarding.set(null);
    this.error.set(null);
    this.loading.set(true);

    this.api
      .getOnboarding(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (onboarding) => {
          this.onboarding.set(onboarding);
          this.loading.set(false);
        },
        error: (err: unknown) => {
          this.error.set(
            err instanceof AppError
              ? err
              : new AppError('unknown', 0, 'Something went wrong. Please try again.'),
          );
          this.loading.set(false);
        },
      });
  }

  set(onboarding: Onboarding): void {
    this.onboarding.set(onboarding);
    this.error.set(null);
  }

  reset(): void {
    this.onboarding.set(null);
    this.addressDraft.set(null);
    this.error.set(null);
  }
}