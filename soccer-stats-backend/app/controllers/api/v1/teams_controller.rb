# app/controllers/api/v1/teams_controller.rb
class Api::V1::TeamsController < Api::V1::BaseController
  before_action :set_team, only: [:show, :update, :destroy]

  def index
    @teams = Team.includes(:players).order(:name)
    
    teams_data = @teams.map do |team|
      {
        id: team.id,
        name: team.name,
        city: team.city,
        founded: team.founded,
        players_count: team.players.count,
        created_at: team.created_at,
        updated_at: team.updated_at
      }
    end
    
    render_success(teams_data)
  end

  def show
    team_stats = calculate_team_stats(@team)
    
    team_data = {
      id: @team.id,
      name: @team.name,
      city: @team.city,
      founded: @team.founded,
      players: @team.players.order(:name).map do |player|
        {
          id: player.id,
          name: player.name,
          position: player.position,
          age: player.age
        }
      end,
      stats: team_stats,
      recent_matches: @team.all_matches.recent.includes(:home_team, :away_team).limit(5).map do |match|
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
      created_at: @team.created_at,
      updated_at: @team.updated_at
    }
    
    render_success(team_data)
  end

  def create
    @team = Team.new(team_params)
    
    if @team.save
      render_success({
        id: @team.id,
        name: @team.name,
        city: @team.city,
        founded: @team.founded
      }, 'Team created successfully', :created)
    else
      render_error('Failed to create team', @team.errors.full_messages)
    end
  end

  def update
    if @team.update(team_params)
      render_success({
        id: @team.id,
        name: @team.name,
        city: @team.city,
        founded: @team.founded
      }, 'Team updated successfully')
    else
      render_error('Failed to update team', @team.errors.full_messages)
    end
  end

  def destroy
    if @team.destroy
      render_success(nil, 'Team deleted successfully')
    else
      render_error('Failed to delete team')
    end
  end

  private

  def set_team
    @team = Team.find_by(id: params[:id])
    render_not_found('Team not found') unless @team
  end

  def team_params
    params.require(:team).permit(:name, :city, :founded)
  end

  def calculate_team_stats(team)
    matches = team.all_matches
    wins = team.wins.count
    draws = team.draws.count
    losses = team.losses.count
    
    {
      matches_played: matches.count,
      wins: wins,
      draws: draws,
      losses: losses,
      points: (wins * 3) + draws,
      goals_for: goals_for(team),
      goals_against: goals_against(team)
    }
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