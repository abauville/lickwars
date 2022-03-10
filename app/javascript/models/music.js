import Vex from "vexflow";

export class Music {
  constructor(notes, chords, bpm) {
    this.notes = JSON.parse(notes);
    this.chords = JSON.parse(chords);
    this.bpm = bpm;
  }

  playbackArrays(arrayName) {
    let array;
    if (arrayName === "notes") {
      array = this.notes;
    } else if (arrayName === "chords") {
      array = this.chords;
    } else {
      throw new Error(
        `arrayName should be 'notes' or 'chords', instead got ${arrayName}`
      );
    }
    const wholeToneLength = (4.0 * 60.0) / this.bpm;

    const noteSequence = [];
    const noteLengths = [];
    let time = 0.0;
    console.log("array", array);
    array.forEach((note) => {
      if (!this.isRest(note)) {
        noteSequence.push([time, note[0]]);
        noteLengths.push((wholeToneLength / note[1]) * 0.95); // 0.95 is have a bit of separation between notes
      }
      time += (1.0 / note[1]) * wholeToneLength;
    });
    return [noteSequence, noteLengths];
  }

  isRest(note) {
    return Array.isArray(note[0]) && note[0][0] == "r";
  }

  isRestIndex(index) {
    return (
      Array.isArray(this.notes[index][0]) &&
      this.notes[index][0][0] === 'r'
    );
  }

  isSingleNote(note) {
    return typeof note[0] === "string" || note[0] instanceof String;
  }

  accidental(note) {
    return note[0].slice(1, -1);
  }

  hasAccidental(note) {
    return this.accidental(note).length > 0;
  }

  keysForSingleNote(note) {
    return [`${note[0].slice(0, -1)}/${note[0][note[0].length - 1]}`];
  }

  staveNotes() {
    const out = [];
    let group = [];
    const VF = Vex.Flow;
    let staveNote;
    let time = 0;
    this.notes.forEach((note, index) => {
      if (this.isSingleNote(note)) {
        staveNote = new VF.StaveNote({
          clef: "treble",
          keys: this.keysForSingleNote(note),
          duration: `${note[1]}`,
          auto_stem: true
        });
        if (this.hasAccidental(note)) {
          staveNote.addAccidental(0, new VF.Accidental(this.accidental(note)));
        }
      } else if (this.isRest(note)) {
        staveNote = new VF.StaveNote({
          clef: "treble",
          keys: this.keysForSingleNote(note),
          duration: `${note[1]}r`,
        });
      } else {
        // chords or mistakes
        throw new Error(
          `Your melody includes a chord or something not handled by the score yet: ${note}`
        );
      }
      group.push(staveNote);
      time += 4.0 / note[1];
      if (time >= 4) {
        // handles filling bars /!\ hard coded to 4/4 time signature
        time = 0;
        out.push(group);
        group = [];
      }
    });
    return out;
  }

  getVexString() {
    const vexEvents = [];
    this.notes.forEach((note, i) => {
      if (Array.isArray(note[0])) {
        if (note[0][0] == "r") {
          // rest
          vexEvents.push(`(${note[0][1]})/r${note[1]}`);
        } else {
          //chord
          vexEvents.push(`(${note[0].join(" ")})/${note[1]}`);
        }
      } else {
        // single note
        vexEvents.push(`${note[0]}/${note[1]}`);
      }
    });
    return vexEvents.join(", ");
  }
}
