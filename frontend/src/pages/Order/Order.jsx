import React, { useContext, useEffect, useState } from "react";
import "./Order.css";
import { StoreContext } from "../../store/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import shortid from "shortid";
import "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const Order = () => {
  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
    clearCartItems,
  } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    location: "",
    phone: "",
    orderNotes: "",
    deliveryTime: new Date(),
    paymentMethod: "pay_on_delivery",
  });

  const [paymentMethod, setPaymentMethod] = useState("pay_on_delivery");
  const totalPrice = getTotalCartAmount() + 150;

  useEffect(() => {
    const storedData = localStorage.getItem("orderData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("orderData", JSON.stringify(data));
  }, [data]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    setData((data) => ({ ...data, paymentMethod: event.target.value }));
  };

  const onDeliveryTimeChange = (date) => {
    setData((data) => ({ ...data, deliveryTime: date }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    const confirmOrder = window.confirm(
      `Are you sure you want to place the order with ${
        paymentMethod === "pay_on_delivery" ? "Pay on Delivery" : "Khalti"
      }?`
    );
    if (!confirmOrder) {
      return; // If the user cancels, stop the order process
    }

    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 150,
      paymentMethod: data.paymentMethod,
    };

    let ress = await axios.post(url + "/api/order/place", orderData, {
      headers: { token },
    });
    if (ress.data.success) {
    } else {
      alert("error");
    }

    if (paymentMethod === "pay_on_delivery") {
      clearCartItems();
      toast.success("Order placed successfully! You will pay on delivery.", {
        autoClose: 10000, // 10 seconds
      });
      setTimeout(() => {
        navigate("/");
      }, 10000);
    } else if (paymentMethod === "khalti") {
      const pid = shortid.generate();

      const payload = {
        return_url: "http://localhost:5173/success",
        website_url: "http://localhost:5173/",
        amount: totalPrice * 100,
        purchase_order_id: pid,
        purchase_order_name: "cake",
        orderItems,
      };
      try {
        let response = await axios.post(url + "/api/payment", payload);
        const paymentUrl = response?.data?.data?.payment_url;
        console.log(paymentUrl);
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          alert("Error");
        }
      } catch (error) {
        alert("Error placing order. Please try again.");
      }
      navigate("/");
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
    window.scrollTo(0, 0);
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <ToastContainer />
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email Address"
        />
        <input
          required
          name="location"
          onChange={onChangeHandler}
          value={data.location}
          type="text"
          placeholder="Location"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="phone"
            onChange={onChangeHandler}
            value={data.phone}
            type="text"
            placeholder="Phone"
          />
        </div>
        <div className="order-notes">
          <label>Order Notes:</label>
          <textarea
            required
            name="orderNotes"
            onChange={onChangeHandler}
            value={data.orderNotes}
            placeholder="Enter any special instructions or notes for your order"
          />
        </div>
        <div className="delivery-time">
          <label>Preferred Delivery Time:</label>
          <DatePicker
            selected={
              data.deliveryTime instanceof Date && !isNaN(data.deliveryTime)
                ? data.deliveryTime
                : new Date()
            }
            onChange={onDeliveryTimeChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="MMMM d, yyyy h:mm a"
          />
        </div>
        <div className="payment-method">
          <label>Select Payment Method:</label>
          <select value={paymentMethod} onChange={handlePaymentMethodChange}>
            <option value="pay_on_delivery">Pay on Delivery</option>
            <option value="khalti">Khalti</option>
          </select>
        </div>
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 150}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>
                {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 150}
              </p>
            </div>
            <hr />
          </div>
          <button type="submit">Order Now</button>
        </div>
      </div>
    </form>
  );
};

export default Order;
