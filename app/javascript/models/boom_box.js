import * as Tone from "tone";
import { Piano } from "@tonejs/piano";

export class BoomBox {
  constructor() {
    this.piano = new Piano({ velocities: 3 }).toDestination();
    this.piano.load().then(() => {console.log("loaded!"); })
    this.breakLoop = false
  }

  play(music) {
    Tone.start()
    let playbackArrays = music.playbackArrays('notes');
    const noteSequence = playbackArrays[0];
    const noteLengths = playbackArrays[1];

    playbackArrays = music.playbackArrays('chords');
    const chordSequence = playbackArrays[0];
    const chordLengths = playbackArrays[1];
    console.log("chordLength", chordLengths)
    console.log("chord", chordSequence)
    let note, chord

    const now = Tone.now() + 0.1
    console.log(this.piano)
    for (let index = 0; index < noteSequence.length; index += 1) {
      note = noteSequence[index]
      const downTime = now + note[0]
      const upTime = now + note[0] + noteLengths[index]
      // const downTime =`+${note[0]}`
      // const upTime = `+${note[0] + chordLengths[index]}`
      this.piano
      .keyDown({ note: `${note[1]}`, time: downTime, velocity: 0.7 })
      .keyUp({ note: `${note[1]}`, time: upTime })
      if (this.breakLoop) {
        break
      }
    }
    for (let index = 0; index < chordSequence.length; index += 1) {
      chord = chordSequence[index]
      chord[1].forEach((noteName) => {
        const downTime = now + chord[0]
        const upTime = now + chord[0] + chordLengths[index]
        this.piano
        .keyDown({ note: `${noteName}`, time: downTime, velocity: 0.4 })
        .keyUp({ note: `${noteName}`, time: upTime })
        .pedalDown({time: downTime})
        .pedalUp({time: upTime})
      })
    }
  }

  playSingleEvent(music_event, value, bpm) {
    const wholeToneLength = 4.0 * 60.0/bpm;
    const duration = wholeToneLength/value
    Tone.start()
    if (Array.isArray(music_event)) { // chord
      music_event.forEach((note) => {
        this.piano
        .keyDown({ note: `${note}`, time: "+0", velocity: 0.4 })
        .keyUp({ note: `${note}`, time: `+${duration}`})
      })
    } else { // single note
      const note = music_event
      this.piano
      .keyDown({ note: `${note}`, time: "+0", velocity: 0.4 })
      .keyUp({ note: `${note}`, time: `+${duration}` })
    }
  }
}
