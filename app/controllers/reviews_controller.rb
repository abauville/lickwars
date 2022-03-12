class ReviewsController < ApplicationController
  def create
    @exercise = Exercise.find(params[:exercise_id])
    @review = Review.new(review_params)
    authorize @review

    if @review.save
      redirect_to exercises_path
      flash[:notice] = 'Feedback Submitted'
    else
      redirect_to exercise_path(@exercise)
      flash[:notice] = 'Unable to submit more than one comment!'
    end
  end

  def index
    @exercise = Exercise.find(params[:exercise_id])
    @reviews = MusicsQuery.new(policy_scope(Review), current_user).all(@exercise)
    @review = Review.find_or_initialize_by(user: current_user, exercise: @exercise)
    @num_votes = policy_scope(Review).where(exercise: @exercise).sum(:vote)
    @vote_value = (@review.vote - 1).abs
    @vote_submit_btn_value = @vote_value == 1 ? '+1' : '-1'
    @content_submit_btn_value =
      @review.id && @review.content != '' ? 'Edit my review' : 'Submit a review'
  end

  def update
    exercise = Exercise.find(params[:exercise_id])
    @review = Review.find_by(user: current_user, exercise: exercise)
    @review.update(review_params)
    authorize @review
    redirect_to exercises_path
  end

  private

  def review_params
    params[:review][:exercise_id] = params[:exercise_id]
    params[:review][:user_id] = current_user.id

    params.require(:review).permit(:user_id, :exercise_id, :vote, :content)
  end
end
