import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const initialCartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
  const [cartItems, setCartItems] = useState(initialCartItems);
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [totalItems, setTotalItems] = useState(0); // For the total number of food items
  const [totalPages, setTotalPages] = useState(0); // For the total number of pages
  const [currentPage, setCurrentPage] = useState(1); // For the current page

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newQuantity = (prev[itemId] || 0) - 1;
      if (newQuantity <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQuantity };
    });
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  const fetchFoodList = async (page = 1, limit = 4) => {
    try {
      const response = await axios.get(`${url}/api/food/list?page=${page}&limit=${limit}`);
      setFoodList(response.data.data); // Set the food items
      setTotalItems(response.data.totalCount); // Set the total number of items
      setTotalPages(response.data.totalPages); // Set the total number of pages
      setCurrentPage(response.data.currentPage); // Set the current page
    } catch (error) {
      console.error("Error fetching food list", error);
    }
  };

  const loadCartData = async (token) => {
    const respones = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(respones.data.cartData);
  };

  const clearCartItems = () => {
    setCartItems({});
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const getFoodItemById = (id) => {
    return foodItems.find((item) => item.id === id);
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartCount,
    url,
    token,
    setToken,
    getFoodItemById,
    setFoodList,
    clearCartItems,
    fetchFoodList,
    totalItems,
    totalPages,
    currentPage,  // Added currentPage
    setCurrentPage,  // Added setter for currentPage
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
