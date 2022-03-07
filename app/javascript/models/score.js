import Vex from 'vexflow'

export class Score {
  constructor(music) {
    this.music = music
    this.vf = new Vex.Flow.Factory({renderer: {elementId: 'score'}})
  }

  draw(event) {
    const VF = Vex.Flow
    if (event) {
      event.preventDefault()
    }
    this.vf.context.clear()
    const score = this.vf.EasyScore()
    const system = this.vf.System()
    console.log("staveNotes ==============");
    console.log(this.music.staveNotes())
    console.log("============== staveNotes");

    const stave = new VF.Stave(10, 40, 400);

    stave.addClef("treble").addTimeSignature("4/4");
    var voice = new VF.Voice({num_beats: 4,  beat_value: 4});
    voice.addTickables(this.music.staveNotes());
    var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 350);

    stave.setContext(this.vf.context).draw();
    voice.draw(this.vf.context, stave);

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
