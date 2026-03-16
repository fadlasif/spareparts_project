import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  title:         String,
  partNumber:    String,
  uniqueCode:    String,
  vehicleModel:  String,
  modelYear:     String,
  weight:        String,
  categoryId:    String,   // ✅ fixed: MongoDB _id is a string, not a number
  price:         Number,
  originalPrice: Number,
  stock:         Number,
  rating:        { type: Number, default: 4.5 },
  reviews:       { type: Number, default: 0 },
  badge:         String,
  image:         String,
  description:   String,
  features:      [String],
}, { timestamps: true })

export default mongoose.model("Product", productSchema)