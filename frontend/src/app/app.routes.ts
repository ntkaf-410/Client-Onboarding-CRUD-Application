import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'onboardings' },
  {
    path: 'onboardings',
    loadComponent: () =>
      import('./features/onboarding/list/onboarding-list.component').then(
        (m) => m.OnboardingListComponent,
      ),
  },
];