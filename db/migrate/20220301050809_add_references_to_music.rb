class AddReferencesToMusic < ActiveRecord::Migration[6.1]
  def change
    add_reference :musics, :user, null: false, foreign_key: true
    add_reference :musics, :exercise, null: false, foreign_key: true
  end
end
