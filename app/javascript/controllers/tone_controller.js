import { Controller } from "stimulus";
import { Music } from "../models/music";
import { BoomBox } from "../models/boom_box";

export default class extends Controller {
  static values = {
    question: String,
    attempt: String,
    bpm: Number
  };

  connect() {
    console.log("bpm", this.bpmValue);
    this.boomBox = new BoomBox();
    this.question = new Music(this.questionValue, this.bpmValue)
  }

  play_question(event) {
    this.boomBox.play(this.question)
  }

  play_attempt(event) {
    const attempt = new Music(this.attemptValue, this.bpmValue)
    this.boomBox.play(attempt)
  }
}
