// Importing Necessary Libraries
import { useEffect, useState } from "react";
import { tempMovieData } from "./MovieData";
import { tempWatchedData } from "./MovieData";

// Importing Font Awesmome React Component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Importing FontAwesome Globaally
import { library } from "@fortawesome/fontawesome-svg-core";

// import your icons
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
library.add(fab, fas, far);

export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const tempQuery = "Interstellar";
  const APIKEY = "8c757fb";

  // Fetching Movie Data using useEffect.
  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(
          `https://www.omdbapi.com/?s=${query}&apikey=${APIKEY}`
        );
        const data = await res.json();
        // console.log(data);
        //
        if (data.Response === "False") {
          throw new Error(data.Error);
        }

        setMovies(data.Search);
        setWatched(tempWatchedData);
        setIsLoading(false);
      } catch (err) {
        if (err.message === "Failed to fetch") {
          setError("Something Went Wrong...");
          // console.error(err.message);
        } else {
          setError(err.message);
          // console.error(err.message);
        }
      } finally {
        setIsLoading(false);
        // setError(null);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError(null);
      return;
    }
    fetchMovies();
  }, [query]);

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {!isLoading && !error && <MovieList movies={movies} />}
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
          {isLoading && <Loader faicon="fa-solid fa-spinner" toSpin={true} />}
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
        </Box>

        <Box>
          <Summary watched={watched} />
          <WatchedMovieList watched={watched} />
        </Box>
      </Main>
    </>
  );
}

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
function Main({ movies, watched, children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);

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

function MovieList({ movies }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function Movie({ movie }) {
  return (
    <li key={movie.imdbID}>
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

function WatchedMovieList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
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
      </div>
    </li>
  );
}
function Summary({ watched }) {
  const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

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
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Search({ query, setQuery }) {
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

function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
