class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:home]

  def home
  end

  def test
    redirect_to exercise_reviews_path(Exercise.first)
  end
end
