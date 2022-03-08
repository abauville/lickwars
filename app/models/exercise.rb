class Exercise < ApplicationRecord
  belongs_to :user
  has_many :musics, dependent: :destroy
  has_many :reviews, dependent: :destroy
  accepts_nested_attributes_for :musics
  validates :difficulty, numericality: { greater_than_or_equal_to: 0 }
  validates :name, presence: true, length: { minimum: 3 }

  def question_music
    musics.find_by(is_question: true)
  end

  def attempt_music(user)
    musics.find_by(is_question: false, user: user)
  end

  def difficulty_string
    min_diff = 0
    max_diff = 10
    string = %w[easy intermediate hard insane]

    return string[-1] if difficulty > max_diff

    index =
      ((difficulty - min_diff) / (max_diff - min_diff) * (string.length - 1))
        .floor
    string[index]
  end

  def self.user_exercise_pie(user)
    grouped =
      Exercise
        .includes(:musics)
        .where(user: user)
        .group_by { |ex| ex.difficulty_string.capitalize }
    grouped.map { |k, v| { k => v.count } }.reduce(:merge)
  end
end
