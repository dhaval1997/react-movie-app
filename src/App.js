import React, { useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false); // State to track retrying

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    setRetrying(false); // Reset retrying when a new request is made.

    try {
      const response = await fetch("https://swapi.py4e.com/api/film");

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      const movielist = data.results.map((movie) => {
        return {
          id: movie.episode_id,
          title: movie.title,
          openingText: movie.opening_crawl,
          releaseDate: movie.release_date,
        };
      });
      setMovies(movielist);
    } catch (error) {
      setError(error.message);
      // If error occurs, start retrying after 5 seconds
      if (!retrying) {
        setRetrying(true);
        setTimeout(fetchData, 5000);
      }
    }
    setIsLoading(false);
  };

  const handleCancelRetry = () => {
    setRetrying(false); // Cancel retrying
  };

  let content = <p>Found No Movies</p>;
  if (isLoading) {
    content = <p>Loading..</p>;
  }
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error && !retrying) {
    content = (
      <div>
        <p>{error}</p>
        <button onClick={handleCancelRetry}>Cancel Retry</button>
      </div>
    );
  }

  return (
    <React.Fragment>
      {console.log("renderes")}
      <section>
        <button onClick={fetchData}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
