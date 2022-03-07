import * as Tone from "tone";

export class BoomBox {
  constructor() {
    this.piano = new Piano({ velocity: 5 }).toDestination();
  }

  play(music) {
    Piano.load().then(() => {
      const playbackArrays = music.playbackArrays();
      const noteSequence = playbackArrays[0];
      const noteLengths = playbackArrays[1];

      const piano = new Piano({ velocities: 5 }).toDestination();

    piano.load().then(() => {
      console.log("loaded!");
      // now = Piano.now();

      noteSequence.forEach((note, index) => {
        piano
        .keyDown({ note: `${note[0]}`, time: `+${note[1]}` })
        .keyUp({ note: `${note[0]}`, time: `+${note[1] + noteLengths[index]}` });
      })

    });
      let counter = 0;
      const seq = new Tone.Part((time, note) => {
        console.log(noteSequence);
        console.log(noteLengths);
        this.piano.keyUp(note, time);
      }, noteSequence).start();
    });
    // Piano.Transport.start();
  }
}
