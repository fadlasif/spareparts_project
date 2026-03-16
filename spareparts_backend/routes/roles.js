import express from "express"
import Role    from "../models/Role.js"
import auth    from "../middleware/auth.js"

const router = express.Router()

router.get("/", async (req, res) => {
  try { res.json(await Role.find()) }
  catch (err) { res.status(500).json({ message: err.message }) }
})

router.post("/", auth, async (req, res) => {
  try { res.json(await Role.create(req.body)) }
  catch (err) { res.status(500).json({ message: err.message }) }
})

router.delete("/:id", auth, async (req, res) => {
  try { await Role.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }) }
  catch (err) { res.status(500).json({ message: err.message }) }
})

export default router