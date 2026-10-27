import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'onboardings' },
  {
    path: 'onboardings',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/onboarding/list/onboarding-list.component').then(
            (m) => m.OnboardingListComponent,
          ),
      },
      {
        path: '',
        loadComponent: () =>
          import('./features/onboarding/wizard/wizard.component').then((m) => m.WizardComponent),
        children: [
          {
            path: 'new',
            loadComponent: () =>
              import('./features/onboarding/personal-step/personal-step.component').then(
                (m) => m.PersonalStepComponent,
              ),
          },
          {
            path: ':id/personal',
            loadComponent: () =>
              import('./features/onboarding/personal-step/personal-step.component').then(
                (m) => m.PersonalStepComponent,
              ),
          },
          {
            path: ':id/address',
            loadComponent: () =>
              import('./features/onboarding/address-step/address-step.component').then(
                (m) => m.AddressStepComponent,
              ),
          }
        ],
      },
    ],
  },
];