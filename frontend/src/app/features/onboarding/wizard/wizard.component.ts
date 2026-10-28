import { Component, computed,  inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink, RouterOutlet } from '@angular/router';

import { WizardStepperComponent } from './wizard-stepper.component';
import { WizardStore } from './wizard-store.service';

@Component({
  selector: 'app-wizard',
  imports: [RouterOutlet, RouterLink, MatButtonModule, MatProgressSpinnerModule, WizardStepperComponent],
  providers: [WizardStore],
  templateUrl: './wizard.component.html',
  styleUrl: './wizard.component.scss',
})
export class WizardComponent {
  protected readonly store = inject(WizardStore);
  protected readonly stepperId = computed(() => {
    const onboarding = this.store.onboarding();
    return onboarding && onboarding.status === 'DRAFT' ? onboarding.id : null;
  })
}