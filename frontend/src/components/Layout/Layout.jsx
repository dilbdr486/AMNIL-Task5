import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../footer/Footer";
import "./Layout.css";

const Layout = ({ children, setShowLogin }) => {
  return (
    <div className="app">
      <Navbar setShowLogin={setShowLogin} />
      {children}
      <Footer />
    </div>
  );
};
export default Layout;
