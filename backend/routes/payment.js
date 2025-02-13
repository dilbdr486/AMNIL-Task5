import express from "express";
const paymentRouter = express.Router();

import { initiatePayment } from "../controllers/paymentController.js";

paymentRouter.post("/", initiatePayment);
//.get("/", paymentController.completePayment)
//.get("/status", paymentController.getAllPayments)
//.post("/delivery", paymentController.deliveryCheck);

export default paymentRouter;
