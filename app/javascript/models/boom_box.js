import * as Tone from "tone";
import { Piano } from "@tonejs/piano";

export class BoomBox {
  constructor() {
    this.piano = new Piano({ velocities: 5 }).toDestination();
  }

  play(music) {
    Tone.start();
    this.piano.load().then(() => {
      const playbackArrays = music.playbackArrays();
      const noteSequence = playbackArrays[0];
      const noteLengths = playbackArrays[1];
      let counter = 0;
      const seq = new Tone.Part((time, note) => {
        this.piano.keyUp(note, time);
        counter++;
      }, noteSequence).start();
      Tone.Transport.start();
    });
  }
}
