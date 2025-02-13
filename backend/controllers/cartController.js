import userModel from "../models/userModel.js";

const addTOCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!userData.cartData) {
      userData.cartData = {}; // Initialize cartData if it doesn't exist
    }

    let cartData = userData.cartData;

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });

    return res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Error adding to cart" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!userData.cartData || !userData.cartData[req.body.itemId]) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    let cartData = userData.cartData;

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
      if (cartData[req.body.itemId] === 0) {
        delete cartData[req.body.itemId]; // Remove the item if the count reaches zero
      }
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });

    return res.json({ success: true, message: "Removed from cart" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Error removing from cart" });
  }
};

const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    return res.json({ success: true, cartData });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching cart data" });
  }
};

export { addTOCart, removeFromCart, getCart };
