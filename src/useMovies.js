import { useState, useEffect } from "react";

const APIKEY = "8c757fb"; // API key for OMDB API

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]); // State for storing movie data
  const [isLoading, setIsLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Fetching Movie Data using useEffect hook
  useEffect(() => {
    callback?.();
    const controller = new AbortController();
    // Async function to fetch movies
    async function fetchMovies() {
      try {
        setIsLoading(true); // Set loading status to true
        setError(null); // Clear any previous error

        const res = await fetch(
          // Fetch movie data from OMDB API
          `https://www.omdbapi.com/?s=${query.trim()}&apikey=${APIKEY}`,
          { signal: controller.signal }
        );
        const data = await res.json(); // Parse response to JSON
        // console.log(data);
        //
        if (data.Response === "False") {
          throw new Error(data.Error); // Throw error if response is false
        }

        setMovies(data.Search); // Set fetched movies to state
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
    // handleClosebtn();
    fetchMovies(); // Call fetchMovies function

    return function () {
      controller.abort();
    };

  }, [query, callback]); // useEffect dependency on query state
  
  return [movies, isLoading, error];
}
