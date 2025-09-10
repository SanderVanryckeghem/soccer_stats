import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="row">
      <div class="col-md-12">
        <h1 class="mb-4">
          <i class="fas fa-calendar text-info"></i>
          Matches
        </h1>
        <p>Matches page coming soon...</p>
      </div>
    </div>
  `
})
export class MatchesComponent {
}