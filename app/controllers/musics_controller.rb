class MusicsController < ApplicationController
  def new
    @music = current_user.musics.new
  end

  def create
    exercise = Exercise.find(params[:exercise_id])
    @music = Music.new(music_params)
    @music.exercise = exercise
    if @music.save
      redirect_to excercises_path
    else
      render :new
    end
  end

  private

  def music_params
    # may need to delete unnecessary one
    params.require(:music).permit(
      :bpm,
      :key_signature,
      :mode,
      :notes,
      :chords,
      :note_values,
      :chord_values,
      :user_id,
      :status
    )
  end
end
