// Visit The Stimulus Handbook for more details
// https://stimulusjs.org/handbook/introduction
//
// This example controller works with specially annotated HTML like:
//
// <div data-controller="hello">
//   <h1 data-target="hello.output"></h1>
// </div>

import Vex from 'vexflow'
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "output" ]
  static values = {
    notes: String,
    lengths: String,
  };

  connect() {
    this.init_converters();
    this.currentSelection = null;
    const VF = Vex.Flow;
    this.vf = new Vex.Flow.Factory({renderer: {elementId: 'score'}})
    // this.note_name_list = ["C#5", "B4", "A4", "G#4"];
    // this.note_length_list = ["q", "q", "q", "q"];
    console.log("notes", this.notesValue)
    console.log("lengths", this.lengthsValue)

    this.note_name_list   = this.notesValue.split(' ')
    this.note_length_list = this.lengthsValue.split(' ')

    console.log("lengths_list", this.note_length_list);

    this.draw();
  }

  init_converters() {
    // Dictionaries
    // =====================================
    this.midiNum2NoteNameSharp = {}
    this.midiNum2NoteNameFlat = {}
    this.noteName2MidiNum = {}

    const midiNumShift = 12;
    const noteNamesSharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteNamesFlat = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    for (let i = 9; i < 97; i += 1) {
      const noteNameSharp = noteNamesSharp[i%12];
      const noteNameFlat = noteNamesFlat[i%12];
      const octave = Math.floor(i/12);
      this.midiNum2NoteNameSharp[midiNumShift+i] = noteNameSharp + String(octave);
      this.midiNum2NoteNameFlat[midiNumShift+i] = noteNameFlat + String(octave);
      this.noteName2MidiNum[noteNameSharp + String(octave)] = midiNumShift+i
      this.noteName2MidiNum[noteNameFlat + String(octave)] = midiNumShift+i // if the noteNameFlat==noteNameSharp, it's just overwritten
    }
  }


  draw(event) {
    if (event) {
      event.preventDefault();
    }
    // const this.vf = new Vex.Flow.Factory({renderer: {elementId: 'score'}});
    this.vf.context.clear();
    const score = this.vf.EasyScore();
    const system = this.vf.System();
    console.log(this.counter);
    const note_event_list = [];
    this.note_name_list.forEach((note, i) => {
      note_event_list.push(`${note}/${this.note_length_list[i]}`);
    });
    console.log("note_event_list", note_event_list);
    system.addStave({
      voices: [score.voice(score.notes(note_event_list.join(", ")))]
    }).addClef('treble').addTimeSignature('4/4');

    console.log("redraw");
    this.vf.draw();

    this.add_action_to_notes()
    this.add_tabindex_to_notes();
  }

  add_action_to_notes() {
    const svg = document.querySelector("svg");
    const notes = svg.querySelectorAll(".vf-stavenote");
    notes.forEach((note) => {note.setAttribute("data-action", "click->score#clickNote")});
  }

  add_tabindex_to_notes() {
    const svg = document.querySelector("svg");
    const notes = svg.querySelectorAll(".vf-stavenote");
    notes.forEach((note) => {note.setAttribute("tabindex", "0")});
  }

  clickNote(event) {
    console.log("note clicked");
    this.toggleNoteSelection(event);
    console.log("currentSelection", this.currentSelection);
    // this.toggleNoteAction(event);
    if (this.currentSelection) {
      this.currentSelection.focus();
    }
  }

  keyUpOnNote(event) {
    console.log("keyup",event.code, event);
    const svgNote = event.currentTarget;
    console.log(this.note_name_index(svgNote));
    const ind = this.note_name_index(svgNote);
    console.log("index", ind);
    const midiNum = this.noteName2MidiNum[this.note_name_list[ind]]
    console.log("midiNum", midiNum);
    console.log("midiNum2NoteNameSharp", this.midiNum2NoteNameSharp);
    console.log("noteName2MidiNum", this.noteName2MidiNum);
    if (event.code === "ArrowUp") {
      console.log("ArrowUp");
      this.note_name_list[ind] = this.midiNum2NoteNameSharp[midiNum+1];
    } else if (event.code === "ArrowDown") {
      console.log("ArrowDown");
      this.note_name_list[ind] = this.midiNum2NoteNameFlat[midiNum-1];
    }
    console.log(this.note_name_list[ind]);
    this.draw();
  }

  note_name_index(svgNote) {
    const svg = document.querySelector("svg");
    const notes = svg.querySelectorAll(".vf-stavenote");
    for (let i = 0; i < notes.length; i += 1) {
      if (notes[i].id === svgNote.id) {
        return i;
      }
    }
  }


  toggleNoteSelection(event) {
    if (this.currentSelection) {
      this.currentSelection.classList.remove("selected");
      this.currentSelection.setAttribute("data-action", "click->score#clickNote"); // vanilla
    }
    if (this.currentSelection !== event.currentTarget) {
      this.currentSelection = event.currentTarget;
      this.currentSelection.classList.add("selected");
      this.currentSelection.setAttribute("data-action", "click->score#clickNote keyup->score#keyUpOnNote"); // add keyup
    } else {
      this.currentSelection = null;
    }
  }

}
