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
    this.boomBox = new BoomBox(document.querySelector("#play-question"));
    this.music = new Music(
      this.notesValue,
      this.chordsValue,
      this.bpmValue
    );
  }

  play(event) {
    event.preventDefault();
    this.boomBox.play(event, this.music);
  }

  stopPlayback(event) {
    this.boomBox.breakLoop = true;
    setTimeout(() => {
      this.boomBox.breakLoop = true;
    }, 100);
  }
}
