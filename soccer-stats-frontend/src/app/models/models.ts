// src/app/models/models.ts

export interface Team {
  id: number;
  name: string;
  city: string;
  founded: number;
  players_count?: number;
  players?: Player[];
  stats?: TeamStats;
  recent_matches?: Match[];
  created_at?: string;
  updated_at?: string;
}

export interface Player {
  id: number;
  name: string;
  position: string;
  age: number;
  team_id?: number;
  team?: Team;
  teammates?: Player[];
  position_teammates?: Player[];
  created_at?: string;
  updated_at?: string;
}

export interface Match {
  id: number;
  home_team: Team;
  away_team: Team;
  home_score: number;
  away_score: number;
  match_date: string;
  winner_id?: number;
  is_draw?: boolean;
  total_goals?: number;
  winner?: Team;
  loser?: Team;
  created_at?: string;
  updated_at?: string;
}

export interface TeamStats {
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goals_for: number;
  goals_against: number;
  goal_difference?: number;
}

export interface DashboardData {
  stats: {
    total_teams: number;
    total_players: number;
    total_matches: number;
    recent_matches_count: number;
  };
  recent_matches: Match[];
  top_players: Player[];
}

export interface LeagueStats {
  league_table: TeamStanding[];
  league_overview: {
    total_teams: number;
    total_matches: number;
    total_goals: number;
    average_goals_per_match: number;
    total_wins: number;
    total_draws: number;
  };
  top_scorers: TeamStanding[];
  best_defense: TeamStanding[];
}

export interface TeamStanding {
  team: Team;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
}

export interface PlayersResponse {
  players: Player[];
  positions: string[];
}

export interface MatchesResponse {
  matches: Match[];
  teams: Team[];
}