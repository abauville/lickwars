class Exercise < ApplicationRecord
  belongs_to :user
  has_many :musics, dependent: :destroy

  validates :difficulty, numericality: { greater_than_or_equal_to: 0 }
  validates :name, presence: true, length: { minimum: 3 }


  def reference_music
    musics.where(user: user)
  end
end
