class Exercise < ApplicationRecord
  belongs_to :user

  validates :difficulty, numericality: { greater_than_or_equal_to: 0 }
  validates :name, presence: true, length: { minimum: 3 }
  validates :description

  def reference_music
    musics.where(user: user)
  end
end
