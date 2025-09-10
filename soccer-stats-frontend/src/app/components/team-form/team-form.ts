// src/app/components/team-form/team-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TeamService } from '../../services/team';
import { Team } from '../../models/models';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="d-flex align-items-center mb-4">
          <a [routerLink]="isEditMode ? ['/teams', teamId] : ['/teams']" class="btn btn-outline-secondary me-3">
            <i class="fas fa-arrow-left"></i>
          </a>
          <h1 class="mb-0">
            <i class="fas fa-plus-circle me-2"></i>
            {{ isEditMode ? 'Edit Team' : 'Add New Team' }}
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
            <form [formGroup]="teamForm" (ngSubmit)="onSubmit()">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="name" class="form-label">Team Name *</label>
                    <input 
                      type="text" 
                      id="name"
                      class="form-control"
                      [class.is-invalid]="teamForm.get('name')?.invalid && teamForm.get('name')?.touched"
                      formControlName="name"
                      placeholder="Enter team name">
                    @if (teamForm.get('name')?.invalid && teamForm.get('name')?.touched) {
                      <div class="invalid-feedback">
                        @if (teamForm.get('name')?.errors?.['required']) {
                          Team name is required.
                        }
                        @if (teamForm.get('name')?.errors?.['minlength']) {
                          Team name must be at least 2 characters long.
                        }
                      </div>
                    }
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="city" class="form-label">City *</label>
                    <input 
                      type="text" 
                      id="city"
                      class="form-control"
                      [class.is-invalid]="teamForm.get('city')?.invalid && teamForm.get('city')?.touched"
                      formControlName="city"
                      placeholder="Enter city">
                    @if (teamForm.get('city')?.invalid && teamForm.get('city')?.touched) {
                      <div class="invalid-feedback">
                        City is required.
                      </div>
                    }
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="founded" class="form-label">Year Founded *</label>
                    <input 
                      type="number" 
                      id="founded"
                      class="form-control"
                      [class.is-invalid]="teamForm.get('founded')?.invalid && teamForm.get('founded')?.touched"
                      formControlName="founded"
                      placeholder="e.g., 1995"
                      min="1800"
                      [max]="currentYear">
                    @if (teamForm.get('founded')?.invalid && teamForm.get('founded')?.touched) {
                      <div class="invalid-feedback">
                        @if (teamForm.get('founded')?.errors?.['required']) {
                          Year founded is required.
                        }
                        @if (teamForm.get('founded')?.errors?.['min'] || teamForm.get('founded')?.errors?.['max']) {
                          Year must be between 1800 and {{ currentYear }}.
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <button 
                  type="submit" 
                  class="btn btn-primary me-2"
                  [disabled]="teamForm.invalid || loading">
                  @if (loading) {
                    <span class="spinner-border spinner-border-sm me-1" role="status"></span>
                  }
                  <i class="fas fa-save me-1"></i>
                  {{ isEditMode ? 'Update Team' : 'Create Team' }}
                </button>
                <a [routerLink]="isEditMode ? ['/teams', teamId] : ['/teams']" class="btn btn-secondary">
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
  styleUrls: ['./team-form.component.css']
})
export class TeamFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private teamService = inject(TeamService);

  teamForm: FormGroup;
  isEditMode = false;
  teamId: number | null = null;
  loading = false;
  error: string | null = null;
  currentYear = new Date().getFullYear();

  constructor() {
    this.teamForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      city: ['', [Validators.required]],
      founded: ['', [Validators.required, Validators.min(1800), Validators.max(this.currentYear)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.teamId = +id;
      this.loadTeam();
    }
  }

  loadTeam(): void {
    if (this.teamId) {
      this.loading = true;
      this.teamService.getTeam(this.teamId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.teamForm.patchValue({
              name: response.data.name,
              city: response.data.city,
              founded: response.data.founded
            });
          } else {
            this.error = 'Failed to load team data';
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message || 'An error occurred while loading team data';
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      this.loading = true;
      this.error = null;

      const teamData = this.teamForm.value;

      const operation = this.isEditMode && this.teamId
        ? this.teamService.updateTeam(this.teamId, teamData)
        : this.teamService.createTeam(teamData);

      operation.subscribe({
        next: (response) => {
          if (response.success && response.data) {
            // Navigate to the team detail page
            this.router.navigate(['/teams', response.data.id]);
          } else {
            this.error = response.message || `Failed to ${this.isEditMode ? 'update' : 'create'} team`;
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message || `An error occurred while ${this.isEditMode ? 'updating' : 'creating'} the team`;
          this.loading = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.teamForm.controls).forEach(key => {
        this.teamForm.get(key)?.markAsTouched();
      });
    }
  }
}