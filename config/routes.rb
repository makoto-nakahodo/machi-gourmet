Rails.application.routes.draw do
  root to: 'toppages#index'
  
  get 'login', to: 'sessions#new'
  post 'login', to: 'sessions#create'
  delete 'logout', to: 'sessions#destroy'
  
  get 'searches', to: 'searches#index'
  
  get 'signup', to: 'users#new'
  
  resources :users, only: [:new, :create, :destroy]
  resources :shops, only: [:index, :create, :destroy]
end
