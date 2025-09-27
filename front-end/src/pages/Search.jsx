import "../App.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useSearchMoviesQuery, useRecommendMoviesQuery } from "./services/apiService";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: searchData = [],
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchMoviesQuery(searchTerm, {
    skip: searchTerm.length < 2,
  });

  const {
    data: recommendData = [],
    isLoading: isRecommendLoading,
    isError: isRecommendError,
  } = useRecommendMoviesQuery(searchTerm, {
    skip: searchTerm.length < 2,
  });

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && (
        <main>
          {/* Search Results */}
          {isSearchLoading && <p>Searching...</p>}
          {isSearchError && <p>Error loading search results.</p>}
          {!isSearchLoading && !isSearchError && searchData.length > 0 && (
            <>
              <h3>Search Results:</h3>
              <div className="container">
                {searchData.slice(0, 10).map((movie) => (
      <Link to={`/movie/${movie.id}`} key={movie.id} state={{movie}}>

                  <div className="content" key={movie.id}>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                      alt={movie.title}
                    />
                    <h2>{movie.title}</h2>
                    <span>{movie.release_date}</span>
                    <div className="showByhover">{movie.overview}</div>

                  </div>
                  </Link>

                ))}
              </div>
            </>
          )}

          {/* Recommended Movies */}
          {isRecommendLoading && <p>Loading recommendations...</p>}
          {isRecommendError && <p>Error loading recommendations.</p>}
          {!isRecommendLoading && !isRecommendError && recommendData.length > 0 && (
            <>

              <h3>Recommended Movies:</h3>
              <div className="container recommendations">
                {recommendData.slice(0, 10).map((movie) => (
      <Link to={`/movie/${movie.id}`} key={movie.id} state={{movie}}>

                  <div className="content" key={movie.id}>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                      alt={movie.title}
                    />
                    <h2>{movie.title}</h2>
                    <span>{movie.release_date}</span>
                    <div className="showByhover">{movie.overview}</div>

                  </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {!isRecommendLoading &&
            !isRecommendError &&
            recommendData.length === 0 && (
              <p>No recommendations found.</p>
            )}
        </main>
      )}
    </div>
  );
};

export default Search;
