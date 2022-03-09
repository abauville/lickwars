class ExercisesQuery
  def initialize(exercises, user)
    @exercises = exercises.includes(:musics)
    @user = user
  end

  def all
    @exercises.order(:difficulty)
              .reject {|ex| ex.attempt_music(@user)}
              .group_by { |ex| ex.difficulty.ceil }
  end

  def filter_by_difficulty(difficulty)
    @exercises.search_by_difficulty(difficulty)
              .order(:difficulty)
              .reject { |ex| ex.attempt_music(@user) }
              .group_by { |ex| ex.difficulty.ceil }
  end
end
