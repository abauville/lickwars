import * as Tone from "tone";

export class BoomBox {
  constructor() {
    this.synth = new Tone.Synth({
      noise: {
        type: "pink",
        playbackRate: 0.1,
      },
      envelope: {
        attack: 0.5,
        decay: 2,
        sustain: 0.5,
        release: 3,
      },
    }).toDestination();
  }

  play(music) {
    Tone.start();
    const playbackArrays = music.playbackArrays();
    const noteSequence = playbackArrays[0];
    const noteLengths = playbackArrays[1];

    let counter = 0;
    const seq = new Tone.Part((time, note) => {
      this.synth.triggerAttackRelease(note, noteLengths[counter], time);
      counter++;
    }, noteSequence).start();
    Tone.Transport.start();
  }
}
