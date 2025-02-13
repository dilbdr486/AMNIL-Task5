import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Order from "./pages/Order/Order";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar/Navbar";
import AdminLogin from "./components/login/adminLogin";
const App = () => {
  const [showLogin, setShowLogin] = useState(true);
  const url = "http://localhost:4000";

  return (
    <div>
      <ToastContainer />
      <Navbar />
      {showLogin && <AdminLogin setShowLogin={setShowLogin} />}
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/order" element={<Order url={url} />} />
          <Route
            path="/login"
            element={<AdminLogin setShowLogin={setShowLogin} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
