class CreateMusics < ActiveRecord::Migration[6.1]
  def change
    create_table :musics do |t|
      t.integer :bpm
      t.integer :key
      t.string :notes
      t.string :chords
      t.integer :note_values
      t.integer :chord_values

      t.timestamps
    end
  end
end
