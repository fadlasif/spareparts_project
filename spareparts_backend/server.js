import express        from "express"
import mongoose       from "mongoose"
import cors           from "cors"
import dotenv         from "dotenv"
import authRoutes     from "./routes/auth.js"
import productRoutes  from "./routes/products.js"
import orderRoutes    from "./routes/orders.js"
import categoryRoutes from "./routes/categories.js"
import roleRoutes     from "./routes/roles.js"
import userRoutes     from "./routes/users.js"

dotenv.config()
const app = express()

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB Error:", err))

app.use("/api/auth",       authRoutes)
app.use("/api/products",   productRoutes)
app.use("/api/orders",     orderRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/roles",      roleRoutes)
app.use("/api/users",      userRoutes)

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
)