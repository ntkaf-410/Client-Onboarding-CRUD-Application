import { ValidatorFn } from '@angular/forms';

export const NAME_PATTERN = /^[\p{L} '-]+$/u;

export const requiredTrimmed: ValidatorFn = (control) =>
  typeof control.value === 'string' && control.value.length > 0 && control.value.trim().length === 0
    ? { required: true }
    : null;

export function minAge(years: number): ValidatorFn {
  return (control) => {
    const value = control.value as Date | null;
    if (!value) {
      return null;
    }
    const limit = new Date();
    limit.setHours(0, 0, 0, 0);
    limit.setFullYear(limit.getFullYear() - years);
    return value > limit ? { minAge: { years } } : null;
  };
}

export const futureDate: ValidatorFn = (control) => {
  const value = control.value as Date | null;
  if (!value) {
    return null;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return value > today ? null : { futureDate: true };
};