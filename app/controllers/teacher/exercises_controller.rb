class Teacher::ExercisesController < ApplicationController
  def index
    @exercises = policy_scope([:teacher, Exercise])
  end
end
