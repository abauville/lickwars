$('[name="event"]').on("change", function () {
  if ($(this).attr("id") == "walkEvent") {
    $("#place").html(
      "<p class='lw-button lw-btn-sm  text-center mb-0 mx-2' data-action='click->tone#play_attempt'><i class='far fa-play-circle'></i>"
    );
  } else {
    $("#place").html(
      " <p id='place' name='meeting_or_location' class='lw-button lw-btn-sm  text-center mb-0 mx-2' data-action='click->tone#play_question'><i class='far fa-play-circle'></i>"
    );
  }
});
