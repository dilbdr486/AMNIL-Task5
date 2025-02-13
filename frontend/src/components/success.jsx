import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
//import useAuth from "../hooks/useAuth";
const Success = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  //const { auth } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get("status");
    const txnId = searchParams.get("t");
    const idx = searchParams.get("idx");
    const token = searchParams.get("token");
    const amount = searchParams.get("amount");
    const mobile = searchParams.get("mobile");
    const transaction_id = searchParams.get("transaction_id");
    const total_amount = searchParams.get("total_amount");
    const purchase_order_id = searchParams.get("purchase_order_id");
    const purchase_order_name = searchParams.get("purchase_order_name");
    const pidx = searchParams.get("pidx");

    // Send data to backend for verification
    verifyPayment({
      status,
      txnId,
      idx,
      token,
      amount,
      mobile,
      transaction_id,
      total_amount,
      purchase_order_id,
      purchase_order_name,
      pidx,
    });
  }, [location]);

  const verifyPayment = async (paymentData) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.get("/payment-khalti", {
        params: paymentData,
      });
      if (response.data.success) {
        setMessage("Payment successful!");
        // Handle successful payment response (e.g., display success message, update state, etc.)
      } else {
        setError(`Payment verification failed: ${response.data.message}`);
        // Handle failed payment verification response
      }
    } catch (error) {
      setError("An error occurred while verifying payment.");
      console.error("Error verifying payment:", error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center mx-auto px-4 lg:mx-auto md:mx-auto sm:mx-auto">
      <div className="relative flex flex-col rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none">
        <h4 className="block font-sans text-2xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
          Payment Logs !!
        </h4>
        {loading ? <p>Loading...</p> : <p>{message}</p>}
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <p className="mt-1 block font-sans text-base font-normal leading-relaxed text-gray-700 antialiased">
            Thank you for your purchase. Your order is being processed.
          </p>
        )}
      </div>
    </div>
  );
};

export default Success;
