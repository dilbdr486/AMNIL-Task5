import express from "express";
import orderModel from "../models/orderModel.js";

const router = express.Router();

router.get("/total-sales", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const totalSales = await orderModel.calculateTotalSales(startDate, endDate);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/day-wise-report", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const report = await orderModel.generateDayWiseReport(startDate, endDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/total-report", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const report = await orderModel.generateTotalReport(startDate, endDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/top-searched-products", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const report = await orderModel.generateTopSearchedProducts(startDate, endDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
