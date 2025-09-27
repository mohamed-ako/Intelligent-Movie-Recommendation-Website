import "../App.css";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useRecommendMoviesQuery } from "./services/apiService";
import { useUpdateClickMutation } from "./services/apiService";
import { useAddFavoriteMutation } from "./services/apiService";


function MovieDetails() {
  const location = useLocation();
  const movie = location.state?.movie;

  const [searchTerm, setSearchTerm] = useState("");

  const [updateClick] = useUpdateClickMutation();
  const [addFavorite] = useAddFavoriteMutation();
  
  // useEffect(() => {
  //   if (movie?.id) {
  //     updateClick(movie.id); // register click when page loads
  //   }
  // }, [movie?.id]);

  useEffect(() => {
    if (movie?.id) {
      updateClick(movie.id); // ✅ correct (as long as movie.id is a number or string)
    }
  }, [movie?.id]);
  



  useEffect(() => {
    if (movie?.title) {
      setSearchTerm(movie.title);
    }
  }, [movie]);

  const {
    data = [],
    isLoading,
    isError,
  } = useRecommendMoviesQuery(searchTerm, {
    skip: searchTerm.length < 2,
  });

  if (!movie) return <p>Movie not found.</p>;

  return (
    <div className="movie-detail">
      <button className="back-button" onClick={() => window.history.back()}>
        Back
      </button>

      {/* Blurred Background */}
      {movie.backdrop_path && (
        <div
          className="backdrop-blur"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        ></div>
      )}
      <div className="overlay"></div>

      {/* Content Over Blur */}
      <div className="movie-content">
        <h1>{movie.title}</h1>

        {/* Image */}
        {movie.backdrop_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
            alt={movie.title}
          />
        ) : (
          <div className="no-image">No backdrop image available.</div>
        )}

        {/* Info Section */}
        <section className="movie-info">
        <button
  onClick={() => {
    if (movie?.id) {
      addFavorite({ movieId: movie.id });
    }
  }}
  className="favorite-button"
>
  ❤️ Add to Favorites
</button>
          <p>
            <strong>Overview:</strong> {movie.overview || "No overview available."}
          </p>
          <p>
            <strong>Original Title:</strong> {movie.original_title}
          </p>
          <p>
            <strong>Release Date:</strong> {movie.release_date || "N/A"}
          </p>
          <p>
            <strong>Popularity:</strong> {movie.popularity.toFixed(2)} views
          </p>
          <p>
            <strong>Rating:</strong>{" "}
            {movie.vote_average > 0 ? `${movie.vote_average}/10` : "Not yet rated"}
          </p>
          <p>
            <strong>Genres:</strong>{" "}
            {Array.isArray(movie.genres)
              ? movie.genres.join(", ")
              : "Unknown genres"}
          </p>
          <p>
            <strong>Language:</strong> {movie.original_language.toUpperCase()}
          </p>
        </section>

        {/* Cast Section */}
        <section className="cast-section">
          <h3>Cast</h3>
          <ul>
            {movie.credits?.cast?.slice(0, 8).map((castMember) => (
              <li key={castMember.id}>
                {castMember.name} - {castMember.character || "Unknown role"}
              </li>
            )) ?? <p>No cast information available.</p>}
          </ul>
        </section>

        {/* Trailer Section */}
        {movie.videos?.results?.length > 0 &&
        movie.videos.results[0]?.key ? (
          <section className="trailer-section">
            <h3>Trailer</h3>
            <iframe
              src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </section>
        ) : (
          <p>No trailer available.</p>
        )}
      </div>

      {/* Recommended Movies */}
      {/* <> */}
      <section className="container recommendations">
      <h3>Recommended Movies</h3>

        {isLoading && <p>Loading recommendations...</p>}
        {isError && <p>Error loading recommendations.</p>}
        {!isLoading && !isError && Array.isArray(data) && data.length > 0 ? (
          data.map((recMovie) => (
            <div className="content" key={recMovie.id}>
              {recMovie.backdrop_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${recMovie.backdrop_path}`}
                  alt={recMovie.title}
                />
              ) : (
                <div className="no-image">No image</div>
              )}
              <h2>{recMovie.title}</h2>
              <span>{recMovie.release_date}</span>
            </div>
          ))
        ) : (
          <p>No recommendations found.</p>
        )}
      </section>
      {/* </> */}
    </div>
  );
}

export default MovieDetails;