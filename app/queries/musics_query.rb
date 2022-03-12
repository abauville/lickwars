class MusicsQuery
  def initialize(musics, user)
    @musics = musics
    @user = user
  end

  def filter_by_status(status)
    @musics.user_exercises_with_attempt_search(status, @user)
           .group_by { |ex| ex.first.difficulty.ceil }
           .sort
  end

  def filter_by_status_and_difficulty(status, difficulty)
    @musics.user_exercises_with_attempt_search(status, @user)
           .select { |k| k.difficulty.ceil == difficulty }
           .group_by { |ex| ex.first.difficulty.ceil }
  end
end
