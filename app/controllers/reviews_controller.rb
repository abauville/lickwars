class ReviewsController < ApplicationController
  def create
    exercise = Exercise.find(params[:exercise_id])
    @review = Review.new(user: current_user, exercise: exercise)

    @review.vote = params[:review][:vote] if params[:review][:vote]
    @review.content = params[:review][:content] if params[:review][:content]
    authorize @review

    @review.save
    redirect_to exercise_reviews_path(exercise)
  end

  def index
    @exercise = Exercise.find(params[:exercise_id])
    @reviews = policy_scope(Review).where(exercise: @exercise)
                                   .where.not(content: nil)
                                   .where.not(content: "")
                                   .order(created_at: :desc)
    @review = Review.find_or_initialize_by(user: current_user, exercise: @exercise)
    @num_votes = policy_scope(Review).where(exercise: @exercise).sum(:vote)
    @vote_value = (@review.vote - 1).abs
    @vote_submit_btn_value = @vote_value == 1 ? '+1' : '-1'
    @content_submit_btn_value = @review.id && @review.content != "" ? 'Edit my review' : 'Submit a review'
  end

  def update
    exercise = Exercise.find(params[:exercise_id])
    @review = Review.find_by(user: current_user, exercise: exercise)

    @review.vote = params[:review][:vote] if params[:review][:vote]
    @review.content = params[:review][:content] if params[:review][:content]
    authorize @review

    @review.save
    redirect_to exercise_reviews_path(exercise)
  end
end
