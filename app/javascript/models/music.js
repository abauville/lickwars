export class Music {
  constructor(notes, bpm) {
    this.notes = JSON.parse(notes);
    this.bpm = bpm
  }

  playbackArrays() {
    const wholeToneLength = 4.0 * 60.0/this.bpm;

    const noteSequence = []
    const noteLengths = []
    let time = 0.0
    this.notes.forEach((note) => {
      if (!this.isRest(note)) {
        noteSequence.push([time, note[0]])
        noteLengths.push(wholeToneLength / note[1] * 0.95) // 0.95 is have a bit of separation between notes
      }
      time += 1.0/note[1] * wholeToneLength;
    })
    return [noteSequence, noteLengths]
  }

  isRest(note) {
    Array.isArray(note[0]) && note[0][0] == 'r'
  }

  getVexString() {
    const vexEvents = []
    this.notes.forEach((note, i) => {
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
}
