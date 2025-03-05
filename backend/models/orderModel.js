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

orderSchema.statics.insertCustomOrders = async function () {
  const customOrders = Array.from({ length: 50 }, (_, i) => ({
    userId: `user${i + 1}`,
    items: [
      { productId: `product${i * 2 + 1}`, quantity: Math.floor(Math.random() * 5) + 1 },
      { productId: `product${i * 2 + 2}`, quantity: Math.floor(Math.random() * 5) + 1 },
    ],
    amount: Math.floor(Math.random() * 1000) + 50,
    address: { city: `City${i + 1}`, street: `Street${i + 1}` },
    status: "Delivered",
    date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    payment: true,
  }));

  await this.insertMany(customOrders);
};

orderSchema.statics.verifyCustomOrders = async function () {
  const count = await this.countDocuments();
  console.log(`Total orders in the database: ${count}`);
  return count;
};

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
