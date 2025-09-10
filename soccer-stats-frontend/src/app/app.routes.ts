// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard';
import { TeamsComponent } from './components/teams/teams';
import { TeamDetailComponent } from './components/team-detail/team-detail';
import { TeamFormComponent } from './components/team-form/team-form';
import { PlayersComponent } from './components/players/players';
import { PlayerDetailComponent } from './components/player-detail/player-detail';
import { PlayerFormComponent } from './components/player-form/player-form';
import { MatchesComponent } from './components/matches/matches';
import { MatchDetailComponent } from './components/match-detail/match-detail';
import { MatchFormComponent } from './components/match-form/match-form';
import { StatsComponent } from './components/stats/stats';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'teams/new', component: TeamFormComponent },
  { path: 'teams/:id', component: TeamDetailComponent },
  { path: 'teams/:id/edit', component: TeamFormComponent },
  { path: 'teams/:teamId/players/new', component: PlayerFormComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'players/:id', component: PlayerDetailComponent },
  { path: 'players/:id/edit', component: PlayerFormComponent },
  { path: 'matches', component: MatchesComponent },
  { path: 'matches/new', component: MatchFormComponent },
  { path: 'matches/:id', component: MatchDetailComponent },
  { path: 'matches/:id/edit', component: MatchFormComponent },
  { path: 'stats', component: StatsComponent },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }