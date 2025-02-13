import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const orders = async (req, res) => {
  const frontend_url = "http//localhost:5173";
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount || 0,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const redirectUrl = `${frontend_url}/verify?success=true&orderId=${newOrder._id}`;
    res.json({ success: true, redirectUrl: redirectUrl });
    //res.json({success:true,message:"Order created successfully"})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { userOrders, listOrders, orders, updateStatus };
