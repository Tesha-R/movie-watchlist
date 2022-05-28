const movieSearchForm = document.getElementById("movie-search-form");
const movieSearchInput = document.getElementById("movie-search");
const app = document.getElementById("app");
const watchListBtn = document.getElementById("watch-list-btn");
const pageTitle = document.getElementById("page-title");

// Request movies from OMB API and return search results
function getMovies(searchResults) {
  let html = "";
  fetch(`https://www.omdbapi.com/?s=${searchResults}&apikey=2428b394`)
    .then((response) => response.json())
    .then((movies) => {
      console.log(movies);
      movies.Search.forEach((movie) => {
        html += movieSearchHTML(movie);
        app.innerHTML = html;
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
// Get search input value to pass to API
movieSearchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let searchResults = movieSearchInput.value;
  if (searchResults.indexOf(" ") >= 0) {
    // If search has spaces removes space and +
    let searchResultsSpace = searchResults.replace(/ /g, "+");
    getMovies(searchResultsSpace);
  } else {
    getMovies(searchResults);
  }
  pageTitle.textContent = "Find your favorite films";
});

/* ------ Adding movie to watch list ------ */

// Add movie to watch list and local storage
function addToWatchlist(movieId) {
  let movieList = getMovieStorage();
  fetch(`https://www.omdbapi.com/?i=+${movieId}&apikey=2428b394`)
    .then((response) => response.json())
    .then((data) => {
      movieList.push(data);
      localStorage.setItem("movieList", JSON.stringify(movieList));
    });
}
// Get movies from local storage
function getMovieStorage() {
  return JSON.parse(localStorage.getItem("movieList")) || [];
}
// Display movies from local storage in watchlist
function renderMovieList() {
  let movieList = getMovieStorage();
  let html = "";
  console.log(movieList);
  movieList.forEach((movie) => {
    html += movieHTML(movie);
    app.innerHTML = html;
  });
  localStorage.setItem("movieList", JSON.stringify(movieList));
}

// Add to watch list button event listener - add movie to list
app.addEventListener("click", (e) => {
  let movieId = e.target.dataset.id;
  if (e.target.matches(".btn-watch")) {
    addToWatchlist(movieId);
  }
});

// My watch list link - view watch list
watchListBtn.addEventListener("click", (e) => {
  e.preventDefault();
  pageTitle.textContent = "My watch list";
  renderMovieList();
});
// Remove movies from watch list
function removeMovieFromList(movieId) {
  let movieList = getMovieStorage();
  for (let i = 0; i < movieList.length; i++) {
    if (movieId === movieList[i].imdbID || movieList[i].Response === "False") {
      movieList.splice(i, 1);
      i--;
      console.log(movieList[i]);
    }
    localStorage.setItem("movieList", JSON.stringify(movieList));
  }
}
// Delete btn event handler
app.addEventListener("click", (e) => {
  let movieId = e.target.dataset.id;
  if (e.target.matches(".btn-delete")) {
    console.log("delete btn");
    e.target.parentElement.parentElement.remove();
    removeMovieFromList(movieId);
  }
});

// Html for wish list
function movieHTML(movie) {
  return `
  <div class="movie">
        <div class="movie-poster" style="background-image:url(${movie.Poster})">
        </div>
        <div class="movie-content">
          <h2 class="movie-title">${movie.Title}</h2>
          <p class="movie-year">${movie.Runtime}</p>
          <p class="movie-genre">${movie.Genre}</p>
          <p class="movie-plot">${movie.Plot}</p>
          <button id="delete-btn" class="btn-delete btn-main" data-id="${movie.imdbID}">Remove</button>
        </div>
      </div>
  
  `;
}
// Html for search results
function movieSearchHTML(movie) {
  return `
  <div class="movie">
        <div class="movie-poster" style="background-image:url(${movie.Poster})">
        </div>
        <div class="movie-content">
          <h2 class="movie-title">${movie.Title}</h2>
          <p class="movie-year">${movie.Year}</p>
          <p class="movie-type">${movie.Type}</p>
          <button id="watchlist-btn" class="btn-watch btn-main" data-id="${movie.imdbID}">+ watchlist</button>
        </div>
      </div>
  
  `;
}
