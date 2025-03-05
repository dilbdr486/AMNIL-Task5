import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Food Processing" },
    date: { type: Date, default: () => Date.now() },
    payment: { type: Boolean, default: true },
  },
  { timestamps: true }
);

orderSchema.statics.calculateTotalSales = async function (startDate, endDate) {
  const sales = await this.aggregate([
    { $match: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
    { $group: { _id: null, totalSales: { $sum: "$amount" } } },
  ]);
  return sales[0]?.totalSales || 0;
};

orderSchema.statics.generateDayWiseReport = async function (startDate, endDate) {
  const report = await this.aggregate([
    { $match: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
    { $group: { _id: { $dayOfMonth: "$date" }, totalSales: { $sum: "$amount" }, totalProducts: { $sum: { $size: "$items" } } } },
    { $sort: { "_id": 1 } },
  ]);
  return report;
};

orderSchema.statics.generateWeekWiseReport = async function (startDate, endDate) {
  const report = await this.aggregate([
    { $match: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
    { $group: { _id: { $isoWeek: "$date" }, totalSales: { $sum: "$amount" }, totalProducts: { $sum: { $size: "$items" } } } },
    { $sort: { "_id": 1 } },
  ]);
  return report;
};

orderSchema.statics.generateMonthWiseReport = async function (startDate, endDate) {
  const report = await this.aggregate([
    { $match: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
    { $group: { _id: { $month: "$date" }, totalSales: { $sum: "$amount" }, totalProducts: { $sum: { $size: "$items" } } } },
    { $sort: { "_id": 1 } },
  ]);
  return report;
};

orderSchema.statics.generateYearWiseReport = async function (startDate, endDate) {
  const report = await this.aggregate([
    { $match: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
    { $group: { _id: { $year: "$date" }, totalSales: { $sum: "$amount" }, totalProducts: { $sum: { $size: "$items" } } } },
    { $sort: { "_id": 1 } },
  ]);
  return report;
};

orderSchema.statics.generateTotalReport = async function (startDate, endDate) {
  const report = await this.aggregate([
    { $match: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
    { $unwind: "$items" },
    { $group: { _id: "$items.productId", totalQuantity: { $sum: "$items.quantity" }, totalRevenue: { $sum: "$amount" } } },
    { $sort: { totalQuantity: -1 } },
    { $limit: 10 },
  ]);
  return report;
};

orderSchema.statics.calculateTotalRevenue = async function (startDate, endDate) {
  const revenue = await this.aggregate([
    { $match: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
    { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
  ]);
  return revenue[0]?.totalRevenue || 0;
};

orderSchema.statics.calculateConversionRate = async function (startDate, endDate) {
  const totalOrders = await this.countDocuments({
    date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  });

  // Assuming you have a separate collection or field for tracking visitors
  const totalVisitors = await this.aggregate([
    { $match: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
    { $group: { _id: null, totalVisitors: { $sum: "$visitors" } } },
  ]);

  const visitors = totalVisitors[0]?.totalVisitors || 1; // Avoid division by zero
  const conversionRate = (totalOrders / visitors) * 100; // Convert to percentage

  return conversionRate.toFixed(2); // Return as a fixed decimal string
};

orderSchema.statics.calculateYoYGrowth = async function (startDate, endDate) {
  const currentPeriodSales = await this.calculateTotalSales(startDate, endDate);
  const previousYearStartDate = new Date(startDate);
  previousYearStartDate.setFullYear(previousYearStartDate.getFullYear() - 1);
  const previousYearEndDate = new Date(endDate);
  previousYearEndDate.setFullYear(previousYearEndDate.getFullYear() - 1);
  const previousPeriodSales = await this.calculateTotalSales(previousYearStartDate, previousYearEndDate);

  const yoyGrowth = ((currentPeriodSales - previousPeriodSales) / previousPeriodSales) * 100;
  return yoyGrowth;
};

orderSchema.statics.calculateMoMGrowth = async function (startDate, endDate) {
  const currentPeriodSales = await this.calculateTotalSales(startDate, endDate);

  // Clone the start and end date objects to avoid modifying the originals
  const previousMonthStartDate = new Date(startDate);
  previousMonthStartDate.setMonth(previousMonthStartDate.getMonth() - 1);
  previousMonthStartDate.setDate(1); // Set to the first day of the previous month

  const previousMonthEndDate = new Date(startDate);
  previousMonthEndDate.setDate(0); // Set to the last day of the previous month

  const previousPeriodSales = await this.calculateTotalSales(previousMonthStartDate, previousMonthEndDate);

  if (previousPeriodSales === 0) {
    return currentPeriodSales === 0 ? 0 : 100;
  }

  const momGrowth = ((currentPeriodSales - previousPeriodSales) / previousPeriodSales) * 100;
  return parseFloat(momGrowth.toFixed(2));
};


const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
