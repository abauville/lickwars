class MusicPolicy < ApplicationPolicy
  class Scope < Scope
    # NOTE: Be explicit about which records you allow access to!
    # def resolve
    #   scope.all
    # end
  end

  def new
    true
  end

  def create?
    true
  end

  def update?
    if record.is_question
      teacher?
    else
      player?
    end
  end

  private

  def teacher?
    record.exercise.user == user
  end

  def player?
    record.user == user
  end
end
