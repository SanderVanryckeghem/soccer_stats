// src/app/components/team-detail/team-detail.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TeamService } from '../../services/team';
import { Team } from '../../models/models';
import { ApiResponse } from '../../services/api';

@Component({
  selector: 'app-team-detail',
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
        <h4>Error Loading Team</h4>
        <p>{{ error }}</p>
        <a routerLink="/teams" class="btn btn-primary">
          <i class="fas fa-arrow-left me-1"></i>
          Back to Teams
        </a>
      </div>
    } @else if (team) {
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center">
          <a routerLink="/teams" class="btn btn-outline-secondary me-3">
            <i class="fas fa-arrow-left"></i>
          </a>
          <div>
            <h1 class="mb-0">{{ team.name }}</h1>
            <p class="text-muted mb-0">
              <i class="fas fa-map-marker-alt me-1"></i> {{ team.city }} | 
              <i class="fas fa-calendar me-1"></i> Founded {{ team.founded }}
            </p>
          </div>
        </div>
        <div class="btn-group">
          <a [routerLink]="['/teams', team.id, 'edit']" class="btn btn-outline-primary">
            <i class="fas fa-edit"></i> Edit
          </a>
          <a [routerLink]="['/teams', team.id, 'players', 'new']" class="btn btn-success">
            <i class="fas fa-plus"></i> Add Player
          </a>
        </div>
      </div>

      <div class="row">
        <!-- Team Stats -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Team Statistics</h5>
            </div>
            <div class="card-body">
              @if (team.stats) {
                <div class="row text-center">
                  <div class="col-4">
                    <h4 class="text-success">{{ team.stats.wins }}</h4>
                    <small>Wins</small>
                  </div>
                  <div class="col-4">
                    <h4 class="text-warning">{{ team.stats.draws }}</h4>
                    <small>Draws</small>
                  </div>
                  <div class="col-4">
                    <h4 class="text-danger">{{ team.stats.losses }}</h4>
                    <small>Losses</small>
                  </div>
                </div>
                <hr>
                <div class="row text-center">
                  <div class="col-6">
                    <h5>{{ team.stats.points }}</h5>
                    <small>Points</small>
                  </div>
                  <div class="col-6">
                    <h5>{{ team.stats.matches_played }}</h5>
                    <small>Played</small>
                  </div>
                </div>
                <hr>
                <div class="row text-center">
                  <div class="col-6">
                    <h6 class="text-success">{{ team.stats.goals_for }}</h6>
                    <small>Goals For</small>
                  </div>
                  <div class="col-6">
                    <h6 class="text-danger">{{ team.stats.goals_against }}</h6>
                    <small>Goals Against</small>
                  </div>
                </div>
              } @else {
                <p class="text-muted text-center">No match statistics available yet.</p>
              }
            </div>
          </div>
        </div>

        <!-- Players -->
        <div class="col-md-8">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Squad ({{ team.players?.length || 0 }})</h5>
              <a [routerLink]="['/teams', team.id, 'players', 'new']" class="btn btn-sm btn-success">
                <i class="fas fa-plus me-1"></i>
                Add Player
              </a>
            </div>
            <div class="card-body">
              @if (team.players && team.players.length > 0) {
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Age</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (player of team.players; track player.id) {
                        <tr>
                          <td>
                            <a [routerLink]="['/players', player.id]" class="text-decoration-none">
                              {{ player.name }}
                            </a>
                          </td>
                          <td>
                            <span class="badge bg-secondary">{{ player.position }}</span>
                          </td>
                          <td>{{ player.age }}</td>
                          <td>
                            <div class="btn-group btn-group-sm">
                              <a [routerLink]="['/players', player.id]" class="btn btn-outline-primary btn-sm">
                                <i class="fas fa-eye"></i>
                              </a>
                              <a [routerLink]="['/players', player.id, 'edit']" class="btn btn-outline-secondary btn-sm">
                                <i class="fas fa-edit"></i>
                              </a>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              } @else {
                <div class="text-center py-4">
                  <i class="fas fa-user-plus fa-4x text-muted mb-3"></i>
                  <h5 class="mt-3">No Players Yet</h5>
                  <p class="text-muted">Add players to build your squad!</p>
                  <a [routerLink]="['/teams', team.id, 'players', 'new']" class="btn btn-success">
                    <i class="fas fa-plus me-1"></i>
                    Add First Player
                  </a>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Matches -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Recent Matches</h5>
              <a [routerLink]="['/matches']" [queryParams]="{team_id: team.id}" class="btn btn-sm btn-outline-primary">
                View All Matches
              </a>
            </div>
            <div class="card-body">
              @if (team.recent_matches && team.recent_matches.length > 0) {
                @for (match of team.recent_matches; track match.id) {
                  <div class="d-flex justify-content-between align-items-center border-bottom py-3">
                    <div class="flex-grow-1">
                      <div class="row align-items-center">
                        <div class="col-md-4 text-end">
                          <strong [class]="match.home_team.id === team.id ? 'text-primary' : ''">
                            {{ match.home_team.name }}
                          </strong>
                        </div>
                        <div class="col-md-4 text-center">
                          <span class="badge fs-6" 
                                [class]="getMatchResultBadgeClass(match)">
                            {{ match.home_score }} - {{ match.away_score }}
                          </span>
                          <br>
                          <small class="text-muted">
                            {{ formatDate(match.match_date) }}
                          </small>
                        </div>
                        <div class="col-md-4">
                          <strong [class]="match.away_team.id === team.id ? 'text-primary' : ''">
                            {{ match.away_team.name }}
                          </strong>
                        </div>
                      </div>
                    </div>
                    <div class="ms-3">
                      <a [routerLink]="['/matches', match.id]" class="btn btn-sm btn-outline-secondary">
                        <i class="fas fa-eye"></i>
                      </a>
                    </div>
                  </div>
                }
              } @else {
                <div class="text-center py-4">
                  <i class="fas fa-calendar-x fa-4x text-muted mb-3"></i>
                  <h5 class="mt-3">No Matches Yet</h5>
                  <p class="text-muted">This team hasn't played any matches.</p>
                  <a routerLink="/matches/new" class="btn btn-primary">
                    <i class="fas fa-plus me-1"></i>
                    Schedule Match
                  </a>
                </div>
              }
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
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private teamService = inject(TeamService);
  
  team: Team | null = null;
  loading = true;
  error: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTeam(+id);
    }
  }

  loadTeam(id: number): void {
    this.loading = true;
    this.error = null;
    
    this.teamService.getTeam(id).subscribe({
      next: (response: ApiResponse<Team>) => {
        if (response.success && response.data) {
          this.team = response.data;
        } else {
          this.error = response.message || 'Failed to load team';
        }
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = error.message || 'An error occurred while loading the team';
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

  getMatchResultBadgeClass(match: any): string {
    if (!this.team) return 'bg-secondary';
    
    const isHome = match.home_team.id === this.team.id;
    const teamScore = isHome ? match.home_score : match.away_score;
    const opponentScore = isHome ? match.away_score : match.home_score;
    
    if (teamScore > opponentScore) {
      return 'bg-success'; // Win
    } else if (teamScore === opponentScore) {
      return 'bg-warning text-dark'; // Draw
    } else {
      return 'bg-danger'; // Loss
    }
  }
}