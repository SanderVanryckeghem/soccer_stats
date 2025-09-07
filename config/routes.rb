Rails.application.routes.draw do
  root 'dashboard#index'
  
  resources :teams do
    resources :players, except: [:index]
  end
  
  resources :matches
  resources :players, only: [:index, :show]
  
  # Dashboard routes
  get 'stats', to: 'dashboard#stats'
end