import express  from "express"
import Category from "../models/Category.js"
import auth     from "../middleware/auth.js"

const router = express.Router()

router.get("/", async (req, res) => {
  try { res.json(await Category.find()) }
  catch (err) { res.status(500).json({ message: err.message }) }
})

router.post("/", auth, async (req, res) => {
  try { res.json(await Category.create(req.body)) }
  catch (err) { res.status(500).json({ message: err.message }) }
})

router.put("/:id", auth, async (req, res) => {
  try { res.json(await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })) }
  catch (err) { res.status(500).json({ message: err.message }) }
})

router.delete("/:id", auth, async (req, res) => {
  try { await Category.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }) }
  catch (err) { res.status(500).json({ message: err.message }) }
})

export default router