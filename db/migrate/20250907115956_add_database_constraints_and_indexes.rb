class AddDatabaseConstraintsAndIndexes < ActiveRecord::Migration[8.0]
  def change
    # Add indexes for foreign keys
    add_index :players, :team_id
    add_index :matches, :home_team_id
    add_index :matches, :away_team_id
    add_index :matches, :match_date
    
    # Add unique constraints where appropriate
    add_index :teams, :name, unique: true
    
    # Add composite indexes for common queries
    add_index :matches, [:home_team_id, :match_date]
    add_index :matches, [:away_team_id, :match_date]
    
    # Add database-level constraints
    change_column_null :teams, :name, false
    change_column_null :players, :name, false
    change_column_null :players, :position, false
    change_column_null :matches, :match_date, false
    change_column_null :matches, :home_score, false
    change_column_null :matches, :away_score, false
  end
end
