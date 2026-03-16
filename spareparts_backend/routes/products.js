import express from "express"
import Product from "../models/Product.js"
import auth from "../middleware/auth.js"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    console.error("GET /products error:", err)
    res.status(500).json({ message: err.message })
  }
})

router.post("/", auth, async (req, res) => {
  try {
    console.log("POST /products body:", JSON.stringify(req.body))
    const product = await Product.create(req.body)
    console.log("Product created:", product._id)
    res.json(product)
  } catch (err) {
    console.error("POST /products error:", err.message)
    console.error("Full error:", err)
    res.status(500).json({ message: err.message, details: err.toString() })
  }
})

router.put("/:id", auth, async (req, res) => {
  try {
    console.log("PUT /products/:id", req.params.id)
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(product)
  } catch (err) {
    console.error("PUT /products error:", err.message)
    res.status(500).json({ message: err.message })
  }
})

router.delete("/:id", auth, async (req, res) => {
  try {
    console.log("DELETE /products/:id", req.params.id)
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: "Deleted" })
  } catch (err) {
    console.error("DELETE /products error:", err.message)
    res.status(500).json({ message: err.message })
  }
})

export default router