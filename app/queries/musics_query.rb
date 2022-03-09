class MusicsQuery
  def initialize(musics)
    @musics = musics
  end

  def filter_by_status(status)
    @musics.user_exercises_with_attempt_search(status)
           .group_by { |ex| ex.first.difficulty.ceil }
           .sort
  end

  def filter_by_status_and_difficulty(status, difficulty)
    @musics.user_exercises_with_attempt_search(status)
           .select { |k| k.difficulty.ceil == difficulty }
           .group_by { |ex| ex.first.difficulty.ceil }
  end
end
