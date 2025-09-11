// src/app/components/player-detail/player-detail.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../services/player';
import { Player } from '../../models/models';
import { ApiResponse } from '../../services/api';

@Component({
  selector: 'app-player-detail',
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
        <h4>Error Loading Player</h4>
        <p>{{ error }}</p>
        <a routerLink="/players" class="btn btn-primary">
          <i class="fas fa-arrow-left me-1"></i>
          Back to Players
        </a>
      </div>
    } @else if (player) {
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center">
          <a routerLink="/players" class="btn btn-outline-secondary me-3">
            <i class="fas fa-arrow-left"></i>
          </a>
          <div>
            <h1 class="mb-0">{{ player.name }}</h1>
            <p class="text-muted mb-0">
              <span class="badge bg-secondary me-2">{{ player.position }}</span>
              <i class="fas fa-birthday-cake me-1"></i> Age {{ player.age }}
            </p>
          </div>
        </div>
        <div class="btn-group">
          <a [routerLink]="['/players', player.id, 'edit']" class="btn btn-outline-primary">
            <i class="fas fa-edit"></i> Edit
          </a>
          <button class="btn btn-outline-danger" (click)="deletePlayer()">
            <i class="fas fa-trash"></i> Remove
          </button>
        </div>
      </div>

      <div class="row">
        <!-- Player Info -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-user me-2"></i>
                Player Information
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <strong>Name:</strong><br>
                <span class="fs-5">{{ player.name }}</span>
              </div>
              
              <div class="mb-3">
                <strong>Position:</strong><br>
                <span class="badge bg-secondary fs-6">{{ player.position }}</span>
              </div>
              
              <div class="mb-3">
                <strong>Age:</strong><br>
                <span class="text-muted">{{ player.age }} years old</span>
              </div>
              
              <div class="mb-3">
                <strong>Team:</strong><br>
                <a [routerLink]="['/teams', player.team?.id]" class="text-decoration-none">
                  {{ player.team?.name }}
                </a>
                <br>
                <small class="text-muted">{{ player.team?.city }}</small>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Team Context -->
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-users me-2"></i>
                Team: {{ player.team?.name }}
              </h5>
            </div>
            <div class="card-body">
              <div class="row text-center mb-4">
                <div class="col-3">
                  <h4>{{ getTeammatesCount() }}</h4>
                  <small class="text-muted">Total Players</small>
                </div>
                <div class="col-3">
                  <h4>{{ getPositionMatesCount() }}</h4>
                  <small class="text-muted">{{ player.position }}s</small>
                </div>
                <div class="col-3">
                  <h4>{{ player.team?.founded }}</h4>
                  <small class="text-muted">Founded</small>
                </div>
                <div class="col-3">
                  <h4>-</h4>
                  <small class="text-muted">Matches</small>
                </div>
              </div>
              
              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <a [routerLink]="['/teams', player.team?.id]" class="btn btn-outline-primary">
                  View Full Team
                </a>
                <a [routerLink]="['/matches']" class="btn btn-outline-info">
                  View Matches
                </a>
              </div>
            </div>
          </div>
          
          <!-- Position teammates -->
          @if (player.position_teammates && player.position_teammates.length > 0) {
            <div class="card mt-3">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-users me-2"></i>
                  Other {{ player.position }}s
                </h5>
              </div>
              <div class="card-body">
                @for (teammate of player.position_teammates; track teammate.id) {
                  <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                    <div>
                      <strong>{{ teammate.name }}</strong><br>
                      <small class="text-muted">Age {{ teammate.age }}</small>
                    </div>
                    <div>
                      <a [routerLink]="['/players', teammate.id]" class="btn btn-sm btn-outline-primary">
                        <i class="fas fa-eye"></i>
                      </a>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
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
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private playerService = inject(PlayerService);
  
  player: Player | null = null;
  loading = true;
  error: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPlayer(+id);
    }
  }

  loadPlayer(id: number): void {
    this.loading = true;
    this.error = null;
    
    this.playerService.getPlayer(id).subscribe({
      next: (response: ApiResponse<Player>) => {
        if (response.success && response.data) {
          this.player = response.data;
        } else {
          this.error = response.message || 'Failed to load player';
        }
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = error.message || 'An error occurred while loading the player';
        this.loading = false;
      }
    });
  }

  deletePlayer(): void {
    if (this.player && confirm(`Are you sure you want to remove ${this.player.name} from the team?`)) {
      this.playerService.deletePlayer(this.player.id).subscribe({
        next: (response: ApiResponse<any>) => {
          if (response.success) {
            this.successMessage = 'Player removed successfully.';
            // Redirect to players list after a short delay
            setTimeout(() => {
              this.router.navigate(['/players']);
            }, 1500);
          } else {
            this.error = response.message || 'Failed to remove player';
          }
        },
        error: (error: Error) => {
          this.error = error.message || 'An error occurred while removing the player';
        }
      });
    }
  }

  getTeammatesCount(): number {
    return this.player?.teammates?.length || 0;
  }

  getPositionMatesCount(): number {
    return this.player?.position_teammates?.length || 0;
  }
}