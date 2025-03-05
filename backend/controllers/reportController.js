import orderModel from "../models/orderModel.js";

const parseDate = (date) => {
  return new Date(date);
};

export const getTotalSales = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    console.log("Request to get total sales from", startDate, "to", endDate);
    const totalSales = await orderModel.calculateTotalSales(startDate, endDate);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// New controller function for total revenue
export const getTotalRevenue = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    console.log("Request to get total revenue from", startDate, "to", endDate);
    const totalRevenue = await orderModel.calculateTotalRevenue(startDate, endDate);
    res.json({ totalRevenue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// New controller function for conversion rate
export const getConversionRate = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    console.log("Request to get conversion rate from", startDate, "to", endDate);
    const conversionRate = await orderModel.calculateConversionRate(startDate, endDate);
    res.json({ conversionRate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDayWiseReport = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    console.log("Request to get day-wise report from", startDate, "to", endDate);
    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);
    const report = await orderModel.generateDayWiseReport(parsedStartDate, parsedEndDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWeekWiseReport = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    console.log("Request to get week-wise report from", startDate, "to", endDate);
    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);
    const report = await orderModel.generateWeekWiseReport(parsedStartDate, parsedEndDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMonthWiseReport = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    console.log("Request to get month-wise report from", startDate, "to", endDate);
    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);
    const report = await orderModel.generateMonthWiseReport(parsedStartDate, parsedEndDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getYearWiseReport = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    console.log("Request to get year-wise report from", startDate, "to", endDate);
    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);
    console.log("Parsed start date:", parsedStartDate);
    console.log("Parsed end date:", parsedEndDate);

    const report = await orderModel.generateYearWiseReport(parsedStartDate, parsedEndDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTotalReport = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    console.log("Request to get total report from", startDate, "to", endDate);
    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);
    const report = await orderModel.generateTotalReport(parsedStartDate, parsedEndDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTopSearchedProducts = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    console.log("Request to get top searched products from", startDate, "to", endDate);
    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);
    const report = await orderModel.generateTopSearchedProducts(parsedStartDate, parsedEndDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    console.log("Fetching all orders from the database...");
    const orders = await orderModel.find({});
    console.log("Orders fetched:", orders);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getYoYGrowth = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const yoyGrowth = await orderModel.calculateYoYGrowth(startDate, endDate);
    res.json({ yoyGrowth });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMoMGrowth = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const momGrowth = await orderModel.calculateMoMGrowth(startDate, endDate);
    res.json({ momGrowth });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
