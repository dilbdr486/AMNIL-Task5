import express from "express";
import {
  getTotalSales,
  getDayWiseReport,
  getWeekWiseReport,
  getMonthWiseReport,
  getYearWiseReport,
  getTotalReport,
  getTopSearchedProducts,
  getAllOrders,
} from "../controllers/reportController.js";

const reportRoutes = express.Router();

reportRoutes.get("/total-sales", getTotalSales);
reportRoutes.get("/day-wise-report", getDayWiseReport);
reportRoutes.get("/week-wise-report", getWeekWiseReport);
reportRoutes.get("/month-wise-report", getMonthWiseReport);
reportRoutes.get("/year-wise-report", getYearWiseReport);
reportRoutes.get("/total-report", getTotalReport);
reportRoutes.get("/top-searched-products", getTopSearchedProducts);
reportRoutes.get("/all-orders", getAllOrders);

export default reportRoutes;
