// src/app/components/stats/stats.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard';
import { LeagueStats, TeamStanding } from '../../models/models';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex align-items-center">
        <a routerLink="/dashboard" class="btn btn-outline-secondary me-3">
          <i class="fas fa-arrow-left"></i>
        </a>
        <h1 class="mb-0">
          <i class="fas fa-chart-bar me-2"></i>
          League Statistics
        </h1>
      </div>
    </div>

    @if (loading) {
      <div class="spinner-container">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    } @else if (error) {
      <div class="error-container">
        <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
        <h4>Error Loading Statistics</h4>
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="loadStats()">
          <i class="fas fa-redo me-1"></i>
          Retry
        </button>
      </div>
    } @else if (stats) {
      @if (stats.league_table.length > 0) {
        <!-- League Table -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-trophy me-2"></i>
              League Table
            </h5>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-dark">
                  <tr>
                    <th>Pos</th>
                    <th>Team</th>
                    <th>MP</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  @for (teamStats of stats.league_table; track teamStats.team.id; let i = $index) {
                    <tr [class]="i === 0 ? 'table-success' : ''">
                      <td>
                        <strong>{{ i + 1 }}</strong>
                        @if (i === 0) {
                          <i class="fas fa-trophy text-warning ms-1"></i>
                        }
                      </td>
                      <td>
                        <a [routerLink]="['/teams', teamStats.team.id]" class="text-decoration-none">
                          <strong>{{ teamStats.team.name }}</strong>
                        </a>
                        <br>
                        <small class="text-muted">{{ teamStats.team.city }}</small>
                      </td>
                      <td>{{ teamStats.matches_played }}</td>
                      <td class="text-success">{{ teamStats.wins }}</td>
                      <td class="text-warning">{{ teamStats.draws }}</td>
                      <td class="text-danger">{{ teamStats.losses }}</td>
                      <td>{{ teamStats.goals_for }}</td>
                      <td>{{ teamStats.goals_against }}</td>
                      <td [class]="teamStats.goal_difference >= 0 ? 'text-success' : 'text-danger'">
                        {{ formatGoalDifference(teamStats.goal_difference) }}
                      </td>
                      <td><strong>{{ teamStats.points }}</strong></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
          <div class="card-footer">
            <small class="text-muted">
              <strong>Legend:</strong>
              MP = Matches Played, W = Wins, D = Draws, L = Losses, 
              GF = Goals For, GA = Goals Against, GD = Goal Difference, Pts = Points (3 for win, 1 for draw)
            </small>
          </div>
        </div>

        <div class="row">
          <!-- Top Performers -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-star me-2"></i>
                  Top Performers
                </h5>
              </div>
              <div class="card-body">
                <h6 class="text-muted">Highest Scoring Teams</h6>
                @for (teamStats of stats.top_scorers; track teamStats.team.id; let i = $index) {
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      @if (i === 0) {
                        <i class="fas fa-trophy text-warning me-1"></i>
                      } @else if (i === 1) {
                        <i class="fas fa-award text-secondary me-1"></i>
                      } @else {
                        <i class="fas fa-award text-warning me-1"></i>
                      }
                      {{ teamStats.team.name }}
                    </div>
                    <span class="badge bg-success">{{ teamStats.goals_for }} goals</span>
                  </div>
                }

                <hr>

                <h6 class="text-muted">Best Defense</h6>
                @for (teamStats of stats.best_defense; track teamStats.team.id; let i = $index) {
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      @if (i === 0) {
                        <i class="fas fa-shield-alt text-primary me-1"></i>
                      } @else if (i === 1) {
                        <i class="fas fa-shield text-info me-1"></i>
                      } @else {
                        <i class="fas fa-shield text-secondary me-1"></i>
                      }
                      {{ teamStats.team.name }}
                    </div>
                    <span class="badge bg-primary">{{ teamStats.goals_against }} conceded</span>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- League Statistics -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-chart-line me-2"></i>
                  League Overview
                </h5>
              </div>
              <div class="card-body">
                <div class="row text-center mb-3">
                  <div class="col-6">
                    <h4>{{ stats.league_overview.total_matches }}</h4>
                    <small class="text-muted">Total Matches</small>
                  </div>
                  <div class="col-6">
                    <h4>{{ stats.league_overview.total_goals }}</h4>
                    <small class="text-muted">Total Goals</small>
                  </div>
                </div>
                
                <div class="row text-center mb-3">
                  <div class="col-6">
                    <h5>{{ stats.league_overview.average_goals_per_match }}</h5>
                    <small class="text-muted">Goals per Match</small>
                  </div>
                  <div class="col-6">
                    <h5>{{ stats.league_overview.total_teams }}</h5>
                    <small class="text-muted">Teams</small>
                  </div>
                </div>
                
                <hr>
                
                <h6 class="text-muted">Match Results</h6>
                <div class="mb-2">
                  <div class="d-flex justify-content-between">
                    <span>Wins:</span>
                    <span class="text-success">{{ stats.league_overview.total_wins }}</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Draws:</span>
                    <span class="text-warning">{{ stats.league_overview.total_draws }}</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Win Percentage:</span>
                    <span>{{ getWinPercentage() }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-5">
          <i class="fas fa-chart-bar fa-5x text-muted mb-3"></i>
          <h3 class="mt-3">No Statistics Available</h3>
          <p class="text-muted">Add teams and matches to see league statistics!</p>
          <div class="btn-group">
            <a routerLink="/teams" class="btn btn-primary">
              <i class="fas fa-plus me-1"></i>
              Add Teams
            </a>
            <a routerLink="/matches" class="btn btn-outline-primary">
              <i class="fas fa-calendar me-1"></i>
              Schedule Matches
            </a>
          </div>
        </div>
      }
    }
  `,
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  
  stats: LeagueStats | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.error = null;
    
    this.dashboardService.getLeagueStats().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats = response.data;
        } else {
          this.error = response.message || 'Failed to load statistics';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'An error occurred while loading statistics';
        this.loading = false;
      }
    });
  }

  formatGoalDifference(diff: number): string {
    if (diff > 0) {
      return `+${diff}`;
    }
    return diff.toString();
  }

  getWinPercentage(): string {
    if (!this.stats || this.stats.league_overview.total_matches === 0) {
      return '0';
    }
    
    const totalMatches = this.stats.league_overview.total_matches * 2; // Each match has 2 teams
    const winPercentage = (this.stats.league_overview.total_wins / totalMatches) * 100;
    return winPercentage.toFixed(1);
  }
}