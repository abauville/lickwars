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
    this.sendNotesToCheckForm();
  }

  initConverters() {
    // Dictionaries
    // =====================================
    this.midiNum2NoteNameSharp = {};
    this.midiNum2NoteNameFlat = {};
    this.noteName2MidiNum = {};

    const midiNumShift = 12;
    const noteNamesSharp = [
      "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
    ];
    const noteNamesFlat = [
      "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"
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
    let midiNum
    if (!this.music.isRestIndex(index)) {
      midiNum = this.noteName2MidiNum[this.music.notes[index][0]];
    } else {
      midiNum = this.noteName2MidiNum[this.music.notes[index][0][1]];
    }

    const refMidiNums = {
      KeyC: 12, KeyD: 14, KeyE: 16, KeyF: 17, KeyG: 19, KeyA: 21, KeyB: 23
    };
    const noteValues = {
      Digit3: 16, Digit4: 8, Digit5: 4, Digit6: 2, Digit7: 1
    }
    switch (event.code) {

      case "ArrowUp": // move note up
        this.updateNote(
          index, "#", event.metaKey || event.ctrlKey ? midiNum + 12 : midiNum + 1
        );
        this.updateScore(event, index)
        break;
      case "ArrowDown": // move note down
        this.updateNote(
          index, "b", event.metaKey || event.ctrlKey ? midiNum - 12 : midiNum - 1
        );
        this.updateScore(event, index)
        break;
      case "ArrowLeft": // select the previous note
        this.selectPreviousNote(event, index, svgNote);
        break;
      case "ArrowRight": // select the next note
        this.selectNextNote(event, index, svgNote);
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
        this.updateNote(index, 'b', newMidiNum, true);
        svgNote = this.updateScore(event, index)
        this.selectNextNote(event, index, svgNote, false)
        break;
      case "Digit3": // 16th note, follows MuseScore's key map
      case "Digit4": // 8th note
      case "Digit5": // quarter note
      case "Digit6": // half note
      case "Digit7": // whole note
        const newValue = noteValues[event.code]
        const oldValue = this.music.notes[index][1]
        if (newValue > oldValue) {
          this.divideNote(index, newValue)
        } else {
          this.mergeNotes(index, newValue)
        }
        this.updateScore(event, index)
        break;
    }
  }

  divideNote(index, newValue, fillWithRests = true) {
    const note = this.music.notes[index][0]
    const prevValue = this.music.notes[index][1]
    for (let i = 0; i < Math.log2(newValue) - Math.log2(prevValue); i++) {
      if (fillWithRests) {
        this.music.notes.splice(index+1+i, 0, [["r", "A4"], newValue/(Math.pow(2,i))]);
      } else {
        this.music.notes.splice(index+1+i, 0, [note, newValue/(Math.pow(2,i))]);
      }
    }
    this.music.notes[index][1] = newValue
  }

  mergeNotes(index, newValue) {
    if (index === this.music.notes.length - 1) {
      // The last note cannot be merged because there is nothing after
      return
    }
    // Merging strategy
    // check if the next notes can be merged directly or if the last note
    // would need to be divided before merging
    // e.g. 8th + 8th notes can be merged into a quarter note
    // but, 8th + 2nd, will be merged into quarter + (8th + quarter) (in that case remainder == 8th)
    // Warning: this function is not yet aware of barlines, and will cause an error when dividing notes across a barline

    // check first if I have enough place to add that note in that measure
    let duration = 1.0/this.music.notes[index][1]
    let target_duration = 1.0/newValue
    let i = 0
    const tol = 1e-6
    let remainder
    console.log("notes", this.music.notes.slice(index))
    // compute remainder

    while (duration < target_duration - tol) {
      i += 1
      if (index + i >= this.music.notes.length) {
        // Prevents overflow over the last bar by increasing newValue (i.e. decreasing its duration)
        newValue = Math.pow(2,Math.ceil(Math.log2(1.0/duration)))
        target_duration = 1.0/newValue
        i = 1
        duration = 1.0/this.music.notes[index][1]
        console.log("newValue", newValue);
      }
      remainder = target_duration - duration
      duration += 1.0/this.music.notes[index+i][1]
      console.log("Counting, dur, rem", duration, remainder)
    }
    const num_notes_to_remove = i
    // divide last note if necessary
    if (duration > target_duration + tol) {
      this.divideNote(index+i, Math.round(1.0/remainder), false)
    }
    // remove notes to be merged
    for (let j = 0; j < num_notes_to_remove; j++) {
      this.music.notes.splice(index+1,1)
    }
    this.music.notes[index][1] = newValue


    // Check if the new notes cross a bar
    duration = 0
    let duration_after_index
    let duration_until_index = 0
    for (i=0; i<index+1; i++) {
      if (i == index) {
        duration_until_index = duration
      }
      duration += 1.0/this.music.notes[i][1]
    }
    duration_after_index = duration
    console.log("dur_u, dur_a", duration_until_index, duration_after_index);

    console.log("Barcheck", duration, duration_until_index, Math.floor(duration_until_index / 1.0), Math.floor(duration / 1.0));
    // crossing a bar? hard coded for 4/4
    if (Math.floor(duration_until_index / 1.0) !== Math.floor(duration_after_index / 1.0)) { // crossing a bar
      remainder = 1.0 - (duration_until_index % 1.0)
      console.log("Crossing a bar!", 1.0/remainder);
      this.divideNote(index, Math.round(1.0/remainder), false)
      // should tie notes, but that's not an option yet
    }

    console.log("notes", this.music.notes.slice(index))
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

  updateNote(index, accidental, newMidiNum, updateRest = false) {
    // Note: works only for single notes. Doesn't handle chords
    if (!this.music.isRestIndex(index) || updateRest) {
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
  }

  updateScore(event, index, playNote = true) {
    this.score.draw(event);
    this.sendNotesToCheckForm();
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
      const note = this.music.notes[this.score.getNoteIndex(target)];
      if (playNote && !this.music.isRest(note)) {
        this.boomBox.playSingleEvent(note[0], 8, this.bpm);
      }
    } else {
      this.currentSelection = null;
    }
  }

  playAttempt(event) {
    console.log("playAttempt")
    this.boomBox.play(this.music);
  }

  sendNotesToCheckForm(event) {
    const checkForm = document.querySelector("#form-notes-input");
    checkForm.value = JSON.stringify(this.music.notes);
  }

}
