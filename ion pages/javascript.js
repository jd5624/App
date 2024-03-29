var search_results_array = [];  // Array for storing shows retrieved in user search
var all_favourites_array = [];  // Array for storing user's favourite shows
var searching = false;          // Indicates if user has performed a search

$(function() {
  // Click handler for search button
  $("#search_button").click(function() {
    searching = true;   // User has tried to perform a search
    getFavourites();    // Update array of user's favourite shows
  });
})

/**
 * Method for getting user's favourite shows
 */
function getFavourites() {
  // IndexedDB request for getting all favourite shows created
  const request = db.transaction(["fav_shows"])
                  .objectStore("fav_shows")
                  .getAll()

  // On request's success
  request.onsuccess = event => {
      all_favourites_array = request.result;  // Store user's favourites in array

      // If on favourites page
      if ($("#fav_list").length) {
        // If user has favourites, add them to displayed list
        if (all_favourites_array.length > 0) {
          addShowsToList("fav_list", all_favourites_array);
        }
        else {  // If user has no favourites, display message
          noResults("fav_list", "No favourites yet");
        }
      }
      else if (searching) { // If not on favourites page and user has tried to search
        // Search for shows
        searchShows();
      }
  }

  // On request error
  request.onerror = event => {
    // Print error to console
    console.log("Error retrieving favourite shows:");
    console.log(event.target);
    // Search for shows
    searchShows();
  }
}

/**
 * Method for handling a user favouriting or unfavouriting a show
 * @param {*} id Show's unique ID
 * @param {*} shows_list List of shows
 */
function favouriteHandler(id, shows_list) {
  let fav_show = {};

  // Find selected show based on ID
  shows_list.forEach(function(show) {
    if (show.id === id) {
      fav_show = show;
      return;
    }
  })

  let fav_button_text = $("#" + id).html();

  // Add or remove show from favourites based on button's text
  if (fav_button_text === "Favourite") {
    addShowToFavourites(fav_show);
  }
  else if (fav_button_text === "Unfavourite") {
    removeShowFromFavourites(fav_show);
  }
}

/**
 * Method for adding show to user's favourites
 * @param {*} fav_show Show to be added to favourites
 */
function addShowToFavourites(fav_show) {
  // IndexedDB request for adding a new favourite show
  const request = db.transaction(["fav_shows"], "readwrite")
                    .objectStore("fav_shows")
                    .add(fav_show)

  // On request's success
  request.onsuccess = event => {
    // Set favourite button text to "Unfavourite"
    $("#" + fav_show.id).html("Unfavourite");
  };

  // On request's error
  request.onerror = event => {
    // Print error to console
    console.log("Adding show to favourites error:");
    console.log(event.target);
  };
}

/**
 * Method for removing a show from the user's favourites
 * @param {*} fav_show Show to be removed from favourites
 */
function removeShowFromFavourites(fav_show) {
  // IndexedDB request for removing a favourite show
  const request = db.transaction(["fav_shows"], "readwrite")
                .objectStore("fav_shows")
                .delete(fav_show.id);

  // On request's success
  request.onsuccess = event => {
    // If on favourites page
    if ($("#fav_list").length) {
      // Get user's favourites so that list will update
      getFavourites();
    }
    else {  // If not on favourites page
      // Set favourite button's text to "Favourite"
      $("#" + fav_show.id).html("Favourite");
    }
  }
  
  // On request's error
  request.onerror = event => {
    // Print error to console
    console.log("Error removing show from favourites:");
    console.log(event.target);
  }
}

/**
 * Method for parsing a show's details from the array of JSON objects
 * @param {*} shows Array of JSON objects representing shows
 */
function getShowDetails(shows) {
  search_results_array = [];

  // For each show
  shows.forEach(function(show_wrapper) {
    // Get show object
    let show = show_wrapper.show;

    // Initialise wanted details
    let id = "";
    let name = "Title Unknown";
    let avg_rating = "Unknown";
    let genres = [];
    let image_url = "";
    let premiered = "Unknown";

    // Get the show's ID
    if (show.hasOwnProperty("id") && show.id !== null) {
      id = show.id;
    }
    else {  // If no ID is found, move onto the next show
      return;
    }

    // Get the show's name
    if (show.hasOwnProperty("name") && show.name !== null) {
        name = show.name;
    }

    // Get the show's rating
    if (show.hasOwnProperty("rating") && show.rating !== null) {
        if (show.rating.hasOwnProperty("average") && show.rating.average !== null) {
            avg_rating = show.rating.average;
        }
    }

    // Get the show's genres
    if (show.hasOwnProperty("genres") && show.genres.length > 0) {
        show.genres.forEach(function(genre) {
          genres.push(genre);
      })
    }

    // Get the show's image URL, either the larger original image or the medium sized one
    if (show.hasOwnProperty("image") && show.image !== null) {
      if (show.image.hasOwnProperty("original") && show.image.original !== null) {
          image_url = show.image.original;
      }
      else if (show.image.hasOwnProperty("medium") && show.image.medium !== null) {
          image_url = show.image.medium;
      }
    }

    // Get the show's premiere date
    if (show.hasOwnProperty("premiered") && show.premiered !== null) {
      premiered = show.premiered;
    }

    // Get the show's plot summary
    if (show.hasOwnProperty("summary") && show.summary !== null) {
      summary = show.summary.replaceAll("<p>", "").replaceAll("</p>", "").replaceAll("<b>", "").replaceAll("</b>", "");
    }

    // Create show object from retrieved details
    let new_show = {
      id: id,
      name: name,
      avg_rating: avg_rating,
      genres: genres,
      image_url: image_url,
      premiered: premiered,
      summary: summary
    }

    // Add new show to search results array
    search_results_array.push(new_show);
  })
}

/**
 * Method for getting an array of shows from the API
 * @param {*} url URL for the API
 */
function getShowsFromAPI(url) {
  // AJAX tool getJSON used to send API request and retrieve returned data
  $.getJSON(url, function(shows) {
    // If shows have been found
    if (shows.length > 0) {
      getShowDetails(shows);  // 
      addShowsToList("search_list", search_results_array);
    }
    else {  // If shows have not been found
      // Show no results message
      noResults("search_list", "No results found :(");
    }
  })
}

/**
 * Method for adding shows to a list
 * @param {*} list_id ID of list shows are to be added to
 * @param {*} shows Shows to be added to list
 */
function addShowsToList(list_id, shows) {
  // Wipe list's HTML content
  let list = $("#" + list_id);
  list.html("");

  // Add each show to list
  shows.forEach(function(show) {
    // HTML for displaying show's name
    let show_info = "<h1><b>" + show.name + "</b></h1>";

    // HTML for displaying show's genres
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

    // HTML for displaying show's average rating
    show_info += "<p><b>Average Rating: </b> " + show.avg_rating;
    if (show.avg_rating !== "Unknown") {
      show_info += "/10"
    }

    // HTML for displaying show's premiere date and plot summary
    show_info += "</p><p><b>Premiered:</b> " + show.premiered + "</p>" +
    "<p><b>Summary:</b> " + show.summary + "</p>";

    // Create ion-label for containing/displaying show's details
    let show_info_label = document.createElement("ion-label");
    $(show_info_label).addClass("ion-text-wrap");
    show_info_label.innerHTML = show_info;

    // Create ion-img for displaying show's poster
    let new_image = document.createElement("ion-img");
    new_image.src = show.image_url;
    $(new_image).addClass("list_img");

    // Set favourite button's text
    let fav_button_text = "Favourite";
    all_favourites_array.forEach(function(fav_show) {
      if (show.id === fav_show.id) {
        fav_button_text = "Unfavourite";
      }
    })

    // Create ion-button for favouriting/unfavouritng show
    let new_fav_button = document.createElement("ion-button");
    new_fav_button.innerHTML = fav_button_text;
    new_fav_button.id = show.id;
    new_fav_button.onclick = function() {
      favouriteHandler(show.id, shows);
    }

    // Create ion-item and give it show's image, details, and favourite button
    let new_item = document.createElement("ion-item");
    new_item.append(new_image);
    new_item.append(show_info_label);
    new_item.append(new_fav_button);
    // Add ion-item to list
    list.append(new_item);
  })
}

/**
 * Method for initialising search for shows
 */
function searchShows() {
  // Initialise API's URL
  var url = "https://api.tvmaze.com/search/shows?q=";
  // Get user's search terms
  var search_terms = getSearchTerms();

  // If user has entered valid search terms
  if (search_terms !== null) {
    // Error message reset
    $("#error_msg").html("");
    // Search terms added to API's URL
    url += search_terms;
    // Search for shows using URL
    getShowsFromAPI(url);
  }
  else {  // If a user has not entered a valid search term, display error message
      $("#error_msg").html("Please enter search term");
  }
}

/**
 * Method for getting user's entered search terms
 * @returns Converted search term, else null
 */
function getSearchTerms() {
  // Get user's search terms, add each word to an array
  let search_term = $("#search_term").val();
  let search_term_array = search_term.trim().split(/\ +/);

  // If user has entered valid search terms
  if (search_term_array.length > 0 && search_term_array[0] !== "") {
      let final_search_term = search_term_array[0];

      // Add a plus between each word
      if (search_term_array.length > 1) {
          for (let i = 1; i < search_term_array.length; i++) {
              final_search_term += "+" + search_term_array[i];
          }
      }

      // Return converted string search term
      return final_search_term;
  }
  else {  // If user has not entered valid search terms, return null
      return null;
  }
}

/**
 * Method for displaying no results message
 * @param {*} list_id ID of list where message will be displayed
 * @param {*} message Message to be displayed
 */
function noResults(list_id, message) {
  // Add message to list
  let search_list = $("#" + list_id);
  search_list.html("<h1>" + message + "</h1>");
}