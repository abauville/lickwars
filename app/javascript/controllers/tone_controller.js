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

  log(params) {
    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease("C4", "8n", now);
    synth.triggerAttackRelease("E4", "8n", now + 0.5);
    synth.triggerAttackRelease("G4", "8n", now + 1);
  }

  show_notes() {
    console.log(this.notesValue);
  }

  // static targets = ["output"];
  // connect() {
  //   this.outputTarget.textContent = "Hello, Stimulus!";
  // }
}
