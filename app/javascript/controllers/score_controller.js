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
  };

  connect() {
    this.initConverters();
    this.currentSelection = null;
    const VF = Vex.Flow;
    this.vf = new Vex.Flow.Factory({renderer: {elementId: 'score'}})
    // this.noteNameList = ["C#5", "B4", "A4", "G#4"];
    // this.noteLengthList = ["q", "q", "q", "q"];
    console.log("notes", this.notesValue)

    this.noteEvents = JSON.parse(this.notesValue);

    // this.noteNameList   = this.notesValue.split(' ')
    // this.noteLengthList = this.lengthsValue.split(' ')
    // this.noteNameList = this.noteNameList.slice(0,4)
    // this.noteLengthList = this.noteLengthList.slice(0,4)
    console.log("lengths list", this.noteLengthList);

    this.draw();
    this.updateAttemptStringPlayback();
  }

  initConverters() {
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


  getVexString() {
    const vexEvents = []
    this.noteEvents.forEach((note, i) => {
      if (Array.isArray(note[0])) {
        if (note[0][0] == 'r') { // rest
          vexEvents.push(`(${note[0][1]})/r${note[1]}`);
        } else { //chord
          vexEvents.push(`(${note[0].join(' ')})/${note[1]}`);
        }
      } else { // single note
        vexEvents.push(`${note[0]}/${note[1]}`);
      }
    });
    return vexEvents.join(', ')
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

    const vexString = this.getVexString();

    console.log("vexString", vexString);
    system.addStave({
      voices: [score.voice(score.notes(vexString))]
    }).addClef('treble').addTimeSignature('4/4');

    console.log("redraw");
    this.vf.draw();

    this.addActionToNotes()
    this.addTabIndexToNotes();
  }

  addActionToNotes() {
    const svg = document.querySelector("svg");
    const notes = svg.querySelectorAll(".vf-stavenote");
    notes.forEach((note) => {note.setAttribute("data-action", "click->score#clickNote")});
  }

  addTabIndexToNotes() {
    const svg = document.querySelector("svg");
    const notes = svg.querySelectorAll(".vf-stavenote");
    notes.forEach((note) => {note.setAttribute("tabindex", "0")});
  }

  clickNote(event) {
    this.toggleNoteSelection(event.currentTarget);
  }

  keyDownOnNote(event) {
    let newMidiNum;
    console.log("keydown", event.code, event, event.metaKey);
    let svgNote = event.currentTarget;
    let index = this.noteNameIndex(svgNote);
    const midiNum = this.noteName2MidiNum[this.noteNameList[index]]
    const refMidiNums = {
      'KeyC': 12,
      'KeyD': 14,
      'KeyE': 16,
      'KeyF': 17,
      'KeyG': 19,
      'KeyA': 21,
      'KeyB': 23,
    }
    switch (event.code) {
      case 'ArrowUp': // move note up
        this.updateNote(event, index, '#', event.metaKey ? midiNum+12 : midiNum+1);
        break;
      case 'ArrowDown': // move note down
        this.updateNote(event, index, 'b', event.metaKey ? midiNum-12 : midiNum-1);
        break;
      case 'ArrowLeft': // select the previous note
        this.selectPreviousNote(event, index, svgNote)
        break;
      case 'ArrowRight': // select the next note
        this.selectNextNote(event, index, svgNote)
        break;
      case 'KeyC':
      case 'KeyD':
      case 'KeyE':
      case 'KeyF':
      case 'KeyG':
      case 'KeyA':
      case 'KeyB':
        const below = - ((midiNum - refMidiNums[event.code] ) % 12)
        const above = below + 12
        newMidiNum = Math.abs(below) < Math.abs(above) ? midiNum + below : midiNum + above
        svgNote = this.updateNote(event, index, 'b', newMidiNum);
        this.selectNextNote(event, index, svgNote)
        break;
      case 'Digit4': // 8th note
        // break both list
        console.log("Bef, 8th note", this.noteNameList)
        this.noteNameList.splice(index,0,"A4/r8")
        console.log("Aft, 8th note", this.noteNameList)
        // insert a new rest
        // change the note durations
        // update display
        break;

    }
  }

  selectPreviousNote(event, index, svgNote) {
    index = Math.max(index - 1, 0)
    return this.changeSelection(event, index, svgNote)
  }

  selectNextNote(event, index, svgNote) {
    index = Math.min(index + 1, this.noteNameList.length-1)
    return this.changeSelection(event, index, svgNote)
  }

  changeSelection(event, index, svgNote) {
    this.toggleNoteSelection(svgNote);
    svgNote = this.getSvgNoteFromIndex(index);
    this.toggleNoteSelection(svgNote);
    this.currentSelection.focus();
    return svgNote
  }

  updateNote(event, index, accidental,newMidiNum) {
    if (accidental == '#') {
      this.noteNameList[index] = this.midiNum2NoteNameSharp[newMidiNum];
    } else if (accidental == 'b') {
      this.noteNameList[index] = this.midiNum2NoteNameFlat[newMidiNum];
    } else {
      throw new Error(`Unknown accidental: ${accidental}. Accepted values are '#' and 'b'.`)
    }

    this.draw(event);
    this.updateAttemptStringPlayback(event);
    const svgNote = this.getSvgNoteFromIndex(index);
    this.toggleNoteSelection(svgNote);
    this.currentSelection.focus();
    return svgNote
  }

  noteNameIndex(svgNote) {
    const svg = document.querySelector("svg");
    const notes = svg.querySelectorAll(".vf-stavenote");
    for (let i = 0; i < notes.length; i += 1) {
      if (notes[i].id === svgNote.id) {
        return i;
      }
    }
  }

  getSvgNoteFromIndex(index) {
    const svg = document.querySelector("svg");
    const notes = svg.querySelectorAll(".vf-stavenote");
    return notes[index]
  }

  toggleNoteSelection(target) {
    if (this.currentSelection) {
      this.currentSelection.classList.remove("selected");
      this.currentSelection.setAttribute("data-action", "click->score#clickNote"); // vanilla
    }
    if (this.currentSelection !== target) {
      this.currentSelection = target;
      this.currentSelection.classList.add("selected");
      this.currentSelection.setAttribute("data-action", "click->score#clickNote keydown->score#keyDownOnNote"); // add keydown
    } else {
      this.currentSelection = null;
    }
  }

  updateAttemptStringPlayback(event) {
    const toneController = document.querySelector("#tone-controller");
    toneController.dataset.toneAttemptValue = this.noteNameList.join(' ')
    console.log("toneController dataset:", toneController.dataset);
  }

}
