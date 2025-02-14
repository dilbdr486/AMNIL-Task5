import foodModel from "../models/foodModels.js";
import fs from "fs";
// Add food item
const addFood = async (req, res) => {
  try {
    let image_filename = req.file ? `${req.file.filename}` : null;

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
    });

    await food.save();
    res.json({ success: true, message: "Food added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding food item" });
  }
};

//all food list with pagination
const listFood = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const foods = await foodModel.find({}).skip(skip).limit(limit);
    const total = await foodModel.countDocuments({});

    res.json({
      success: true,
      data: foods,
      totalCount: total,  // Sending total count as totalCount
      totalPages: Math.ceil(total / limit),  // Sending total pages as totalPages
      currentPage: page  // Sending the current page
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};


//remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food item not found" });
    }

    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) {
        console.error("Error removing file:", err);
      }
    });

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food removed" });
  } catch (error) {
    console.error("Error removing food item:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error removing food item",
        error: error.message,
      });
  }
};

const searchFood = async (req, res) => {
  try {
    const search = req.body.search;
    const foodData = await foodModel.find({
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { category: { $regex: ".*" + search + ".*", $options: "i" } },
        { description: { $regex: ".*" + search + ".*", $options: "i" } }
      ]
    });
    if (foodData.length > 0) {
      res.json({ success: true, message: "Food details", data: foodData });
    } else {
      res.json({ success: false, message: "Food not found" });
    }
  } catch (error) {
    console.error(`Error searching food: ${error}`);
    res.status(400).json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood, searchFood };
