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
    notes: String,
  };

  connect() {
    // fetch(this.urlValue).then(/* … */);
  }

  show_notes() {
    console.log(this.notesValue);
  }

  log(params) {
    const splitNotesArray = this.notesValue.split(" ");
    console.log(splitNotesArray);
    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease(`${splitNotesArray[0]}4`, "8n", now);
    synth.triggerAttackRelease(`${splitNotesArray[1]}4`, "8n", now + 0.5);
    synth.triggerAttackRelease(`${splitNotesArray[2]}4`, "8n", now + 1);
    synth.triggerAttackRelease(`${splitNotesArray[3]}4`, "8n", now + 1.5);
  }

  // static targets = ["output"];
  // connect() {
  //   this.outputTarget.textContent = "Hello, Stimulus!";
  // }
}
