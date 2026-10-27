import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppError } from '../core/models/app-error.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 4000 });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 8000 });
  }

  errorFrom(error: unknown): void {
    this.error(error instanceof AppError ? error.message : 'Something went wrong. Please try again.');
  }
}