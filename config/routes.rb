Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'application#home'
  resources :images
  get 'tags/:tag', to: 'application#home', as: :tag
end
