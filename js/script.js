document.addEventListener("DOMContentLoaded", init);

const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
  },
  api: {
    apiKey: "493416f28c67cc7b85eaf63fa3006630",
    apiUrl: "https://api.themoviedb.org/3/",
  },
};

// initialize the app
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displayMovieSlider();
      displayPopularMovies();
      break;
    case "/shows.html":
      displayPopularShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayShowDetails();
      break;
    case "/search.html":
      search();
      break;
  }

  highlightActiveLink();
}

// display popular movies
async function displayPopularMovies() {
  const { results } = await fetchApiData("movie/popular");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            ${
              movie.poster_path
                ? `<img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"
              />`
                : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>  
    `;
    document.querySelector("#popular-movies").appendChild(div);
  });
}

// display popular tv shows
async function displayPopularShows() {
  const { results } = await fetchApiData("tv/popular");
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
            <a href="tv-details.html?id=${show.id}">
              ${
                show.poster_path
                  ? `<img
                  src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                  class="card-img-top"
                  alt="${show.name}"
                />`
                  : `<img
                src="../images/no-image.jpg"
                class="card-img-top"
                alt="${show.name}"
              />`
              }
            </a>
            <div class="card-body">
              <h5 class="card-title">${show.name}</h5>
              <p class="card-text">
                <small class="text-muted">Air Date: ${
                  show.first_air_date
                }</small>
              </p>
            </div>  
      `;
    document.querySelector("#popular-shows").appendChild(div);
  });
}

// display movie details
async function displayMovieDetails() {
  const movieID = window.location.search.split("=")[1];
  const movie = await fetchApiData(`movie/${movieID}`);

  // to add the backdrop image
  displayBackgroundImage("movie", movie.backdrop_path);

  const div = document.createElement("div");
  div.innerHTML = `
  <div class="details-top">
          <div>
          ${
            movie.poster_path
              ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
              : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
          />`
          }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
             ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href=${
              movie.homepage
            } target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumbers(
              movie.budget
            )}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumbers(
              movie.revenue
            )}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies
            .map((company) => `<span>${company.name}</span>`)
            .join(",  ")}</div>
    </div>
  `;
  document.querySelector("#movie-details").appendChild(div);
}

// display show details
async function displayShowDetails() {
  const showID = window.location.search.split("=")[1];
  const show = await fetchApiData(`tv/${showID}`);

  // to add the backdrop image
  displayBackgroundImage("show", show.backdrop_path);

  const div = document.createElement("div");
  div.innerHTML = `
    <div class="details-top">
            <div>
            ${
              show.poster_path
                ? `<img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="${show.name}"
              />`
                : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`
            }
            </div>
            <div>
              <h2>${show.name}</h2>
              <p>
                <i class="fas fa-star text-primary"></i>
                ${show.vote_average.toFixed(1)} / 10
              </p>
              <p class="text-muted">First Air Date: ${show.first_air_date}</p>
              <p>
               ${show.overview}
              </p>
              <h5>Genres</h5>
              <ul class="list-group">
              ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
              </ul>
              <a href=${
                show.homepage
              } target="_blank" class="btn">Visit show Homepage</a>
            </div>
          </div>
          <div class="details-bottom">
            <h2>Show Info</h2>
            <ul>
              <li><span class="text-secondary">Number Of Episodes:</span> ${
                show.number_of_episodes
              }</li>
              <li><span class="text-secondary">Last Episode To Air:</span> ${
                show.last_episode_to_air.name
              }</li>
              <li><span class="text-secondary">Status:</span> ${
                show.status
              }</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">${show.production_companies
              .map((company) => `<span>${company.name}</span>`)
              .join(",  ")}</div>
      </div>
    `;
  document.querySelector("#show-details").appendChild(div);
}

// display movies slider
async function displayMovieSlider() {
  const { results } = await fetchApiData("movie/now_playing");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
            </h4> 
        `;
    document.querySelector(".swiper-wrapper").appendChild(div);
    initSwiper();
  });
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// search movies / tv shows
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if (global.search.term === "" || global.search.term === null) {
    showAlert("please enter a search term", "error");
  }

  const { results, page, total_pages } = await searchApiData();
  if (results.length === 0) {
    showAlert("no results found", "error");
  }

  displaySearchResults(results);
  document.querySelector("#search-term").value = "";
}

function displaySearchResults(results) {
  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="${global.search.type}-details.html?id=${result.id}">
            ${
              result.poster_path
                ? `<img
                src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
                class="card-img-top"
                alt="${result.title ?? result.name}"
              />`
                : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${result.title ?? result.name}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${result.title ?? result.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${
                result.release_date ?? result.first_air_date
              }</small>
            </p>
          </div>  
    `;
    document.querySelector("#search-results").appendChild(div);
  });
}

// display background images on details pages
function displayBackgroundImage(type, backdropPath) {
  const div = document.createElement("div");
  div.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backdropPath})`;
  div.style.backgroundSize = "cover";
  div.style.backgroundPosition = "center";
  div.style.backgroundRepeat = "no-repeat";
  div.style.height = "100vh";
  div.style.width = "100vw";
  div.style.position = "absolute";
  div.style.top = "0";
  div.style.left = "0";
  div.style.zIndex = "-1";
  div.style.opacity = "0.2";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(div);
  } else {
    document.querySelector("#show-details").appendChild(div);
  }
}

// Highlight the active link (movies || tv shows)
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

// show alert
function showAlert(message, className) {
  const alertElement = document.createElement("div");
  alertElement.classList.add("alert", className);
  alertElement.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertElement);
  setTimeout(() => alertElement.remove(), 2000);
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

function addCommasToNumbers(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// fetch data from the TMDB API
async function fetchApiData(endPoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();
  const response = await fetch(
    `${API_URL}${endPoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await response.json();
  hideSpinner();

  return data;
}

// make serach request
async function searchApiData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();
  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}`
  );

  const data = await response.json();
  hideSpinner();

  return data;
}
