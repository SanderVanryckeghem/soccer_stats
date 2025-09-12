// src/app/services/ai-simulation.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from './api';

export interface MatchSimulation {
  home_score: number;
  away_score: number;
  outcome: 'home_win' | 'away_win' | 'draw';
  probabilities: {
    home_win: number;
    draw: number;
    away_win: number;
  };
  match_events: MatchEvent[];
}

export interface MatchEvent {
  type: string;
  team: string;
  minute: number;
  player: string;
}

export interface SimulationResponse {
  simulation: MatchSimulation;
  match?: any;
  saved: boolean;
}

export interface SeasonSimulationResponse {
  simulated_matches: any[];
  created_matches?: any[];
  total_matches: number;
  saved: boolean;
}

export interface SimulationPreview {
  teams: {
    home: { id: number; name: string };
    away: { id: number; name: string };
  };
  simulation_stats: {
    home_wins: number;
    draws: number;
    away_wins: number;
    average_home_score: number;
    average_away_score: number;
    sample_probabilities: {
      home_win: number;
      draw: number;
      away_win: number;
    };
  };
  sample_simulations: MatchSimulation[];
}

export interface TeamStrength {
  team: { id: number; name: string };
  strength: number;
  stats: {
    matches_played: number;
    wins: number;
    draws: number;
    losses: number;
    points: number;
    goals_for: number;
    goals_against: number;
    goal_difference: number;
  };
  strength_rating: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiSimulationService {
  private apiService = inject(ApiService);

  /**
   * Simulate a single match between two teams
   */
  simulateMatch(homeTeamId: number, awayTeamId: number, saveMatch = false, matchDate?: string): Observable<ApiResponse<SimulationResponse>> {
    const params: any = {
      home_team_id: homeTeamId,
      away_team_id: awayTeamId,
      save_match: saveMatch.toString()
    };
    
    if (matchDate) {
      params.match_date = matchDate;
    }
    
    return this.apiService.post<SimulationResponse>('/ai_matches/simulate_match', params);
  }

  /**
   * Simulate a full season of matches for all teams
   */
  simulateSeason(saveMatches = false): Observable<ApiResponse<SeasonSimulationResponse>> {
    return this.apiService.post<SeasonSimulationResponse>('/ai_matches/simulate_season', {
      save_matches: saveMatches.toString()
    });
  }

  /**
   * Get a preview of match simulation with probability analysis
   */
  previewSimulation(homeTeamId: number, awayTeamId: number): Observable<ApiResponse<SimulationPreview>> {
    return this.apiService.get<SimulationPreview>(`/ai_matches/preview_simulation?home_team_id=${homeTeamId}&away_team_id=${awayTeamId}`);
  }

  /**
   * Get team strength analysis
   */
  getTeamStrength(teamId: number): Observable<ApiResponse<TeamStrength>> {
    return this.apiService.get<TeamStrength>(`/ai_matches/team_strength?team_id=${teamId}`);
  }

  /**
   * Get strength comparison between two teams
   */
  compareTeams(team1Id: number, team2Id: number): Observable<{team1: TeamStrength, team2: TeamStrength}> {
    return new Observable(observer => {
      Promise.all([
        this.getTeamStrength(team1Id).toPromise(),
        this.getTeamStrength(team2Id).toPromise()
      ]).then(([team1Response, team2Response]) => {
        if (team1Response?.success && team2Response?.success) {
          observer.next({
            team1: team1Response.data!,
            team2: team2Response.data!
          });
        }
        observer.complete();
      }).catch(error => observer.error(error));
    });
  }

  /**
   * Helper method to format match outcome
   */
  formatMatchOutcome(outcome: string): string {
    switch (outcome) {
      case 'home_win': return 'Home Win';
      case 'away_win': return 'Away Win';
      case 'draw': return 'Draw';
      default: return 'Unknown';
    }
  }

  /**
   * Helper method to get outcome color class
   */
  getOutcomeColorClass(outcome: string): string {
    switch (outcome) {
      case 'home_win': return 'text-success';
      case 'away_win': return 'text-danger';
      case 'draw': return 'text-warning';
      default: return 'text-muted';
    }
  }

  /**
   * Helper method to format probability as percentage
   */
  formatProbability(probability: number): string {
    return `${(probability * 100).toFixed(1)}%`;
  }
}