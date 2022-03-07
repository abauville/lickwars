import * as Tone from "tone";

export class BoomBox {
  constructor() {
    this.synth = new Tone.Synth({
      oscillator: {
        type: "square",
      },
      filter: {
        Q: 2,
        type: "lowpass",
        rolloff: -12,
      },
      envelope: {
        attack: 0.005,
        decay: 3,
        sustain: 0,
        release: 0.45,
      },
      filterEnvelope: {
        attack: 0.001,
        decay: 0.32,
        sustain: 0.9,
        release: 3,
        baseFrequency: 700,
        octaves: 2.3,
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
