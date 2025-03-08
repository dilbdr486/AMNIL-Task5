import express from "express";
import orderModel from "../models/orderModel.js";
import { getProductSalesHistory, scheduleReport, getCustomerSalesAnalysis } from "../controllers/reportController.js";

const reportRoutes = express.Router();

// Helper function to parse dates
const parseDate = (date) => {
  return new Date(date);
};

// Middleware to validate date parameters
const validateDates = (req, res, next) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate and endDate are required" });
  }
  next();
};

// Total Sales Route
reportRoutes.get("/total-sales", validateDates, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const totalSales = await orderModel.calculateTotalSales(startDate, endDate);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Total Revenue Route
reportRoutes.get("/total-revenue", validateDates, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const totalRevenue = await orderModel.calculateTotalRevenue(startDate, endDate);
    res.json({ totalRevenue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Conversion Rate Route
reportRoutes.get("/conversion-rate", validateDates, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const conversionRate = await orderModel.calculateConversionRate(startDate, endDate);
    res.json({ conversionRate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Day-wise Report Route
reportRoutes.get("/day-wise-report", validateDates, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);
    const report = await orderModel.generateDayWiseReport(parsedStartDate, parsedEndDate);
    // console.log(report);
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Week-wise Report Route
reportRoutes.get("/week-wise-report", validateDates, async (req, res) => {
  const { startDate, endDate } = req.query;
  // console.log("Received request for week-wise report with dates:", startDate, endDate);
  try {
    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);
    // console.log("Parsed dates:", parsedStartDate, parsedEndDate);

    const report = await orderModel.generateWeekWiseReport(parsedStartDate, parsedEndDate);
    // console.log("Generated report:", report);
    res.json(report);
  } catch (error) {
    // console.error("Error generating week-wise report:", error);
    res.status(500).json({ error: error.message });
  }
});

// Month-wise Report Route
reportRoutes.get("/month-wise-report", validateDates, async (req, res) => {
  const { startDate, endDate } = req.query;
  // console.log("Received request for month-wise report with dates:", startDate, endDate);
  try {
    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);
    // console.log("Parsed dates:", parsedStartDate, parsedEndDate);

    const report = await orderModel.generateMonthWiseReport(parsedStartDate, parsedEndDate);
    // console.log("Generated report:", report);
    res.json(report);
  } catch (error) {
    // console.error("Error generating month-wise report:", error);
    res.status(500).json({ error: error.message });
  }
});

// Year-wise Report Route
reportRoutes.get("/year-wise-report", validateDates, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);
    const report = await orderModel.generateYearWiseReport(parsedStartDate, parsedEndDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Total Report Route
reportRoutes.get("/total-report", validateDates, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);
    const report = await orderModel.generateTotalReport(parsedStartDate, parsedEndDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Top Searched Products Route
reportRoutes.get("/top-searched-products", validateDates, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);
    const report = await orderModel.generateTopSearchedProducts(parsedStartDate, parsedEndDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Year-over-Year (YoY) Growth Route
reportRoutes.get("/yoy-growth", validateDates, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const yoyGrowth = await orderModel.calculateYoYGrowth(startDate, endDate);
    res.json({ yoyGrowth });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Month-over-Month (MoM) Growth Route
reportRoutes.get("/mom-growth", validateDates, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const momGrowth = await orderModel.calculateMoMGrowth(startDate, endDate);
    res.json({ momGrowth });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gross Profit Per Product Route
reportRoutes.get("/gross-profit-per-product", validateDates, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const report = await orderModel.calculateGrossProfitPerProduct(startDate, endDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Margin Products Route
reportRoutes.get("/margin-products", validateDates, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const report = await orderModel.identifyMarginProducts(startDate, endDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Insert Custom Orders Route
reportRoutes.post("/insert-custom-orders", async (req, res) => {
  try {
    await orderModel.insertCustomOrders();
    res.status(201).json({ message: "Custom orders inserted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Custom Orders Route
reportRoutes.get("/verify-custom-orders", async (req, res) => {
  try {
    const count = await orderModel.verifyCustomOrders();
    res.json({ message: `Total orders in the database: ${count}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Product Sales History Route
reportRoutes.get("/product-sales-history", validateDates, async (req, res) => {
  const { productId, startDate, endDate } = req.query;

  console.log("Received request for product sales history:", { productId, startDate, endDate });

  if (!productId) {
    return res.status(400).json({ error: "productId is required" });
  }

  try {
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    // Ensure endDate includes the full day
    parsedEndDate.setHours(23, 59, 59, 999);

    const salesHistory = await orderModel.getProductSalesHistory(productId, parsedStartDate, parsedEndDate);

    console.log("Fetched sales history:", salesHistory);

    if (!salesHistory || salesHistory.length === 0) {
      console.log("No sales data found for this product in the given date range.");
      return res.json({ message: "No sales data found for this product in the given date range." });
    }

    res.json(salesHistory);
  } catch (error) {
    console.error("Error fetching product sales history:", error);
    res.status(500).json({ error: error.message });
  }
});

// Schedule Report Route
reportRoutes.post("/schedule-report", async (req, res) => {
  const { email, frequency } = req.body;
  try {
    await scheduleReport(email, frequency);
    res.status(201).json({ message: "Report scheduled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customer-Based Sales Analysis Route
reportRoutes.get("/customer-sales-analysis", validateDates, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const analysis = await getCustomerSalesAnalysis(startDate, endDate);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default reportRoutes;
