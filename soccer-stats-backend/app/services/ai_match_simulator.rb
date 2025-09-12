# app/services/ai_match_simulator.rb
class AiMatchSimulator
  def initialize
    @random = Random.new
  end

  def simulate_match(home_team, away_team)
    # Get current league standings to calculate team strength
    home_strength = calculate_team_strength(home_team)
    away_strength = calculate_team_strength(away_team)
    
    # Home advantage bonus
    home_strength *= 1.1
    
    # Calculate win probabilities based on strength difference
    probabilities = calculate_win_probabilities(home_strength, away_strength)
    
    # Simulate the match outcome
    outcome = determine_match_outcome(probabilities)
    
    # Generate realistic score based on team strengths and outcome
    scores = generate_match_score(home_strength, away_strength, outcome)
    
    {
      home_score: scores[:home],
      away_score: scores[:away],
      outcome: outcome, # :home_win, :away_win, :draw
      probabilities: probabilities,
      match_events: generate_match_events(scores, home_team, away_team)
    }
  end

  def simulate_season_matches(teams)
    results = []
    
    # Generate all possible team combinations
    teams.combination(2).each do |home_team, away_team|
      # Simulate both home and away fixtures
      [
        { home: home_team, away: away_team },
        { home: away_team, away: home_team }
      ].each do |fixture|
        simulation = simulate_match(fixture[:home], fixture[:away])
        
        results << {
          home_team_id: fixture[:home].id,
          away_team_id: fixture[:away].id,
          home_score: simulation[:home_score],
          away_score: simulation[:away_score],
          match_date: generate_random_future_date,
          simulation_data: simulation.except(:home_score, :away_score)
        }
      end
    end
    
    results.shuffle # Randomize match order
  end

  private

  def calculate_team_strength(team)
    # Base strength calculation using current league position and stats
    stats = get_team_stats(team)
    
    if stats[:matches_played] == 0
      # New team - use average strength
      return 50.0
    end
    
    # Weight different factors
    points_per_game = stats[:points].to_f / stats[:matches_played]
    goal_difference_per_game = stats[:goal_difference].to_f / stats[:matches_played]
    win_rate = stats[:wins].to_f / stats[:matches_played]
    
    # Calculate strength (0-100 scale)
    strength = (points_per_game * 15) + # Max 45 points (3 * 15)
               (goal_difference_per_game * 5) + # Goal difference impact
               (win_rate * 30) + # Win rate bonus
               @random.rand(10) # Random factor for unpredictability
    
    # Ensure strength stays within realistic bounds
    [[strength, 20].max, 80].min
  end

  def get_team_stats(team)
    matches = team.all_matches
    wins = team.wins.count
    draws = team.draws.count
    losses = team.losses.count
    goals_for = calculate_goals_for(team)
    goals_against = calculate_goals_against(team)
    
    {
      matches_played: matches.count,
      wins: wins,
      draws: draws,
      losses: losses,
      points: (wins * 3) + draws,
      goals_for: goals_for,
      goals_against: goals_against,
      goal_difference: goals_for - goals_against
    }
  end

  def calculate_goals_for(team)
    (team.home_matches.sum(:home_score) || 0) + 
    (team.away_matches.sum(:away_score) || 0)
  end

  def calculate_goals_against(team)
    (team.home_matches.sum(:away_score) || 0) + 
    (team.away_matches.sum(:home_score) || 0)
  end

  def calculate_win_probabilities(home_strength, away_strength)
    # Use logistic regression-like calculation for realistic probabilities
    strength_diff = home_strength - away_strength
    
    # Convert strength difference to probabilities
    if strength_diff > 20
      home_win_prob = 0.7
    elsif strength_diff > 10
      home_win_prob = 0.6
    elsif strength_diff > 0
      home_win_prob = 0.5 + (strength_diff / 40.0)
    elsif strength_diff > -10
      home_win_prob = 0.5 + (strength_diff / 40.0)
    elsif strength_diff > -20
      home_win_prob = 0.3
    else
      home_win_prob = 0.2
    end
    
    # Draw probability is higher for evenly matched teams
    draw_prob = 0.25 + (0.1 * Math.exp(-((strength_diff.abs) / 10.0)))
    
    # Adjust probabilities to sum to 1
    away_win_prob = 1.0 - home_win_prob - draw_prob
    
    {
      home_win: home_win_prob.round(3),
      draw: draw_prob.round(3),
      away_win: away_win_prob.round(3)
    }
  end

  def determine_match_outcome(probabilities)
    rand_value = @random.rand
    
    if rand_value < probabilities[:home_win]
      :home_win
    elsif rand_value < probabilities[:home_win] + probabilities[:draw]
      :draw
    else
      :away_win
    end
  end

  def generate_match_score(home_strength, away_strength, outcome)
    # Base goal expectancy based on team strengths
    home_expected_goals = (home_strength / 30.0) + @random.rand(0.5)
    away_expected_goals = (away_strength / 30.0) + @random.rand(0.5)
    
    # Adjust based on outcome
    case outcome
    when :home_win
      home_goals = generate_goals(home_expected_goals * 1.2)
      away_goals = generate_goals(away_expected_goals * 0.8)
      # Ensure home team wins
      away_goals = [away_goals, home_goals - 1].min if away_goals >= home_goals
    when :away_win
      home_goals = generate_goals(home_expected_goals * 0.8)
      away_goals = generate_goals(away_expected_goals * 1.2)
      # Ensure away team wins
      home_goals = [home_goals, away_goals - 1].min if home_goals >= away_goals
    when :draw
      avg_goals = (home_expected_goals + away_expected_goals) / 2
      goals = generate_goals(avg_goals)
      home_goals = away_goals = goals
    end
    
    # Ensure realistic score ranges (0-6 goals typically)
    {
      home: [[home_goals, 0].max, 6].min,
      away: [[away_goals, 0].max, 6].min
    }
  end

  def generate_goals(expected_goals)
    # Use Poisson distribution for realistic goal generation
    # Simplified approximation
    if expected_goals < 0.5
      @random.rand < expected_goals ? 1 : 0
    elsif expected_goals < 1.5
      case @random.rand
      when 0..0.3 then 0
      when 0.3..0.8 then 1
      else 2
      end
    else
      # For higher expected goals, use normal approximation
      goals = (expected_goals + @random.rand(-1.0..1.0)).round
      [goals, 0].max
    end
  end

  def generate_match_events(scores, home_team, away_team)
    events = []
    total_goals = scores[:home] + scores[:away]
    
    # Generate goal events with random times
    goal_times = (1..total_goals).map { @random.rand(1..90) }.sort
    
    home_goals_scored = 0
    away_goals_scored = 0
    
    goal_times.each do |time|
      if home_goals_scored < scores[:home] && (away_goals_scored >= scores[:away] || @random.rand < 0.5)
        events << {
          type: 'goal',
          team: home_team.name,
          minute: time,
          player: get_random_player_name(home_team)
        }
        home_goals_scored += 1
      elsif away_goals_scored < scores[:away]
        events << {
          type: 'goal',
          team: away_team.name,
          minute: time,
          player: get_random_player_name(away_team)
        }
        away_goals_scored += 1
      end
    end
    
    events
  end

  def get_random_player_name(team)
    # Try to get actual player, fallback to generic name
    if team.players.any?
      team.players.sample.name
    else
      ["Player #{@random.rand(1..23)}", "Striker", "Midfielder", "Defender"].sample
    end
  end

  def generate_random_future_date
    # Generate match date between now and 6 months from now
    start_date = Time.current + 1.week
    end_date = start_date + 6.months
    
    Time.at(@random.rand(start_date.to_f..end_date.to_f)).strftime('%Y-%m-%d %H:%M:%S')
  end
end