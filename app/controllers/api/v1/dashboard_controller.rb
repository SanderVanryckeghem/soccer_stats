# app/controllers/api/v1/dashboard_controller.rb
class Api::V1::DashboardController < Api::V1::BaseController
  def index
    recent_matches = Match.includes(:home_team, :away_team).recent.limit(5)
    
    dashboard_data = {
      stats: {
        total_teams: Team.count,
        total_players: Player.count,
        total_matches: Match.count,
        recent_matches_count: recent_matches.count
      },
      recent_matches: recent_matches.map do |match|
        {
          id: match.id,
          home_team: { id: match.home_team.id, name: match.home_team.name },
          away_team: { id: match.away_team.id, name: match.away_team.name },
          home_score: match.home_score,
          away_score: match.away_score,
          match_date: match.match_date,
          winner_id: match.winner&.id
        }
      end,
      top_players: Player.joins(:team).limit(5).map do |player|
        {
          id: player.id,
          name: player.name,
          position: player.position,
          team: { id: player.team.id, name: player.team.name }
        }
      end
    }
    
    render_success(dashboard_data)
  end

  def stats
    teams_with_stats = Team.all.map do |team|
      matches = team.all_matches
      wins = team.wins.count
      draws = team.draws.count
      losses = team.losses.count
      goals_for = goals_for(team)
      goals_against = goals_against(team)
      
      {
        team: {
          id: team.id,
          name: team.name,
          city: team.city,
          founded: team.founded
        },
        matches_played: matches.count,
        wins: wins,
        draws: draws,
        losses: losses,
        points: (wins * 3) + draws,
        goals_for: goals_for,
        goals_against: goals_against,
        goal_difference: goals_for - goals_against
      }
    end.sort_by { |stats| -stats[:points] }

    total_matches = teams_with_stats.sum { |stats| stats[:matches_played] } / 2
    total_goals = teams_with_stats.sum { |stats| stats[:goals_for] }
    
    stats_data = {
      league_table: teams_with_stats,
      league_overview: {
        total_teams: Team.count,
        total_matches: total_matches,
        total_goals: total_goals,
        average_goals_per_match: total_matches > 0 ? (total_goals.to_f / total_matches).round(2) : 0,
        total_wins: teams_with_stats.sum { |stats| stats[:wins] },
        total_draws: teams_with_stats.sum { |stats| stats[:draws] }
      },
      top_scorers: teams_with_stats.sort_by { |stats| -stats[:goals_for] }.first(3),
      best_defense: teams_with_stats.sort_by { |stats| stats[:goals_against] }.first(3)
    }
    
    render_success(stats_data)
  end

  private

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