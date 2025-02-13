import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./success.css";
const PaymentSuccess = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Redirect to homepage after a delay, e.g., 3 seconds
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 3000);

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, [navigate]);

  return (
    <div className="payment-success-container">
      <h1>Payment Successful!</h1>
      <p>
        Thank you for your payment. Your order has been placed successfully.
      </p>
    </div>
  );
};

export default PaymentSuccess;
