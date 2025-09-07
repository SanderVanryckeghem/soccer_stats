# app/controllers/teams_controller.rb
class TeamsController < ApplicationController
  before_action :set_team, only: [:show, :edit, :update, :destroy]

  def index
    @teams = Team.includes(:players).order(:name)
  end

  def show
    @players = @team.players.alphabetical
    @recent_matches = @team.all_matches.recent.includes(:home_team, :away_team).limit(10)
    @team_stats = calculate_team_stats(@team)
  end

  def new
    @team = Team.new
  end

  def create
    @team = Team.new(team_params)
    
    if @team.save
      redirect_to @team, notice: 'Team was successfully created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @team.update(team_params)
      redirect_to @team, notice: 'Team was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @team.destroy
    redirect_to teams_url, notice: 'Team was successfully deleted.'
  end

  private

  def set_team
    @team = Team.find(params[:id])
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