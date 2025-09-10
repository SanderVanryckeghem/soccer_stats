// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <i class="fas fa-futbol me-2"></i>
          Soccer Stats
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                <i class="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/teams" routerLinkActive="active">
                <i class="fas fa-users me-1"></i>
                Teams
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/players" routerLinkActive="active">
                <i class="fas fa-user me-1"></i>
                Players
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/matches" routerLinkActive="active">
                <i class="fas fa-calendar me-1"></i>
                Matches
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/stats" routerLinkActive="active">
                <i class="fas fa-chart-bar me-1"></i>
                Stats
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container mt-4">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'soccer-stats-frontend';
}