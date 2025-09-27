import "../App.css";
import React, { useState } from "react";
import { useRecommendMoviesQuery } from "./services/apiService";

const Recommend = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data = [],
    isLoading,
    isError,
  } = useRecommendMoviesQuery(searchTerm, {
    skip: searchTerm.length < 2,
  });

  // {/* data.slice(0, 10).map((movie) => ( */}

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search for Recommendations movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {isLoading && <p>Searching for Recommendations...</p>}
      {isError && <p>Error loading Recommendations results</p>}
      <div className="container">
        {searchTerm &&
          data.map((movie) => (
            <div className="content" key={movie.id} onHover={() => {}}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                alt={movie.title}
              />
              <h2>{movie.title}</h2>
              <span>{movie.release_date}</span>
              {/* <span>{movie.vote_average} / 10 Stars</span>
            <div className="showByhover">{movie.overview}</div> */}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Recommend;
