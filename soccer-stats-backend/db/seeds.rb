puts "Creating teams..."

teams_data = [
  { name: "Barcelona", city: "Barcelona", founded: 1899 },
  { name: "Real Madrid", city: "Madrid", founded: 1902 },
  { name: "Manchester United", city: "Manchester", founded: 1878 },
  { name: "Liverpool", city: "Liverpool", founded: 1892 },
  { name: "Bayern Munich", city: "Munich", founded: 1900 },
  { name: "Juventus", city: "Turin", founded: 1897 }
]

teams = teams_data.map { |team_data| Team.find_or_create_by(name: team_data[:name]) do |team|
  team.city = team_data[:city]
  team.founded = team_data[:founded]
end }

puts "Created #{teams.count} teams"

puts "Creating players..."

players_data = [
  # Barcelona players
  { name: "Lionel Messi", position: "Forward", age: 36, team: "Barcelona" },
  { name: "Gerard Piqué", position: "Defender", age: 36, team: "Barcelona" },
  { name: "Sergio Busquets", position: "Midfielder", age: 35, team: "Barcelona" },
  { name: "Marc-André ter Stegen", position: "Goalkeeper", age: 31, team: "Barcelona" },
  
  # Real Madrid players
  { name: "Karim Benzema", position: "Forward", age: 36, team: "Real Madrid" },
  { name: "Luka Modrić", position: "Midfielder", age: 38, team: "Real Madrid" },
  { name: "Sergio Ramos", position: "Defender", age: 37, team: "Real Madrid" },
  { name: "Thibaut Courtois", position: "Goalkeeper", age: 31, team: "Real Madrid" },
]

players_data.each do |player_data|
  team = Team.find_by(name: player_data[:team])
  Player.find_or_create_by(name: player_data[:name], team: team) do |player|
    player.position = player_data[:position]
    player.age = player_data[:age]
  end
end

puts "Created #{Player.count} players"

puts "Creating matches..."

# Create some sample matches
barcelona = Team.find_by(name: "Barcelona")
real_madrid = Team.find_by(name: "Real Madrid")
manchester_united = Team.find_by(name: "Manchester United")
liverpool = Team.find_by(name: "Liverpool")

matches_data = [
  { home_team: barcelona, away_team: real_madrid, match_date: 1.month.ago, home_score: 2, away_score: 1 },
  { home_team: manchester_united, away_team: liverpool, match_date: 2.weeks.ago, home_score: 1, away_score: 3 },
  { home_team: real_madrid, away_team: manchester_united, match_date: 1.week.ago, home_score: 0, away_score: 0 },
]

matches_data.each do |match_data|
  Match.find_or_create_by(
    home_team: match_data[:home_team],
    away_team: match_data[:away_team],
    match_date: match_data[:match_date]
  ) do |match|
    match.home_score = match_data[:home_score]
    match.away_score = match_data[:away_score]
  end
end

puts "Created #{Match.count} matches"
puts "Seed data complete!"