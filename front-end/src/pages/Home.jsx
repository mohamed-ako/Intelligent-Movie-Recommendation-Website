import "../App.css";
import { useState, useEffect } from "react";
import { useGetDataQuery } from "./services/apiService";
import { Link } from "react-router-dom";
import { useUpdateClickMutation,useRecommendByBehaviorQuery,useAddFavoriteMutation} from "./services/apiService";



function Home() {

  const [updateClick] = useUpdateClickMutation();
  const [addFavorite] = useAddFavoriteMutation();
  


  const [nextCounter, setNextCounter] = useState(40);
  const [olCounter, setOlCounter] = useState(0);
  const [chosen, setChosen] = useState("");
  const [chosenData, setChosenData] = useState([]);

  const { data, isLoading, isError } = useGetDataQuery("/all_movies");

  const { data: recommendations =[], isLoading:recLoading  } = useRecommendByBehaviorQuery();

  

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data</p>;

  const popularity_desc = [...data].sort((a, b) => b.popularity - a.popularity);
  const vote_average_desc = [...data].sort((a, b) => b.vote_average - a.vote_average);
  const release_date_desc = [...data].sort(
    (a, b) => new Date(b.release_date) - new Date(a.release_date)
  );

  console.log(release_date_desc)
  const handleChoose = (type, dataList) => {
    setChosen(type);
    setChosenData(dataList);
    setOlCounter(0);
    setNextCounter(40);
  };


  const renderMovies = (movies) =>
    movies.map((movie) => (
      <Link to={`/movie/${movie.id}`} key={movie.id} state={{movie}}>
      <div className="content" key={movie.id}>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
          alt={movie.title}
        />
        <h2>{movie.title}</h2>
        <span>{movie.popularity} Views - </span>
        <span>{movie.vote_average} / 10 Stars</span>
        <span><button
  onClick={(e) => {
    if (movie?.id) {
      e.preventDefault(); 
      addFavorite(movie.id);

    }
  }}
  className="favorite-button"
>
  ❤️ Add to Favorites
</button></span>
        <div className="showByhover">{movie.overview}</div>
      </div>
      </Link>
    ));

  return (
    <div className="App">
      {chosen === "" ? (
        <>

<h2>Recommended for You</h2>
          <main className="container">
            {recLoading ? (
              <p>Loading recommendations...</p>
            ) : recommendations.length > 0 ? (
              renderMovies(recommendations.slice(0, 10))
            ) : (
              <p>No personalized recommendations found.</p>
            )}
          </main>
        {/* <button className="login" onClick={()=>(location.href('/User'))}>Login</button> */}

        {/* <Search/> */}
          <h2>The Most Popular Movies</h2>
          <main className="container">
            {renderMovies(popularity_desc.slice(0, 10))}
            <span onClick={() => handleChoose("Populares", popularity_desc)}>{`>`}</span>
          </main>

          <h2>The Top Movies</h2>
          <main className="container">
            {renderMovies(vote_average_desc.slice(0, 10))}
            <span onClick={() => handleChoose("Top", vote_average_desc)}>{`>`}</span>
          </main>

          <h2>The Newest Movies</h2>
          <main className="container">
            {renderMovies(release_date_desc.slice(0, 10))}
            <span className="more" onClick={() => handleChoose("Newest", release_date_desc)}>{`>`}</span>
          </main>
        </>
      ) : (
        <>
              <button className="back-button" onClick={() => setChosen("")}>

        X
      </button>
          <h2>
            {chosen === "Newest" && "The Newest Movies"}
            {chosen === "Top" && "The Top Movies"}
            {chosen === "Populares" && "The Most Popular Movies"}
          </h2>

          <main className="container full_cont">
            {renderMovies(chosenData.slice(olCounter, nextCounter))}
          </main>

          <div className="pagination-buttons">
            {olCounter >= 40 && (
              <button
                onClick={() => {
                  setOlCounter(olCounter - 50);
                  setNextCounter(nextCounter - 50);
                }}
              >
                BACK
              </button>
            )}
            {nextCounter < chosenData.length && (
              <button
                onClick={() => {
                  setOlCounter(olCounter + 50);
                  setNextCounter(nextCounter + 50);
                }}
              >
                NEXT
              </button>
            )}
          </div>
        </>
      )}
      
    </div>
  );
}

export default Home;
