class RemoveNoteValuesFromMusics < ActiveRecord::Migration[6.1]
  def change
    remove_column :musics, :note_values, :string, default: '', null: false
    remove_column :musics, :chord_values, :string, default: '', null: false
  end
end
