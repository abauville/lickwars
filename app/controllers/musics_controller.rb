class MusicsController < ApplicationController
  def new
    @music = current_user.musics.new
    authorize @music
  end

  def create
    exercise = Exercise.find(params[:exercise_id])
    @music = current_user.musics.new(music_params)
    authorize @music
    @music.exercise = exercise
    if @music.save
      redirect_to excercises_path
    else
      render :new
    end
  end

  private

  def music_params
    params.require(:music).permit(
      :bpm,
      :key_signature,
      :mode,
      :notes,
      :chords,
      :note_values,
      :chord_values
    )
  end
end
