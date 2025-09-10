// src/app/services/team.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from './api';
import { Team } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiService = inject(ApiService);

  getAllTeams(): Observable<ApiResponse<Team[]>> {
    return this.apiService.get<Team[]>('/teams');
  }

  getTeam(id: number): Observable<ApiResponse<Team>> {
    return this.apiService.get<Team>(`/teams/${id}`);
  }

  createTeam(team: Partial<Team>): Observable<ApiResponse<Team>> {
    return this.apiService.post<Team>('/teams', { team });
  }

  updateTeam(id: number, team: Partial<Team>): Observable<ApiResponse<Team>> {
    return this.apiService.put<Team>(`/teams/${id}`, { team });
  }

  deleteTeam(id: number): Observable<ApiResponse<any>> {
    return this.apiService.delete<any>(`/teams/${id}`);
  }
}