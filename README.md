# ⚽ Soccer Stats Application

A full-stack web application for managing soccer teams, players, matches, and statistics with **AI-powered match simulation**. Built with Ruby on Rails API backend and Angular frontend.

## 🚀 Project Overview

This application allows users to:
- **Manage Teams**: Create, view, edit, and delete soccer teams
- **Player Management**: Add players to teams, view player profiles and statistics
- **Match Tracking**: Schedule matches, record scores, and view match details
- **Statistics Dashboard**: View league tables, team standings, and performance analytics
- **🤖 AI Match Simulation**: Generate realistic matches based on team performance and league standings
- **Season Generation**: Automatically create complete fixture lists with AI-generated results
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🤖 AI Simulation Features

### **Intelligent Match Prediction**
- **League table-based strength calculation**: Teams higher in standings have better win chances
- **Home advantage factor**: 10% bonus for home teams
- **Realistic scoring patterns**: Uses team strength to generate believable match scores
- **Dynamic probability analysis**: Shows win/draw/loss percentages before simulation

### **Match Simulation Modes**
- **Single Match Simulation**: Preview and simulate individual matches
- **Season Generation**: Create complete fixture lists for all teams
- **Batch Processing**: Generate multiple matches at once
- **Save Options**: Preview results or save directly to database

### **Advanced Analytics**
- **Team Strength Analysis**: Calculate team performance ratings (0-100 scale)
- **Statistical Predictions**: Run multiple simulations for probability distribution
- **Match Events**: Generate goal times and scorer information
- **Performance Tracking**: Monitor how AI predictions compare to actual results

## 🏗️ Architecture

### Backend (Ruby on Rails API)
- **Framework**: Ruby on Rails 7.0+ (API mode)
- **Database**: MySQL
- **Authentication**: Stateless API with CORS support
- **API Structure**: RESTful JSON API with consistent response format
- **AI Engine**: Custom match simulation service with advanced algorithms

### Frontend (Angular)
- **Framework**: Angular 20
- **UI Library**: Bootstrap 5
- **Icons**: Font Awesome
- **Architecture**: Standalone components with lazy loading
- **HTTP Client**: Angular HttpClient with centralized API service
- **AI Interface**: Interactive simulation dashboard with real-time results

## 📁 Project Structure

```
soccer-stats/
├── soccer-stats-backend/          # Rails API Backend
│   ├── app/
│   │   ├── controllers/
│   │   │   └── api/v1/            # API Controllers
│   │   │       ├── teams_controller.rb
│   │   │       ├── matches_controller.rb
│   │   │       └── ai_matches_controller.rb  # 🆕 AI Simulation API
│   │   ├── models/                # Data Models
│   │   │   ├── team.rb
│   │   │   ├── match.rb
│   │   │   └── player.rb
│   │   ├── services/              # Business Logic
│   │   │   └── ai_match_simulator.rb  # 🆕 AI Simulation Engine
│   │   └── views/                 # Web Views (optional)
│   ├── config/                    # Rails Configuration
│   ├── db/                        # Database Migrations & Seeds
│   └── Gemfile                    # Ruby Dependencies
└── soccer-stats-frontend/         # Angular Frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/         # Angular Components
    │   │   │   ├── teams/
    │   │   │   ├── matches/
    │   │   │   ├── players/
    │   │   │   └── ai-simulation/  # 🆕 AI Simulation UI
    │   │   ├── services/          # API Services
    │   │   │   ├── team.service.ts
    │   │   │   ├── match.service.ts
    │   │   │   └── ai-simulation.service.ts  # 🆕 AI API Integration
    │   │   ├── models/            # TypeScript Interfaces
    │   │   └── app.routes.ts      # Routing Configuration
    │   └── styles.css             # Global Styles
    └── package.json               # Node Dependencies
```

## 🛠️ Technology Stack

### Backend Technologies
- **Ruby on Rails** - Web application framework
- **MySQL** - Primary database
- **Rack-CORS** - Cross-origin resource sharing
- **Puma** - Web server
- **Custom AI Engine** - Match simulation algorithms

### Frontend Technologies
- **Angular 20** - Frontend framework
- **TypeScript** - Programming language
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icon library
- **RxJS** - Reactive programming
- **Angular Animations** - Smooth UI transitions

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

### Backend Requirements
- Ruby
- Rails
- MySQL
- Node.js (for asset compilation)

### Frontend Requirements
- Angular
- npm or yarn
- Angular CLI

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/soccer-stats.git
cd soccer-stats
```

### 2. Backend Setup
```bash
cd soccer-stats-backend

# Install dependencies
bundle install

# Setup database
rails db:create
rails db:migrate
rails db:seed

# Start the Rails server
rails server
```

### 3. Frontend Setup
```bash
cd soccer-stats-frontend

# Install dependencies
npm install

# Start the Angular development server
ng serve
```

### 4. Access the Application
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000/api/v1
- **AI Simulation**: http://localhost:4200/ai-simulation

## 📊 API Endpoints

### Teams
- `GET /api/v1/teams` - List all teams
- `GET /api/v1/teams/:id` - Get team details
- `POST /api/v1/teams` - Create new team
- `PUT /api/v1/teams/:id` - Update team
- `DELETE /api/v1/teams/:id` - Delete team

### Players
- `GET /api/v1/players` - List all players
- `GET /api/v1/players/:id` - Get player details
- `POST /api/v1/teams/:team_id/players` - Add player to team
- `PUT /api/v1/players/:id` - Update player
- `DELETE /api/v1/players/:id` - Delete player

### Matches
- `GET /api/v1/matches` - List all matches
- `GET /api/v1/matches/:id` - Get match details
- `POST /api/v1/matches` - Create new match
- `PUT /api/v1/matches/:id` - Update match
- `DELETE /api/v1/matches/:id` - Delete match

### 🤖 AI Simulation (NEW)
- `POST /api/v1/ai_matches/simulate_match` - Simulate single match
- `POST /api/v1/ai_matches/simulate_season` - Generate full season
- `GET /api/v1/ai_matches/preview_simulation` - Preview match probabilities
- `GET /api/v1/ai_matches/team_strength` - Get team strength analysis

### Dashboard & Statistics
- `GET /api/v1/dashboard` - Dashboard data
- `GET /api/v1/dashboard/stats` - League statistics

## 🎯 Features

### ✅ Completed Features
- **Team Management**: CRUD operations for teams
- **Player Management**: Add/edit players with team associations
- **Match Tracking**: Schedule and record match results
- **Dashboard**: Overview with key statistics
- **League Table**: Standings with points, goals, and statistics
- **🤖 AI Match Simulation**: Generate realistic matches based on team performance
- **🏆 Season Generation**: Create complete fixture lists automatically
- **📊 Team Strength Analysis**: Calculate and compare team performance ratings
- **🎲 Probability Prediction**: Multi-run simulation analysis
- **⚽ Match Events**: Generate goal times and scorer information
- **Responsive Design**: Mobile-friendly interface
- **API Integration**: Full backend-frontend communication

### 🚧 Future Enhancements
- **Machine Learning Integration**: Train AI on historical match data
- **Player Performance Impact**: Include individual player stats in AI calculations
- **Weather & Venue Factors**: Add environmental conditions to simulations
- **Injury System**: Simulate player injuries and squad rotation
- **Transfer Market**: AI-driven player valuation and transfer suggestions
- **Real-time Match Commentary**: Generate live match event descriptions
- **Advanced Statistics**: xG (Expected Goals), possession, shot accuracy
- **Multi-season Campaigns**: Track team development over multiple seasons
- **Tournament Mode**: Simulate cup competitions and playoffs
- **User Authentication**: Personal leagues and team management
- **Export Functionality**: PDF reports and CSV data export
- **WebSocket Integration**: Real-time match updates
- **Mobile App**: React Native companion app

## 🤖 AI Simulation Algorithm

### Team Strength Calculation
The AI uses multiple factors to determine team strength (0-100 scale):

```
Team Strength = (Points per Game × 15) + 
                (Goal Difference per Game × 5) + 
                (Win Rate × 30) + 
                Random Factor (0-10)
```

### Match Outcome Prediction
- **Strength Differential Analysis**: Compares team ratings
- **Home Advantage**: 10% bonus for home team
- **Probability Distribution**: Calculates win/draw/loss percentages
- **Realistic Scoring**: Uses Poisson-like distribution for goal generation

### Season Generation
- **Complete Fixture List**: All possible team combinations
- **Home & Away Matches**: Each team plays every other team twice
- **Randomized Schedule**: Matches distributed across realistic timeframe
- **Batch Processing**: Efficient bulk match creation

## 🧪 Testing the AI System

### Quick Start Guide
1. **Add Teams**: Create at least 4-6 teams with different founding years
2. **Play Some Matches**: Record 5-10 manual match results to establish rankings
3. **Access AI Simulation**: Navigate to `/ai-simulation`
4. **Test Single Match**: Select two teams and preview probabilities
5. **Generate Season**: Create complete fixture list with AI results

### Expected Behaviors
- **Better teams should win more often** (but not always)
- **Home advantage should be noticeable** in win percentages  
- **Close matches should have higher draw probability**
- **Score lines should be realistic** (0-0 to 5-4 range typically)

## 📈 Performance & Scalability

### Database Optimization
- **Indexed Foreign Keys**: Fast team and match lookups
- **Efficient Queries**: Minimize N+1 problems with includes
- **Bulk Operations**: Batch insert for season generation

### AI Performance
- **Fast Calculations**: Sub-second response times for single matches
- **Scalable Season Generation**: Handle 20+ team leagues efficiently  
- **Memory Efficient**: Minimal memory footprint for simulations

## 🛡️ Configuration

### Environment Variables
```bash
# Backend (.env)
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_HOST=localhost
DATABASE_PORT=3306

# Frontend (environment.ts)
API_BASE_URL=http://localhost:3000/api/v1
```

### CORS Configuration
Update `config/initializers/cors.rb` if deploying to different domains:
```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:4200', 'your-production-domain.com'
    resource '*', headers: :any, methods: [:get, :post, :put, :delete, :options]
  end
end
```

## 🐛 Troubleshooting

### Common Issues

**AI Simulation 422 Error**
- Ensure all AI routes are added to `config/routes.rb`
- Verify `AiMatchesController` and `AiMatchSimulator` files exist
- Check Rails server logs for detailed error messages

**Teams Not Loading in Simulation**
- Ensure you have at least 2 teams in the database
- Run `rails db:seed` to create sample data
- Check API endpoints are returning data correctly

**Frontend Routing Issues**
- Verify AI simulation route is added to `app.routes.ts`
- Ensure component files exist in correct directories
- Check browser console for component loading errors

### Development Tips
- Use browser developer tools to monitor API requests
- Check Rails logs for backend errors: `tail -f log/development.log`
- Enable Angular development mode for detailed error messages

## 👨‍💻 Author

**Sander Vanryckeghem**
- GitHub: [@SanderVanryckeghem](https://github.com/SanderVanryckeghem)
- LinkedIn: [Sander Vanryckeghem](https://www.linkedin.com/in/sander-vanryckeghem-b29042b9)

## 🙏 Acknowledgments

- Built with Ruby on Rails and Angular
- UI components from Bootstrap
- Icons from Font Awesome
- AI algorithms inspired by football analytics research
- Special thanks to the open-source community for excellent documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Areas for Contribution
- **AI Algorithm Improvements**: Enhance match prediction accuracy
- **UI/UX Enhancements**: Improve user interface and experience
- **Performance Optimization**: Database and API performance improvements
- **Testing**: Add comprehensive test coverage
- **Documentation**: Improve code documentation and guides

---

**Happy Coding! ⚽ 🤖**

*Built with ❤️ for football fans and data enthusiasts*
