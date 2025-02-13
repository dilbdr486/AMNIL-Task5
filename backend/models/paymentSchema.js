import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema(
  {
    customerInfo: { type: Object },
    transactionId: { type: String, default: null },
    shippingAddress: { type: Object },
    pidx: { type: String, unique: true, sparse: true },
    productId: {
      type: String,
      ref: "PurchasedItem",
      required: true,
    },
    amount: { type: Number, required: true },
    dataFromVerificationReq: { type: Object },
    apiQueryFromUser: { type: Object },
    paymentGateway: {
      type: String,
      enum: ["khalti", "esewa", "Delivery"],
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
    },
    paymentDate: {
      type: Date,
      default: () => Date.now(),
    },
    purchasedItem: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Payment", paymentSchema);
