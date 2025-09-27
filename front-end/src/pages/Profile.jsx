import {
  useRecommendByBehaviorQuery,
  useGetProfileQuery,
  useGetDataQuery,
} from "./services/apiService";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
  }, [navigate]);

  const { data: user } = useGetProfileQuery();
  const { data: allMovies } = useGetDataQuery("/all_movies");

  const { data: recommendations, isLoading } = useRecommendByBehaviorQuery();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  useEffect(() => {
    if (recommendations) {
      console.log("Personalized Recommendations:", recommendations);
    }
  }, [recommendations]);

  // Favorite Movies

  const favoriteMovies =
    allMovies?.filter((movie) =>
      user?.favorites?.map(String).includes(String(movie.id))
    ) || [];

  const clickedMovies =
    allMovies?.filter((movie) =>
      user?.clicked?.map(String).includes(String(movie.id))
    ) || [];

  console.log("favoriteMovies", favoriteMovies);
  console.log("allMovies", allMovies);
  console.log("user", user);

  return (
    <div className="profile">
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
      <h2>Welcome {user?.name}</h2>

      {/* Favorites Section */}
      <h3>⭐ Favorites</h3>
      <div className="container">
        {favoriteMovies.length > 0 ? (
          favoriteMovies.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id} state={{ movie }}>
              <div className="content">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                  alt={movie.title}
                />
                <h3>{movie.title}</h3>
                <span>{movie.vote_average} / 10</span>
              </div>
            </Link>
          ))
        ) : (
          <p>No favorites added yet.</p>
        )}
      </div>

      {/* Clicked Movies Section */}
      <h3>👁️ Recently Clicked</h3>
      <div className="container">
        {clickedMovies.length > 0 ? (
          clickedMovies.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id} state={{ movie }}>
              <div className="content">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                  alt={movie.title}
                />
                <h3>{movie.title}</h3>
                <span>{movie.vote_average} / 10</span>
              </div>
            </Link>
          ))
        ) : (
          <p>No clicked movies yet.</p>
        )}
      </div>

      {/* Recommendations */}
      <h3>🎯 Recommended for You</h3>
      <div className="container">
        {isLoading && <p>Loading recommendations...</p>}
        {recommendations?.length > 0
          ? recommendations.map((movie) => (
              <Link to={`/movie/${movie.id}`} key={movie.id} state={{ movie }}>
                <div className="content">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                    alt={movie.title}
                  />
                  <h3>{movie.title}</h3>
                  <span>{movie.vote_average} / 10</span>
                </div>
              </Link>
            ))
          : !isLoading && <p>No personalized recommendations found.</p>}
      </div>
    </div>
  );
}
