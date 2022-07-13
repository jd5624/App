$(function() {
    $("#search_button").click(searchShows);
})

function getList(url) {
    $.getJSON(url, function(shows) {
        console.log(shows);

        let show_info = "";

        shows.forEach(function(show_wrapper) {
            let show = show_wrapper.show;
            let show_name = "Unknown";
            let show_avg_rating = "Unknown";

            if (show.hasOwnProperty("name") && show.name !== null) {
                show_name = show.name;
            }

            if (show.hasOwnProperty("rating") && show.rating !== null) {
                if (show.rating.hasOwnProperty("average") && show.rating.average !== null) {
                    show_avg_rating = show.rating.average;
                }
            }

            show_info += "Title: " + show_name + "<br>" +
            "Average Rating: " + show_avg_rating + "<br><br>";
        })

        $("#search_found").html(show_info);
    })
}

function searchShows() {
    var url = "https://api.tvmaze.com/search/shows?q=";
    var search_terms = getSearchTerms();

    if (search_terms !== null) {
        $("#error_msg").html("")
        url += search_terms;
        getList(url);
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