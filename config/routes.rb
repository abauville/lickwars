Rails.application.routes.draw do
  devise_for :users
  root to: 'pages#home'
  resources :exercises, only: %i[index new create edit update delete]
  namespace :teacher do
    resources :exercises, only: :index
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
