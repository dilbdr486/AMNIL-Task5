import orderModel from "../models/orderModel.js";
import cron from "node-cron";
import nodemailer from "nodemailer";

const parseDate = (date) => {
  return new Date(date);
};

export const getTotalSales = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    // console.log("Request to get total sales from", startDate, "to", endDate);
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
    // console.log("Request to get total revenue from", startDate, "to", endDate);
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
    // console.log("Request to get conversion rate from", startDate, "to", endDate);
    const conversionRate = await orderModel.calculateConversionRate(startDate, endDate);
    res.json({ conversionRate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDayWiseReport = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    // console.log("Request to get day-wise report from", startDate, "to", endDate);
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
    // console.log("Request to get week-wise report from", startDate, "to", endDate);
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
    // console.log("Request to get month-wise report from", startDate, "to", endDate);
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
    // console.log("Request to get year-wise report from", startDate, "to", endDate);
    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);
    // console.log("Parsed start date:", parsedStartDate);
    // console.log("Parsed end date:", parsedEndDate);

    const report = await orderModel.generateYearWiseReport(parsedStartDate, parsedEndDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTotalReport = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    // console.log("Request to get total report from", startDate, "to", endDate);
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
    // console.log("Request to get top searched products from", startDate, "to", endDate);
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
    // console.log("Fetching all orders from the database...");
    const orders = await orderModel.find({});
    // console.log("Orders fetched:", orders);
    res.json(orders);
  } catch (error) {
    // console.error("Error fetching orders:", error);
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
    // console.log("Request to get MoM growth from", startDate, "to", endDate);
    const momGrowth = await orderModel.calculateMoMGrowth(startDate, endDate);
    res.json({ momGrowth });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGrossProfitPerProduct = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const report = await orderModel.calculateGrossProfitPerProduct(startDate, endDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMarginProducts = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const report = await orderModel.identifyMarginProducts(startDate, endDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductSalesHistory = async (req, res) => {
  const { productId, startDate, endDate } = req.query;
  console.log("Received request for product sales history:", { productId, startDate, endDate });
  try {
    const salesHistory = await orderModel.getProductSalesHistory(productId, startDate, endDate);
    console.log("Fetched sales history:", salesHistory);
    res.json(salesHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const scheduleReport = async (email, frequency) => {
  let cronExpression;
  if (frequency === "daily") {
    cronExpression = "0 0 * * *"; // Every day at midnight
  } else if (frequency === "weekly") {
    cronExpression = "0 0 * * 0"; // Every Sunday at midnight
  } else if (frequency === "monthly") {
    cronExpression = "0 0 1 * *"; // On the first day of every month at midnight
  }

  cron.schedule(cronExpression, async () => {
    const startDate = new Date();
    const endDate = new Date();
    const report = await orderModel.generateTotalReport(startDate, endDate);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Scheduled Report",
      text: JSON.stringify(report),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  });
};

export const getCustomerSalesAnalysis = async (startDate, endDate) => {
  const newCustomers = await orderModel.calculateSalesForNewCustomers(startDate, endDate);
  const repeatCustomers = await orderModel.calculateSalesForRepeatCustomers(startDate, endDate);
  const topCustomerSegments = await orderModel.getTopCustomerSegments(startDate, endDate);

  return { newCustomers, repeatCustomers, topCustomerSegments };
};
