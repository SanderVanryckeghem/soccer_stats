# ⚽ Soccer Stats Application

A full-stack web application for managing soccer teams, players, matches, and statistics. Built with Ruby on Rails API backend and Angular frontend.

## 🚀 Project Overview

This application allows users to:
- **Manage Teams**: Create, view, edit, and delete soccer teams
- **Player Management**: Add players to teams, view player profiles and statistics
- **Match Tracking**: Schedule matches, record scores, and view match details
- **Statistics Dashboard**: View league tables, team standings, and performance analytics
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Backend (Ruby on Rails API)
- **Framework**: Ruby on Rails 7.0+ (API mode)
- **Database**: MySQL
- **Authentication**: Stateless API with CORS support
- **API Structure**: RESTful JSON API with consistent response format

### Frontend (Angular)
- **Framework**: Angular 20
- **UI Library**: Bootstrap 5
- **Icons**: Font Awesome
- **Architecture**: Standalone components with lazy loading
- **HTTP Client**: Angular HttpClient with centralized API service

## 📁 Project Structure

```
soccer-stats/
├── soccer-stats-backend/          # Rails API Backend
│   ├── app/
│   │   ├── controllers/
│   │   │   └── api/v1/            # API Controllers
│   │   ├── models/                # Data Models
│   │   └── views/                 # Web Views (optional)
│   ├── config/                    # Rails Configuration
│   ├── db/                        # Database Migrations & Seeds
│   └── Gemfile                    # Ruby Dependencies
└── soccer-stats-frontend/         # Angular Frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/         # Angular Components
    │   │   ├── services/          # API Services
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

### Frontend Technologies
- **Angular 20** - Frontend framework
- **TypeScript** - Programming language
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icon library
- **RxJS** - Reactive programming

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

### Backend Requirements
- Ruby 3.0+
- Rails 7.0+
- MySQL 8.0+
- Node.js (for asset compilation)

### Frontend Requirements
- Node.js 18+
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
# Navigate to backend directory
cd soccer-stats-backend

# Install Ruby dependencies
bundle install

# Create and configure database
# Update config/database.yml with your MySQL credentials
rails db:create
rails db:migrate
rails db:seed

# Start the Rails server
rails server
```

The Rails API will be available at `http://localhost:3000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd soccer-stats-frontend

# Install Node.js dependencies
npm install

# Start the Angular development server
ng serve
```

The Angular application will be available at `http://localhost:4200`

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```bash
# Backend (.env)
DATABASE_USERNAME=your_mysql_username
DATABASE_PASSWORD=your_mysql_password
DATABASE_HOST=localhost
DATABASE_PORT=3306
```

### CORS Configuration

The backend is configured to accept requests from `http://localhost:4200`. Update `config/initializers/cors.rb` if deploying to different domains.

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
- **Responsive Design**: Mobile-friendly interface
- **API Integration**: Full backend-frontend communication

### 🚧 Future Enhancements
- User authentication and authorization
- Player transfer system
- Season management
- Advanced statistics and charts
- Export functionality
- Real-time updates with WebSockets
- Image uploads for teams and players
- Match commentary and events

## 👨‍💻 Author

**Your Name**
- GitHub: [@SanderVanryckeghem](https://github.com/SanderVanryckeghem)
- LinkedIn: [Sander Vanryckeghem](https://www.linkedin.com/in/sander-vanryckeghem-b29042b9)

## 🙏 Acknowledgments

- Built with Ruby on Rails and Angular
- UI components from Bootstrap
- Icons from Font Awesome
- Inspired by modern sports management applications

---

**Happy Coding! ⚽**
