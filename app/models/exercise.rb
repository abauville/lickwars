class Exercise < ApplicationRecord
  belongs_to :user
  has_many :musics, dependent: :destroy

  validates :difficulty, numericality: { greater_than_or_equal_to: 0 }
  validates :name, presence: true, length: { minimum: 3 }

  def reference_music
    musics.where(user: user)
  end

  def difficulty_string
    min_diff = 0
    max_diff = 10
    string = ["easy", "intermediate", "hard", "insane"]

    return string[-1] if difficulty > max_diff


    index = ((difficulty - min_diff) / (max_diff - min_diff) * (string.length - 1)).floor
    string[index]
  end
end
