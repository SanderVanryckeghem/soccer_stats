# app/controllers/api/v1/players_controller.rb
class Api::V1::PlayersController < Api::V1::BaseController
  before_action :set_team, only: [:create, :update]
  before_action :set_player, only: [:show, :update, :destroy]

  def index
    @players = Player.includes(:team).order(:name)
    @players = @players.where(position: params[:position]) if params[:position].present?
    
    players_data = @players.map do |player|
      {
        id: player.id,
        name: player.name,
        position: player.position,
        age: player.age,
        team: {
          id: player.team.id,
          name: player.team.name,
          city: player.team.city
        },
        created_at: player.created_at,
        updated_at: player.updated_at
      }
    end
    
    render_success({
      players: players_data,
      positions: Player.distinct.pluck(:position).compact.sort
    })
  end

  def show
    player_data = {
      id: @player.id,
      name: @player.name,
      position: @player.position,
      age: @player.age,
      team: {
        id: @player.team.id,
        name: @player.team.name,
        city: @player.team.city,
        founded: @player.team.founded
      },
      teammates: @player.team.players.where.not(id: @player.id).order(:name).map do |teammate|
        {
          id: teammate.id,
          name: teammate.name,
          position: teammate.position,
          age: teammate.age
        }
      end,
      position_teammates: @player.team.players
        .where(position: @player.position)
        .where.not(id: @player.id)
        .order(:name)
        .map do |teammate|
          {
            id: teammate.id,
            name: teammate.name,
            age: teammate.age
          }
        end,
      created_at: @player.created_at,
      updated_at: @player.updated_at
    }
    
    render_success(player_data)
  end

  def create
    @player = @team.players.build(player_params)
    
    if @player.save
      render_success({
        id: @player.id,
        name: @player.name,
        position: @player.position,
        age: @player.age,
        team_id: @player.team_id
      }, 'Player created successfully', :created)
    else
      render_error('Failed to create player', @player.errors.full_messages)
    end
  end

  def update
    if @player.update(player_params)
      render_success({
        id: @player.id,
        name: @player.name,
        position: @player.position,
        age: @player.age,
        team_id: @player.team_id
      }, 'Player updated successfully')
    else
      render_error('Failed to update player', @player.errors.full_messages)
    end
  end

  def destroy
    team_id = @player.team_id
    if @player.destroy
      render_success({ team_id: team_id }, 'Player deleted successfully')
    else
      render_error('Failed to delete player')
    end
  end

  private

  def set_team
    if params[:team_id]
      @team = Team.find_by(id: params[:team_id])
      render_not_found('Team not found') unless @team
    elsif @player
      @team = @player.team
    end
  end

  def set_player
    @player = Player.find_by(id: params[:id])
    render_not_found('Player not found') unless @player
  end

  def player_params
    params.require(:player).permit(:name, :position, :age)
  end
end