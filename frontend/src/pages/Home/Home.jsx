import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Navbar/Header/Header";
import ExpolerMenu from "../../components/ExpolerMenu/ExpolerMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
const Home = () => {
  const [category, setCategory] = useState("All");
  return (
    <div className="home" id="home">
      <Header />
      <ExpolerMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
    </div>
  );
};

export default Home;
