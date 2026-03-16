import mongoose  from "mongoose"
import dotenv    from "dotenv"
import Product   from "./models/Product.js"
import Category  from "./models/Category.js"
import Role      from "./models/Role.js"
import User      from "./models/User.js"
import bcrypt    from "bcryptjs"

dotenv.config()

const CATEGORIES = [
  { name: "Engine Parts",        icon: "⚙️" },
  { name: "Brakes & Suspension", icon: "🛑" },
  { name: "Electrical",          icon: "⚡" },
  { name: "Body Parts",          icon: "🚗" },
  { name: "Filters & Fluids",    icon: "🔧" },
  { name: "Transmission",        icon: "🔩" },
  { name: "Cooling System",      icon: "❄️" },
  { name: "Tyres & Wheels",      icon: "🛞" },
]

const PRODUCTS = [
  { title:"High-Performance Ceramic Brake Pads", partNumber:"BP-2024-HX", uniqueCode:"UNQ-BP-001", vehicleModel:"Toyota Camry / Corolla", modelYear:"2018–2024", weight:"1.2 kg", categoryId:2, price:2499, originalPrice:3200, stock:45, rating:4.7, reviews:312, badge:"Bestseller", image:"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80", description:"OEM-grade ceramic brake pads engineered for superior stopping power and reduced brake fade.", features:["Zero copper formula","Low brake dust","OEM fitment","Pre-scored slots"] },
  { title:"Premium Synthetic Engine Oil Filter", partNumber:"OF-1055-TY", uniqueCode:"UNQ-OF-002", vehicleModel:"Honda City / Amaze / Jazz", modelYear:"2015–2023", weight:"0.3 kg", categoryId:5, price:599, originalPrice:799, stock:120, rating:4.5, reviews:189, badge:"New Arrival", image:"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80", description:"High-flow synthetic media oil filter provides superior filtration efficiency.", features:["99.6% filtration efficiency","Anti-drain-back valve","Full-flow design"] },
  { title:"Heavy Duty Alternator Assembly — 90A", partNumber:"ALT-9823-FD", uniqueCode:"UNQ-ALT-003", vehicleModel:"Ford EcoSport / Figo", modelYear:"2017–2022", weight:"4.5 kg", categoryId:3, price:8999, originalPrice:11500, stock:12, rating:4.6, reviews:74, badge:"OEM Grade", image:"https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=80", description:"Direct replacement heavy-duty alternator with 90A output. 12-month warranty.", features:["90A output","Triple tested","12-month warranty","Plug-and-play"] },
  { title:"ABS Front Bumper Guard — Gloss Black", partNumber:"BG-4412-MS", uniqueCode:"UNQ-BG-004", vehicleModel:"Maruti Suzuki Swift", modelYear:"2018–2024", weight:"2.8 kg", categoryId:4, price:3200, originalPrice:4000, stock:30, rating:4.2, reviews:95, badge:null, image:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80", description:"Impact-resistant ABS plastic front bumper guard with UV-stable gloss black finish.", features:["UV-stable finish","Impact resistant","Sensor cutouts"] },
  { title:"Cast Iron Piston Ring Set", partNumber:"PR-7721-HY", uniqueCode:"UNQ-PR-005", vehicleModel:"Hyundai i20 / Elite i20", modelYear:"2014–2021", weight:"0.8 kg", categoryId:1, price:4500, originalPrice:5800, stock:25, rating:4.4, reviews:48, badge:"Premium", image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", description:"Precision-machined cast iron piston ring set with PVD coating.", features:["PVD coating","Precision machined","Reduced friction"] },
  { title:"Leather-Wrapped Gear Shift Lever", partNumber:"GS-3390-VW", uniqueCode:"UNQ-GS-006", vehicleModel:"Volkswagen Polo / Vento", modelYear:"2016–2023", weight:"1.1 kg", categoryId:6, price:2100, originalPrice:2700, stock:18, rating:4.3, reviews:62, badge:null, image:"https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80", description:"OEM-specification gear shift lever with premium leather grip.", features:["Genuine leather grip","Chrome finish","OEM spec"] },
  { title:"Gas-Charged Rear Shock Absorber", partNumber:"SA-6612-KI", uniqueCode:"UNQ-SA-007", vehicleModel:"Kia Seltos 2WD", modelYear:"2019–2024", weight:"3.2 kg", categoryId:2, price:5600, originalPrice:7000, stock:20, rating:4.8, reviews:143, badge:"Hot", image:"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80", description:"High-pressure gas-charged monotube shock absorber for smooth ride.", features:["Monotube design","High pressure gas","Corrosion resistant"] },
  { title:"Iridium Spark Plug Set — 4 Pcs", partNumber:"SP-1122-NG", uniqueCode:"UNQ-SP-008", vehicleModel:"Nissan Magnite / Kicks", modelYear:"2020–2024", weight:"0.4 kg", categoryId:1, price:1299, originalPrice:1600, stock:80, rating:4.6, reviews:207, badge:"Value Pack", image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", description:"Iridium tipped spark plugs for consistent ignition and improved fuel economy.", features:["Iridium tip","4-piece set","Up to 120,000 km life"] },
  { title:"Full Aluminium Radiator Assembly", partNumber:"RA-5501-MH", uniqueCode:"UNQ-RA-009", vehicleModel:"Mahindra Scorpio / XUV 300", modelYear:"2017–2023", weight:"5.2 kg", categoryId:7, price:6800, originalPrice:8500, stock:8, rating:4.5, reviews:55, badge:null, image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", description:"Full aluminium radiator with 30% improved heat dissipation.", features:["36-row core","TIG welded","Pressure tested 20 PSI"] },
  { title:"Projector Headlight Assembly — Pair", partNumber:"HL-2233-TA", uniqueCode:"UNQ-HL-010", vehicleModel:"Tata Nexon EV / Nexon", modelYear:"2019–2024", weight:"1.8 kg", categoryId:3, price:7200, originalPrice:9000, stock:15, rating:4.7, reviews:88, badge:"OEM Grade", image:"https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=80", description:"L+R pair of projector headlights with LED DRL and auto-levelling.", features:["LED DRL","Auto-levelling","IP67 waterproof","L+R pair"] },
  { title:"Power Steering Pump — Hydraulic", partNumber:"PS-8871-SZ", uniqueCode:"UNQ-PS-011", vehicleModel:"Suzuki Ertiga / Ciaz", modelYear:"2016–2022", weight:"2.3 kg", categoryId:6, price:5100, originalPrice:6400, stock:22, rating:4.3, reviews:41, badge:null, image:"https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80", description:"Remanufactured hydraulic power steering pump, 100% pressure-tested.", features:["Pressure tested","Includes pulley","Factory-rebuilt"] },
  { title:"Air Filter — High Flow Panel", partNumber:"AF-3345-RN", uniqueCode:"UNQ-AF-012", vehicleModel:"Renault Kwid / Triber", modelYear:"2016–2024", weight:"0.2 kg", categoryId:5, price:499, originalPrice:650, stock:200, rating:4.4, reviews:310, badge:"New Arrival", image:"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80", description:"Oiled cotton-gauze high-flow air filter for improved throttle response.", features:["Cotton gauze media","Washable & reusable","High flow design"] },
]

const ROLES = [
  { name: "Super Admin",     permissions: ["all"] },
  { name: "Product Manager", permissions: ["products","categories"] },
  { name: "Order Manager",   permissions: ["orders"] },
  { name: "Support Agent",   permissions: ["orders","users"] },
]

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log("✅ Connected to MongoDB")

  // Clear existing data
  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
    Role.deleteMany({}),
    User.deleteMany({}),
  ])
  console.log("🗑️  Cleared existing data")

  // Seed categories
  await Category.insertMany(CATEGORIES)
  console.log("✅ Categories seeded")

  // Seed products
  await Product.insertMany(PRODUCTS)
  console.log("✅ Products seeded")

  // Seed roles
  await Role.insertMany(ROLES)
  console.log("✅ Roles seeded")

  // Create admin user
  const hashed = await bcrypt.hash("admin123", 10)
  await User.create({ name: "Admin", email: "admin@autoparts.com", password: hashed, isAdmin: true })
  console.log("✅ Admin user created — email: admin@autoparts.com / password: admin123")

  console.log("\n🎉 Database seeded successfully!")
  process.exit(0)
}

seed().catch(err => { console.error("❌ Seed error:", err); process.exit(1) })