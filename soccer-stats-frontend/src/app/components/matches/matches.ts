// src/app/components/matches/matches.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatchService } from '../../services/match';
import { Match, Team, MatchesResponse } from '../../models/models';
import { ApiResponse } from '../../services/api';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>
        <i class="fas fa-calendar-event me-2"></i>
        Matches
      </h1>
      <a routerLink="/matches/new" class="btn btn-primary">
        <i class="fas fa-plus me-1"></i>
        Schedule New Match
      </a>
    </div>

    <!-- Filter -->
    @if (teams.length > 0) {
      <div class="card mb-4">
        <div class="card-body py-2">
          <div class="d-flex align-items-center">
            <label class="form-label me-2 mb-0">Filter by team:</label>
            <select 
              [(ngModel)]="selectedTeamId" 
              (ngModelChange)="onTeamFilterChange()"
              class="form-select me-2" 
              style="width: auto;">
              <option value="">All Teams</option>
              @for (team of teams; track team.id) {
                <option [value]="team.id">{{ team.name }}</option>
              }
            </select>
            @if (selectedTeamId) {
              <button class="btn btn-sm btn-outline-secondary" (click)="clearFilter()">
                <i class="fas fa-times me-1"></i>
                Clear
              </button>
            }
          </div>
        </div>
      </div>
    }

    @if (loading) {
      <div class="spinner-container">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    } @else if (error) {
      <div class="error-container">
        <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
        <h4>Error Loading Matches</h4>
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="loadMatches()">
          <i class="fas fa-redo me-1"></i>
          Retry
        </button>
      </div>
    } @else if (matches.length > 0) {
      <div class="row">
        @for (match of matches; track match.id) {
          <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <!-- Match Teams -->
                <div class="text-center mb-3">
                  <div class="row align-items-center">
                    <div class="col-5">
                      <h6 class="mb-0">{{ match.home_team.name }}</h6>
                      <small class="text-muted">{{ match.home_team.city }}</small>
                    </div>
                    <div class="col-2">
                      <i class="fas fa-home text-muted"></i>
                    </div>
                    <div class="col-5">
                      <h6 class="mb-0">{{ match.away_team.name }}</h6>
                      <small class="text-muted">{{ match.away_team.city }}</small>
                    </div>
                  </div>
                </div>

                <!-- Score -->
                <div class="text-center mb-3">
                  <h2 class="mb-1">
                    <span [class]="match.home_score > match.away_score ? 'text-success' : ''">
                      {{ match.home_score }}
                    </span>
                    <span class="text-muted">-</span>
                    <span [class]="match.away_score > match.home_score ? 'text-success' : ''">
                      {{ match.away_score }}
                    </span>
                  </h2>
                  
                  @if (match.is_draw) {
                    <span class="badge bg-warning text-dark">Draw</span>
                  } @else if (match.winner_id) {
                    <span class="badge bg-success">
                      <i class="fas fa-trophy"></i> 
                      {{ getWinnerName(match) }}
                    </span>
                  }
                </div>

                <!-- Date -->
                <div class="text-center text-muted">
                  <i class="fas fa-calendar me-1"></i>
                  {{ formatDate(match.match_date) }}
                  <br>
                  <small>{{ formatTime(match.match_date) }}</small>
                </div>
              </div>
              
              <div class="card-footer bg-transparent">
                <div class="btn-group w-100" role="group">
                  <a [routerLink]="['/matches', match.id]" class="btn btn-outline-primary btn-sm">
                    <i class="fas fa-eye"></i> View
                  </a>
                  <a [routerLink]="['/matches', match.id, 'edit']" class="btn btn-outline-secondary btn-sm">
                    <i class="fas fa-edit"></i> Edit
                  </a>
                  <button class="btn btn-outline-danger btn-sm" (click)="deleteMatch(match)">
                    <i class="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      @if (selectedTeamId) {
        <div class="mt-4">
          <p class="text-muted">
            Showing matches for <strong>{{ getSelectedTeamName() }}</strong>
          </p>
        </div>
      }
    } @else {
      <div class="text-center py-5">
        <i class="fas fa-calendar-x fa-5x text-muted mb-3"></i>
        <h3 class="mt-3">No Matches Yet</h3>
        @if (selectedTeamId) {
          <p class="text-muted">No matches found for the selected team.</p>
          <button class="btn btn-outline-primary me-2" (click)="clearFilter()">
            View All Matches
          </button>
        } @else {
          <p class="text-muted">Schedule your first match to get started!</p>
        }
        <a routerLink="/matches/new" class="btn btn-primary btn-lg">
          <i class="fas fa-plus me-1"></i>
          Schedule First Match
        </a>
      </div>
    }

    @if (successMessage) {
      <div class="success-message">
        <i class="fas fa-check-circle me-2"></i>
        {{ successMessage }}
      </div>
    }
  `,
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  private matchService = inject(MatchService);
  private route = inject(ActivatedRoute);
  
  matches: Match[] = [];
  teams: Team[] = [];
  selectedTeamId: string = '';
  loading = true;
  error: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    // Check if there's a team filter in the route
    this.route.queryParams.subscribe(params => {
      if (params['team_id']) {
        this.selectedTeamId = params['team_id'];
      }
      this.loadMatches();
    });
  }

  loadMatches(): void {
    this.loading = true;
    this.error = null;
    
    const teamId = this.selectedTeamId ? +this.selectedTeamId : undefined;
    
    this.matchService.getAllMatches(teamId).subscribe({
      next: (response: ApiResponse<MatchesResponse>) => {
        if (response.success && response.data) {
          this.matches = response.data.matches;
          this.teams = response.data.teams;
        } else {
          this.error = response.message || 'Failed to load matches';
        }
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = error.message || 'An error occurred while loading matches';
        this.loading = false;
      }
    });
  }

  onTeamFilterChange(): void {
    this.loadMatches();
  }

  clearFilter(): void {
    this.selectedTeamId = '';
    this.loadMatches();
  }

  deleteMatch(match: Match): void {
    if (confirm('Are you sure you want to delete this match?')) {
      this.matchService.deleteMatch(match.id).subscribe({
        next: (response: ApiResponse<any>) => {
          if (response.success) {
            this.successMessage = 'Match deleted successfully.';
            this.loadMatches(); // Reload the list
            
            // Clear success message after 3 seconds
            setTimeout(() => {
              this.successMessage = null;
            }, 3000);
          } else {
            this.error = response.message || 'Failed to delete match';
          }
        },
        error: (error: Error) => {
          this.error = error.message || 'An error occurred while deleting the match';
        }
      });
    }
  }

  getWinnerName(match: Match): string {
    if (match.home_score > match.away_score) {
      return match.home_team.name;
    } else if (match.away_score > match.home_score) {
      return match.away_team.name;
    }
    return '';
  }

  getSelectedTeamName(): string {
    const team = this.teams.find(t => t.id === +this.selectedTeamId);
    return team ? team.name : '';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}