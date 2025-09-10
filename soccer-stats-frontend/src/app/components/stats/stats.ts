import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="row">
      <div class="col-md-12">
        <h1 class="mb-4">
          <i class="fas fa-chart-bar text-warning"></i>
          Statistics
        </h1>
        <p>Statistics page coming soon...</p>
      </div>
    </div>
  `
})
export class StatsComponent {
}