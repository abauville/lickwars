class RemoveReferenceFromExercise < ActiveRecord::Migration[6.1]
  def change
    remove_foreign_key :exercises, column: :music_id
  end
end
