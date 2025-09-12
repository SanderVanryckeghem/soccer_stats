// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AiSimulationComponent } from './components/ai-simulation/ai-simulation';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'teams', 
    loadComponent: () => import('./components/teams/teams.component').then(m => m.TeamsComponent)
  },
  { 
    path: 'teams/new', 
    loadComponent: () => import('./components/team-form/team-form').then(m => m.TeamFormComponent)
  },
  { 
    path: 'teams/:id/edit', 
    loadComponent: () => import('./components/team-form/team-form').then(m => m.TeamFormComponent)
  },
  { 
    path: 'teams/:id', 
    loadComponent: () => import('./components/team-detail/team-detail').then(m => m.TeamDetailComponent)
  },
  { 
    path: 'teams/:teamId/players/new', 
    loadComponent: () => import('./components/player-form/player-form').then(m => m.PlayerFormComponent)
  },
  { 
    path: 'players', 
    loadComponent: () => import('./components/players/players').then(m => m.PlayersComponent)
  },
  { 
    path: 'players/:id/edit', 
    loadComponent: () => import('./components/player-form/player-form').then(m => m.PlayerFormComponent)
  },
  { 
    path: 'players/:id', 
    loadComponent: () => import('./components/player-detail/player-detail').then(m => m.PlayerDetailComponent)
  },
  { 
    path: 'matches', 
    loadComponent: () => import('./components/matches/matches').then(m => m.MatchesComponent)
  },
  { 
    path: 'matches/new', 
    loadComponent: () => import('./components/match-form/match-form').then(m => m.MatchFormComponent)
  },
  { 
    path: 'matches/:id/edit', 
    loadComponent: () => import('./components/match-form/match-form').then(m => m.MatchFormComponent)
  },
  { 
    path: 'matches/:id', 
    loadComponent: () => import('./components/match-detail/match-detail').then(m => m.MatchDetailComponent)
  },
  { 
    path: 'stats', 
    loadComponent: () => import('./components/stats/stats').then(m => m.StatsComponent)
  },
  { path: '**', redirectTo: '/dashboard' },
  {
    path: 'ai-simulation', 
    loadComponent: () => import('./components/ai-simulation/ai-simulation').then(m => m.AiSimulationComponent)
  },
];