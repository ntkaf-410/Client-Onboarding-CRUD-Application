import { Component, DestroyRef, ElementRef, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable, concat, defer, finalize, switchMap, tap, toArray } from 'rxjs';

import { COUNTRIES } from '../../../core/constants/dropdowns';
import { AddressFields, AddressFormValue } from '../../../core/models/address-form.model';
import { Address, AddressRequest, AddressType } from '../../../core/models/address.model';
import { AppError } from '../../../core/models/app-error.model';
import { Onboarding } from '../../../core/models/onboarding.model';
import { requiredTrimmed } from '../../../core/validators/app-validators';
import { NotificationService } from '../../../shared/notification.service';
import { OnboardingApiService } from '../services/onboarding-api.service';
import { WizardStore } from '../wizard/wizard-store.service';
import { AddressFieldsComponent } from './address-fields.component';

const BLANK: AddressFields = {
  addressLine1: '', addressLine2: '', suburb: '', city: '', district: '', postalCode: '', country: '',
};

const POSTAL_REQUIRED = ['addressLine1', 'city', 'country'] as const;

@Component({
  selector: 'app-address-step',
  imports: [
    ReactiveFormsModule, MatButtonModule, MatCheckboxModule, MatProgressSpinnerModule,
    AddressFieldsComponent,
  ],
  templateUrl: './address-step.component.html',
  styleUrl: './address-step.component.scss',
})
export class AddressStepComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(OnboardingApiService);
  protected readonly store = inject(WizardStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notify = inject(NotificationService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  private readonly onboardingId = Number(this.route.snapshot.paramMap.get('id'));

  protected readonly countries = signal<string[]>([...COUNTRIES]);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.group({
    residential: this.fb.group({
      ...this.commonControls(true),
      residentialStatus: this.fb.control('', [Validators.required]),
    }),
    samePostal: this.fb.control(false),
    postal: this.fb.group(this.commonControls(false)),
  });

  protected readonly samePostal = toSignal(this.form.controls.samePostal.valueChanges, {
    initialValue: false,
  });

  private filled = false;
  private leaveClean = false;
  private activeType: AddressType = 'RESIDENTIAL';
  private saved: { residential?: Address; postal?: Address } = {};

  constructor() {
    this.store.activeStep.set(2);
    this.store.ensureLoaded(this.onboardingId);

    effect(() => {
      const onboarding = this.store.onboarding();
      if (!onboarding || this.filled) {
        return;
      }
      this.filled = true;
      untracked(() => {
        if (onboarding.status === 'SUBMITTED') {
          void this.router.navigate(['/onboardings', onboarding.id]); // read-only view (task 8)
          return;
        }
        this.fill(onboarding);
      });
    });

    this.form.controls.samePostal.valueChanges.pipe(takeUntilDestroyed()).subscribe((same) => {
      const postal = this.form.controls.postal;
      if (same) {
        postal.disable({ emitEvent: false });
      } else {
        postal.enable({ emitEvent: false });
      }
      this.syncPostalRequired();
    });

    this.form.controls.postal.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.syncPostalRequired());

    this.destroyRef.onDestroy(() => {
      if (!this.leaveClean && this.form.dirty) {
        this.store.addressDraft.set(this.form.getRawValue());
      }
    });
  }

  protected back(): void {
    void this.router.navigate(['/onboardings', this.onboardingId, 'personal']);
  }

  protected next(): void {
    if (this.saving()) {
      return;
    }
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.focusFirstInvalid();
      return;
    }
    const onboarding = this.store.onboarding();
    if (!onboarding) {
      return;
    }

    this.saving.set(true);
    this.save(onboarding)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (updated) => {
          this.leaveClean = true;
          this.store.addressDraft.set(null);
          this.store.set(updated);
          void this.router.navigate(['/onboardings', updated.id, 'review']);
        },
        error: (err: unknown) => this.handleError(err),
      });
  }


  private save(onboarding: Onboarding): Observable<Onboarding> {
    const value = this.form.getRawValue();
    const residential = this.toRequest('RESIDENTIAL', value.residential, value.residential.residentialStatus);
    const postal = this.postalRequest(value);

    return concat(
      this.upsert(onboarding.personalId, residential),
      postal ? this.upsert(onboarding.personalId, postal) : this.deletePostalIfSaved(),
    ).pipe(
      toArray(),
      switchMap(() => this.api.updateOnboardingStep(onboarding.id, 3)),
    );
  }

  private postalRequest(value: AddressFormValue): AddressRequest | null {
    if (value.samePostal) {
      return this.toRequest('POSTAL', value.residential, null);
    }
    const started = Object.values(value.postal).some((v) => v.trim().length > 0);
    return started ? this.toRequest('POSTAL', value.postal, null) : null;
  }

  private upsert(personalId: number, request: AddressRequest): Observable<Address> {
    return defer(() => {
      this.activeType = request.addressType;
      const existing = request.addressType === 'RESIDENTIAL' ? this.saved.residential : this.saved.postal;
      const call$ = existing
        ? this.api.updateAddress(existing.id, request)
        : this.api.createAddress(personalId, request);
      return call$.pipe(tap((address) => this.remember(address)));
    });
  }

  private deletePostalIfSaved(): Observable<void> {
    const postal = this.saved.postal;
    if (!postal) {
      return EMPTY;
    }
    return defer(() => {
      this.activeType = 'POSTAL';
      return this.api.deleteAddress(postal.id).pipe(tap(() => (this.saved.postal = undefined)));
    });
  }

  private remember(address: Address): void {
    if (address.addressType === 'RESIDENTIAL') {
      this.saved.residential = address;
    } else {
      this.saved.postal = address;
    }
  }

  private toRequest(type: AddressType, fields: AddressFields, status: string | null): AddressRequest {
    return {
      addressType: type,
      addressLine1: fields.addressLine1.trim(),
      addressLine2: fields.addressLine2.trim() || null,
      suburb: fields.suburb.trim() || null,
      city: fields.city.trim(),
      district: fields.district.trim() || null,
      postalCode: fields.postalCode.trim() || null,
      country: fields.country,
      residentialStatus: type === 'RESIDENTIAL' ? status : null,
    };
  }


  private fill(onboarding: Onboarding): void {
    const residential = onboarding.addresses.find((a) => a.addressType === 'RESIDENTIAL');
    const postal = onboarding.addresses.find((a) => a.addressType === 'POSTAL');
    this.saved = { residential, postal };

    const draft = this.store.addressDraft();
    if (draft) {
      this.store.addressDraft.set(null);
      this.apply(draft);
      return;
    }
    this.apply(this.fromSaved(residential, postal));
  }

  private apply(value: AddressFormValue): void {
    this.ensureCountries([value.residential.country, value.postal.country]);
    this.form.patchValue(value);
    this.syncPostalRequired();
  }

  private fromSaved(residential?: Address, postal?: Address): AddressFormValue {
    const r = residential ? this.fieldsOf(residential) : BLANK;
    const p = postal ? this.fieldsOf(postal) : BLANK;
    const same =
      !!residential && !!postal && (Object.keys(r) as (keyof AddressFields)[]).every((k) => r[k] === p[k]);
    return {
      residential: { ...r, residentialStatus: residential?.residentialStatus ?? '' },
      samePostal: same,
      postal: p,
    };
  }

  private fieldsOf(a: Address): AddressFields {
    return {
      addressLine1: a.addressLine1,
      addressLine2: a.addressLine2 ?? '',
      suburb: a.suburb ?? '',
      city: a.city,
      district: a.district ?? '',
      postalCode: a.postalCode ?? '',
      country: a.country,
    };
  }

  private ensureCountries(values: string[]): void {
    const missing = values.filter((v) => v && !this.countries().includes(v));
    if (missing.length > 0) {
      this.countries.update((list) => [...list, ...new Set(missing)].sort());
    }
  }


  private commonControls(required: boolean) {
    const req = required ? [Validators.required, requiredTrimmed] : [];
    return {
      addressLine1: this.fb.control('', [...req, Validators.maxLength(100)]),
      addressLine2: this.fb.control('', [Validators.maxLength(100)]),
      suburb: this.fb.control('', [Validators.maxLength(60)]),
      city: this.fb.control('', [...req, Validators.maxLength(60)]),
      district: this.fb.control('', [Validators.maxLength(60)]),
      postalCode: this.fb.control('', [Validators.pattern(/^[A-Za-z0-9]{1,10}$/)]),
      country: this.fb.control('', required ? [Validators.required] : []),
    };
  }

  private syncPostalRequired(): void {
    const postal = this.form.controls.postal;
    if (postal.disabled) {
      return;
    }
    const started = Object.values(postal.getRawValue()).some((v) => v.trim().length > 0);
    for (const name of POSTAL_REQUIRED) {
      const control = postal.controls[name];
      if (started) {
        control.addValidators([Validators.required, requiredTrimmed]);
      } else {
        control.removeValidators([Validators.required, requiredTrimmed]);
      }
      control.updateValueAndValidity({ emitEvent: false });
    }
  }


  private handleError(err: unknown): void {
    if (err instanceof AppError && err.fieldErrors.length > 0) {
      const unmatched: string[] = [];
      for (const fieldError of err.fieldErrors) {
        const control =
          this.activeType === 'POSTAL'
            ? this.form.controls.postal.get(fieldError.field)
            : this.form.controls.residential.get(fieldError.field);
        if (control) {
          control.setErrors({ server: fieldError.message });
          control.markAsTouched();
        } else {
          unmatched.push(fieldError.message);
        }
      }
      this.notify.error(unmatched.length > 0 ? unmatched.join(' ') : err.message);
      this.focusFirstInvalid();
      return;
    }
    this.notify.errorFrom(err);
  }

  private focusFirstInvalid(): void {
    this.host.nativeElement
      .querySelector<HTMLElement>('input.ng-invalid, mat-select.ng-invalid')
      ?.focus();
  }
}