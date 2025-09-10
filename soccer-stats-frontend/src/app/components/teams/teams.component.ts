// src/app/components/teams/teams.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TeamService } from '../../services/team';
import { Team } from '../../models/models';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="row">
      <div class="col-md-12">
        <h1 class="mb-4">
          <i class="fas fa-users text-primary"></i>
          Teams
        </h1>
      </div>
    </div>

    <div *ngIf="loading" class="spinner-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
    <div *ngIf="error && !loading" class="error-container">
      <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
      <h4>Error Loading Teams</h4>
      <p>{{ error }}</p>
      <button class="btn btn-primary" (click)="loadTeams()">
        <i class="fas fa-redo me-1"></i>
        Retry
      </button>
    </div>
    
    <div *ngIf="teams && !loading && !error">
      <div class="row">
        <div *ngFor="let team of teams; trackBy: trackByTeamId" class="col-md-6 col-lg-4 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">
                <i class="fas fa-shield-alt me-2"></i>
                {{ team.name }}
              </h5>
              <p class="card-text">
                <i class="fas fa-map-marker-alt me-1"></i>
                {{ team.city }}
              </p>
              <p class="card-text">
                <i class="fas fa-calendar me-1"></i>
                Founded: {{ team.founded }}
              </p>
              <p class="card-text" *ngIf="team.players_count">
                <i class="fas fa-users me-1"></i>
                {{ team.players_count }} players
              </p>
              <div class="d-flex justify-content-between">
                <button class="btn btn-outline-primary btn-sm">
                  <i class="fas fa-eye me-1"></i>
                  View Details
                </button>
                <button class="btn btn-outline-secondary btn-sm">
                  <i class="fas fa-edit me-1"></i>
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: []
})
export class TeamsComponent implements OnInit {
  private teamService = inject(TeamService);
  
  teams: Team[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.loading = true;
    this.error = null;
    
    this.teamService.getTeams().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.teams = response.data;
        } else {
          this.error = response.message || 'Failed to load teams';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'An error occurred while loading teams';
        this.loading = false;
      }
    });
  }

  trackByTeamId(index: number, team: Team): number {
    return team.id;
  }
}