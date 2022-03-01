class CreateExercises < ActiveRecord::Migration[6.1]
  def change
    create_table :exercises do |t|
      t.references :user, null: false, foreign_key: true
      t.float :difficulty
      t.string :name, null: false
      t.text :description, null: false, default: ""
      t.string :chord_progression, null: false, default: ""

      t.timestamps
    end
  end
end
