class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  # validates :name, uniqueness: true, length: { minimum: 3 }
  before_save :default_values

  has_many :musics, dependent: :destroy
  has_many :exercises, dependent: :destroy

  def default_values
    self.name ||= self.email[...self.email.index('@')]
  end

  def teacher?
    # /!\ needs to be updated once the exercises model exists
    return false
    # !user.exercises.empty?
  end
end
