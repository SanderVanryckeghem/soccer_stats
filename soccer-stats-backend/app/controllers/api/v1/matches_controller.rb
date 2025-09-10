# app/controllers/api/v1/matches_controller.rb
class Api::V1::MatchesController < Api::V1::BaseController
  before_action :set_match, only: [:show, :update, :destroy]

  def index
    @matches = Match.includes(:home_team, :away_team).recent
    @matches = @matches.by_team(Team.find(params[:team_id])) if params[:team_id].present?
    
    matches_data = @matches.map do |match|
      {
        id: match.id,
        home_team: {
          id: match.home_team.id,
          name: match.home_team.name,
          city: match.home_team.city
        },
        away_team: {
          id: match.away_team.id,
          name: match.away_team.name,
          city: match.away_team.city
        },
        home_score: match.home_score,
        away_score: match.away_score,
        match_date: match.match_date,
        winner_id: match.winner&.id,
        is_draw: match.draw?,
        total_goals: match.total_goals,
        created_at: match.created_at,
        updated_at: match.updated_at
      }
    end
    
    render_success({
      matches: matches_data,
      teams: Team.order(:name).map { |t| { id: t.id, name: t.name } }
    })
  end

  def show
    match_data = {
      id: @match.id,
      home_team: {
        id: @match.home_team.id,
        name: @match.home_team.name,
        city: @match.home_team.city
      },
      away_team: {
        id: @match.away_team.id,
        name: @match.away_team.name,
        city: @match.away_team.city
      },
      home_score: @match.home_score,
      away_score: @match.away_score,
      match_date: @match.match_date,
      winner: @match.winner ? {
        id: @match.winner.id,
        name: @match.winner.name
      } : nil,
      loser: @match.loser ? {
        id: @match.loser.id,
        name: @match.loser.name
      } : nil,
      is_draw: @match.draw?,
      total_goals: @match.total_goals,
      created_at: @match.created_at,
      updated_at: @match.updated_at
    }
    
    render_success(match_data)
  end

  def create
    @match = Match.new(match_params)
    
    if @match.save
      render_success({
        id: @match.id,
        home_team_id: @match.home_team_id,
        away_team_id: @match.away_team_id,
        home_score: @match.home_score,
        away_score: @match.away_score,
        match_date: @match.match_date
      }, 'Match created successfully', :created)
    else
      render_error('Failed to create match', @match.errors.full_messages)
    end
  end

  def update
    if @match.update(match_params)
      render_success({
        id: @match.id,
        home_team_id: @match.home_team_id,
        away_team_id: @match.away_team_id,
        home_score: @match.home_score,
        away_score: @match.away_score,
        match_date: @match.match_date
      }, 'Match updated successfully')
    else
      render_error('Failed to update match', @match.errors.full_messages)
    end
  end

  def destroy
    if @match.destroy
      render_success(nil, 'Match deleted successfully')
    else
      render_error('Failed to delete match')
    end
  end

  private

  def set_match
    @match = Match.find_by(id: params[:id])
    render_not_found('Match not found') unless @match
  end

  def match_params
    params.require(:match).permit(:home_team_id, :away_team_id, :match_date, :home_score, :away_score)
  end
end