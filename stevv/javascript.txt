var search_results_array = [];
var all_favourites_array = [];
var searching = false;

$(function() {
  $("#search_button").click(function() {
    searching = true;
    getFavourites();
  });
})

function getFavourites() {
  const request = db.transaction(["fav_shows"])
                  .objectStore("fav_shows")
                  .getAll()

  request.onsuccess = event => {
      console.log("Favourite shows retrieved:");
      console.log(request.result);
      all_favourites_array = request.result;

      if ($("#fav_list").length) {
        if (all_favourites_array.length > 0) {
          addShowsToList("fav_list", all_favourites_array);
        }
        else {
          noResults("fav_list", "No favourites yet");
        }
      }
      else if (searching) {
        searchShows();
      }
  }

  request.onerror = event => {
      console.log("Error retrieving favourite shows:");
      console.log(event.target);
      searchShows();
  }
}

function favouriteHandler(id, shows_list) {
  let fav_show = {};

  shows_list.forEach(function(show) {
    if (show.id === id) {
      fav_show = show;
      return;
    }
  })

  let fav_button_text = $("#" + id).html();

  if (fav_button_text === "Favourite") {
    addShowToFavourites(fav_show);
  }
  else if (fav_button_text === "Unfavourite") {
    removeShowFromFavourites(fav_show);
  }
}

function addShowToFavourites(fav_show) {
  const request = db.transaction(["fav_shows"], "readwrite")
                    .objectStore("fav_shows")
                    .add(fav_show)

  request.onsuccess = event => {
      console.log("Show added to favourites:");
      console.log(event.target.result);
      $("#" + fav_show.id).html("Unfavourite");
  };

  request.onerror = event => {
    console.log("Adding show to favourites error:");
    console.log(event.target);
  };
}

function removeShowFromFavourites(fav_show) {
  const request = db.transaction(["fav_shows"], "readwrite")
                .objectStore("fav_shows")
                .delete(fav_show.id);

  request.onsuccess = event => {
      console.log("Show removed from favourites");

      if ($("#fav_list").length) {
        getFavourites();
      }
      else {
        $("#" + fav_show.id).html("Favourite");
      }
  }
  
  request.onerror = event => {
      console.log("Error removing show from favourites:");
      console.log(event.target);
  }
}

function getShowDetails(shows) {
  search_results_array = [];

  shows.forEach(function(show_wrapper) {
    let show = show_wrapper.show;
    let id = "";
    let name = "Title Unknown";
    let avg_rating = "Unknown";
    let genres = [];
    let image_url = "";
    let premiered = "Unknown";

    if (show.hasOwnProperty("id") && show.id !== null) {
      id = show.id;
    }
    else {
      return;
    }

    if (show.hasOwnProperty("name") && show.name !== null) {
        name = show.name;
    }

    if (show.hasOwnProperty("rating") && show.rating !== null) {
        if (show.rating.hasOwnProperty("average") && show.rating.average !== null) {
            avg_rating = show.rating.average;
        }
    }

    if (show.hasOwnProperty("genres") && show.genres.length > 0) {
        show.genres.forEach(function(genre) {
          genres.push(genre);
      })
    }

    if (show.hasOwnProperty("image") && show.image !== null) {
      if (show.image.hasOwnProperty("original") && show.image.original !== null) {
          image_url = show.image.original;
      }
      else if (show.image.hasOwnProperty("medium") && show.image.medium !== null) {
          image_url = show.image.medium;
      }
    }

    if (show.hasOwnProperty("premiered") && show.premiered !== null) {
      premiered = show.premiered;
    }

    if (show.hasOwnProperty("summary") && show.summary !== null) {
      summary = show.summary.replaceAll("<p>", "").replaceAll("</p>", "").replaceAll("<b>", "").replaceAll("</b>", "");
    }

    let new_show = {
      id: id,
      name: name,
      avg_rating: avg_rating,
      genres: genres,
      image_url: image_url,
      premiered: premiered,
      summary: summary
    }

    search_results_array.push(new_show);
  })
}

function getShowsFromAPI(url) {
  $.getJSON(url, function(shows) {
    if (shows.length > 0) {
      getShowDetails(shows);
      addShowsToList("search_list", search_results_array);
    }
    else {
      noResults("search_list", "No results found :(");
    }
  })
}

function addShowsToList(list_id, shows) {
  let search_list = document.getElementById(list_id);
  search_list.innerHTML = "";

  shows.forEach(function(show) {
    let show_info = "<h1><b>" + show.name + "</b></h1>";

    show.genres.forEach(function(genre, i) {
      if (i == 0) {
        show_info += "<p><b>Genres: </b>";
      }

      if (i > 0) {
        show_info += ", ";
      }

      show_info += genre;

      if (i == show.genres.length - 1) {
        show_info += "</p>";
      }
    })

    show_info += "<p><b>Average Rating: </b> " + show.avg_rating;
    if (show.avg_rating !== "Unknown") {
      show_info += "/10"
    }

    show_info += "</p><p><b>Premiered:</b> " + show.premiered + "</p>" +
    "<p><b>Summary:</b> " + show.summary + "</p>";

    let show_info_label = document.createElement("ion-label");
    $(show_info_label).addClass("ion-text-wrap");
    show_info_label.innerHTML = show_info;

    let new_image = document.createElement("ion-img");
    new_image.src = show.image_url;
    $(new_image).addClass("list_img");

    let fav_button_text = "Favourite";
    all_favourites_array.forEach(function(fav_show) {
      if (show.id === fav_show.id) {
        fav_button_text = "Unfavourite";
      }
    })

    let new_fav_button = document.createElement("ion-button");
    new_fav_button.innerHTML = fav_button_text;
    new_fav_button.id = show.id;
    new_fav_button.onclick = function() {
      favouriteHandler(show.id, shows);
    }

    let new_item = document.createElement("ion-item");
    new_item.append(new_image);
    new_item.append(show_info_label);
    new_item.append(new_fav_button);
    search_list.append(new_item);
  })
}

function searchShows() {
  var url = "https://api.tvmaze.com/search/shows?q=";
  var search_terms = getSearchTerms();

  if (search_terms !== null) {
      $("#error_msg").html("");
      url += search_terms;
      getShowsFromAPI(url);
  }
  else {
      $("#error_msg").html("Please enter search term");
  }
}

function getSearchTerms() {
  let search_term = $("#search_term").val();
  let search_term_array = search_term.trim().split(/\ +/);

  if (search_term_array.length > 0 && search_term_array[0] !== "") {
      let final_search_term = search_term_array[0];

      if (search_term_array.length > 1) {
          for (let i = 1; i < search_term_array.length; i++) {
              final_search_term += "+" + search_term_array[i];
          }
      }

      return final_search_term;
  }
  else {
      return null;
  }
}

function noResults(list_id, message) {
  console.log("no results");
  let search_list = $("#" + list_id);
  search_list.html("<h1>" + message + "</h1>");
}