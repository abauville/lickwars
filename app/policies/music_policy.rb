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
    the_teacher?
  end

  private

  def the_teacher?
    record.exercise.user == user
  end
end
