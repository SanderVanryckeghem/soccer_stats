// src/app/components/team-detail/team-detail.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h1>Team Detail</h1>
      <p>Team detail component - Coming soon!</p>
      <a routerLink="/teams" class="btn btn-primary">Back to Teams</a>
    </div>
  `,
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent {}