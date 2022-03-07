class ExercisesController < ApplicationController
  before_action :set_exercise, only: %i[edit update show destroy]
  def index
    # will return only exercises where the user has had an attempt
    # @user_exercises = Music.user_exercises_with_attempt(current_user)
    @exercises = policy_scope(Exercise).includes(:musics)
  end

  def new
    @exercise = current_user.exercises.new
    authorize @exercise
  end

  def create
    @exercise = current_user.exercises.new(exercise_params)
    authorize @exercise

    if @exercise.save
      redirect_to exercises_path
    else
      render :new
    end
  end

  def edit
  end

  def show
    authorize @exercise
    @question_music = @exercise.question_music
    @attempt_music = current_user.musics.find_or_initialize_by(exercise: @exercise, is_question: false)
    @review = Review.find_or_initialize_by(user: current_user, exercise: @exercise)
    @action = @attempt_music.id ? { path: music_path(@attempt_music), method: :patch } : { path: exercise_musics_path(@exercise), method: :post }
  end

  def update
    @exercise.update(exercise_params)

    if @exercise.save
      redirect_to exercises_path
    else
      render :edit
    end
  end

  def destroy
    @exercise.destroy
    redirect_to exercises_path
  end

  def exercise_params
    params.require(:exercise).permit(:name, :description, :chord_progression, :user_id, :difficulty)
  end

  def set_exercise
    @exercise = Exercise.find(params[:id])
    authorize @exercise
  end
end
