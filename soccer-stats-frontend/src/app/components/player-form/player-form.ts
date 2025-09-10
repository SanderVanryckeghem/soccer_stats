// src/app/components/player-form/player-form.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h1>Player Form</h1>
      <p>Player form component - Coming soon!</p>
      <a routerLink="/players" class="btn btn-primary">Back to Players</a>
    </div>
  `,
  styleUrls: ['./player-form.component.css']
})
export class PlayerFormComponent {}
