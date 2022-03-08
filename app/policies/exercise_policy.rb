class ExercisePolicy < ApplicationPolicy
  class Scope < Scope
    # NOTE: Be explicit about which records you allow access to!
    def resolve
      scope.where.not(user: user)
    end
  end

  def show?
    true
  end

  def create?
    true
  end

  def update?
    record.user == user  # Only restaurant creator can update it
  end

  def destroy?
    record.user == user  # Only restaurant creator can update it
  end
end
