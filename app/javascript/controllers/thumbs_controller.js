// Visit The Stimulus Handbook for more details
// https://stimulusjs.org/handbook/introduction
//
// This example controller works with specially annotated HTML like:
//
// <div data-controller="hello">
//   <h1 data-target="hello.output"></h1>
// </div>
import { Controller } from "stimulus";
export default class extends Controller {
  static targets = ["thumbs"];

  connect() {
    console.log("connected");
  }
  toggle() {
    console.log("toggle");
    this.thumbsTarget.classList.toggle("btn-dark");
    console.log(this.displayClass);
    this.thumbsTarget.setAttribute("disabled", "");
  }
}
