// src/app/components/match-detail/match-detail.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatchService } from '../../services/match';
import { Match } from '../../models/models';

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (loading) {
      <div class="spinner-container">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    } @else if (error) {
      <div class="error-container">
        <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
        <h4>Error Loading Match</h4>
        <p>{{ error }}</p>
        <a routerLink="/matches" class="btn btn-primary">
          <i class="fas fa-arrow-left me-1"></i>
          Back to Matches
        </a>
      </div>
    } @else if (match) {
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center">
          <a routerLink="/matches" class="btn btn-outline-secondary me-3">
            <i class="fas fa-arrow-left"></i>
          </a>
          <h1 class="mb-0">Match Details</h1>
        </div>
        <div class="btn-group">
          <a [routerLink]="['/matches', match.id, 'edit']" class="btn btn-outline-primary">
            <i class="fas fa-edit"></i> Edit
          </a>
          <button class="btn btn-outline-danger" (click)="deleteMatch()">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-md-10">
          <!-- Match Result Card -->
          <div class="card mb-4">
            <div class="card-body py-4">
              <div class="row align-items-center text-center">
                <!-- Home Team -->
                <div class="col-md-4">
                  <div class="mb-3">
                    <a [routerLink]="['/teams', match.home_team.id]" class="text-decoration-none">
                      <h3 class="mb-1">{{ match.home_team.name }}</h3>
                    </a>
                    <p class="text-muted mb-0">
                      <i class="fas fa-home"></i> Home
                    </p>
                    <small class="text-muted">{{ match.home_team.city }}</small>
                  </div>
                </div>
                
                <!-- Score -->
                <div class="col-md-4">
                  <div class="mb-3">
                    <h1 class="display-3 mb-0">
                      <span [class]="match.home_score > match.away_score ? 'text-success' : ''">
                        {{ match.home_score }}
                      </span>
                      <span class="text-muted">-</span>
                      <span [class]="match.away_score > match.home_score ? 'text-success' : ''">
                        {{ match.away_score }}
                      </span>
                    </h1>
                    @if (match.is_draw) {
                      <span class="badge bg-warning text-dark fs-6">Draw</span>
                    } @else if (match.winner) {
                      <span class="badge bg-success fs-6">
                        <i class="fas fa-trophy"></i> {{ match.winner.name }} Wins
                      </span>
                    }
                  </div>
                  <p class="text-muted mb-0">
                    <i class="fas fa-calendar"></i>
                    {{ formatDate(match.match_date) }}
                  </p>
                  <small class="text-muted">
                    {{ formatTime(match.match_date) }}
                  </small>
                </div>
                
                <!-- Away Team -->
                <div class="col-md-4">
                  <div class="mb-3">
                    <a [routerLink]="['/teams', match.away_team.id]" class="text-decoration-none">
                      <h3 class="mb-1">{{ match.away_team.name }}</h3>
                    </a>
                    <p class="text-muted mb-0">
                      <i class="fas fa-plane"></i> Away
                    </p>
                    <small class="text-muted">{{ match.away_team.city }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Match Statistics -->
          <div class="row">
            <div class="col-md-6">
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="fas fa-chart-bar"></i>
                    Match Statistics
                  </h5>
                </div>
                <div class="card-body">
                  <div class="row text-center">
                    <div class="col-6">
                      <h4>{{ match.total_goals || (match.home_score + match.away_score) }}</h4>
                      <small class="text-muted">Total Goals</small>
                    </div>
                    <div class="col-6">
                      <h4>{{ ((match.total_goals || (match.home_score + match.away_score)) / 2).toFixed(1) }}</h4>
                      <small class="text-muted">Goals per Team</small>
                    </div>
                  </div>
                  <hr>
                  <div class="mb-2">
                    <div class="d-flex justify-content-between">
                      <small>Goals Scored</small>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>{{ match.home_team.name }}:</span>
                      <strong>{{ match.home_score }}</strong>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>{{ match.away_team.name }}:</span>
                      <strong>{{ match.away_score }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-6">
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="fas fa-info-circle"></i>
                    Match Information
                  </h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <strong>Date:</strong><br>
                    <span class="text-muted">
                      {{ formatDateTime(match.match_date) }}
                    </span>
                  </div>
                  
                  <div class="mb-3">
                    <strong>Venue:</strong><br>
                    <span class="text-muted">
                      {{ match.home_team.city }} (Home venue)
                    </span>
                  </div>
                  
                  <div class="mb-3">
                    <strong>Result:</strong><br>
                    @if (match.is_draw) {
                      <span class="badge bg-warning text-dark">Draw</span>
                    } @else {
                      <span class="badge bg-success">
                        {{ match.winner?.name }} Victory
                      </span>
                    }
                  </div>

                  <div class="mb-0">
                    <strong>Match Day:</strong><br>
                    <span class="text-muted">
                      {{ getTimeAgo(match.match_date) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Records -->
          <div class="row mt-4">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="fas fa-users"></i>
                    Teams
                  </h5>
                </div>
                <div class="card-body">
                  <div class="row text-center">
                    <div class="col-md-4">
                      <h4 class="text-primary">{{ match.home_team.name }}</h4>
                      <p class="mb-0">
                        <a [routerLink]="['/teams', match.home_team.id]" class="btn btn-sm btn-outline-primary">
                          View Team
                        </a>
                      </p>
                    </div>
                    <div class="col-md-4">
                      <h5 class="text-muted">vs</h5>
                      <small class="text-muted">Match Result</small>
                    </div>
                    <div class="col-md-4">
                      <h4 class="text-info">{{ match.away_team.name }}</h4>
                      <p class="mb-0">
                        <a [routerLink]="['/teams', match.away_team.id]" class="btn btn-sm btn-outline-info">
                          View Team
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      @if (successMessage) {
        <div class="success-message">
          <i class="fas fa-check-circle me-2"></i>
          {{ successMessage }}
        </div>
      }
    }
  `,
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private matchService = inject(MatchService);
  
  match: Match | null = null;
  loading = true;
  error: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMatch(+id);
    }
  }

  loadMatch(id: number): void {
    this.loading = true;
    this.error = null;
    
    this.matchService.getMatch(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.match = response.data;
        } else {
          this.error = response.message || 'Failed to load match';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'An error occurred while loading the match';
        this.loading = false;
      }
    });
  }

  deleteMatch(): void {
    if (this.match && confirm('Are you sure you want to delete this match?')) {
      this.matchService.deleteMatch(this.match.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Match deleted successfully.';
            // Redirect to matches list after a short delay
            setTimeout(() => {
              window.location.href = '/matches';
            }, 1500);
          } else {
            this.error = response.message || 'Failed to delete match';
          }
        },
        error: (error) => {
          this.error = error.message || 'An error occurred while deleting the match';
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return '1 day ago';
    } else {
      return `${diffInDays} days ago`;
    }
  }
}