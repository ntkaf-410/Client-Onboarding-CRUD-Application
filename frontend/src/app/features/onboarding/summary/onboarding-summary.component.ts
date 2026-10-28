import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  EMPLOYMENT_STATUSES, GENDERS, ID_TYPES, MARITAL_STATUSES, RESIDENTIAL_STATUSES,
} from '../../../core/constants/dropdowns';
import { Address } from '../../../core/models/address.model';
import { Onboarding } from '../../../core/models/onboarding.model';
import { labelOf } from '../../../core/utils/labels';

@Component({
  selector: 'app-onboarding-summary',
  imports: [DatePipe, RouterLink],
  templateUrl: './onboarding-summary.component.html',
  styleUrl: './onboarding-summary.component.scss',
})
export class OnboardingSummaryComponent {
  readonly onboarding = input.required<Onboarding>();
  readonly editable = input(false);

  protected readonly genders = GENDERS;
  protected readonly maritalStatuses = MARITAL_STATUSES;
  protected readonly idTypes = ID_TYPES;
  protected readonly employmentStatuses = EMPLOYMENT_STATUSES;
  protected readonly residentialStatuses = RESIDENTIAL_STATUSES;
  protected readonly label = labelOf;

  protected readonly personal = computed(() => this.onboarding().personal);

  protected readonly fullName = computed(() => {
    const p = this.personal();
    return [p.title, p.firstName, p.middleName, p.lastName].filter(Boolean).join(' ');
  });

  protected readonly residential = computed(() =>
    this.onboarding().addresses.find((a) => a.addressType === 'RESIDENTIAL'),
  );

  protected readonly postal = computed(() =>
    this.onboarding().addresses.find((a) => a.addressType === 'POSTAL'),
  );

  protected formatAddress(a: Address): string {
    return [a.addressLine1, a.addressLine2, a.suburb, a.city, a.district, a.postalCode, a.country]
      .filter(Boolean)
      .join(', ');
  }
}