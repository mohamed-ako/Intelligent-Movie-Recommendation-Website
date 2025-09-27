// src/components/UserMovieList.js
import React from "react";
import {
  useGetUserProfileQuery,
  useUpdateUserMoviesMutation,
} from "./services/apiService";

const UserMovieList = () => {
  const { data: user, isLoading } = useGetUserProfileQuery();
  const [updateUserMovies] = useUpdateUserMoviesMutation();

  const handleMoveToWatched = async (movieId) => {
    await updateUserMovies({
      action: "moveToWatched",
      movieId,
    });
  };

  if (isLoading) return <p>Loading user data...</p>;

  return (
    <div>
      <h3>🎬 Currently Watching</h3>
      <ul>
        {user?.watching?.map((movieId) => (
          <li key={movieId}>
            {movieId}
            <button onClick={() => handleMoveToWatched(movieId)}>
              Mark as Watched
            </button>
          </li>
        ))}
      </ul>

      <h3>✅ Already Watched</h3>
      <ul>
        {user?.watched?.map((movieId) => (
          <li key={movieId}>{movieId}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserMovieList;
