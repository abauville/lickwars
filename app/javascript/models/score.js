import Vex from 'vexflow'

export class Score {
  constructor(music) {
    this.music = music
    const VF = Vex.Flow
    // this.vf = new Vex.Flow.Factory({renderer: {elementId: 'score'}})
    this.div = document.getElementById("score")
    this.renderer = new VF.Renderer(this.div, VF.Renderer.Backends.SVG);

    // Size our SVG:




    // And get a drawing context:
    this.context = this.renderer.getContext();
  }

  draw(event) {
    let x = 0
    let stave
    const context = this.context

    const VF = Vex.Flow
    if (event) {
      event.preventDefault()
    }



    const measure_width = 200
    const key_time_signature_width = 50

    const allMeasureStaveNotes = this.music.staveNotes()
    const total_width = allMeasureStaveNotes.length * measure_width + key_time_signature_width
    console.log("total_width", total_width);
    this.renderer.resize(total_width+15, 200);
    this.context.clear()



    allMeasureStaveNotes.forEach((thisMeasureStaveNotes, index) => {

      if (index === 0) {
        // leave space for the key and time signature
        stave = new VF.Stave(x + 10, 40, measure_width + key_time_signature_width);
        stave.addClef("treble").addTimeSignature("4/4")
        x += key_time_signature_width
      } else {
        stave = new VF.Stave(x + 10, 40, measure_width)
      }
      if (index === allMeasureStaveNotes.length - 1) {
        stave.setEndBarType(VF.Barline.type.END);
      }

      const voice = new VF.Voice({num_beats: 4,  beat_value: 4});
      voice.addTickables(thisMeasureStaveNotes);

      var beams = VF.Beam.generateBeams(thisMeasureStaveNotes);


      const formatter = new VF.Formatter({ softmaxFactor: 20 }).joinVoices([voice]).format([voice], measure_width);
      stave.setContext(context).draw();
      voice.draw(context, stave);

      beams.forEach(function(b) {b.setContext(context).draw()})

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
