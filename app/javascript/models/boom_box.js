import * as Tone from "tone";

export class BoomBox {
  constructor() {
    this.synth = new Tone.Synth().toDestination();
  }

  play(music) {
    Tone.start();
    const playbackArrays = music.playbackArrays();
    const noteSequence = playbackArrays[0];
    const noteLengths = playbackArrays[1];

    let counter = 0;
    const seq = new Tone.Part((time, note) => {
      console.log(noteSequence);
      console.log(noteLengths);
      this.synth.triggerAttackRelease(note, noteLengths[counter], time);
      counter++;
    }, noteSequence).start();
    Tone.Transport.start();
  }
}
