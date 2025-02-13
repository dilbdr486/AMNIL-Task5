import mongoose from "mongoose";

export const connectdb = async () => {
  await mongoose
    .connect(
      "mongodb+srv://dilbahadur:dil143@cluster1.tdnjh.mongodb.net/CakeShopping"
    )
    .then(() => console.log("DB Connected"));
};