class ExercisesController < ApplicationController
  before_action :set_exercise, only: %i[edit update show destroy]

  def index
    if params[:status].blank? && params[:difficulty].blank?
      @exercises = ExercisesQuery.new(policy_scope(Exercise), current_user).all
    else
      handle_queries
      policy_scope(Exercise)
    end
    @daily_stat = Music.daily_completion_stat(current_user)
    @weekly_stat = Music.weekly_completion_stat(current_user)
    @exercise_pie = Exercise.user_exercise_pie(current_user)
  end

  def new
    @exercise = current_user.exercises.new
    @exercise.musics.build
    @music = Music.new(
      notes: JSON[[[['r', 'A4'], 1], [['r', 'A4'], 1], [['r', 'A4'], 1], [['r', 'A4'], 1]]],
      chords: "[]",
      key_signature: 0,
      exercise: @exercise,
      user: current_user
    )
    authorize @exercise
  end

  def create
    @exercise = current_user.exercises.new(exercise_params)
    authorize @exercise
    if @exercise.save
      redirect_to teacher_exercises_path
    else
      render :new
    end
  end

  def edit
    @music = @exercise.musics.where(user: current_user, is_question: true).first
  end

  def show
    authorize @exercise
    @question_music = @exercise.question_music
    @attempt_music =
      current_user.musics.find_or_initialize_by(
        exercise: @exercise,
        is_question: false
      )
    @review =
      Review.find_or_initialize_by(user: current_user, exercise: @exercise)
    @action =
      if @attempt_music.id
        { url: music_path(@attempt_music), method: :patch }
      else
        @attempt_music.init_notes_with_rests(@question_music.num_measures)
        { url: exercise_musics_path(@exercise), method: :post }
      end
  end

  def update
    @exercise.update(exercise_params)
    if @exercise.save
      redirect_to teacher_exercises_path
    else
      render :edit
    end
  end

  def destroy
    @exercise.destroy
    redirect_to exercises_path
  end

  private

  def handle_queries
    @query = true
    if !params[:status].blank? && !params[:difficulty].blank?
      @results = MusicsQuery.new(current_user.musics, current_user)
                            .filter_by_status_and_difficulty(params[:status].to_i, params[:difficulty].to_i)
    elsif !params[:status].blank? && params[:difficulty].blank?
      @results = MusicsQuery.new(current_user.musics, current_user).filter_by_status(params[:status].to_i)
    else
      @exercises = ExercisesQuery.new(policy_scope(Exercise), current_user)
                                 .filter_by_difficulty(params[:difficulty].to_i)
    end
  end

  def exercise_params
    params
      .require(:exercise)
      .permit(:name, :description, :chord_progression, :user_id, :difficulty,
              musics_attributes: %i[id bpm key_signature mode notes chords is_question user_id exercise_id])
  end

  def set_exercise
    @exercise = Exercise.find(params[:id])
    authorize @exercise
  end
end
