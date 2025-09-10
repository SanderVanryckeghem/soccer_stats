// src/app/services/dashboard.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from './api';
import { DashboardData, LeagueStats } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiService = inject(ApiService);

  getDashboardData(): Observable<ApiResponse<DashboardData>> {
    return this.apiService.get<DashboardData>('/dashboard');
  }

  getLeagueStats(): Observable<ApiResponse<LeagueStats>> {
    return this.apiService.get<LeagueStats>('/dashboard/stats');
  }
}