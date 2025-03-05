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

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
