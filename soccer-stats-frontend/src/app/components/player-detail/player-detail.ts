// src/app/components/player-detail/player-detail.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h1>Player Detail</h1>
      <p>Player detail component - Coming soon!</p>
      <a routerLink="/players" class="btn btn-primary">Back to Players</a>
    </div>
  `,
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent {}