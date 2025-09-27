import "./App.css";
import Home from "./pages/Home";
import Search from "./pages/Search";
import MovieDetails from "./pages/MovieDetails";
import UserManager from "./pages/UserManager";
import Profile from "./pages/Profile";
import AuthForm from "./pages/AuthForm";
import Nav from "./pages/Nav";


// import Recommend from "./pages/Recommend";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
    <Router>
    <Nav/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/User" element={<UserManager />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/auth" element={<AuthForm  />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </Router>

    </>
  );
}
export default App;
