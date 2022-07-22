function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");
    var to_change_colour = document.getElementsByClassName("colour_mode_change");
    for (let i = 0; i < to_change_colour.length; i++) {
        to_change_colour[i].classList.toggle("dark-mode");
      }
  }
  