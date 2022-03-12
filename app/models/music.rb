class Music < ApplicationRecord
  belongs_to :user
  belongs_to :exercise
  validates :bpm,
            presence: true,
            numericality: {
              greater_than: 10,
              lower_than: 500
            }
  validates :notes, presence: true
  validate :valid_notes?, :valid_chords?
  validates :user, uniqueness: { scope: %i[exercise is_question] }

  DAILY_TARGET = 10
  WEEKLY_TARGET = 50

  enum status: { in_progress: 0, finished: 1 }

  def valid_notes?
    valid_json?(notes)
  end

  def valid_chords?
    valid_json?(chords)
  end

  def self.user_exercises_with_attempt_search(status, user)
    includes(:exercise).where(is_question: false, status: status)
                       .where.not(exercise: { user: user })
                       .group_by(&:exercise)
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

  def num_measures
    # works only for measures where the duration is one whole note
    notes = JSON.parse(self.notes)
    duration = 0
    notes.each do |note|
      duration += 1.0 / note[1]
    end
    return duration.to_int
  end

  def init_notes_with_rests(n_measures)
    out = []
    n_measures.times { out << [['r', 'A4'], 1] }
    self.notes = JSON[out]
  end

  private

  def valid_json?(string)
    result = JSON.parse(string)
    result.is_a?(Hash) || result.is_a?(Array)
  rescue JSON::ParserError, TypeError
    false
  end
end
