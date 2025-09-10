import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="row">
      <div class="col-md-12">
        <h1 class="mb-4">
          <i class="fas fa-user text-success"></i>
          Players
        </h1>
        <p>Players page coming soon...</p>
      </div>
    </div>
  `
})
export class PlayersComponent {
}