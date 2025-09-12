// src/app/components/ai-simulation/ai-simulation.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AiSimulationService, MatchSimulation, SimulationPreview, TeamStrength } from '../../services/ai-simulation';
import { TeamService } from '../../services/team';
import { Team } from '../../models/models';

@Component({
  selector: 'app-ai-simulation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center">
          <a routerLink="/matches" class="btn btn-outline-secondary me-3">
            <i class="fas fa-arrow-left"></i>
          </a>
          <h1 class="mb-0">
            <i class="fas fa-robot text-primary me-2"></i>
            AI Match Simulation
          </h1>
        </div>
      </div>

      @if (loading) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      } @else {
        <!-- Team Selection -->
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-users me-2"></i>
                  Single Match Simulation
                </h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Home Team</label>
                    <select class="form-select" [(ngModel)]="selectedHomeTeam" (change)="onTeamSelectionChange()">
                      <option value="">Select Home Team</option>
                      <option *ngFor="let team of teams" [value]="team.id">
                        {{ team.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Away Team</label>
                    <select class="form-select" [(ngModel)]="selectedAwayTeam" (change)="onTeamSelectionChange()">
                      <option value="">Select Away Team</option>
                      <option *ngFor="let team of teams" [value]="team.id" [disabled]="team.id == selectedHomeTeam">
                        {{ team.name }}
                      </option>
                    </select>
                  </div>
                </div>
                
                <div class="d-flex gap-2">
                  <button 
                    class="btn btn-outline-primary" 
                    (click)="previewMatch()" 
                    [disabled]="!selectedHomeTeam || !selectedAwayTeam || simulating">
                    <i class="fas fa-chart-bar me-1"></i>
                    Preview
                  </button>
                  <button 
                    class="btn btn-primary" 
                    (click)="simulateMatch(false)" 
                    [disabled]="!selectedHomeTeam || !selectedAwayTeam || simulating">
                    <i class="fas fa-play me-1"></i>
                    Simulate
                  </button>
                  <button 
                    class="btn btn-success" 
                    (click)="simulateMatch(true)" 
                    [disabled]="!selectedHomeTeam || !selectedAwayTeam || simulating">
                    <i class="fas fa-save me-1"></i>
                    Simulate & Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-calendar-alt me-2"></i>
                  Season Simulation
                </h5>
              </div>
              <div class="card-body">
                <p class="text-muted">Generate matches for all team combinations</p>
                <div class="d-flex gap-2">
                  <button 
                    class="btn btn-outline-warning" 
                    (click)="simulateSeason(false)" 
                    [disabled]="teams.length < 2 || simulating">
                    <i class="fas fa-eye me-1"></i>
                    Preview Season
                  </button>
                  <button 
                    class="btn btn-warning" 
                    (click)="simulateSeason(true)" 
                    [disabled]="teams.length < 2 || simulating">
                    <i class="fas fa-calendar-plus me-1"></i>
                    Generate Season
                  </button>
                </div>
                @if (teams.length >= 2) {
                  <small class="text-muted">
                    Will create {{ teams.length * (teams.length - 1) }} matches
                  </small>
                } @else {
                  <small class="text-danger">
                    Need at least 2 teams for season simulation
                  </small>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Team Strengths Comparison -->
        @if (teamStrengths && teamStrengths.team1 && teamStrengths.team2) {
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-balance-scale me-2"></i>
                Team Strength Analysis
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="text-center mb-3">
                    <h6>{{ teamStrengths.team1.team.name }}</h6>
                    <div class="progress mb-2" style="height: 25px;">
                      <div 
                        class="progress-bar bg-primary" 
                        [style.width.%]="teamStrengths.team1.strength"
                        [attr.aria-valuenow]="teamStrengths.team1.strength">
                        {{ teamStrengths.team1.strength }}
                      </div>
                    </div>
                    <span class="badge bg-secondary">{{ teamStrengths.team1.strength_rating }}</span>
                  </div>
                  <div class="small">
                    <div class="d-flex justify-content-between">
                      <span>Points:</span>
                      <strong>{{ teamStrengths.team1.stats.points }}</strong>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>Goal Difference:</span>
                      <strong [class]="teamStrengths.team1.stats.goal_difference >= 0 ? 'text-success' : 'text-danger'">
                        {{ teamStrengths.team1.stats.goal_difference > 0 ? '+' : '' }}{{ teamStrengths.team1.stats.goal_difference }}
                      </strong>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>Win Rate:</span>
                      <strong>{{ getWinRate(teamStrengths.team1.stats) }}%</strong>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="text-center mb-3">
                    <h6>{{ teamStrengths.team2.team.name }}</h6>
                    <div class="progress mb-2" style="height: 25px;">
                      <div 
                        class="progress-bar bg-danger" 
                        [style.width.%]="teamStrengths.team2.strength"
                        [attr.aria-valuenow]="teamStrengths.team2.strength">
                        {{ teamStrengths.team2.strength }}
                      </div>
                    </div>
                    <span class="badge bg-secondary">{{ teamStrengths.team2.strength_rating }}</span>
                  </div>
                  <div class="small">
                    <div class="d-flex justify-content-between">
                      <span>Points:</span>
                      <strong>{{ teamStrengths.team2.stats.points }}</strong>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>Goal Difference:</span>
                      <strong [class]="teamStrengths.team2.stats.goal_difference >= 0 ? 'text-success' : 'text-danger'">
                        {{ teamStrengths.team2.stats.goal_difference > 0 ? '+' : '' }}{{ teamStrengths.team2.stats.goal_difference }}
                      </strong>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>Win Rate:</span>
                      <strong>{{ getWinRate(teamStrengths.team2.stats) }}%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Simulation Preview -->
        @if (simulationPreview) {
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-chart-pie me-2"></i>
                Match Prediction Analysis
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">
                  <div class="text-center">
                    <div class="progress mb-2" style="height: 30px;">
                      <div class="progress-bar bg-success" [style.width.%]="simulationPreview.simulation_stats.sample_probabilities.home_win * 100">
                        {{ aiService.formatProbability(simulationPreview.simulation_stats.sample_probabilities.home_win) }}
                      </div>
                    </div>
                    <small>{{ simulationPreview.teams.home.name }} Win</small>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center">
                    <div class="progress mb-2" style="height: 30px;">
                      <div class="progress-bar bg-warning" [style.width.%]="simulationPreview.simulation_stats.sample_probabilities.draw * 100">
                        {{ aiService.formatProbability(simulationPreview.simulation_stats.sample_probabilities.draw) }}
                      </div>
                    </div>
                    <small>Draw</small>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center">
                    <div class="progress mb-2" style="height: 30px;">
                      <div class="progress-bar bg-danger" [style.width.%]="simulationPreview.simulation_stats.sample_probabilities.away_win * 100">
                        {{ aiService.formatProbability(simulationPreview.simulation_stats.sample_probabilities.away_win) }}
                      </div>
                    </div>
                    <small>{{ simulationPreview.teams.away.name }} Win</small>
                  </div>
                </div>
              </div>
              
              <div class="row mt-3">
                <div class="col-md-6">
                  <h6>Simulation Results (10 runs):</h6>
                  <div class="d-flex justify-content-between">
                    <span>{{ simulationPreview.teams.home.name }} Wins:</span>
                    <strong class="text-success">{{ simulationPreview.simulation_stats.home_wins }}/10</strong>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Draws:</span>
                    <strong class="text-warning">{{ simulationPreview.simulation_stats.draws }}/10</strong>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>{{ simulationPreview.teams.away.name }} Wins:</span>
                    <strong class="text-danger">{{ simulationPreview.simulation_stats.away_wins }}/10</strong>
                  </div>
                </div>
                <div class="col-md-6">
                  <h6>Average Scores:</h6>
                  <div class="d-flex justify-content-between">
                    <span>{{ simulationPreview.teams.home.name }}:</span>
                    <strong>{{ simulationPreview.simulation_stats.average_home_score.toFixed(1) }}</strong>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>{{ simulationPreview.teams.away.name }}:</span>
                    <strong>{{ simulationPreview.simulation_stats.average_away_score.toFixed(1) }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Simulation Results -->
        @if (lastSimulation) {
          <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="fas fa-flag-checkered me-2"></i>
                Match Result
              </h5>
              @if (lastSimulation.saved) {
                <span class="badge bg-success">
                  <i class="fas fa-check me-1"></i>
                  Saved to Database
                </span>
              }
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-8">
                  <div class="match-result text-center py-3">
                    <div class="row align-items-center">
                      <div class="col-4 text-end">
                        <h4>{{ getTeamName(selectedHomeTeam) }}</h4>
                        <span class="badge bg-primary">Home</span>
                      </div>
                      <div class="col-4">
                        <div class="score-display">
                          <span class="display-4 fw-bold">
                            {{ lastSimulation.simulation.home_score }} - {{ lastSimulation.simulation.away_score }}
                          </span>
                          <div class="mt-2">
                            <span class="badge {{ aiService.getOutcomeColorClass(lastSimulation.simulation.outcome) }} fs-6">
                              {{ aiService.formatMatchOutcome(lastSimulation.simulation.outcome) }}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="col-4 text-start">
                        <h4>{{ getTeamName(selectedAwayTeam) }}</h4>
                        <span class="badge bg-secondary">Away</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <h6>Win Probabilities:</h6>
                  <div class="small">
                    <div class="d-flex justify-content-between">
                      <span>Home Win:</span>
                      <strong>{{ aiService.formatProbability(lastSimulation.simulation.probabilities.home_win) }}</strong>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>Draw:</span>
                      <strong>{{ aiService.formatProbability(lastSimulation.simulation.probabilities.draw) }}</strong>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>Away Win:</span>
                      <strong>{{ aiService.formatProbability(lastSimulation.simulation.probabilities.away_win) }}</strong>
                    </div>
                  </div>
                </div>
              </div>

              @if (lastSimulation.simulation.match_events && lastSimulation.simulation.match_events.length > 0) {
                <div class="mt-3">
                  <h6>Match Events:</h6>
                  <div class="timeline">
                    @for (event of lastSimulation.simulation.match_events; track event.minute) {
                      <div class="timeline-item">
                        <span class="badge bg-success me-2">{{ event.minute }}'</span>
                        <i class="fas fa-futbol me-1"></i>
                        <strong>{{ event.player }}</strong> ({{ event.team }})
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- Season Simulation Results -->
        @if (seasonSimulation) {
          <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="fas fa-calendar-check me-2"></i>
                Season Simulation Results
              </h5>
              @if (seasonSimulation.saved) {
                <span class="badge bg-success">
                  <i class="fas fa-check me-1"></i>
                  {{ seasonSimulation.total_matches }} matches created
                </span>
              } @else {
                <span class="badge bg-info">
                  <i class="fas fa-eye me-1"></i>
                  Preview Only
                </span>
              }
            </div>
            <div class="card-body">
              <p class="mb-3">
                <strong>Total Matches:</strong> {{ seasonSimulation.total_matches }}
                @if (!seasonSimulation.saved) {
                  <button class="btn btn-sm btn-success ms-3" (click)="simulateSeason(true)">
                    <i class="fas fa-save me-1"></i>
                    Save All Matches
                  </button>
                }
              </p>

              <!-- Sample matches preview -->
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Home Team</th>
                      <th>Score</th>
                      <th>Away Team</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (match of seasonSimulation.simulated_matches.slice(0, 10); track match.home_team_id) {
                      <tr>
                        <td>{{ getTeamNameById(match.home_team_id) }}</td>
                        <td class="text-center">
                          <strong>{{ match.home_score }} - {{ match.away_score }}</strong>
                        </td>
                        <td>{{ getTeamNameById(match.away_team_id) }}</td>
                        <td>{{ formatDate(match.match_date) }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
                @if (seasonSimulation.simulated_matches.length > 10) {
                  <p class="text-muted text-center">
                    ... and {{ seasonSimulation.simulated_matches.length - 10 }} more matches
                  </p>
                }
              </div>
            </div>
          </div>
        }

        <!-- Error Display -->
        @if (error) {
          <div class="alert alert-danger">
            <i class="fas fa-exclamation-triangle me-2"></i>
            {{ error }}
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .score-display {
      background: #f8f9fa;
      border: 2px solid #dee2e6;
      border-radius: 10px;
      padding: 20px;
    }
    
    .timeline-item {
      padding: 5px 0;
      border-left: 2px solid #28a745;
      padding-left: 15px;
      margin-bottom: 10px;
    }
    
    .progress {
      border-radius: 15px;
    }
    
    .match-result {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 15px;
      border: 1px solid #dee2e6;
    }
  `]
})
export class AiSimulationComponent implements OnInit {
  aiService = inject(AiSimulationService);
  teamService = inject(TeamService);

  teams: Team[] = [];
  selectedHomeTeam: number | null = null;
  selectedAwayTeam: number | null = null;
  
  loading = false;
  simulating = false;
  error: string | null = null;
  
  simulationPreview: SimulationPreview | null = null;
  lastSimulation: any = null;
  seasonSimulation: any = null;
  teamStrengths: { team1: TeamStrength; team2: TeamStrength } | null = null;

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.loading = true;
    this.teamService.getAllTeams().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.teams = response.data;
        } else {
          this.error = 'Failed to load teams';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'An error occurred while loading teams';
        this.loading = false;
      }
    });
  }

  onTeamSelectionChange(): void {
    this.simulationPreview = null;
    this.teamStrengths = null;
    this.lastSimulation = null;
    
    if (this.selectedHomeTeam && this.selectedAwayTeam) {
      this.loadTeamStrengths();
    }
  }

  loadTeamStrengths(): void {
    if (!this.selectedHomeTeam || !this.selectedAwayTeam) return;
    
    this.aiService.compareTeams(this.selectedHomeTeam, this.selectedAwayTeam).subscribe({
      next: (strengths) => {
        this.teamStrengths = strengths;
      },
      error: (error) => {
        console.error('Error loading team strengths:', error);
      }
    });
  }

  previewMatch(): void {
    if (!this.selectedHomeTeam || !this.selectedAwayTeam) return;
    
    this.simulating = true;
    this.error = null;
    
    this.aiService.previewSimulation(this.selectedHomeTeam, this.selectedAwayTeam).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.simulationPreview = response.data;
        } else {
          this.error = response.message || 'Failed to preview simulation';
        }
        this.simulating = false;
      },
      error: (error) => {
        this.error = error.message || 'An error occurred during simulation preview';
        this.simulating = false;
      }
    });
  }

  simulateMatch(saveMatch: boolean): void {
    if (!this.selectedHomeTeam || !this.selectedAwayTeam) return;
    
    this.simulating = true;
    this.error = null;
    this.lastSimulation = null;
    
    this.aiService.simulateMatch(this.selectedHomeTeam, this.selectedAwayTeam, saveMatch).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.lastSimulation = response.data;
        } else {
          this.error = response.message || 'Failed to simulate match';
        }
        this.simulating = false;
      },
      error: (error) => {
        this.error = error.message || 'An error occurred during match simulation';
        this.simulating = false;
      }
    });
  }

  simulateSeason(saveMatches: boolean): void {
    this.simulating = true;
    this.error = null;
    this.seasonSimulation = null;
    
    this.aiService.simulateSeason(saveMatches).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.seasonSimulation = response.data;
        } else {
          this.error = response.message || 'Failed to simulate season';
        }
        this.simulating = false;
      },
      error: (error) => {
        this.error = error.message || 'An error occurred during season simulation';
        this.simulating = false;
      }
    });
  }

  getTeamName(teamId: number | null): string {
    if (!teamId) return '';
    const team = this.teams.find(t => t.id === teamId);
    return team ? team.name : '';
  }

  getTeamNameById(teamId: number): string {
    const team = this.teams.find(t => t.id === teamId);
    return team ? team.name : `Team ${teamId}`;
  }

  getWinRate(stats: any): string {
    if (stats.matches_played === 0) return '0';
    return ((stats.wins / stats.matches_played) * 100).toFixed(1);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}