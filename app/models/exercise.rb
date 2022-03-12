class Exercise < ApplicationRecord
  belongs_to :user
  has_many :musics, dependent: :destroy
  has_many :reviews, dependent: :destroy
  accepts_nested_attributes_for :musics
  validates :difficulty, numericality: { greater_than_or_equal_to: 0 }
  validates :name, presence: true, length: { minimum: 3 }

  DIFF_STRING = [
    "Do-Re-Mi",
    "Do-Re-Mi-So",
    "Do-Re-Mi-Fa-So-La. Melodies on the I chord with passing tones",
    "Major scale. Melodies on the I chord with passing and neighbor tones",
    "Major melodies on the I - V - I progression",
    "Major melodies on the I - IV - I progression",
    "Major melodies on the I - IV - V - I progression",
    "Major melodies on the I - IV - V - I progression",
    "Introducing the V7 chord",
    "Melodies on the ii - V7 - I progression"
  ]

  after_create do
    self.description = DIFF_STRING[difficulty.floor]
    save
  end

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
    when 1 then where(difficulty: 0..1)
    when 2 then where(difficulty: 1..2)
    when 3 then where(difficulty: 2..3)
    when 4 then where(difficulty: 3..4)
    when 5 then where(difficulty: 4..5)
    when 6 then where(difficulty: 5..6)
    when 7 then where(difficulty: 6..7)
    when 8 then where(difficulty: 7..8)
    when 9 then where(difficulty: 8..9)
    when 10 then where(difficulty: 9..10)
    else
      where("difficulty > ?", MAX_DIFF)
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
