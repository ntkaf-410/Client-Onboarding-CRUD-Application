import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatButtonModule],
  template: `
    <div class="state">
      <h1>Not found</h1>
      <p>{{ message() }}</p>
      <a mat-flat-button routerLink="/onboardings">Back to the list</a>
    </div>
  `,
  styles: `
    .state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 48px 0;
      text-align: center;
    }
  `,
})
export class NotFoundComponent {
  readonly message = input('The page you are looking for does not exist.');
}