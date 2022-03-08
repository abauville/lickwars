class CreateMusics < ActiveRecord::Migration[6.1]
  def change
    create_table :musics do |t|
      t.integer :bpm, null: false, default: 80
      t.integer :key_signature, null: false, default: 0
      t.integer :mode, null: false, default: 0
      t.string :notes, null: false, default: ''
      t.string :chords, null: false, default: ''
      t.string :note_values, null: false, default: ''
      t.string :chord_values, null: false, default: ''

      t.timestamps
    end
  end
end
