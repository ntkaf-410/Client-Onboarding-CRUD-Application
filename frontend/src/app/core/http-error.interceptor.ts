import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { ApiError } from './models/api-error.model';
import { AppError, AppErrorKind } from './models/app-error.model';

const GENERIC_MESSAGE = 'Something went wrong. Please try again.';

const KIND_BY_CODE: Record<string, AppErrorKind> = {
  VALIDATION_ERROR: 'validation',
  NOT_FOUND: 'not-found',
  DUPLICATE_RESOURCE: 'duplicate',
  BUSINESS_RULE_VIOLATION: 'business-rule',
  INTERNAL_ERROR: 'server',
};

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(catchError((error: unknown) => throwError(() => toAppError(error))));

function toAppError(error: unknown): AppError {
  if (!(error instanceof HttpErrorResponse)) {
    return new AppError('unknown', 0, GENERIC_MESSAGE);
  }

  if (error.status === 0) {
    return new AppError(
      'network',
      0,
      'The service is unavailable. Check your connection and try again.',
    );
  }

  if (isApiError(error.error)) {
    const body = error.error;
    return new AppError(
      KIND_BY_CODE[body.error] ?? kindFromStatus(error.status),
      body.status ?? error.status,
      body.message,
      body.fieldErrors ?? [],
    );
  }

  return new AppError(kindFromStatus(error.status), error.status, messageFromStatus(error.status));
}

function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ApiError).error === 'string' &&
    typeof (value as ApiError).message === 'string'
  );
}

function kindFromStatus(status: number): AppErrorKind {
  if (status === 400) return 'validation';
  if (status === 404) return 'not-found';
  if (status === 409) return 'duplicate';
  if (status === 422) return 'business-rule';
  if (status >= 500) return 'server';
  return 'unknown';
}

function messageFromStatus(status: number): string {
  if (status === 404) return 'The requested item was not found.';
  if (status >= 500) return 'The service had a problem. Please try again later.';
  return GENERIC_MESSAGE;
}