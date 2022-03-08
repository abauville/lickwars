import { Controller } from "stimulus";
import { Music } from "../models/music";
import { BoomBox } from "../models/boom_box";

export default class extends Controller {
  static values = {
    question: String,
    attempt: String,
    chords: String,
    bpm: Number,
  };

  connect() {
    console.log("bpm", this.bpmValue);
    this.boomBox = new BoomBox();
    this.question = new Music(
      this.questionValue,
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

  play_question(event) {
    this.boomBox.play(this.question);
  }

  play_attempt(event) {
    const attempt = new Music(this.attemptValue, "[]", this.bpmValue);
    this.boomBox.play(attempt);
  }

  stopPlayback(event) {
    this.boomBox.breakLoop = true;
    setTimeout(() => {
      this.boomBox.breakLoop = true;
    }, 100);
  }


}
