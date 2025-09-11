// src/app/components/player-form/player-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PlayerService } from '../../services/player';
import { TeamService } from '../../services/team';
import { Player, Team } from '../../models/models';
import { ApiResponse } from '../../services/api';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="d-flex align-items-center mb-4">
          <a [routerLink]="getBackLink()" class="btn btn-outline-secondary me-3">
            <i class="fas fa-arrow-left"></i>
          </a>
          <h1 class="mb-0">
            <i class="fas fa-plus-circle me-2"></i>
            {{ isEditMode ? 'Edit Player' : 'Add Player' }}
            @if (team) {
              <small class="text-muted d-block">{{ team.name }}</small>
            }
          </h1>
        </div>

        @if (error) {
          <div class="error-message">
            <i class="fas fa-exclamation-triangle me-2"></i>
            {{ error }}
          </div>
        }

        <div class="card">
          <div class="card-body">
            <form [formGroup]="playerForm" (ngSubmit)="onSubmit()">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="name" class="form-label">Player Name *</label>
                    <input 
                      type="text" 
                      id="name"
                      class="form-control"
                      [class.is-invalid]="playerForm.get('name')?.invalid && playerForm.get('name')?.touched"
                      formControlName="name"
                      placeholder="Enter player name">
                    @if (playerForm.get('name')?.invalid && playerForm.get('name')?.touched) {
                      <div class="invalid-feedback">
                        Player name is required.
                      </div>
                    }
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="age" class="form-label">Age *</label>
                    <input 
                      type="number" 
                      id="age"
                      class="form-control"
                      [class.is-invalid]="playerForm.get('age')?.invalid && playerForm.get('age')?.touched"
                      formControlName="age"
                      placeholder="Enter age"
                      min="16"
                      max="45">
                    @if (playerForm.get('age')?.invalid && playerForm.get('age')?.touched) {
                      <div class="invalid-feedback">
                        @if (playerForm.get('age')?.errors?.['required']) {
                          Age is required.
                        }
                        @if (playerForm.get('age')?.errors?.['min'] || playerForm.get('age')?.errors?.['max']) {
                          Age must be between 16 and 45.
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="position" class="form-label">Position *</label>
                    <select 
                      id="position"
                      class="form-select"
                      [class.is-invalid]="playerForm.get('position')?.invalid && playerForm.get('position')?.touched"
                      formControlName="position">
                      <option value="">Select Position</option>
                      <option value="Goalkeeper">Goalkeeper</option>
                      <option value="Defender">Defender</option>
                      <option value="Midfielder">Midfielder</option>
                      <option value="Forward">Forward</option>
                    </select>
                    @if (playerForm.get('position')?.invalid && playerForm.get('position')?.touched) {
                      <div class="invalid-feedback">
                        Position is required.
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
                        @if (team) {
                          Player will be added to <strong>{{ team.name }}</strong>
                        } @else {
                          Select a team for this player
                        }
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <button 
                  type="submit" 
                  class="btn btn-primary me-2"
                  [disabled]="playerForm.invalid || loading">
                  @if (loading) {
                    <span class="spinner-border spinner-border-sm me-1" role="status"></span>
                  }
                  <i class="fas fa-save me-1"></i>
                  {{ isEditMode ? 'Update Player' : 'Add Player' }}
                </button>
                <a [routerLink]="getBackLink()" class="btn btn-secondary">
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
  styleUrls: ['./player-form.component.css']
})
export class PlayerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private playerService = inject(PlayerService);
  private teamService = inject(TeamService);

  playerForm: FormGroup;
  isEditMode = false;
  playerId: number | null = null;
  teamId: number | null = null;
  team: Team | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    this.playerForm = this.fb.group({
      name: ['', [Validators.required]],
      position: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(16), Validators.max(45)]]
    });
  }

  ngOnInit(): void {
    // Check if this is for a specific team
    const teamId = this.route.snapshot.paramMap.get('teamId');
    const playerId = this.route.snapshot.paramMap.get('id');

    if (teamId) {
      this.teamId = +teamId;
      this.loadTeam();
    }

    if (playerId) {
      this.isEditMode = true;
      this.playerId = +playerId;
      this.loadPlayer();
    }
  }

  loadTeam(): void {
    if (this.teamId) {
      this.teamService.getTeam(this.teamId).subscribe({
        next: (response: ApiResponse<Team>) => {
          if (response.success && response.data) {
            this.team = response.data;
          }
        },
        error: (error: Error) => {
          this.error = 'Failed to load team information';
        }
      });
    }
  }

  loadPlayer(): void {
    if (this.playerId) {
      this.loading = true;
      this.playerService.getPlayer(this.playerId).subscribe({
        next: (response: ApiResponse<Player>) => {
          if (response.success && response.data) {
            const player = response.data;
            this.team = player.team || null;
            this.teamId = player.team?.id || null;
            
            this.playerForm.patchValue({
              name: player.name,
              position: player.position,
              age: player.age
            });
          } else {
            this.error = 'Failed to load player data';
          }
          this.loading = false;
        },
        error: (error: Error) => {
          this.error = error.message || 'An error occurred while loading player data';
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.playerForm.valid) {
      this.loading = true;
      this.error = null;

      const playerData = this.playerForm.value;

      let operation;
      if (this.isEditMode && this.playerId) {
        operation = this.playerService.updatePlayer(this.playerId, playerData);
      } else if (this.teamId) {
        operation = this.playerService.createPlayer(this.teamId, playerData);
      } else {
        this.error = 'No team specified for player';
        this.loading = false;
        return;
      }

      operation.subscribe({
        next: (response: ApiResponse<Player>) => {
          if (response.success && response.data) {
            // Navigate to appropriate page
            if (this.team) {
              this.router.navigate(['/teams', this.team.id]);
            } else {
              this.router.navigate(['/players']);
            }
          } else {
            this.error = response.message || `Failed to ${this.isEditMode ? 'update' : 'create'} player`;
          }
          this.loading = false;
        },
        error: (error: Error) => {
          this.error = error.message || `An error occurred while ${this.isEditMode ? 'updating' : 'creating'} the player`;
          this.loading = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.playerForm.controls).forEach(key => {
        this.playerForm.get(key)?.markAsTouched();
      });
    }
  }

  getBackLink(): string[] {
    if (this.team) {
      return ['/teams', this.team.id.toString()];
    } else if (this.isEditMode && this.playerId) {
      return ['/players', this.playerId.toString()];
    }
    return ['/players'];
  }
}