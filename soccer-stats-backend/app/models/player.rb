class Player < ApplicationRecord
  belongs_to :team

  validates :name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :position, presence: true, inclusion: { in: %w[Goalkeeper Defender Midfielder Forward] }
  validates :age, presence: true, numericality: { greater_than: 16, less_than: 45 }
  validates :goals, presence: true, numericality: { greater_than_or_equal_to: 0, only_integer: true }

  # Scopes
  scope :by_position, ->(position) { where(position: position) }
  scope :by_age_range, ->(min, max) { where(age: min..max) }
  scope :alphabetical, -> { order(:name) }
  scope :top_scorers, ->(limit = 10) { order(goals: :desc).limit(limit) }
end