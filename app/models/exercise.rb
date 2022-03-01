class Exercise < ApplicationRecord
  belongs_to :user
  has_many :musics, dependent: :destroy

  validates :difficulty, numericality: { greater_than_or_equal_to: 0 }
  validates :name, presence: true, length: { minimum: 3 }

  def reference_music
    musics.where(user: user)
  end

  def diff_level
    @exercises = Exercise.all
    @exercises.each do |exercise|
      if exercise.difficulty.between?(1, 4)
        @answer = "easy"
      elsif exercise.difficulty.between?(4, 7)
        @answer = "medium"
      else
        @answer = "hard"
      end
    end
    @answer
  end
end
