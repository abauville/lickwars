// Visit The Stimulus Handbook for more details
// https://stimulusjs.org/handbook/introduction
//
// This example controller works with specially annotated HTML like:
//
// <div data-controller="hello">
//   <h1 data-target="hello.output"></h1>
// </div>
import * as Tone from "tone";

import { Controller } from "stimulus";

export default class extends Controller {
  static values = {
    question: String,
    attempt: String,
  };

  connect() {
    this.synth = new Tone.Synth().toDestination();
    // const now = Tone.now();
    // fetch(this.urlValue).then(/* … */);
  }

  show_notes() {
    console.log(this.notesValue);
  }

  is_rest(note) {
    Array.isArray(note[0]) && note[0][0] == 'r'
  }

  playbackArrays(note_string) {
    const bpm  = 80; // should be read from DB
    const wholeToneLength = 4.0 * 60.0/bpm;

    const notes = JSON.parse(note_string);
    const noteSequence = []
    const noteLengths = []
    let time = 0.0
    notes.forEach((note) => {
      if (!this.is_rest(note)) {
        noteSequence.push([time, note[0]])
        noteLengths.push(wholeToneLength / note[1] * 0.95) // 0.95 is have a bit of separation between notes
      }
      time += 1.0/note[1] * wholeToneLength;
    })
    return [noteSequence, noteLengths]
  }

  play(note_string) {
    Tone.start();

    const playbackArrays = this.playbackArrays(note_string)
    const noteSequence = playbackArrays[0]
    const noteLengths = playbackArrays[1]

    let counter = 0;
    const seq = new Tone.Part(
      (time, note) => {
          this.synth.triggerAttackRelease(note, noteLengths[counter], time);
          counter++;
        },
        noteSequence,
    ).start();
    Tone.Transport.start();
  }

  play_question(event) {
    this.play(this.questionValue)
  }

  play_attempt(event) {
    this.play(this.attemptValue)
  }

  // static targets = ["output"];
  // connect() {
  //   this.outputTarget.textContent = "Hello, Stimulus!";
  // }
}
