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
    let endTime = 0.0
    sequenceNames.forEach((sequenceName) => {
      let playbackArrays = music.playbackArrays(sequenceName);
      const sequence = playbackArrays[0];
      const lengths = playbackArrays[1];

      const offSequence = sequence.map((n, i) => {return [n[0] + lengths[i], n[1]]})
      if (offSequence.slice(-1).length>0 && offSequence.slice(-1)[0][0] > endTime) {
        endTime = offSequence.slice(-1)[0][0]
      }

      const noteOnEvents = new Tone.Part(((time, noteEvent) => {
        // console.log("on", time, noteEvent)
        if (noteEvent !== 'rest') {
          this.piano.keyDown(noteEvent)
        }
      }), sequence).start(0)

      const noteOffEvents = new Tone.Part(((time, noteEvent) => {
        // console.log("off", time, noteEvent)
        if (noteEvent !== 'rest') {
          this.piano.keyUp(noteEvent)
        }
      }), offSequence).start(0)
    })
    return endTime
  }


  initAnimationQuestion(event, bpm) {
    const wholeNoteLength = (4.0 * 60.0) / this.bpm;

  }

  togglePlayStop(target) {
    Tone.Transport.toggle()
    if (Tone.Transport.state === 'started') {
      target.innerHTML = target.dataset.stopHtml
    } else {
      target.innerHTML = target.dataset.playHtml
      for (let i=9; i<97; i++) {
        this.piano.keyUp({midi: i}, '+0')
      }
    }
  }

  play(event, music) {
    Tone.Transport.cancel(0)
    const endTime = this.initSequences(event, music)
    const stopTransport = new Tone.Part(((time, t) => {
      this.togglePlayStop(t)
    }), [[endTime+.01, event.currentTarget]]).start(0)

    if (event.currentTarget.id === "play-question") {
      this.initAnimationQuestion(event, music.bpm)
    }

    Tone.start();
    this.togglePlayStop(event.currentTarget)
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
