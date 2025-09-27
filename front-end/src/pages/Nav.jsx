import "../App.css";
import {useNavigate } from "react-router-dom";
import Search from "./Search";


const Nav = () => {
  const navigate = useNavigate();


  return (
<div className="nav-dark">
  <button className="nav-btn home" onClick={() => navigate("/")}>Home</button>
  <Search />
  <button className="nav-btn login" onClick={() => navigate("/Profile")}>Profile</button>
</div>)
};

export default Nav;
