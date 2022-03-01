class Music < ApplicationRecord
  belongs_to :user
  belongs_to :exercise

  validates :bpm, presence: true, numericality: { greater_than: 10, lower_than: 500 }
  validates :key_signature
  validates :mode, presence: true
  validates :notes, presence: true
  validates :chords, presence: true
  validates :note_values, presence: true
  validates :chord_values, presence: true
  validate  :each_note_has_value?
  validate  :each_chord_has_value?
  validates :user, uniqueness: {
    scope: %i[exercise is_question]
  }

  enum key_signature: {
    unfinished: 0,
    finished: 1
  }

  enum key_signature: {
    '0#': 0, '1#': 1, '2#': 2, '3#': 3,
    '4#': 4, '5#': 5, '6#': 6, '7#': 7,
    '0b': 0, '1b': 1, '2b': 2, '3b': 3,
    '4b': 4, '5b': 5, '6b': 6, '7b': 7,
  }

  enum mode: {
    major: 0,
    minor: 1
  }

  def key
    keys = {
      major: {
        '0#': 'C',  '1#': 'G',  '2#': 'D',  '3#': 'A',
        '4#': 'E',  '5#': 'B',  '6#': 'F#', '7#': 'C#',
        '0b': 'C',  '1b': 'F',  '2b': 'Bb', '3b': 'Eb',
        '4b': 'Ab', '5b': 'Db', '6b': 'Gb', '7b': 'Cb'
      },
      minor: {
        '0#': 'A',  '1#': 'E',  '2#': 'B',  '3#': 'F#',
        '4#': 'C#', '5#': 'G#', '6#': 'D#', '7#': 'A#',
        '0b': 'A',  '1b': 'D',  '2b': 'G',  '3b': 'C',
        '4b': 'F',  '5b': 'Bb', '6b': 'Eb', '7b': 'Ab'
      }
    }
    return keys[tonality][key_signature]
  end

  def each_note_has_value?
    notes.split.length == note_values.split.length
  end

  def each_chord_has_value?
    chords.split.length == chord_values.split.length
  end
end
