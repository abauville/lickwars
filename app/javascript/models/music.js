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

}
