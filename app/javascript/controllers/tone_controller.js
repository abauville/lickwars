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
import { Piano } from "@tonejs/piano";

export default class extends Controller {
  static values = {
    question: String,
    attempt: String,
  };

  connect() {
    // fetch(this.urlValue).then(/* … */);
  }

  show_notes() {
    console.log(this.notesValue);
  }

  play(note_string) {
    const splitNotesArray = note_string.split(" ");
    // console.log(splitNotesArray);
    // const synth = new Tone.Synth().toDestination();
    // const now = Tone.now();

    // create the piano and load 5 velocity steps
    //connect it to the speaker output
    const piano = new Piano({ velocities: 5 }).toDestination();

    piano.load().then(() => {
      console.log("loaded!");
      // now = Piano.now();
      piano
        .keyDown({ note: `${splitNotesArray[0]}`, time: "+0" })
        .keyUp({ note: `${splitNotesArray[0]}`, time: "+0.5" });
      piano
        .keyDown({ note: `${splitNotesArray[1]}`, time: "+0.5" })
        .keyUp({ note: `${splitNotesArray[1]}`, time: "+1" });
      piano
        .keyDown({ note: `${splitNotesArray[2]}`, time: "+1" })
        .keyUp({ note: `${splitNotesArray[2]}`, time: "+1.5" });
      piano
        .keyDown({ note: `${splitNotesArray[3]}`, time: "+1.5" })
        .keyUp({ note: `${splitNotesArray[3]}`, time: "+2" });

      // piano.triggerAttackRelease(`${splitNotesArray[0]}`, "8n", now);
      // piano.triggerAttackRelease(`${splitNotesArray[1]}`, "8n", now + 0.5);
      // piano.triggerAttackRelease(`${splitNotesArray[2]}`, "8n", now + 1);
      // piano.triggerAttackRelease(`${splitNotesArray[3]}`, "8n", now + 1.5);
    });
  }

  play_question(event) {
    this.play(this.questionValue);
  }

  play_attempt(event) {
    this.play(this.attemptValue);
  }

  // static targets = ["output"];
  // connect() {
  //   this.outputTarget.textContent = "Hello, Stimulus!";
  // }
}
