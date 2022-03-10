const teacherButton = document.getElementById("teacher-ex-card-button-add");

const buttonContainer = document.getElementById("button-container");

const footer = document.getElementById("footer");

const checkOffset = () => {
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
      teacherButton.style.position = "fixed";
      teacherButton.style.bottom = '50px';
    }
  }
};

export default document.addEventListener("scroll", checkOffset);
