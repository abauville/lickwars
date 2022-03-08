class Exercise < ApplicationRecord
  belongs_to :user
  has_many :musics, dependent: :destroy
  has_many :reviews, dependent: :destroy
  accepts_nested_attributes_for :musics
  validates :difficulty, numericality: { greater_than_or_equal_to: 0 }
  validates :name, presence: true, length: { minimum: 3 }

  MIN_DIFF = 0
  MAX_DIFF = 10

  def question_music
    musics.find_by(is_question: true)
  end

  def attempt_music(user)
    musics.find_by(is_question: false, user: user)
  end

  def self.search_by_difficulty(search_difficulty)
    case search_difficulty
    when 0 then where(difficulty: 0..4)
    when 1 then where(difficulty: 4..7)
    when 2 then where(difficulty: 7..10)
    else
      where("difficulty > ?", MAX_DIFF)
    end
  end

  def select_by_difficulty(search_difficulty)
    case search_difficulty
    when 0 then (0..4).include?(difficulty)
    when 1 then (4..7).include?(difficulty)
    when 2 then (7..10).include?(difficulty)
    else
      true
    end
  end

  def difficulty_string
    string = %w[easy intermediate hard insane]

    return string[-1] if difficulty > MAX_DIFF

    index = ((difficulty - MIN_DIFF) / (MAX_DIFF - MIN_DIFF) * (string.length - 1)).floor
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
