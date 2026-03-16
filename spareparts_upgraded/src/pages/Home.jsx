import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import ProductCard from "../components/ProductCard"
import Toast from "../components/Toast"
import { formatINR } from "../data/dummyData"

const HERO_CARDS = [
  { icon:"⚙️", title:"Engine Parts",         sub:"Pistons, rings, gaskets", price:"From ₹499" },
  { icon:"🛑", title:"Brakes & Suspension",   sub:"Pads, discs, shocks",    price:"From ₹999" },
  { icon:"⚡", title:"Electrical Parts",      sub:"Alternators, sensors",   price:"From ₹599" },
]

export default function Home() {
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  // ── Read from Redux (which reads from MongoDB) ──
  const products   = useSelector(s => s.products.list)
  const categories = useSelector(s => s.categories.list)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600) }

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-grid">
            <div>
              <p className="eyebrow hero-eyebrow">🔩 Trusted Spare Parts Marketplace</p>
              <h1 className="h1 hero-title">Find the <span>Right Part</span><br/>for Your Vehicle</h1>
              <p className="hero-desc">OEM-grade spare parts for all major Indian and international car brands. Guaranteed fitment, fast delivery, hassle-free returns.</p>
              <div className="hero-actions">
                <button className="btn btn-primary btn-lg" onClick={() => navigate("/products")}>Shop Now →</button>
                <button className="btn btn-outline btn-lg"  onClick={() => navigate("/products")}>Browse Catalogue</button>
              </div>
              <div className="hero-stats">
                {[["10,000+","Parts in Stock"],["50+","Car Brands"],["12Mo","Warranty"],["48hr","Delivery"]].map(([v,l]) => (
                  <div key={l}>
                    <div className="stat-num">{v.replace("+","")}{v.includes("+")&&<span>+</span>}</div>
                    <div className="stat-lbl">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-visual">
              {HERO_CARDS.map((c,i) => (
                <div key={i} className="hero-card">
                  <div className="hero-card-icon">{c.icon}</div>
                  <div><div className="hero-card-title">{c.title}</div><div className="hero-card-sub">{c.sub}</div></div>
                  <div className="hero-card-price">{c.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <div className="features-strip">
        <div className="features-inner">
          {[["🚚","Free Shipping","Orders above ₹999"],["🔒","Secure Payments","100% safe checkout"],["✅","OEM Quality","Genuine parts guaranteed"],["↩️","Easy Returns","7-day return policy"]].map(([icon,ft,fs]) => (
            <div className="feature-item" key={ft}>
              <span className="feature-icon">{icon}</span>
              <div className="feature-text"><div className="ft">{ft}</div><div className="fs">{fs}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <div className="sec-header">
            <h2 className="h2 sec-title">Shop by Category</h2>
            <Link to="/products" className="view-all">View All →</Link>
          </div>
          {categories.length === 0 ? (
            <div style={{ textAlign:"center", color:"var(--t3)", padding:"40px" }}>
              No categories found. Add some in the Admin Dashboard.
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:"12px" }}>
              {categories.map(cat => (
                <Link key={cat._id} to={`/products?cat=${cat._id}`} style={{ textDecoration:"none" }}>
                  <div className="card card-glow" style={{ padding:"20px 14px", textAlign:"center", cursor:"pointer" }}>
                    <div style={{ fontSize:"32px", marginBottom:"8px" }}>{cat.icon}</div>
                    <div className="h4" style={{ fontSize:"13px" }}>{cat.name}</div>
                    <div style={{ fontSize:"11px", color:"var(--t3)", marginTop:"3px" }}>
                      {products.filter(p => p.categoryId === cat._id).length} parts
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED PRODUCTS — first 3 categories */}
      {categories.slice(0, 3).map(cat => {
        const catProds = products.filter(p => p.categoryId === cat._id)
        if (!catProds.length) return null
        return (
          <section key={cat._id} className="section" style={{ paddingTop:0 }}>
            <div className="container">
              <div className="sec-header">
                <h2 className="h2 sec-title">{cat.icon} {cat.name}</h2>
                <Link to={`/products?cat=${cat._id}`} className="view-all">View all →</Link>
              </div>
              <div className="product-grid">
                {catProds.slice(0, 4).map(p => (
                  <ProductCard key={p._id} product={p} showToast={showToast} />
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* empty state when no products at all */}
      {products.length === 0 && (
        <section className="section">
          <div className="container" style={{ textAlign:"center", color:"var(--t3)", padding:"60px 0" }}>
            <div style={{ fontSize:"48px", marginBottom:"16px" }}>📦</div>
            <h3 className="h3">No products yet</h3>
            <p style={{ marginTop:"8px" }}>Add products from the Admin Dashboard to see them here.</p>
          </div>
        </section>
      )}

      {/* PROMO BANNER */}
      <section className="container" style={{ paddingBottom:"48px" }}>
        <div style={{
          borderRadius:"var(--r4)", overflow:"hidden",
          background:"linear-gradient(135deg,rgba(249,115,22,.15) 0%,rgba(239,68,68,.1) 100%)",
          border:"1px solid rgba(249,115,22,.25)",
          padding:"40px 32px",
          display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"20px"
        }}>
          <div>
            <p className="eyebrow" style={{ marginBottom:"8px" }}>Limited Time Offer</p>
            <h2 className="h2" style={{ marginBottom:"10px" }}>Up to <span className="text-orange">40% OFF</span><br/>on Brake & Suspension</h2>
            <p style={{ color:"var(--t2)", fontSize:"14px" }}>Use code <strong style={{ color:"var(--orange)" }}>BRAKE40</strong> at checkout</p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/products")}>
            Shop Brakes →
          </button>
        </div>
      </section>

      {toast && <Toast message={toast} />}
    </div>
  )
}