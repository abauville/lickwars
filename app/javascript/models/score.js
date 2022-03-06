import Vex from 'vexflow'

export class Score {
  constructor(music) {
    this.music = music
    this.vf = new Vex.Flow.Factory({renderer: {elementId: 'score'}})
  }

  draw(event) {
    if (event) {
      event.preventDefault()
    }
    this.vf.context.clear()
    const score = this.vf.EasyScore()
    const system = this.vf.System()

    system.addStave({
      voices: [score.voice(score.notes(this.music.getVexString()))]
    }).addClef('treble').addTimeSignature('4/4');

    this.vf.draw();

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
}
