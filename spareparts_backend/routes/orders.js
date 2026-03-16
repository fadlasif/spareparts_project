import express from "express"
import Order from "../models/Order.js"
import Product from "../models/Product.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Get all orders (admin)
router.get("/", auth, async (req, res) => {
  try {
    res.json(await Order.find().sort({ createdAt: -1 }))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get logged-in user's own orders
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    console.error("GET /orders/my error:", err.message)
    res.status(500).json({ message: err.message })
  }
})

// Place order — reduces stock for each product
router.post("/", auth, async (req, res) => {
  try {
    // Reduce stock for each item ordered
    for (const item of req.body.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.qty } }  // decrement stock by qty ordered
      )
    }

    const order = await Order.create({ ...req.body, userId: req.user.id })
    console.log("✅ Order created:", order._id, "for userId:", req.user.id)
    res.json(order)
  } catch (err) {
    console.error("POST /orders error:", err.message)
    res.status(500).json({ message: err.message })
  }
})

// Update order status (admin)
router.put("/:id", auth, async (req, res) => {
  try {
    res.json(await Order.findByIdAndUpdate(req.params.id, req.body, { new: true }))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router