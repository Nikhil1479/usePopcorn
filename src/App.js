// Importing Necessary Libraries
import { useEffect, useState } from "react"; // Importing React hooks for component lifecycle management
import { tempMovieData } from "./MovieData"; // Importing temporary movie data
import { tempWatchedData } from "./MovieData"; // Importing temporary watched movie data
import StarRating from "./StarRating"; // Importing StarRating component

// Importing Font Awesmome React Component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importing FontAwesomeIcon component

// Importing FontAwesome Globally
import { library } from "@fortawesome/fontawesome-svg-core"; // Importing library for FontAwesome icons

// import your icons
import { fab } from "@fortawesome/free-brands-svg-icons"; // Importing FontAwesome brands icons
import { fas } from "@fortawesome/free-solid-svg-icons"; // Importing FontAwesome solid icons
import { far } from "@fortawesome/free-regular-svg-icons"; // Importing FontAwesome regular icons
library.add(fab, fas, far); // Adding imported icons to the library

const APIKEY = "8c757fb"; // API key for OMDB API

// Exporting default function component named App
export default function App() {
  // useState hooks for managing component state
  const [movies, setMovies] = useState(tempMovieData); // State for storing movie data
  const [watched, setWatched] = useState(tempWatchedData); // State for storing watched movies
  const [isLoading, setIsLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [query, setQuery] = useState(""); // State for search query
  const [selectedMovie, setSelectedMovie] = useState(null); // State for selected movie details

  // Function to close selected movie details
  function handleClosebtn() {
    setSelectedMovie(null);
  }

  // Function to handle selecting a movie and toggling its details
  function handleSelectedMovie(id) {
    setSelectedMovie(selectedMovie === id ? null : id);
  }

  // Function to handle adding a new movie to the watched list
  function handleAddMovie(newMovie) {
    setWatched((watched) => [...watched, newMovie]);
  }

  // Function to handle deleting a movie from watched list
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // Fetching Movie Data using useEffect hook
  useEffect(() => {
    const controller = new AbortController();
    // Async function to fetch movies
    async function fetchMovies() {
      try {
        setIsLoading(true); // Set loading status to true
        setError(null); // Clear any previous error

        const res = await fetch(
          // Fetch movie data from OMDB API
          `https://www.omdbapi.com/?s=${query}&apikey=${APIKEY}`,
          { signal: controller.signal }
        );
        const data = await res.json(); // Parse response to JSON
        // console.log(data);
        //
        if (data.Response === "False") {
          throw new Error(data.Error); // Throw error if response is false
        }

        setMovies(data.Search); // Set fetched movies to state
        setWatched(tempWatchedData); // Reset watched movies data
        setIsLoading(false); // Set loading status to false
      } catch (err) {
        if (err.message === "Failed to fetch") {
          setError("Something Went Wrong..."); // Set error message for failed fetch
          // console.error(err.message);
        } else if (err.name === "AbortError") {
          console.log("User Aborted"); // Ignoring the Abort Error
        } else {
          setError(err.message); // Set error message for other errors
        }
      } finally {
        setIsLoading(false); // Set loading status to false
        // setError(null);
      }
    }
    if (query.length < 3) {
      setMovies([]); // Clear movies data if query length is less than 3
      setError(null); // Clear any previous error
      return;
    }
    handleClosebtn();
    fetchMovies(); // Call fetchMovies function

    return function () {
      controller.abort();
    };
  }, [query]); // useEffect dependency on query state

  // JSX structure for rendering App component
  return (
    <>
      {/* Navbar component */}
      <Navbar>
        <Logo /> {/* Logo component */}
        <Search query={query} setQuery={setQuery} /> {/* Search component */}
        <NumResults movies={movies} /> {/* NumResults component */}
      </Navbar>

      {/* Main component */}
      <Main>
        <Box>
          {/* Render MovieList component if not loading and no error */}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              handleSelectedMovie={handleSelectedMovie}
            />
          )}
          {/* Render ErrorMessage component if error */}
          {error && (
            <ErrorMessage
              message={error}
              faicon={
                error === "Movie not found!"
                  ? "fa-solid fa-ban"
                  : "fa-solid fa-circle-exclamation"
              }
            />
          )}
          {/* Render Loader component if loading */}
          {isLoading && <Loader faicon="fa-solid fa-spinner" toSpin={true} />}
        </Box>

        <Box>
          {/* Render MovieDetails component if movie is selected */}
          {selectedMovie ? (
            <MovieDetails
              key={selectedMovie}
              selectedID={selectedMovie}
              onClosebtn={handleClosebtn}
              onAddMovie={handleAddMovie}
              watched={watched}
            />
          ) : (
            <>
              {/* Render Summary and WatchedMovieList components if no movie is selected */}
              <Summary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

// Function component for rendering movie details
function MovieDetails({ selectedID, onClosebtn, onAddMovie, watched }) {
  // useState hook for managing component state
  const [movieDetail, setMovieDetail] = useState({}); // State for movie details
  const [userRating, setUserRating] = useState(0); // State for user rating

  // Destructuring movieDetail object
  const {
    Title: title,
    Plot: plot,
    Director: director,
    Genre: genre,
    Released: released,
    Poster: poster,
    imdbRating,
    Runtime: runtime,
    Actors: actors,
  } = movieDetail;

  // Function to handle adding movie to watched list
  function handleAddMovie() {
    const newMovie = {
      imdbID: selectedID,
      poster,
      title,
      runtime: Number(runtime.split(" ")[0]),
      imdbRating,
      userRating: userRating,
    };
    console.log(newMovie);
    onAddMovie(newMovie); // Call onAddMovie function to add movie to watched list
    onClosebtn(); // Close movie details
  }

  // Check if movie is already in watched list
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID);

  //This line of code retrieves the user rating of a specific movie from the watched list, if it exists, based on its IMDb ID.
  const selectedMovieUserRating = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating;

  // useEffect hook to fetch movie details
  useEffect(() => {
    // Async function to fetch movie details
    async function fetchMovieDetails() {
      try {
        const res = await fetch(
          // Fetch movie details from OMDB API
          `https://www.omdbapi.com/?i=${selectedID}&apikey=${APIKEY}`
        );
        const data = await res.json(); // Parse response to JSON
        console.log(data);
        setMovieDetail(data); // Set fetched movie details to state
      } catch (e) {
        console.log(e.message);
      }
    }
    fetchMovieDetails(); // Call fetchMovieDetails function
  }, [selectedID]); // useEffect dependency on selectedID state

  // useEffect hook to change webpage title based on the selected movie
  /* The above code is a React useEffect hook that sets the document title to "Movie | {title}" when
  the title variable is truthy. It also returns a cleanup function that resets the document title to
  "usePopcorn" when the component unmounts or when the title variable changes. The useEffect hook
  will run whenever the title variable changes. */
  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    // cleanup function that resets the document title to "usePopcorn" when the component unmounts or when the title variable changes.
    return function () {
      document.title = "usePopcorn";
    };
  }, [title]);

  /* The below code is a React useEffect hook that adds an event listener for the "keydown" event on the
document. When a key is pressed, it checks if the key code is "Escape". If the Escape key is
pressed, it calls the onClosebtn function and logs "closing" to the console. The useEffect hook also
returns a cleanup function that removes the event listener when the component unmounts or when the
onClosebtn function changes. */
  useEffect(() => {
    function callback(e) {
      if (e.code === "Escape") {
        onClosebtn();
        console.log("closing");
      }
    }
    // Attaching Event Listener
    document.addEventListener("keydown", callback);

    // Cleanup Function to remove Event Listener
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [onClosebtn]);

  // JSX structure for rendering MovieDetails component
  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onClosebtn}>
          <FontAwesomeIcon icon="fa-solid fa-angle-left" />{" "}
        </button>
        <img src={poster} alt={`Poster of ${title} movie`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDB Rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          {!isWatched ? (
            <>
              <StarRating
                maxRating={10}
                size={21}
                defaultRating={0}
                onSetRating={setUserRating}
              />
              <p>{userRating ? `This movie is rated ${userRating}` : ""}</p>

              {/* Button to add movie to watched list */}
              <button className="btn-add" onClick={() => handleAddMovie()}>
                {" "}
                + Add To List
              </button>
            </>
          ) : (
            <p>You rated movie {selectedMovieUserRating} </p>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring, {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}

// Function component for rendering error message
function ErrorMessage({ message, faicon = "fa-solid fa-circle-exclamation" }) {
  return (
    <p className="error">
      <span>
        <FontAwesomeIcon icon={faicon} color="red" />
      </span>
      {message}
    </p>
  );
}

// Function component for rendering loader
function Loader({ faicon = "fa-solid fa-spinner", toSpin = true }) {
  return (
    <p className="loader">
      {" "}
      <span>
        <FontAwesomeIcon icon={faicon} spin={toSpin} />
      </span>
      Loading...
    </p>
  );
}

// Function component for rendering main content
function Main({ children }) {
  return <main className="main">{children}</main>;
}

// Function component for rendering collapsible box
function Box({ children }) {
  const [isOpen1, setIsOpen1] = useState(true); // useState hook for managing component state

  // JSX structure for rendering Box component
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}

// Function component for rendering list of movies
function MovieList({ movies, handleSelectedMovie }) {
  // JSX structure for rendering MovieList component
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleSelectedMovie={handleSelectedMovie}
        />
      ))}
    </ul>
  );
}

// Function component for rendering individual movie
function Movie({ movie, handleSelectedMovie }) {
  // JSX structure for rendering Movie component
  return (
    <li key={movie.imdbID} onClick={() => handleSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// Function component for rendering list of watched movies
function WatchedMovieList({ watched, onDeleteWatched }) {
  // JSX structure for rendering WatchedMovieList component
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

// Function component for rendering individual watched movie
function WatchedMovie({ movie, onDeleteWatched }) {
  // JSX structure for rendering WatchedMovie component
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          <FontAwesomeIcon icon="fa-solid fa-xmark" />
        </button>
      </div>
    </li>
  );
}

// Function component for rendering summary of watched movies
function Summary({ watched }) {
  // Function to calculate average of an array
  const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

  // Calculating average IMDb rating, user rating, and runtime of watched movies
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  // JSX structure for rendering Summary component
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

// Function component for rendering logo
function Logo() {
  // JSX structure for rendering Logo component
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

// Function component for rendering number of search results
function NumResults({ movies }) {
  // JSX structure for rendering NumResults component
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

// Function component for rendering search input
function Search({ query, setQuery }) {
  // JSX structure for rendering Search component
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

// Function component for rendering navigation bar
function Navbar({ children }) {
  // JSX structure for rendering Navbar component
  return <nav className="nav-bar">{children}</nav>;
}