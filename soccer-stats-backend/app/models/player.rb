class Player < ApplicationRecord
  belongs_to :team
  
  validates :name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :position, presence: true, inclusion: { in: %w[Goalkeeper Defender Midfielder Forward] }
  validates :age, presence: true, numericality: { greater_than: 16, less_than: 45 }
  
  # Scopes
  scope :by_position, ->(position) { where(position: position) }
  scope :by_age_range, ->(min, max) { where(age: min..max) }
  scope :alphabetical, -> { order(:name) }
end