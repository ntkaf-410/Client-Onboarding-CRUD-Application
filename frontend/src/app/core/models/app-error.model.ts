import { FieldError } from './api-error.model';

export type AppErrorKind =
  | 'network'
  | 'validation'
  | 'not-found'
  | 'duplicate'
  | 'business-rule'
  | 'server'
  | 'unknown';

export class AppError {
  constructor(
    readonly kind: AppErrorKind,
    readonly status: number,
    readonly message: string,
    readonly fieldErrors: FieldError[] = [],
  ) {}

  fieldMessage(field: string): string | undefined {
    return this.fieldErrors.find((e) => e.field === field)?.message;
  }
}