// src/app/services/match.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from './api';
import { Match, MatchesResponse } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiService = inject(ApiService);

  getAllMatches(teamId?: number): Observable<ApiResponse<MatchesResponse>> {
    const endpoint = teamId ? `/matches?team_id=${teamId}` : '/matches';
    return this.apiService.get<MatchesResponse>(endpoint);
  }

  getMatch(id: number): Observable<ApiResponse<Match>> {
    return this.apiService.get<Match>(`/matches/${id}`);
  }

  createMatch(match: Partial<Match>): Observable<ApiResponse<Match>> {
    return this.apiService.post<Match>('/matches', { match });
  }

  updateMatch(id: number, match: Partial<Match>): Observable<ApiResponse<Match>> {
    return this.apiService.put<Match>(`/matches/${id}`, { match });
  }

  deleteMatch(id: number): Observable<ApiResponse<any>> {
    return this.apiService.delete<any>(`/matches/${id}`);
  }
}