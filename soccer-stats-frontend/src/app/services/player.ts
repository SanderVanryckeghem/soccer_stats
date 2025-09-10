// src/app/services/player.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from './api';
import { Player, PlayersResponse } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiService = inject(ApiService);

  getAllPlayers(position?: string): Observable<ApiResponse<PlayersResponse>> {
    const endpoint = position ? `/players?position=${position}` : '/players';
    return this.apiService.get<PlayersResponse>(endpoint);
  }

  getPlayer(id: number): Observable<ApiResponse<Player>> {
    return this.apiService.get<Player>(`/players/${id}`);
  }

  createPlayer(teamId: number, player: Partial<Player>): Observable<ApiResponse<Player>> {
    return this.apiService.post<Player>(`/teams/${teamId}/players`, { player });
  }

  updatePlayer(id: number, player: Partial<Player>): Observable<ApiResponse<Player>> {
    return this.apiService.put<Player>(`/players/${id}`, { player });
  }

  deletePlayer(id: number): Observable<ApiResponse<any>> {
    return this.apiService.delete<any>(`/players/${id}`);
  }
}