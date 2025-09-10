# app/controllers/dashboard_controller.rb
class DashboardController < ApplicationController
  def index
    @recent_matches = Match.includes(:home_team, :away_team).recent.limit(5)
    @total_teams = Team.count
    @total_players = Player.count
    @total_matches = Match.count
    @top_scorers = top_scorers_data
  end

  def stats
    @teams_with_stats = Team.all.map do |team|
      matches = team.all_matches
      wins = team.wins.count
      draws = team.draws.count
      losses = team.losses.count
      
      {
        team: team,
        matches_played: matches.count,
        wins: wins,
        draws: draws,
        losses: losses,
        points: (wins * 3) + draws,
        goals_for: goals_for(team),
        goals_against: goals_against(team)
      }
    end.sort_by { |stats| -stats[:points] }
  end

  private

  def top_scorers_data
    # This is a simple example - in a real app you'd have goal scoring data
    Player.joins(:team).limit(5)
  end

  def goals_for(team)
    home_goals = Match.where(home_team: team).sum(:home_score)
    away_goals = Match.where(away_team: team).sum(:away_score)
    home_goals + away_goals
  end

  def goals_against(team)
    home_goals_against = Match.where(home_team: team).sum(:away_score)
    away_goals_against = Match.where(away_team: team).sum(:home_score)
    home_goals_against + away_goals_against
  end
end