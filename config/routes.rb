Rails.application.routes.draw do
  devise_for :users
  root to: 'pages#home'
  get '/test', to: 'pages#test'
  resources :exercises, only: %i[index new create edit update delete show] do
    resources :reviews, only: %i[index create update]
    resources :musics, only: :create
  end

  # updating a music doesn't require exercise id so not necessary to nest
  resources :musics, only: :update

  namespace :teacher do
    resources :exercises, only: :index
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
