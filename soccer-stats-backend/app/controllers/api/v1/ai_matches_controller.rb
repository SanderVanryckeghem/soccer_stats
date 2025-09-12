# app/controllers/api/v1/ai_matches_controller.rb
class Api::V1::AiMatchesController < Api::V1::BaseController
  before_action :set_teams, only: [:simulate_match, :simulate_season]

  def simulate_match
    home_team = Team.find(params[:home_team_id])
    away_team = Team.find(params[:away_team_id])
    
    if home_team == away_team
      return render_error('Teams must be different for a match')
    end
    
    simulator = AiMatchSimulator.new
    simulation = simulator.simulate_match(home_team, away_team)
    
    # Optionally save the match if requested
    if params[:save_match] == 'true'
      match = Match.create!(
        home_team: home_team,
        away_team: away_team,
        home_score: simulation[:home_score],
        away_score: simulation[:away_score],
        match_date: params[:match_date] || 1.week.from_now
      )
      
      render_success({
        simulation: simulation,
        match: format_match_data(match),
        saved: true
      })
    else
      render_success({
        simulation: simulation,
        saved: false
      })
    end
  rescue ActiveRecord::RecordNotFound => e
    render_error("Team not found: #{e.message}")
  rescue StandardError => e
    render_error("Simulation failed: #{e.message}")
  end

  def simulate_season
    if @teams.count < 2
      return render_error('Need at least 2 teams to simulate matches')
    end
    
    simulator = AiMatchSimulator.new
    simulated_matches = simulator.simulate_season_matches(@teams)
    
    # Save matches if requested
    if params[:save_matches] == 'true'
      created_matches = []
      
      simulated_matches.each do |match_data|
        match = Match.create!(match_data.except(:simulation_data))
        created_matches << format_match_data(match)
      end
      
      render_success({
        simulated_matches: simulated_matches,
        created_matches: created_matches,
        total_matches: created_matches.count,
        saved: true
      })
    else
      render_success({
        simulated_matches: simulated_matches,
        total_matches: simulated_matches.count,
        saved: false
      })
    end
  rescue StandardError => e
    render_error("Season simulation failed: #{e.message}")
  end

  def preview_simulation
    home_team = Team.find(params[:home_team_id])
    away_team = Team.find(params[:away_team_id])
    
    simulator = AiMatchSimulator.new
    
    # Run multiple simulations to show probability distribution
    simulations = 10.times.map do
      simulator.simulate_match(home_team, away_team)
    end
    
    # Calculate statistics
    outcomes = simulations.group_by { |sim| sim[:outcome] }
    
    stats = {
      home_wins: outcomes[:home_win]&.count || 0,
      draws: outcomes[:draw]&.count || 0,
      away_wins: outcomes[:away_win]&.count || 0,
      average_home_score: simulations.sum { |sim| sim[:home_score] } / 10.0,
      average_away_score: simulations.sum { |sim| sim[:away_score] } / 10.0,
      sample_probabilities: simulations.first[:probabilities]
    }
    
    render_success({
      teams: {
        home: { id: home_team.id, name: home_team.name },
        away: { id: away_team.id, name: away_team.name }
      },
      simulation_stats: stats,
      sample_simulations: simulations.first(3)
    })
  rescue ActiveRecord::RecordNotFound => e
    render_error("Team not found: #{e.message}")
  rescue StandardError => e
    render_error("Preview failed: #{e.message}")
  end

  def team_strength
    team = Team.find(params[:team_id])
    simulator = AiMatchSimulator.new
    strength = simulator.send(:calculate_team_strength, team)
    stats = simulator.send(:get_team_stats, team)
    
    render_success({
      team: { id: team.id, name: team.name },
      strength: strength.round(2),
      stats: stats,
      strength_rating: case strength
                      when 0..30 then 'Weak'
                      when 30..45 then 'Below Average'
                      when 45..55 then 'Average'
                      when 55..70 then 'Above Average'
                      when 70..85 then 'Strong'
                      else 'Elite'
                      end
    })
  rescue ActiveRecord::RecordNotFound => e
    render_error("Team not found: #{e.message}")
  rescue StandardError => e
    render_error("Team strength calculation failed: #{e.message}")
  end

  private

  def set_teams
    @teams = Team.all
    if @teams.empty?
      render_error('No teams available for simulation')
    end
  end

  def format_match_data(match)
    {
      id: match.id,
      home_team: { id: match.home_team.id, name: match.home_team.name },
      away_team: { id: match.away_team.id, name: match.away_team.name },
      home_score: match.home_score,
      away_score: match.away_score,
      match_date: match.match_date,
      winner_id: match.winner&.id
    }
  end
end