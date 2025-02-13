import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectdb } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import 'dotenv/config'
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
// app config
const app = express()
const port = 4000

// middlewares
app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// db connection
connectdb();

// api endpoints
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/payment",paymentRouter)

import dotenv from 'dotenv';
import paymentRouter from './routes/payment.js';
if(process.env.NODE_ENV != "production"){
  dotenv.config();
}

// test endpoint
app.get("/", (req, res) => {
  res.send('API Working')
});

// start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})
  // mongodb+srv://DilBahaur:mondodb143@cluster0.yrc2rsi.mongodb.net/?
