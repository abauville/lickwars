import * as Tone from "tone";
import { Piano } from "@tonejs/piano";

export class BoomBox {
  constructor() {
    const vol = new Tone.Volume(-12).toDestination();
    this.piano = new Piano({
      release: true,
      velocities: 5 });
    this.piano.connect(vol);
    this.piano.load().then(() => {
      console.log("loaded!");
    });
    this.breakLoop = false;
  }

  initSequences(event, music) {
    const sequenceNames = ['notes', 'chords']
    let endTime = 0
    sequenceNames.forEach((sequenceName) => {
      let playbackArrays = music.playbackArrays(sequenceName);
      const sequence = playbackArrays[0];
      const lengths = playbackArrays[1];

      const offSequence = sequence.map((n, i) => {return [n[0] + lengths[i], n[1]]})
      endTime = Math.max(offSequence.slice(-1)[0], endTime)

      const noteOnEvents = new Tone.Part(((time, event) => {
        console.log("on", time, event)
        if (event !== 'rest') {
          this.piano.keyDown(event)
        }
      }), sequence).start(0)

      const noteOffEvents = new Tone.Part(((time, event) => {
        // console.log("off", time, event)
        if (event !== 'rest') {
          this.piano.keyUp(event)
        }
      }), offSequence).start(0)
    })
    Tone.Transport.schedule((time) => {

      this.togglePlayStop(event)
    }, endTime+.01);
  }

  togglePlayStop(event) {
    Tone.Transport.toggle()
    console.log("state", Tone.Transport.state);
    console.log("stopHtml", event.currentTarget.dataset.stopHtml);
    if (Tone.Transport.state == 'started') {
      event.currentTarget.innerHTML = event.currentTarget.dataset.stopHtml
    } else {
      event.currentTarget.innerHTML = event.currentTarget.dataset.playHtml
      for (let i=9; i<97; i++) {
        this.piano.keyUp({midi: i}, '+0')
      }
    }
  }

  play(event, music) {
    console.log("play", event);
    Tone.Transport.cancel(0)
    this.initSequences(event, music)
    Tone.start();
    this.togglePlayStop(event)

    // Tone.Transport.toggle(startTime)
    // console.log("transport state", Tone.Transport.state, Tone.Transport.state === 'stopped', Tone.Transport)
    //
  }

  playSingleEvent(music_event, value, bpm) {
    const wholeToneLength = (4.0 * 60.0) / bpm;
    const duration = wholeToneLength / value;
    Tone.start();
    if (Array.isArray(music_event)) {
      // chord
      music_event.forEach((note) => {
        this.piano
          .keyDown({ note: `${note}`, time: "+0", velocity: 0.4 })
          .keyUp({ note: `${note}`, time: `+${duration}` });
      });
    } else {
      // single note
      const note = music_event;
      this.piano
        .keyDown({ note: `${note}`, time: "+0", velocity: 0.4 })
        .keyUp({ note: `${note}`, time: `+${duration}` });
    }
  }
}
