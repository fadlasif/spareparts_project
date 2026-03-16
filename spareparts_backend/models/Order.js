import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
  userId:      { type: String, index: true },
  customer:    String,
  email:       String,
  phone:       String,
  address:     String,
  items:       Array,
  total:       Number,
  paymentMode: String,
  status:      { type: String, default: "Pending" },
  placedAt:    String,
}, { timestamps: true })

export default mongoose.model("Order", orderSchema)