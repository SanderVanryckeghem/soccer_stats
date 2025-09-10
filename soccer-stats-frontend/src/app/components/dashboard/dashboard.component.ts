// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard';
import { DashboardData } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="row">
      <div class="col-md-12">
        <h1 class="mb-4">
          <i class="fas fa-trophy text-warning"></i>
          Soccer Stats Dashboard
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
      <h4>Error Loading Dashboard</h4>
      <p>{{ error }}</p>
      <button class="btn btn-primary" (click)="loadDashboard()">
        <i class="fas fa-redo me-1"></i>
        Retry
      </button>
    </div>
    
    <div *ngIf="dashboardData && !loading && !error">
      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4>{{ dashboardData.stats.total_teams }}</h4>
                  <p class="mb-0">Teams</p>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4>{{ dashboardData.stats.total_players }}</h4>
                  <p class="mb-0">Players</p>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-user fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4>{{ dashboardData.stats.total_matches }}</h4>
                  <p class="mb-0">Matches</p>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-calendar fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4>{{ dashboardData.stats.recent_matches_count }}</h4>
                  <p class="mb-0">Recent</p>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-clock fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Recent Matches -->
        <div class="col-md-8">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="fas fa-calendar-alt me-2"></i>
                Recent Matches
              </h5>
              <a routerLink="/matches" class="btn btn-sm btn-outline-primary">
                View All
              </a>
            </div>
            <div class="card-body">
              <div *ngIf="dashboardData.recent_matches.length > 0; else noMatches">
                <div *ngFor="let match of dashboardData.recent_matches; trackBy: trackByMatchId" class="d-flex justify-content-between align-items-center border-bottom py-2">
                  <div class="flex-grow-1">
                    <div class="row align-items-center">
                      <div class="col-4 text-end">
                        <strong>{{ match.home_team.name }}</strong>
                      </div>
                      <div class="col-4 text-center">
                        <span class="badge bg-primary fs-6">
                          {{ match.home_score }} - {{ match.away_score }}
                        </span>
                      </div>
                      <div class="col-4">
                        <strong>{{ match.away_team.name }}</strong>
                      </div>
                    </div>
                    <div class="text-center text-muted small">
                      {{ formatDate(match.match_date) }}
                    </div>
                  </div>
                  <div class="ms-3">
                    <a [routerLink]="['/matches', match.id]" class="btn btn-sm btn-outline-secondary">
                      <i class="fas fa-eye"></i>
                    </a>
                  </div>
                </div>
              </div>
              <ng-template #noMatches>
                <p class="text-muted text-center py-4">No matches recorded yet.</p>
              </ng-template>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions & Top Players -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-plus-circle me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <a routerLink="/teams/new" class="btn btn-outline-primary">
                  <i class="fas fa-plus me-1"></i> Add Team
                </a>
                <a routerLink="/matches/new" class="btn btn-outline-success">
                  <i class="fas fa-plus me-1"></i> Add Match
                </a>
                <a routerLink="/teams" class="btn btn-outline-info">
                  <i class="fas fa-eye me-1"></i> View Teams
                </a>
                <a routerLink="/stats" class="btn btn-outline-warning">
                  <i class="fas fa-chart-bar me-1"></i> View Stats
                </a>
              </div>
            </div>
          </div>
          
          <!-- Top Players -->
          <div class="card mt-3">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-star me-2"></i>
                Players
              </h5>
            </div>
            <div class="card-body">
              <div *ngIf="dashboardData.top_players.length > 0; else noPlayers">
                <div *ngFor="let player of dashboardData.top_players; trackBy: trackByPlayerId" class="d-flex justify-content-between align-items-center border-bottom py-1">
                  <div>
                    <strong>{{ player.name }}</strong><br>
                    <small class="text-muted">{{ player.team?.name }}</small>
                  </div>
                  <span class="badge bg-secondary">{{ player.position }}</span>
                </div>
              </div>
              <ng-template #noPlayers>
                <p class="text-muted">No players recorded yet.</p>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  
  dashboardData: DashboardData | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = null;
    
    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.dashboardData = response.data;
        } else {
          this.error = response.message || 'Failed to load dashboard data';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'An error occurred while loading dashboard';
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  trackByMatchId(index: number, match: any): number {
    return match.id;
  }

  trackByPlayerId(index: number, player: any): number {
    return player.id;
  }
}