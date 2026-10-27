import { Component, ElementRef, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, finalize, switchMap, tap } from 'rxjs';

import {
  COUNTRIES, EMPLOYMENT_STATUSES, GENDERS, ID_TYPES, MARITAL_STATUSES, TITLES,
} from '../../../core/constants/dropdowns';
import { AppError } from '../../../core/models/app-error.model';
import { Onboarding } from '../../../core/models/onboarding.model';
import { PersonalRequest } from '../../../core/models/personal.model';
import { fromApiDate, toApiDate } from '../../../core/utils/date.util';
import {
  NAME_PATTERN, futureDate, minAge, requiredTrimmed,
} from '../../../core/validators/app-validators';
import { NotificationService } from '../../../shared/notification.service';
import { OnboardingApiService } from '../services/onboarding-api.service';
import { WizardStore } from '../wizard/wizard-store.service';

const PATTERN_MESSAGES: Record<string, string> = {
  firstName: 'Use letters, spaces, hyphens and apostrophes only',
  middleName: 'Use letters, spaces, hyphens and apostrophes only',
  lastName: 'Use letters, spaces, hyphens and apostrophes only',
  idNumber: 'Use 6 to 30 letters or digits',
  mobileNumber: 'Use 7 to 15 digits, with an optional leading +',
};

@Component({
  selector: 'app-personal-step',
  imports: [
    ReactiveFormsModule, RouterLink, MatButtonModule, MatDatepickerModule, MatFormFieldModule,
    MatInputModule, MatProgressSpinnerModule, MatSelectModule,
  ],
  providers: [
    provideNativeDateAdapter({
      parse: { dateInput: null },
      display: {
        dateInput: { day: '2-digit', month: 'short', year: 'numeric' },
        monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { day: '2-digit', month: 'long', year: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
      },
    }),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  templateUrl: './personal-step.component.html',
  styleUrl: './personal-step.component.scss',
})
export class PersonalStepComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(OnboardingApiService);
  private readonly store = inject(WizardStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notify = inject(NotificationService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly titles = TITLES;
  protected readonly genders = GENDERS;
  protected readonly maritalStatuses = MARITAL_STATUSES;
  protected readonly idTypes = ID_TYPES;
  protected readonly employmentStatuses = EMPLOYMENT_STATUSES;
  protected readonly countries = signal<string[]>([...COUNTRIES]);
  protected readonly saving = signal(false);

  protected readonly maxBirthDate = (() => {
    const limit = new Date();
    limit.setHours(0, 0, 0, 0);
    limit.setFullYear(limit.getFullYear() - 18);
    return limit;
  })();

  protected readonly form = this.fb.group({
    title: ['', [Validators.required]],
    firstName: ['', [Validators.required, requiredTrimmed, Validators.maxLength(50), Validators.pattern(NAME_PATTERN)]],
    middleName: ['', [Validators.maxLength(50), Validators.pattern(NAME_PATTERN)]],
    lastName: ['', [Validators.required, requiredTrimmed, Validators.maxLength(50), Validators.pattern(NAME_PATTERN)]],
    dateOfBirth: this.fb.control<Date | null>(null, [Validators.required, minAge(18)]),
    gender: ['', [Validators.required]],
    maritalStatus: ['', [Validators.required]],
    nationality: ['', [Validators.required]],
    idType: ['', [Validators.required]],
    idNumber: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{6,30}$/)]],
    idExpiryDate: this.fb.control<Date | null>(null),
    email: ['', [Validators.required, requiredTrimmed, Validators.email, Validators.maxLength(150)]],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]],
    occupation: ['', [Validators.maxLength(100)]],
    employmentStatus: ['', [Validators.required]],
  });

  private filled = !this.route.snapshot.paramMap.has('id');
  private createdPersonalId: number | null = null;

  constructor() {
    this.store.activeStep.set(1);

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam === null) {
      this.store.reset();
    } else {
      this.store.ensureLoaded(Number(idParam));
    }

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

    this.form.controls.idType.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.syncExpiryValidators());
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

    this.saving.set(true);
    this.save(this.toRequest())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (onboarding) => {
          this.store.set(onboarding);
          void this.router.navigate(['/onboardings', onboarding.id, 'address']);
        },
        error: (err: unknown) => this.handleError(err),
      });
  }

  protected message(name: string): string {
    const errors = this.form.get(name)?.errors;
    if (!errors) {
      return '';
    }
    if (errors['server']) return errors['server'] as string;
    if (errors['required']) return 'This field is required';
    if (errors['maxlength']) return `Use at most ${errors['maxlength'].requiredLength} characters`;
    if (errors['pattern']) return PATTERN_MESSAGES[name] ?? 'Invalid format';
    if (errors['email']) return 'Enter a valid email address';
    if (errors['minAge'] || errors['matDatepickerMax']) return 'The client must be 18 or older';
    if (errors['futureDate']) return 'The date must be in the future';
    if (errors['matDatepickerParse']) return 'Enter a valid date, for example 17 Mar 1994';
    return 'Invalid value';
  }

  private save(request: PersonalRequest): Observable<Onboarding> {
    const existing = this.store.onboarding();

    if (existing) {
      return this.api
        .updatePersonal(existing.personalId, request)
        .pipe(switchMap(() => this.api.updateOnboardingStep(existing.id, 2)));
    }

    const personal$ =
      this.createdPersonalId === null
        ? this.api.createPersonal(request)
        : this.api.updatePersonal(this.createdPersonalId, request);

    return personal$.pipe(
      tap((personal) => (this.createdPersonalId = personal.id)),
      switchMap((personal) => this.api.createOnboarding(personal.id)),
      tap((onboarding) => this.store.set(onboarding)),
      switchMap((onboarding) => this.api.updateOnboardingStep(onboarding.id, 2)),
    );
  }

  private toRequest(): PersonalRequest {
    const v = this.form.getRawValue();
    return {
      title: v.title,
      firstName: v.firstName.trim(),
      middleName: v.middleName.trim() || null,
      lastName: v.lastName.trim(),
      dateOfBirth: toApiDate(v.dateOfBirth) as string,
      gender: v.gender,
      maritalStatus: v.maritalStatus,
      nationality: v.nationality,
      idType: v.idType,
      idNumber: v.idNumber.trim(),
      idExpiryDate: toApiDate(v.idExpiryDate),
      email: v.email.trim(),
      mobileNumber: v.mobileNumber.trim(),
      occupation: v.occupation.trim() || null,
      employmentStatus: v.employmentStatus,
    };
  }

  private fill(onboarding: Onboarding): void {
    const p = onboarding.personal;
    if (!this.countries().includes(p.nationality)) {
      this.countries.update((list) => [...list, p.nationality].sort());
    }
    this.form.patchValue({
      title: p.title,
      firstName: p.firstName,
      middleName: p.middleName ?? '',
      lastName: p.lastName,
      dateOfBirth: fromApiDate(p.dateOfBirth),
      gender: p.gender,
      maritalStatus: p.maritalStatus,
      nationality: p.nationality,
      idType: p.idType,
      idNumber: p.idNumber,
      idExpiryDate: fromApiDate(p.idExpiryDate),
      email: p.email,
      mobileNumber: p.mobileNumber,
      occupation: p.occupation ?? '',
      employmentStatus: p.employmentStatus,
    });
    this.syncExpiryValidators();
  }

  private syncExpiryValidators(): void {
    const type = this.form.controls.idType.value;
    const required = type === 'PASSPORT' || type === 'DRIVERS_LICENCE';
    const control = this.form.controls.idExpiryDate;
    control.setValidators(required ? [Validators.required, futureDate] : []);
    control.updateValueAndValidity({ emitEvent: false });
  }

  private handleError(err: unknown): void {
    if (err instanceof AppError && err.fieldErrors.length > 0) {
      const unmatched: string[] = [];
      for (const fieldError of err.fieldErrors) {
        const control = this.form.get(fieldError.field);
        if (control) {
          control.setErrors({ server: fieldError.message });
          control.markAsTouched();
        } else {
          unmatched.push(fieldError.message);
        }
      }
      this.notify.error(unmatched.length > 0 ? unmatched.join(' ') : 'Please correct the highlighted fields.');
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