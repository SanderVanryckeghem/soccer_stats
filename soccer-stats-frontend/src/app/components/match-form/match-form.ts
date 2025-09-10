// src/app/components/match-form/match-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatchService } from '../../services/match';
import { TeamService } from '../../services/team';
import { Match, Team } from '../../models/models';

@Component({
  selector: 'app-match-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="d-flex align-items-center mb-4">
          <a [routerLink]="isEditMode ? ['/matches', matchId] : ['/matches']" class="btn btn-outline-secondary me-3">
            <i class="fas fa-arrow-left"></i>
          </a>
          <h1 class="mb-0">
            <i class="fas fa-plus-circle me-2"></i>
            {{ isEditMode ? 'Edit Match' : 'Schedule New Match' }}
          </h1>
        </div>

        @if (error) {
          <div class="error-message">
            <i class="fas fa-exclamation-triangle me-2"></i>
            {{ error }}
          </div>
        }

        <div class="card">
          @if (isEditMode && match) {
            <div class="card-header">
              <h5 class="mb-0">
                {{ match.home_team.name }} vs {{ match.away_team.name }}
              </h5>
              <small class="text-muted">
                {{ formatDate(match.match_date) }}
              </small>
            </div>
          }
          <div class="card-body">
            <form [formGroup]="matchForm" (ngSubmit)="onSubmit()">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="home_team_id" class="form-label">Home Team *</label>
                    <select 
                      id="home_team_id"
                      class="form-select"
                      [class.is-invalid]="matchForm.get('home_team_id')?.invalid && matchForm.get('home_team_id')?.touched"
                      formControlName="home_team_id">
                      <option value="">Select Home Team</option>
                      @for (team of teams; track team.id) {
                        <option [value]="team.id">{{ team.name }}</option>
                      }
                    </select>
                    @if (matchForm.get('home_team_id')?.invalid && matchForm.get('home_team_id')?.touched) {
                      <div class="invalid-feedback">
                        Home team is required.
                      </div>
                    }
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="away_team_id" class="form-label">Away Team *</label>
                    <select 
                      id="away_team_id"
                      class="form-select"
                      [class.is-invalid]="matchForm.get('away_team_id')?.invalid && matchForm.get('away_team_id')?.touched"
                      formControlName="away_team_id">
                      <option value="">Select Away Team</option>
                      @for (team of teams; track team.id) {
                        <option [value]="team.id">{{ team.name }}</option>
                      }
                    </select>
                    @if (matchForm.get('away_team_id')?.invalid && matchForm.get('away_team_id')?.touched) {
                      <div class="invalid-feedback">
                        Away team is required.
                      </div>
                    }
                    @if (matchForm.hasError('sameTeam')) {
                      <div class="invalid-feedback d-block">
                        Away team must be different from home team.
                      </div>
                    }
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="match_date" class="form-label">Match Date & Time *</label>
                    <input 
                      type="datetime-local" 
                      id="match_date"
                      class="form-control"
                      [class.is-invalid]="matchForm.get('match_date')?.invalid && matchForm.get('match_date')?.touched"
                      formControlName="match_date">
                    @if (matchForm.get('match_date')?.invalid && matchForm.get('match_date')?.touched) {
                      <div class="invalid-feedback">
                        Match date and time is required.
                      </div>
                    }
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-3">
                  <div class="mb-3">
                    <label for="home_score" class="form-label">Home Team Score *</label>
                    <input 
                      type="number" 
                      id="home_score"
                      class="form-control"
                      [class.is-invalid]="matchForm.get('home_score')?.invalid && matchForm.get('home_score')?.touched"
                      formControlName="home_score"
                      placeholder="0"
                      min="0"
                      max="20">
                    @if (matchForm.get('home_score')?.invalid && matchForm.get('home_score')?.touched) {
                      <div class="invalid-feedback">
                        @if (matchForm.get('home_score')?.errors?.['required']) {
                          Home score is required.
                        }
                        @if (matchForm.get('home_score')?.errors?.['min'] || matchForm.get('home_score')?.errors?.['max']) {
                          Score must be between 0 and 20.
                        }
                      </div>
                    }
                  </div>
                </div>
                
                <div class="col-md-3">
                  <div class="mb-3">
                    <label for="away_score" class="form-label">Away Team Score *</label>
                    <input 
                      type="number" 
                      id="away_score"
                      class="form-control"
                      [class.is-invalid]="matchForm.get('away_score')?.invalid && matchForm.get('away_score')?.touched"
                      formControlName="away_score"
                      placeholder="0"
                      min="0"
                      max="20">
                    @if (matchForm.get('away_score')?.invalid && matchForm.get('away_score')?.touched) {
                      <div class="invalid-feedback">
                        @if (matchForm.get('away_score')?.errors?.['required']) {
                          Away score is required.
                        }
                        @if (matchForm.get('away_score')?.errors?.['min'] || matchForm.get('away_score')?.errors?.['max']) {
                          Score must be between 0 and 20.
                        }
                      </div>
                    }
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">&nbsp;</label>
                    <div class="form-control-plaintext">
                      <small class="text-muted">
                        <i class="fas fa-info-circle"></i>
                        Enter the final scores for completed matches
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <button 
                  type="submit" 
                  class="btn btn-primary me-2"
                  [disabled]="matchForm.invalid || loading">
                  @if (loading) {
                    <span class="spinner-border spinner-border-sm me-1" role="status"></span>
                  }
                  <i class="fas fa-save me-1"></i>
                  {{ isEditMode ? 'Update Match' : 'Create Match' }}
                </button>
                <a [routerLink]="isEditMode ? ['/matches', matchId] : ['/matches']" class="btn btn-secondary">
                  <i class="fas fa-times me-1"></i>
                  Cancel
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./match-form.component.css']
})
export class MatchFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private matchService = inject(MatchService);
  private teamService = inject(TeamService);

  matchForm: FormGroup;
  isEditMode = false;
  matchId: number | null = null;
  match: Match | null = null;
  teams: Team[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    this.matchForm = this.fb.group({
      home_team_id: ['', [Validators.required]],
      away_team_id: ['', [Validators.required]],
      match_date: ['', [Validators.required]],
      home_score: [0, [Validators.required, Validators.min(0), Validators.max(20)]],
      away_score: [0, [Validators.required, Validators.min(0), Validators.max(20)]]
    }, { validators: this.sameTeamValidator });
  }

  ngOnInit(): void {
    this.loadTeams();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.matchId = +id;
      this.loadMatch();
    }
  }

  sameTeamValidator(form: FormGroup) {
    const homeTeamId = form.get('home_team_id')?.value;
    const awayTeamId = form.get('away_team_id')?.value;
    
    if (homeTeamId && awayTeamId && homeTeamId === awayTeamId) {
      return { sameTeam: true };
    }
    return null;
  }

  loadTeams(): void {
    this.teamService.getAllTeams().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.teams = response.data;
        }
      },
      error: (error) => {
        this.error = 'Failed to load teams';
      }
    });
  }

  loadMatch(): void {
    if (this.matchId) {
      this.loading = true;
      this.matchService.getMatch(this.matchId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.match = response.data;
            
            // Convert date to datetime-local format
            const matchDate = new Date(response.data.match_date);
            const localDate = new Date(matchDate.getTime() - matchDate.getTimezoneOffset() * 60000);
            const formattedDate = localDate.toISOString().slice(0, 16);
            
            this.matchForm.patchValue({
              home_team_id: response.data.home_team.id,
              away_team_id: response.data.away_team.id,
              match_date: formattedDate,
              home_score: response.data.home_score,
              away_score: response.data.away_score
            });
          } else {
            this.error = 'Failed to load match data';
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message || 'An error occurred while loading match data';
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.matchForm.valid) {
      this.loading = true;
      this.error = null;

      const matchData = {
        home_team_id: +this.matchForm.value.home_team_id,
        away_team_id: +this.matchForm.value.away_team_id,
        match_date: this.matchForm.value.match_date,
        home_score: +this.matchForm.value.home_score,
        away_score: +this.matchForm.value.away_score
      };

      const operation = this.isEditMode && this.matchId
        ? this.matchService.updateMatch(this.matchId, matchData)
        : this.matchService.createMatch(matchData);

      operation.subscribe({
        next: (response) => {
          if (response.success && response.data) {
            // Navigate to the match detail page
            this.router.navigate(['/matches', response.data.id]);
          } else {
            this.error = response.message || `Failed to ${this.isEditMode ? 'update' : 'create'} match`;
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message || `An error occurred while ${this.isEditMode ? 'updating' : 'creating'} the match`;
          this.loading = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.matchForm.controls).forEach(key => {
        this.matchForm.get(key)?.markAsTouched();
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
}