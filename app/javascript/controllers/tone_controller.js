import { Controller } from "stimulus";
import { Music } from "../models/music";
import { BoomBox } from "../models/boom_box";

export default class extends Controller {
  static values = {
    notes: String,
    chords: String,
    bpm: Number,
  };

  connect() {
    this.boomBox = new BoomBox();
    this.music = new Music(
      this.notesValue,
      this.chordsValue,
      this.bpmValue
    );
  }

  play(event) {
    const play_question = document.querySelector("#radio_question")
    if (play_question.checked) {
      this.play_question(event);
    } else {
      this.play_attempt(event);
    }
  }

  play(event) {
    this.boomBox.play(this.music);
  }


  stopPlayback(event) {
    this.boomBox.breakLoop = true;
    setTimeout(() => {
      this.boomBox.breakLoop = true;
    }, 100);
  }


}
