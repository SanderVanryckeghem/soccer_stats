# config/routes.rb
Rails.application.routes.draw do
  # Keep your existing web routes for now
  root 'dashboard#index'
  
  resources :teams do
    resources :players, except: [:index]
  end
  
  resources :matches
  resources :players, only: [:index, :show]
  get 'stats', to: 'dashboard#stats'
  
  # API Routes - with defaults format json
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      # Dashboard
      get 'dashboard', to: 'dashboard#index'
      get 'dashboard/stats', to: 'dashboard#stats'
      
      # Teams
      resources :teams do
        resources :players, except: [:index, :show]
      end
      
      # Players
      resources :players, only: [:index, :show, :update, :destroy]
      
      # Matches
      resources :matches
      
      # AI Simulation routes - ADD THESE LINES
      resources :ai_matches, only: [] do
        collection do
          post :simulate_match
          post :simulate_season
          get :preview_simulation
          get :team_strength
        end
      end
    end
  end
end