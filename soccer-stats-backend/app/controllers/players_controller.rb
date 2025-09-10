# app/controllers/players_controller.rb
class PlayersController < ApplicationController
  before_action :set_player, only: [:show, :edit, :update, :destroy]
  before_action :set_team, only: [:new, :create, :edit, :update]

  def index
    @players = Player.includes(:team).order(:name)
    @players = @players.by_position(params[:position]) if params[:position].present?
    @positions = Player.distinct.pluck(:position).compact.sort
  end

  def show
  end

  def new
    @player = @team.players.build
  end

  def create
    @player = @team.players.build(player_params)
    
    if @player.save
      redirect_to [@team, @player], notice: 'Player was successfully created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @player.update(player_params)
      redirect_to [@player.team, @player], notice: 'Player was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    team = @player.team
    @player.destroy
    redirect_to team, notice: 'Player was successfully deleted.'
  end

  private

  def set_player
    @player = Player.find(params[:id])
  end

  def set_team
    if params[:team_id]
      @team = Team.find(params[:team_id])
    elsif @player
      @team = @player.team
    end
  end

  def player_params
    params.require(:player).permit(:name, :position, :age)
  end
end