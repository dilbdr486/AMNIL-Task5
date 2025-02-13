import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import Order from "./pages/Order/Order";
import Login from "./components/LoginPopup/Login";
import MyOrders from "./pages/MyOrders/MyOrders";
import Layout from "./components/Layout/Layout";
import PaymentSuccess from "./pages/Success/PaymentSuccess";

const App = () => {
  const [showlogin, setShowLogin] = useState(false);
  return (
    <>
      {showlogin ? <Login setShowLogin={setShowLogin} /> : <></>}
      <Routes>
        <Route
          path="/"
          element={
            <Layout setShowLogin={setShowLogin}>
              <Home />
            </Layout>
          }
        />
        <Route path="/Order" element={<Order />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/Cart" element={<Cart />} />{" "}
        {/* no layout for cart page */}
        <Route path="/success" element={<PaymentSuccess />} />
      </Routes>
    </>
  );
};

export default App;
