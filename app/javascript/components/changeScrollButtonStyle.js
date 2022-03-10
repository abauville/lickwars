const teacherButton = document.getElementById("teacher-ex-card-button-add");

const buttonContainer = document.getElementById("button-container");

const footer = document.getElementById("footer");

const checkOffset = () => {
  console.log("checking");
  if (teacherButton) {
    if (
      teacherButton.offsetTop +
        Math.abs(buttonContainer.getBoundingClientRect().y) >=
      footer.offsetTop - 175
    ) {
      teacherButton.style.position = "absolute";
      teacherButton.style.bottom = '50px';
    }

    if (window.scrollY + window.innerHeight <= footer.offsetTop) {
      // console.log("fixed");
      // console.log("sy: ", window.scrollY);
      // console.log("wh: ", window.innerHeight);
      // console.log("fo: ", footer.offsetTop);

      teacherButton.style.position = "fixed";
      teacherButton.style.bottom = '50px';
    }
  }
};

// console.log("sy: ", window.scrollY);
//       console.log("wh: ", window.innerHeight);
//       console.log("fo: ", footer.offsetTop);

export default document.addEventListener("scroll", checkOffset);
