import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import {
  Subject, catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap, tap,
} from 'rxjs';

import { ONBOARDING_STATUSES } from '../../../core/constants/dropdowns';
import { ApiError } from '../../../core/models/api-error.model';
import { OnboardingListItem, OnboardingStatus } from '../../../core/models/onboarding.model';
import { Page } from '../../../core/models/page.model';
import { OnboardingApiService } from '../services/onboarding-api.service';

@Component({
  selector: 'app-onboarding-list',
  imports: [
    DatePipe, ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule, MatTableModule,
  ],
  templateUrl: './onboarding-list.component.html',
  styleUrl: './onboarding-list.component.scss',
})
export class OnboardingListComponent {
  private readonly api = inject(OnboardingApiService);

  protected readonly columns = ['clientName', 'idNumber', 'status', 'currentStep', 'updatedAt', 'actions'];
  protected readonly statusOptions = ONBOARDING_STATUSES;
  protected readonly pageSizeOptions = [10, 25, 50];

  protected readonly searchControl = new FormControl('', { nonNullable: true });
  protected readonly statusControl = new FormControl<OnboardingStatus | ''>('', { nonNullable: true });

  protected readonly page = signal(0);
  protected readonly size = signal(10);
  protected readonly loading = signal(false);
  protected readonly error = signal<ApiError | null>(null);
  protected readonly data = signal<Page<OnboardingListItem> | null>(null);
  protected readonly filtersActive = signal(false);

  private readonly reload$ = new Subject<void>();

  constructor() {
    this.reload$
      .pipe(
        startWith(undefined),
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
          this.filtersActive.set(!!this.searchControl.value.trim() || !!this.statusControl.value);
        }),
        switchMap(() =>
          this.api
            .listOnboardings({
              page: this.page(),
              size: this.size(),
              status: this.statusControl.value,
              search: this.searchControl.value,
            })
            .pipe(
              catchError((err: unknown) => {
                this.error.set(err as ApiError);
                return of(null);
              }),
            ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((result) => {
        this.loading.set(false);
        if (result) {
          this.data.set(result);
        }
      });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => this.resetAndReload());

    this.statusControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.resetAndReload());
  }

  protected onPage(event: PageEvent): void {
    this.page.set(event.pageIndex);
    this.size.set(event.pageSize);
    this.reload$.next();
  }

  protected retry(): void {
    this.reload$.next();
  }

  protected clearFilters(): void {
    this.searchControl.setValue('', { emitEvent: false });
    this.statusControl.setValue('', { emitEvent: false });
    this.resetAndReload();
  }

  protected openLink(item: OnboardingListItem): unknown[] {
    if (item.status === 'SUBMITTED') {
      return ['/onboardings', item.id];
    }
    const step = ['personal', 'address', 'review'][item.currentStep - 1] ?? 'personal';
    return ['/onboardings', item.id, step];
  }

  private resetAndReload(): void {
    this.page.set(0);
    this.reload$.next();
  }
}