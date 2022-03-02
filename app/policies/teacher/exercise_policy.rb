class Teacherr::ExercisePolicy < ApplicationPolicy
  class Scope < Scope
    # NOTE: Be explicit about which records you allow access to!
    def resolve
      user.exercises
    end
  end
end
