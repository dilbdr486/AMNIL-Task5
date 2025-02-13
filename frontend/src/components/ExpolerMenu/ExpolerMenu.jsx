import React from "react";
import "./ExpolerMenu.css";
import { menu_list } from "../../assets/assets";

const ExpolerMenu = ({ category, setCategory }) => {
  return (
    <div className="expoler_menu" id="expoler_menu">
      <h1>Explore Our Menu</h1>
      <p className="expoler_menu_list">
        Explore our diverse selection of cakes, each designed to suit different
        tastes, occasions, and preferences.
      </p>
      <div className="expoler_menu_list">
        {menu_list.map((item, index) => (
          <div
            onClick={() =>
              setCategory((prev) =>
                prev === item.menu_name ? "All" : item.menu_name
              )
            }
            key={index}
            className="expoler_menu_list_item"
          >
            <img
              className={category === item.menu_name ? "active" : ""}
              src={item.menu_image}
              alt=""
            />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExpolerMenu;
