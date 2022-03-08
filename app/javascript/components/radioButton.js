$('[name="event"]').on("change", function () {
  if ($(this).attr("id") == "walkEvent") {
    $("#place").html(
      "<p class='lw-button lw-btn-sm text-center mx-2' data-action='click->tone#play_attempt'><i class='far fa-play-circle'></i>Attempt</p>"
    );
  } else {
    $("#place").text("Location: ");
  }
});
