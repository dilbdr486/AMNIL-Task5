import React, { useContext, useState, useEffect } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../store/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list, fetchFoodList, totalItems, currentPage, totalPages } = useContext(StoreContext);
  const [prevPage, setPrevPage] = useState(currentPage); // Store previous page to avoid unnecessary fetch

  // Fetch the food list only when the page changes
  useEffect(() => {
    if (prevPage !== currentPage) {  // Check if the page is actually changing
      fetchFoodList(currentPage, 4);  // Fetch food items only when the page changes
      setPrevPage(currentPage); // Update the previous page state
    }
  }, [currentPage, prevPage, fetchFoodList]); // Dependencies will ensure it only runs when the currentPage changes

  const handlePageChange = (page) => {
    // Avoid triggering page change if the page is already loading
    if (page !== currentPage) {
      fetchFoodList(page, 4);
    }
  };

  return (
    <div className="food-display" id="food-display">
      <h2>Top cakes near you</h2>
      <div className="food-display-list">
        {food_list.map((item) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
          return null;
        })}
      </div>

      <div className="flex justify-center gap-4 mt-4 items-center">
        <button
          className="flex justify-center items-center py-3 px-4 border border-gray-300 bg-white rounded-lg shadow-md hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="flex justify-center items-center py-3 px-4 border border-gray-300 bg-white rounded-lg shadow-md hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FoodDisplay;
