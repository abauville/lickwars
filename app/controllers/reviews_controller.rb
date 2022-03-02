class ReviewsController < ApplicationController
  def create
    exercise = Exercise.find(params[:exercise_id])
    @review = Review.find_or_initialize_by(user: current_user, exercise_id: exercise)

    @review.content(vote: params[:review][:vote]) if params[:review][:vote]
    @review.content(vote: params[:review][:content]) if params[:review][:content]
    @review.save
    redirect_to exercise_reviews_path(exercise)
  end

  def index
    exercise = Exercise.find(params[:exercise_id])
    @reviews = policy_scope(Review).where(exercise: exercise)
  end

  def show

  end
end
