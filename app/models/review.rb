class Review < ApplicationRecord
  belongs_to :exercise
  belongs_to :user
  validates :user, presence: true, uniqueness: { scope: :exercise }
  validate :vote_or_content

  def vote_or_content
    vote || content
  end
end
