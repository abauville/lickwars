// import * as Tone from "tone";
import { Piano } from "@tonejs/piano";

export class BoomBox {
  constructor() {
    this.piano = new Piano({ velocities: 2 }).toDestination();
    this.piano.load().then(() => {console.log("loaded!"); })
    this.breakLoop = false
  }

  play(music) {
    const playbackArrays = music.playbackArrays();
    const noteSequence = playbackArrays[0];
    const noteLengths = playbackArrays[1];
    let note
    for (let index = 0; index < noteSequence.length; index += 1) {
      note = noteSequence[index]
      this.piano
      .keyDown({ note: `${note[1]}`, time: `+${note[0]}` })
      .keyUp({ note: `${note[1]}`, time: `+${note[0] + noteLengths[index]}` })
      if (this.breakLoop) {
        break
      }
    }
  }
}
