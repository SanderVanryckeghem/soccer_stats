import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'teams', 
    loadComponent: () => import('./components/teams/teams').then(m => m.TeamsComponent)
  },
  { 
    path: 'players', 
    loadComponent: () => import('./components/players/players').then(m => m.PlayersComponent)
  },
  { 
    path: 'matches', 
    loadComponent: () => import('./components/matches/matches').then(m => m.MatchesComponent)
  },
  { 
    path: 'stats', 
    loadComponent: () => import('./components/stats/stats').then(m => m.StatsComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];
