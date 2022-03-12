class ReviewsQuery < ApplicationQuery
  def all(exercise)
    @records.where(exercise: exercise)
            .where.not(content: nil || '')
            .order(created_at: :desc)
  end
end
