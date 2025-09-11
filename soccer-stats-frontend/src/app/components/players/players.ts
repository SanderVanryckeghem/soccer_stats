// src/app/components/players/players.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player';
import { Player, PlayersResponse } from '../../models/models';
import { ApiResponse } from '../../services/api';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>
        <i class="fas fa-users me-2"></i>
        All Players
        @if (filteredPlayersCount > 0) {
          <span class="badge bg-secondary ms-2">{{ filteredPlayersCount }}</span>
        }
      </h1>
      <div class="btn-group">
        <a routerLink="/teams" class="btn btn-outline-primary">
          <i class="fas fa-plus me-1"></i>
          Add Player to Team
        </a>
      </div>
    </div>

    <!-- Search and Filter Controls -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <!-- Search -->
          <div class="col-md-4">
            <label for="searchTerm" class="form-label">Search Players</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
              <input 
                type="text" 
                id="searchTerm"
                class="form-control" 
                placeholder="Search by name or team..."
                [(ngModel)]="searchTerm"
                (input)="filterPlayers()">
              @if (searchTerm) {
                <button class="btn btn-outline-secondary" type="button" (click)="clearSearch()">
                  <i class="fas fa-times"></i>
                </button>
              }
            </div>
          </div>

          <!-- Position Filter -->
          <div class="col-md-3">
            <label for="positionFilter" class="form-label">Position</label>
            <select 
              id="positionFilter"
              class="form-select" 
              [(ngModel)]="selectedPosition"
              (change)="filterPlayers()">
              <option value="">All Positions</option>
              @for (position of positions; track position) {
                <option [value]="position">{{ position }}</option>
              }
            </select>
          </div>

          <!-- Age Range Filter -->
          <div class="col-md-3">
            <label for="ageFilter" class="form-label">Age Range</label>
            <select 
              id="ageFilter"
              class="form-select" 
              [(ngModel)]="selectedAgeRange"
              (change)="filterPlayers()">
              <option value="">All Ages</option>
              <option value="young">Young (16-22)</option>
              <option value="prime">Prime (23-29)</option>
              <option value="experienced">Experienced (30+)</option>
            </select>
          </div>

          <!-- Sort Options -->
          <div class="col-md-2">
            <label for="sortBy" class="form-label">Sort By</label>
            <select 
              id="sortBy"
              class="form-select" 
              [(ngModel)]="sortBy"
              (change)="sortPlayers()">
              <option value="name">Name</option>
              <option value="age">Age</option>
              <option value="position">Position</option>
              <option value="team">Team</option>
            </select>
          </div>
        </div>

        @if (hasActiveFilters()) {
          <div class="mt-3">
            <button class="btn btn-sm btn-outline-secondary" (click)="clearAllFilters()">
              <i class="fas fa-times me-1"></i>
              Clear All Filters
            </button>
          </div>
        }
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
        <h4>Error Loading Players</h4>
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="loadPlayers()">
          <i class="fas fa-redo me-1"></i>
          Retry
        </button>
      </div>
    } @else if (filteredPlayers.length > 0) {
      <!-- Players Grid -->
      <div class="row">
        @for (player of paginatedPlayers; track player.id) {
          <div class="col-md-6 col-lg-4 col-xl-3 mb-4">
            <div class="card h-100 player-card">
              <div class="card-body d-flex flex-column">
                <div class="text-center mb-3">
                  <div class="player-avatar mb-2">
                    <i class="fas fa-user-circle fa-4x text-muted"></i>
                  </div>
                  <h5 class="card-title mb-1">
                    <a [routerLink]="['/players', player.id]" class="text-decoration-none">
                      {{ player.name }}
                    </a>
                  </h5>
                  <span class="badge bg-position mb-2" [class]="getPositionBadgeClass(player.position)">
                    {{ player.position }}
                  </span>
                </div>

                <div class="player-details flex-grow-1">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="text-muted">Age:</span>
                    <strong>{{ player.age }}</strong>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="text-muted">Team:</span>
                    <a [routerLink]="['/teams', player.team?.id]" class="text-decoration-none text-truncate ms-2">
                      {{ player.team?.name }}
                    </a>
                  </div>
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted">City:</span>
                    <span class="text-truncate ms-2">{{ player.team?.city }}</span>
                  </div>
                </div>
              </div>
              
              <div class="card-footer bg-transparent">
                <div class="btn-group w-100" role="group">
                  <a [routerLink]="['/players', player.id]" class="btn btn-outline-primary btn-sm">
                    <i class="fas fa-eye"></i>
                  </a>
                  <a [routerLink]="['/players', player.id, 'edit']" class="btn btn-outline-secondary btn-sm">
                    <i class="fas fa-edit"></i>
                  </a>
                  <a [routerLink]="['/teams', player.team?.id]" class="btn btn-outline-info btn-sm">
                    <i class="fas fa-users"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Pagination -->
      @if (totalPages > 1) {
        <nav aria-label="Players pagination">
          <ul class="pagination justify-content-center">
            <li class="page-item" [class.disabled]="currentPage === 1">
              <button class="page-link" (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1">
                <i class="fas fa-chevron-left"></i>
              </button>
            </li>
            
            @for (page of getPageNumbers(); track page) {
              <li class="page-item" [class.active]="page === currentPage">
                <button class="page-link" (click)="goToPage(page)">
                  {{ page }}
                </button>
              </li>
            }
            
            <li class="page-item" [class.disabled]="currentPage === totalPages">
              <button class="page-link" (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages">
                <i class="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
        
        <div class="text-center text-muted">
          Showing {{ getStartIndex() + 1 }} - {{ getEndIndex() }} of {{ filteredPlayersCount }} players
        </div>
      }

    } @else {
      <!-- Empty State -->
      <div class="text-center py-5">
        @if (hasActiveFilters()) {
          <i class="fas fa-search fa-5x text-muted mb-3"></i>
          <h3 class="mt-3">No Players Match Your Filters</h3>
          <p class="text-muted">Try adjusting your search criteria or clearing filters.</p>
          <button class="btn btn-outline-primary" (click)="clearAllFilters()">
            <i class="fas fa-times me-1"></i>
            Clear All Filters
          </button>
        } @else {
          <i class="fas fa-user-slash fa-5x text-muted mb-3"></i>
          <h3 class="mt-3">No Players Found</h3>
          <p class="text-muted">No players have been added yet. Add players through team management.</p>
          <a routerLink="/teams" class="btn btn-primary">
            <i class="fas fa-users me-1"></i>
            View Teams
          </a>
        }
      </div>
    }
  `,
  styles: [`
    .player-card {
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      border: 1px solid rgba(0,0,0,.125);
    }
    
    .player-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,.15);
    }
    
    .player-avatar {
      color: #6c757d;
    }
    
    .bg-position.bg-goalkeeper { background-color: #ffc107 !important; color: #000; }
    .bg-position.bg-defender { background-color: #28a745 !important; }
    .bg-position.bg-midfielder { background-color: #007bff !important; }
    .bg-position.bg-forward { background-color: #dc3545 !important; }
    
    .player-details {
      font-size: 0.9rem;
    }
    
    .text-truncate {
      max-width: 120px;
    }
    
    .pagination .page-link {
      border: 1px solid #dee2e6;
      color: #007bff;
    }
    
    .pagination .page-item.active .page-link {
      background-color: #007bff;
      border-color: #007bff;
    }
  `]
})
export class PlayersComponent implements OnInit {
  private playerService = inject(PlayerService);
  
  // Data properties
  players: Player[] = [];
  filteredPlayers: Player[] = [];
  positions: string[] = [];
  
  // Filter properties
  searchTerm: string = '';
  selectedPosition: string = '';
  selectedAgeRange: string = '';
  sortBy: string = 'name';
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 12;
  
  // State properties
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadPlayers();
  }

  get filteredPlayersCount(): number {
    return this.filteredPlayers.length;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPlayersCount / this.itemsPerPage);
  }

  get paginatedPlayers(): Player[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredPlayers.slice(startIndex, endIndex);
  }

  loadPlayers(): void {
    this.loading = true;
    this.error = null;
    
    this.playerService.getAllPlayers().subscribe({
      next: (response: ApiResponse<PlayersResponse>) => {
        if (response.success && response.data) {
          this.players = response.data.players;
          this.positions = response.data.positions;
          this.filterPlayers();
        } else {
          this.error = response.message || 'Failed to load players';
        }
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = error.message || 'An error occurred while loading players';
        this.loading = false;
      }
    });
  }

  filterPlayers(): void {
    let filtered = [...this.players];

    // Search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(player => 
        player.name.toLowerCase().includes(term) ||
        player.team?.name.toLowerCase().includes(term) ||
        player.team?.city.toLowerCase().includes(term)
      );
    }

    // Position filter
    if (this.selectedPosition) {
      filtered = filtered.filter(player => player.position === this.selectedPosition);
    }

    // Age range filter
    if (this.selectedAgeRange) {
      filtered = filtered.filter(player => {
        switch (this.selectedAgeRange) {
          case 'young': return player.age >= 16 && player.age <= 22;
          case 'prime': return player.age >= 23 && player.age <= 29;
          case 'experienced': return player.age >= 30;
          default: return true;
        }
      });
    }

    this.filteredPlayers = filtered;
    this.sortPlayers();
    this.currentPage = 1; // Reset to first page after filtering
  }

  sortPlayers(): void {
    this.filteredPlayers.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'age':
          return a.age - b.age;
        case 'position':
          return a.position.localeCompare(b.position);
        case 'team':
          return (a.team?.name || '').localeCompare(b.team?.name || '');
        default:
          return 0;
      }
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterPlayers();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedPosition = '';
    this.selectedAgeRange = '';
    this.sortBy = 'name';
    this.filterPlayers();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.selectedPosition || this.selectedAgeRange);
  }

  getPositionBadgeClass(position: string): string {
    const positionClass = position.toLowerCase().replace(/\s+/g, '-');
    return `bg-${positionClass}`;
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex(): number {
    return Math.min(this.getStartIndex() + this.itemsPerPage, this.filteredPlayersCount);
  }
}