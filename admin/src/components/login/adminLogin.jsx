import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const AdminLogin = ({ setShowLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate a simple login check
    if (email === "admin@gmail.com" && password === "admin123") {
      setShowLogin(false);
      navigate("/add");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login">
      <form className="login-container" onSubmit={handleLogin}>
        <div className="login-title">
          <h2>Login</h2>
        </div>
        <div className="login-input">
          <input
            name="email"
            type="text"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
