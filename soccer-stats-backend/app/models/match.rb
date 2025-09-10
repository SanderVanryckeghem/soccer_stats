class Match < ApplicationRecord
  belongs_to :home_team, class_name: 'Team'
  belongs_to :away_team, class_name: 'Team'
  
  validates :match_date, presence: true
  validates :home_score, :away_score, presence: true, numericality: { greater_than_or_equal_to: 0, less_than: 50 }
  
  validate :different_teams
  validate :match_date_not_in_future
  
  # Scopes
  scope :recent, -> { order(match_date: :desc) }
  scope :by_team, ->(team) { where('home_team_id = ? OR away_team_id = ?', team.id, team.id) }
  scope :completed, -> { where.not(home_score: nil, away_score: nil) }
  
  # Methods
  def winner
    return nil if home_score == away_score
    home_score > away_score ? home_team : away_team
  end
  
  def loser
    return nil if home_score == away_score
    home_score < away_score ? home_team : away_team
  end
  
  def draw?
    home_score == away_score
  end
  
  def total_goals
    home_score + away_score
  end
  
  private
  
  def different_teams
    errors.add(:away_team, "can't be the same as home team") if home_team_id == away_team_id
  end
  
  def match_date_not_in_future
    errors.add(:match_date, "can't be in the future") if match_date && match_date > Time.current
  end
end