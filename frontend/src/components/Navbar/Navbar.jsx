import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { FaSearch } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../store/StoreContext";
import axios from "axios";

const Navbar = ({ setShowLogin }) => {
  const [searchQuery, setSearchQuery] = useState("");
  //const [searchResults, setSearchResults] = useState([]);
  const [menu, setmenu] = useState("Home");
  const { getTotalCartCount, token, setToken, setFoodList } =
    useContext(StoreContext);
  const navigate = useNavigate();
  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      setToken("");
      navigate("/");
    }
  };
  const totalCartItems = getTotalCartCount();

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/food/search", // Adjusted to match your API
          { search: searchQuery } // Sending the search query in the request body
        );
        console.log("Search results:", response.data);
        if (response.data.success) {
          setFoodList(response.data.data); // Update global context with search results
        } else {
          console.log("Food not found");
          setFoodList([]); // Clear the list if no food found
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      console.log("Search query is empty");
    }
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="" className="log" />
      </Link>

      <ul className="navbar_menu">
        <li
          onClick={() => setmenu("Home")}
          className={menu === "Home" ? "active" : ""}
        >
          <a href="#home">Home</a>
        </li>
        <li
          onClick={() => setmenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          <a href="#expoler_menu">Menu</a>
        </li>
        <li
          onClick={() => setmenu("contact")}
          className={menu === "contact" ? "active" : ""}
        >
          <a href="#footer">Contact</a>
        </li>
      </ul>
      <div className="navbar_right">
        <div className="navbar_search">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update query on change
            placeholder="Search..."
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch(); // Trigger search on Enter key press
              }
            }}
          />
          <FaSearch
            className="search-icon"
            style={{ fontSize: "24px" }}
            onClick={handleSearch}
          />
        </div>

        <div className="navbar_cart_icon">
          <Link to="/cart">
            <FaShoppingCart className="icons" />
            {totalCartItems > 0 && (
              <span className="cart-counter">{totalCartItems || 0}</span>
            )}
          </Link>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}> sign in</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-pro-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="" />
                Orders
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
