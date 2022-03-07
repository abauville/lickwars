import Vex from 'vexflow'

export class Score {
  constructor(music) {
    this.music = music
    const VF = Vex.Flow
    // this.vf = new Vex.Flow.Factory({renderer: {elementId: 'score'}})
    this.div = document.getElementById("score")
    const renderer = new VF.Renderer(this.div, VF.Renderer.Backends.SVG);

    // Size our SVG:
    renderer.resize(3000, 200);



    // And get a drawing context:
    this.context = renderer.getContext();
  }

  draw(event) {
    const VF = Vex.Flow
    if (event) {
      event.preventDefault()
    }
    this.context.clear()
    // const score = this.vf.EasyScore()
    // const system = this.vf.System()
    // console.log("staveNotes ==============");
    // console.log(this.music.staveNotes())
    // console.log("============== staveNotes");
    let x = 10
    const measure_width = 350
    let stave
    this.music.staveNotes().forEach((thisMeasureStaveNotes, index) => {

      if (index == 0) {
        // leave space for the key and time signature
        stave = new VF.Stave(x, 40, measure_width + 50);
        x += 50
      } else {
        stave = new VF.Stave(x, 40, measure_width);
      }
      // const stave = new VF.Stave(x, 40, measure_width);
      if (index == 0) {
        stave.addClef("treble").addTimeSignature("4/4");
      }

      const voice = new VF.Voice({num_beats: 4,  beat_value: 4});
      voice.addTickables(thisMeasureStaveNotes);


      // format and leave space for the key and time signature
      const formatter = new VF.Formatter().joinVoices([voice]).format([voice], measure_width);
      stave.setContext(this.context).draw();
      voice.draw(this.context, stave);
      x += measure_width
    })

    // document.querySelector("svg").style.overflow = "scroll";
    this.addActionToNotes()
    this.addTabIndexToNotes()
  }

  addActionToNotes() {
    const svg = document.querySelector("svg");
    const notes = svg.querySelectorAll(".vf-stavenote");
    notes.forEach((note) => {note.setAttribute("data-action", "click->score#clickNote")});
  }

  addTabIndexToNotes() {
    const svg = document.querySelector("svg");
    const notes = svg.querySelectorAll(".vf-stavenote");
    notes.forEach((note) => {note.setAttribute("tabindex", "0")});
  }

  getNoteIndex(svgNote) {
    const svg = document.querySelector("svg");
    const svgNotes = svg.querySelectorAll(".vf-stavenote");
    for (let i = 0; i < svgNotes.length; i += 1) {
      if (svgNotes[i].id === svgNote.id) {
        return i;
      }
    }
  }

  getSvgNote(index) {
    const svg = document.querySelector("svg");
    const svgNotes = svg.querySelectorAll(".vf-stavenote");
    return svgNotes[index]
  }
}
