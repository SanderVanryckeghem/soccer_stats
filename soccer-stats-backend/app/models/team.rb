class Team < ApplicationRecord
  has_many :players, dependent: :destroy
  has_many :home_matches, class_name: 'Match', foreign_key: 'home_team_id'
  has_many :away_matches, class_name: 'Match', foreign_key: 'away_team_id'
  
  validates :name, presence: true, uniqueness: { case_sensitive: false }
  validates :city, presence: true
  validates :founded, numericality: { greater_than: 1800, less_than_or_equal_to: Date.current.year }
  
  # Add this scope
  scope :by_name, -> { order(:name) }
  scope :founded_after, ->(year) { where('founded > ?', year) }
  
  # Methods for statistics
  def all_matches
    Match.where('home_team_id = ? OR away_team_id = ?', id, id)
  end
  
  def wins
    Match.where(
      '(home_team_id = ? AND home_score > away_score) OR (away_team_id = ? AND away_score > home_score)',
      id, id
    )
  end
  
  def losses
    Match.where(
      '(home_team_id = ? AND home_score < away_score) OR (away_team_id = ? AND away_score < home_score)',
      id, id
    )
  end
  
  def draws
    Match.where(
      '(home_team_id = ? OR away_team_id = ?) AND home_score = away_score',
      id, id
    )
  end
end