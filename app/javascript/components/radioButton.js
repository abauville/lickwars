$('[name="event"]').on("change", function () {
  if ($(this).attr("id") == "walkEvent") {
    $("#place").text("Meeting point: ");
  } else {
    $("#place").text("Location: ");
  }
});
