import express from "express"
import User    from "../models/User.js"
import auth    from "../middleware/auth.js"

const router = express.Router()

router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  }
  catch (err) { res.status(500).json({ message: err.message }) }
})

router.put("/:id", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password")
    res.json(user)
  }
  catch (err) { res.status(500).json({ message: err.message }) }
})

export default router