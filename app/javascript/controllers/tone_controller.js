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
  static targets = ["output"];
  log(params) {
    console.log("test?");
    //create a synth and connect it to the main output (your speakers)

    const synth = new Tone.Synth().toDestination();

    //play a middle 'C' for the duration of an 8th note
    synth.triggerAttackRelease("C4", "8n");
  }
  connect() {
    this.outputTarget.textContent = "Hello, Stimulus!";
  }
}
