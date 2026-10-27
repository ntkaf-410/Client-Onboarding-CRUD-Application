import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { RESIDENTIAL_STATUSES } from '../../../core/constants/dropdowns';

@Component({
  selector: 'app-address-fields',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <fieldset [formGroup]="group()" class="block">
      <legend>{{ legend() }}</legend>
      <div class="grid">
        <mat-form-field>
          <mat-label>Address line 1</mat-label>
          <input matInput formControlName="addressLine1" />
          <mat-error>{{ message('addressLine1') }}</mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Address line 2</mat-label>
          <input matInput formControlName="addressLine2" />
          <mat-error>{{ message('addressLine2') }}</mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Suburb / area</mat-label>
          <input matInput formControlName="suburb" />
          <mat-error>{{ message('suburb') }}</mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>City / town</mat-label>
          <input matInput formControlName="city" />
          <mat-error>{{ message('city') }}</mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>District / state</mat-label>
          <input matInput formControlName="district" />
          <mat-error>{{ message('district') }}</mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Postal code</mat-label>
          <input matInput formControlName="postalCode" />
          <mat-error>{{ message('postalCode') }}</mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Country</mat-label>
          <mat-select formControlName="country">
            @for (country of countries(); track country) {
              <mat-option [value]="country">{{ country }}</mat-option>
            }
          </mat-select>
          <mat-error>{{ message('country') }}</mat-error>
        </mat-form-field>

        @if (showStatus()) {
          <mat-form-field>
            <mat-label>Residential status</mat-label>
            <mat-select formControlName="residentialStatus">
              @for (option of residentialStatuses; track option.value) {
                <mat-option [value]="option.value">{{ option.label }}</mat-option>
              }
            </mat-select>
            <mat-error>{{ message('residentialStatus') }}</mat-error>
          </mat-form-field>
        }
      </div>
    </fieldset>
  `,
  styles: `
    .block {
      border: 0;
      margin: 16px 0 0;
      padding: 0;
    }
    legend {
      font-size: 1.1rem;
      font-weight: 600;
      padding: 0;
      margin-bottom: 8px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      column-gap: 16px;
    }
    mat-form-field {
      width: 100%;
    }
  `,
})
export class AddressFieldsComponent {
  readonly group = input.required<FormGroup>();
  readonly legend = input.required<string>();
  readonly countries = input.required<readonly string[]>();
  readonly showStatus = input(false);

  protected readonly residentialStatuses = RESIDENTIAL_STATUSES;

  protected message(name: string): string {
    const errors = this.group().get(name)?.errors;
    if (!errors) {
      return '';
    }
    if (errors['server']) return errors['server'] as string;
    if (errors['required']) return 'This field is required';
    if (errors['maxlength']) return `Use at most ${errors['maxlength'].requiredLength} characters`;
    if (errors['pattern']) return 'Use up to 10 letters or digits';
    return 'Invalid value';
  }
}