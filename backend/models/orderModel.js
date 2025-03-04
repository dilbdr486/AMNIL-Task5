import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Food Processing" },
    date: { type: Date, default: Date.now() },
    payment: { type: Boolean, default: true },
  },
  { timestamps: true }
);

orderSchema.statics.calculateTotalSales = async function (startDate, endDate) {
  const sales = await this.aggregate([
    { $match: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
    { $group: { _id: null, totalSales: { $sum: "$amount" } } }
  ]);
  return sales[0]?.totalSales || 0;
};

orderSchema.statics.generateDayWiseReport = async function (startDate, endDate) {
  const report = await this.aggregate([
    { $match: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
    { $group: { _id: { $dayOfMonth: "$date" }, totalSales: { $sum: "$amount" }, totalProducts: { $sum: { $size: "$items" } } } },
    { $sort: { "_id": 1 } }
  ]);
  return report;
};

orderSchema.statics.generateTotalReport = async function (startDate, endDate) {
  const report = await this.aggregate([
    { $match: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
    { $unwind: "$items" },
    { $group: { _id: "$items.productId", totalQuantity: { $sum: 1 }, totalRevenue: { $sum: "$amount" } } },
    { $sort: { totalQuantity: -1 } },
    { $limit: 10 }
  ]);
  return report;
};

orderSchema.statics.generateTopSearchedProducts = async function (startDate, endDate) {
  // Assuming there is a 'searches' collection that logs product searches
  const searches = await this.aggregate([
    { $match: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
    { $group: { _id: "$searchTerm", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  return searches;
};

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

// Custom data for testing purposes
const customOrders = [
  {
    userId: "user1",
    items: [{ productId: "product1" }, { productId: "product2" }],
    amount: 100,
    address: { city: "City1", street: "Street1" },
    status: "Delivered",
    date: new Date("2025-01-01"),
    payment: true,
  },
  {
    userId: "user2",
    items: [{ productId: "product3" }, { productId: "product4" }],
    amount: 200,
    address: { city: "City2", street: "Street2" },
    status: "Delivered",
    date: new Date("2025-01-05"),
    payment: true,
  },
  {
    userId: "user3",
    items: [{ productId: "product5" }, { productId: "product6" }],
    amount: 150,
    address: { city: "City3", street: "Street3" },
    status: "Delivered",
    date: new Date("2025-01-10"),
    payment: true,
  },
  {
    userId: "user4",
    items: [{ productId: "product7" }, { productId: "product8" }],
    amount: 250,
    address: { city: "City4", street: "Street4" },
    status: "Delivered",
    date: new Date("2025-01-15"),
    payment: true,
  },
  {
    userId: "user5",
    items: [{ productId: "product9" }, { productId: "product10" }],
    amount: 300,
    address: { city: "City5", street: "Street5" },
    status: "Delivered",
    date: new Date("2025-01-20"),
    payment: true,
  },
  {
    userId: "user6",
    items: [{ productId: "product11" }, { productId: "product12" }],
    amount: 350,
    address: { city: "City6", street: "Street6" },
    status: "Delivered",
    date: new Date("2025-01-25"),
    payment: true,
  },
  {
    userId: "user7",
    items: [{ productId: "product13" }, { productId: "product14" }],
    amount: 400,
    address: { city: "City7", street: "Street7" },
    status: "Delivered",
    date: new Date("2025-01-30"),
    payment: true,
  },
  {
    userId: "user8",
    items: [{ productId: "product15" }, { productId: "product16" }],
    amount: 450,
    address: { city: "City8", street: "Street8" },
    status: "Delivered",
    date: new Date("2025-02-01"),
    payment: true,
  },
  {
    userId: "user9",
    items: [{ productId: "product17" }, { productId: "product18" }],
    amount: 500,
    address: { city: "City9", street: "Street9" },
    status: "Delivered",
    date: new Date("2025-02-05"),
    payment: true,
  },
  {
    userId: "user10",
    items: [{ productId: "product19" }, { productId: "product20" }],
    amount: 550,
    address: { city: "City10", street: "Street10" },
    status: "Delivered",
    date: new Date("2025-02-10"),
    payment: true,
  },
  {
    userId: "user11",
    items: [{ productId: "product21" }, { productId: "product22" }],
    amount: 600,
    address: { city: "City11", street: "Street11" },
    status: "Delivered",
    date: new Date("2025-02-15"),
    payment: true,
  },
  {
    userId: "user12",
    items: [{ productId: "product23" }, { productId: "product24" }],
    amount: 650,
    address: { city: "City12", street: "Street12" },
    status: "Delivered",
    date: new Date("2025-02-20"),
    payment: true,
  },
  {
    userId: "user13",
    items: [{ productId: "product25" }, { productId: "product26" }],
    amount: 700,
    address: { city: "City13", street: "Street13" },
    status: "Delivered",
    date: new Date("2025-02-25"),
    payment: true,
  },
  {
    userId: "user14",
    items: [{ productId: "product27" }, { productId: "product28" }],
    amount: 750,
    address: { city: "City14", street: "Street14" },
    status: "Delivered",
    date: new Date("2025-03-01"),
    payment: true,
  },
  {
    userId: "user15",
    items: [{ productId: "product29" }, { productId: "product30" }],
    amount: 800,
    address: { city: "City15", street: "Street15" },
    status: "Delivered",
    date: new Date("2025-03-05"),
    payment: true,
  },
  {
    userId: "user16",
    items: [{ productId: "product31" }, { productId: "product32" }],
    amount: 850,
    address: { city: "City16", street: "Street16" },
    status: "Delivered",
    date: new Date("2025-03-10"),
    payment: true,
  },
  {
    userId: "user17",
    items: [{ productId: "product33" }, { productId: "product34" }],
    amount: 900,
    address: { city: "City17", street: "Street17" },
    status: "Delivered",
    date: new Date("2025-03-15"),
    payment: true,
  },
  {
    userId: "user18",
    items: [{ productId: "product35" }, { productId: "product36" }],
    amount: 950,
    address: { city: "City18", street: "Street18" },
    status: "Delivered",
    date: new Date("2025-03-20"),
    payment: true,
  },
  {
    userId: "user19",
    items: [{ productId: "product37" }, { productId: "product38" }],
    amount: 1000,
    address: { city: "City19", street: "Street19" },
    status: "Delivered",
    date: new Date("2025-03-25"),
    payment: true,
  },
  {
    userId: "user20",
    items: [{ productId: "product39" }, { productId: "product40" }],
    amount: 1050,
    address: { city: "City20", street: "Street20" },
    status: "Delivered",
    date: new Date("2025-03-30"),
    payment: true,
  },
];

// Export custom data for use in the server
export { customOrders };
export default orderModel;
