import * as Tone from "tone";
import { Piano } from "@tonejs/piano";

export class BoomBox {
  constructor(target) {
    const vol = new Tone.Volume(-12).toDestination();
    this.piano = new Piano({
      release: true,
      velocities: 5 });
    this.piano.connect(vol);
    this.piano.load().then(() => {
      console.log("loaded! target:", target);
      target.disabled = false
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


  initAttemptAnimation(event, music) {
    // const wholeNoteLength = (4.0 * 60.0) / this.bpm;

    let playbackArrays = music.playbackArrays('notes');
    let sequence = playbackArrays[0];
    const lengths = playbackArrays[1];
    sequence = sequence.map((s, i) => {return [s[0], i]})
    let offSequence = sequence.map((n, i) => {return [n[0] + lengths[i], n[1]]})
    offSequence = offSequence.map((s, i) => {return [s[0], i]})
    const svg = document.querySelector("svg");
    const notes = svg.querySelectorAll(".vf-stavenote");
    const noteOnEvents = new Tone.Part(((time, index) => {
      // console.log("onEvent", index);
      notes[index].classList.toggle("highlight")
    }), sequence).start(0)

    const noteOffEvents = new Tone.Part(((time, index) => {
      // console.log("offEvent", index);
      notes[index].classList.toggle("highlight")
    }), offSequence).start(0)

  }

  initQuestionAnimation(event, music) {
    console.log("initQuestionAnimation")
    const wholeNoteLength = (4.0 * 60.0) / music.bpm;

    // highlight staves
    const svg = document.querySelector("svg");
    const staveLines = svg.querySelectorAll("[stroke='#999999']");
    console.log("stavelines", staveLines)
    let sequence = []
    let offSequence = []
    let yTopStave = Number(staveLines[0].attributes.d.value.split('L')[0].split(' ')[1])

    let y
    let i_measure = -1
    staveLines.forEach((stave, index) => {
      y = Number(stave.attributes.d.value.split('L')[0].split(' ')[1])
      if (y === yTopStave) {
        i_measure += 1
      }

      // const i_measure = Math.floor(index / 5)
      sequence.push([wholeNoteLength * i_measure, stave])
      offSequence.push([wholeNoteLength * (i_measure + 1), stave])
    })
    console.log("seq", sequence)
    console.log("offSequence", offSequence)

    const onEvents = new Tone.Part(((time, stave) => {
      console.log("onEvent", time, stave);
      stave.classList.toggle("stave-highlight")
    }), sequence).start(0)

    const offEvents = new Tone.Part(((time, stave) => {
      // console.log("offEvent", index);
      stave.classList.toggle("stave-highlight")
    }), offSequence).start(0)

    // // highlight notes
    // let playbackArrays = music.playbackArrays('notes');
    // sequence = playbackArrays[0];
    // const lengths = playbackArrays[1];
    // sequence = sequence.map((s, i) => {return [Math.floor(s[0]/wholeNoteLength) * wholeNoteLength, i]})
    // offSequence = sequence.map((s, i) => {return [(Math.floor(s[0]/wholeNoteLength) + 1) * wholeNoteLength, s[1]]})
    // offSequence = offSequence.map((s, i) => {return [s[0], i]})
    // const notes = svg.querySelectorAll(".vf-stavenote");
    // const noteOnEvents = new Tone.Part(((time, index) => {
    //   // console.log("onEvent", index);
    //   notes[index].classList.toggle("highlight")
    // }), sequence).start(0)

    // const noteOffEvents = new Tone.Part(((time, index) => {
    //   // console.log("offEvent", index);
    //   notes[index].classList.toggle("highlight")
    // }), offSequence).start(0)

  }

  togglePlayStop(target) {
    Tone.Transport.toggle()
    if (Tone.Transport.state === 'started') {
      target.innerHTML = target.dataset.stopHtml
    } else {
      target.innerHTML = target.dataset.playHtml
      // release every note
      for (let i=9; i<97; i++) {
        this.piano.keyUp({midi: i}, '+0')
      }
      // remove every highlight
      const svg = document.querySelector("svg");
      const notes = svg.querySelectorAll(".vf-stavenote");
      notes.forEach((n) => {n.classList.remove("highlight")})
      const staveLines = svg.querySelectorAll("[stroke='#999999']");
      staveLines.forEach((s) => {s.classList.remove("stave-highlight")})
    }
  }

  play(event, music) {
    Tone.Transport.cancel(0)
    const endTime = this.initSequences(event, music)
    const stopTransport = new Tone.Part(((time, t) => {
      this.togglePlayStop(t)
    }), [[endTime+0.8, event.currentTarget]]).start(0)

    if (event.currentTarget.id === "play-attempt") {
      this.initAttemptAnimation(event, music)
    }
    console.log("target", event.currentTarget)
    if (event.currentTarget.id === "play-question") {
      this.initQuestionAnimation(event, music)
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
