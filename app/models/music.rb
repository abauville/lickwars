class Music < ApplicationRecord
  # The format for notes and chords is a list of list in json format:
  # [[<group 1>], [<group 2>]]
  # The possible groups are:
  # Single note: "['<note name><octave number>', <note value>]"
  #     e.g., "['C4', 4]"
  # Chord: "[['<note name><octave number>', '<note name><octave number>' ...], <note value>]"
  #     e.g., "[['C4', 'E4', 'G4', 'C5'], 1]"
  # rest: "[['r', '<note name><octave number>'], <note value>]".
  #     e.g., "[['r', 'A4'], 1]". i.e. A rest placed at the location of 'A4'

  belongs_to :user
  belongs_to :exercise

  validates :bpm,
            presence: true,
            numericality: {
              greater_than: 10,
              lower_than: 500
            }
  validates :key_signature, :mode, :notes, :chords, presence: true
  validate :valid_notes?
  validate :valid_chords?
  validates :user, uniqueness: { scope: %i[exercise is_question] }

  DAILY_TARGET = 10
  WEEKLY_TARGET = 50

  enum status: { in_progress: 0, finished: 1 }

  enum key_signature: {
         '0#': 0,
         '1#': 1,
         '2#': 2,
         '3#': 3,
         '4#': 4,
         '5#': 5,
         '6#': 6,
         '7#': 7,
         '0b': 0,
         '1b': 1,
         '2b': 2,
         '3b': 3,
         '4b': 4,
         '5b': 5,
         '6b': 6,
         '7b': 7
       }

  enum mode: { major: 0, minor: 1 }

  def key
    keys = {
      major: {
        '0#': 'C',
        '1#': 'G',
        '2#': 'D',
        '3#': 'A',
        '4#': 'E',
        '5#': 'B',
        '6#': 'F#',
        '7#': 'C#',
        '0b': 'C',
        '1b': 'F',
        '2b': 'Bb',
        '3b': 'Eb',
        '4b': 'Ab',
        '5b': 'Db',
        '6b': 'Gb',
        '7b': 'Cb'
      },
      minor: {
        '0#': 'A',
        '1#': 'E',
        '2#': 'B',
        '3#': 'F#',
        '4#': 'C#',
        '5#': 'G#',
        '6#': 'D#',
        '7#': 'A#',
        '0b': 'A',
        '1b': 'D',
        '2b': 'G',
        '3b': 'C',
        '4b': 'F',
        '5b': 'Bb',
        '6b': 'Eb',
        '7b': 'Ab'
      }
    }
    return keys[tonality][key_signature]
  end

  def valid_notes?
    valid_json?(notes)
  end

  def valid_chords?
    valid_json?(chords)
  end

  def self.user_exercises_with_attempt(user)
    includes(:exercise).where(user: user, is_question: false).group_by(&:exercise)
  end
  
  def self.daily_completion_stat(user)
    musics =
      Music.where(
        created_at: Time.zone.now.beginning_of_day..Time.zone.now.end_of_day,
        user: user
      )
    stat = (musics.count / DAILY_TARGET.to_f) * 100
    stat > 100 ? 100 : stat
  end

  def self.weekly_completion_stat(user)
    musics =
      Music.where(
        created_at: Time.zone.now.beginning_of_week..Time.zone.now.end_of_week,
        user: user
      )
    stat = (musics.count / WEEKLY_TARGET.to_f) * 100
    stat > 100 ? 100 : stat
  end

  private

  def valid_json?(string)
    result = JSON.parse(string)
    result.is_a?(Hash) || result.is_a?(Array)
  rescue JSON::ParserError, TypeError
    false
  end
end
