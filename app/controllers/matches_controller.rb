# app/controllers/matches_controller.rb
class MatchesController < ApplicationController
  before_action :set_match, only: [:show, :edit, :update, :destroy]

  def index
    @matches = Match.includes(:home_team, :away_team).recent
    @matches = @matches.by_team(Team.find(params[:team_id])) if params[:team_id].present?
    @teams = Team.by_name
  end

  def show
  end

  def new
    @match = Match.new
    @teams = Team.order(:name)
  end

  def create
    @match = Match.new(match_params)
    
    if @match.save
      redirect_to @match, notice: 'Match was successfully created.'
    else
      @teams = Team.order(:name)
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @teams = Team.order(:name)
  end

  def update
    if @match.update(match_params)
      redirect_to @match, notice: 'Match was successfully updated.'
    else
      @teams = Team.order(:name)
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @match.destroy
    redirect_to matches_url, notice: 'Match was successfully deleted.'
  end

  private

  def set_match
    @match = Match.find(params[:id])
  end

  def match_params
    params.require(:match).permit(:home_team_id, :away_team_id, :match_date, :home_score, :away_score)
  end
end