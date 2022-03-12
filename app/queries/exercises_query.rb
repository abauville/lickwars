class ExercisesQuery < ApplicationQuery
  def initialize(records, user)
    super
    @records.includes(:musics)
  end

  def all
    @records.order(:difficulty)
            .reject { |ex| ex.attempt_music(@user) }
            .group_by { |ex| ex.difficulty.ceil }
  end

  def filter_by_difficulty(difficulty)
    @records.search_by_difficulty(difficulty)
            .order(:difficulty)
            .reject { |ex| ex.attempt_music(@user) }
            .group_by { |ex| ex.difficulty.ceil }
  end
end
