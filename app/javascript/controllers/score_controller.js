// Visit The Stimulus Handbook for more details
// https://stimulusjs.org/handbook/introduction
//
// This example controller works with specially annotated HTML like:
//
// <div data-controller="hello">
//   <h1 data-target="hello.output"></h1>
// </div>
import { Controller } from "stimulus";
import { Music } from "../models/music";
import { Score } from "../models/score";
import { BoomBox } from "../models/boom_box";

export default class extends Controller {
  static targets = ["output"];
  static values = {
    notes: String,
    bpm: Number,
  };

  connect() {
    this.bpm = this.bpmValue;
    this.music = new Music(this.notesValue, "[]", this.bpm);
    this.boomBox = new BoomBox();
    this.score = new Score(this.music);
    this.initConverters();
    this.currentSelection = null;

    this.score.draw();
    this.updateAttemptStringPlayback();
  }

  initConverters() {
    // Dictionaries
    // =====================================
    this.midiNum2NoteNameSharp = {};
    this.midiNum2NoteNameFlat = {};
    this.noteName2MidiNum = {};

    const midiNumShift = 12;
    const noteNamesSharp = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    const noteNamesFlat = [
      "C",
      "Db",
      "D",
      "Eb",
      "E",
      "F",
      "Gb",
      "G",
      "Ab",
      "A",
      "Bb",
      "B",
    ];
    for (let i = 9; i < 97; i += 1) {
      const noteNameSharp = noteNamesSharp[i % 12];
      const noteNameFlat = noteNamesFlat[i % 12];
      const octave = Math.floor(i / 12);
      this.midiNum2NoteNameSharp[midiNumShift + i] =
        noteNameSharp + String(octave);
      this.midiNum2NoteNameFlat[midiNumShift + i] =
        noteNameFlat + String(octave);
      this.noteName2MidiNum[noteNameSharp + String(octave)] = midiNumShift + i;
      this.noteName2MidiNum[noteNameFlat + String(octave)] = midiNumShift + i; // if the noteNameFlat==noteNameSharp, it's just overwritten
    }
  }

  clickNote(event) {
    this.toggleNoteSelection(event.currentTarget);
  }

  keyDownOnNote(event) {
    let newMidiNum;
    console.log("keydown", event.code, event, event.metaKey);
    let svgNote = event.currentTarget;
    let index = this.score.getNoteIndex(svgNote);
    const midiNum = this.noteName2MidiNum[this.music.notes[index][0]];
    const refMidiNums = {
      KeyC: 12,
      KeyD: 14,
      KeyE: 16,
      KeyF: 17,
      KeyG: 19,
      KeyA: 21,
      KeyB: 23,
    };
    switch (event.code) {
      case "ArrowUp": // move note up
        this.updateNote(
          event,
          index,
          "#",
          event.metaKey || event.ctrlKey ? midiNum + 12 : midiNum + 1
        );
        break;
      case "ArrowDown": // move note down
        this.updateNote(
          event,
          index,
          "b",
          event.metaKey || event.ctrlKey ? midiNum - 12 : midiNum - 1
        );
        break;
      case "ArrowLeft": // select the previous note
        this.selectPreviousNote(event, index, svgNote);
        break;
      case "ArrowRight": // select the next note
        this.selectNextNote(event, index, svgNote);
        break;
      case "KeyC":
      case "KeyD":
      case "KeyE":
      case "KeyF":
      case "KeyG":
      case "KeyA":
      case "KeyB":
        const below = -((midiNum - refMidiNums[event.code]) % 12);
        const above = below + 12;
        newMidiNum =
          Math.abs(below) < Math.abs(above) ? midiNum + below : midiNum + above;
        svgNote = this.updateNote(event, index, "b", newMidiNum);
        this.selectNextNote(event, index, svgNote, false);
        break;
      case "Digit4": // 8th note
        // break both list
        console.log("Bef, 8th note", this.music.notes);
        this.music.notes.splice(index, 0, [["r", "A4"], 8]);
        console.log("Aft, 8th note", this.music.notes);
        // insert a new rest
        // change the note durations
        // update display
        break;
    }
  }

  selectPreviousNote(event, index, svgNote, playNote = true) {
    index = Math.max(index - 1, 0);
    return this.changeSelection(event, index, svgNote, playNote);
  }

  selectNextNote(event, index, svgNote, playNote = true) {
    index = Math.min(index + 1, this.music.notes.length - 1);
    return this.changeSelection(event, index, svgNote, playNote);
  }

  changeSelection(event, index, svgNote, playNote = true) {
    this.toggleNoteSelection(svgNote, playNote);
    svgNote = this.score.getSvgNote(index);
    this.toggleNoteSelection(svgNote, playNote);
    this.currentSelection.focus();
    return svgNote;
  }

  updateNote(event, index, accidental, newMidiNum, playNote = true) {
    // Note: works only for single notes. Doesn't handle chords
    if (!this.music.isRestIndex(index)) {
      if (accidental == "#") {
        this.music.notes[index][0] = this.midiNum2NoteNameSharp[newMidiNum];
      } else if (accidental == "b" || accidental == "n") {
        this.music.notes[index][0] = this.midiNum2NoteNameFlat[newMidiNum];
      } else {
        throw new Error(
          `Unknown accidental: ${accidental}. Accepted values are '#' and 'b'.`
        );
      }
    }

    this.score.draw(event);
    this.updateAttemptStringPlayback(event);
    const svgNote = this.score.getSvgNote(index);
    this.toggleNoteSelection(svgNote, playNote);
    this.currentSelection.focus();
    return svgNote;
  }

  toggleNoteSelection(target, playNote = true) {
    if (this.currentSelection) {
      this.currentSelection.classList.remove("selected");
      this.currentSelection.setAttribute(
        "data-action",
        "click->score#clickNote"
      ); // vanilla
    }
    if (this.currentSelection !== target) {
      this.currentSelection = target;
      this.currentSelection.classList.add("selected");
      this.currentSelection.setAttribute(
        "data-action",
        "click->score#clickNote keydown->score#keyDownOnNote"
      ); // add keydown
      if (playNote) {
        const note = this.music.notes[this.score.getNoteIndex(target)];
        this.boomBox.playSingleEvent(note[0], 8, this.bpm);
      }
    } else {
      this.currentSelection = null;
    }
  }

  updateAttemptStringPlayback(event) {
    const toneController = document.querySelector("#tone-controller");
    toneController.dataset.toneAttemptValue = JSON.stringify(this.music.notes);
    console.log(JSON.stringify(this.music.notes));
    document.getElementById("music_notes").value = JSON.stringify(
      this.music.notes
    );
  }
  // use this as a model for when writing your score, make new function
  sendAttemptStringToForm() {}
}
