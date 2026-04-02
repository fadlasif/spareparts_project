import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import ProductCard from "../components/ProductCard"
import Toast from "../components/Toast"
import { formatINR } from "../data/dummyData"

// Dark themed category images mapped by category name keywords
const CAT_IMAGES = {
  "engine":      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80",
  "brake":       "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80",
  "electrical":  "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=80",
  "body":        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
  "filter":      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80",
  "transmission":"https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80",
  "cooling":     "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "tyre":        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&q=80",
  "wheel":       "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&q=80",
  "accessory":   "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80",
  "suspension":  "https://images.unsplash.com/photo-1504222490345-c075b7b52e7b?w=600&q=80",
  "default":     "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80",
}

const getCatImage = (name) => {
  const lower = name.toLowerCase()
  for (const [key, url] of Object.entries(CAT_IMAGES)) {
    if (lower.includes(key)) return url
  }
  return CAT_IMAGES.default
}

export default function Home() {
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  const products   = useSelector(s => s.products.list)
  const categories = useSelector(s => s.categories.list)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600) }

  return (
    <div>
      {/* HERO */}
      <section className="hero" style={{ padding:0, overflow:"hidden", position:"relative", minHeight:"520px" }}>
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:`url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80")`,
          backgroundSize:"cover", backgroundPosition:"center",
          filter:"brightness(0.35)", zIndex:0,
        }} />
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(249,115,22,0.15) 100%)",
          zIndex:1,
        }} />
        <div className="hero-inner" style={{ position:"relative", zIndex:2, padding:"80px 20px" }}>
          <div style={{ maxWidth:"640px" }}>
            <p className="eyebrow hero-eyebrow">🔩 Trusted Spare Parts Marketplace</p>
            <h1 className="h1 hero-title">Find the <span>Right Part</span><br/>for Your Vehicle</h1>
            <p className="hero-desc">OEM-grade spare parts for all major Indian and international car brands. Guaranteed fitment, fast delivery, hassle-free returns.</p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate("/products")}>Shop Now →</button>
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

      {/* CATEGORIES — bigger cards with dark images */}
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
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"16px" }}>
              {categories.map(cat => (
                <Link key={cat._id} to={`/products?cat=${cat._id}`} style={{ textDecoration:"none" }}>
                  <div style={{
                    borderRadius:"var(--r3)", overflow:"hidden", cursor:"pointer",
                    border:"1px solid var(--border)", position:"relative", height:"180px",
                    transition:"transform .2s, box-shadow .2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(249,115,22,.2)" }}
                    onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none" }}
                  >
                    {/* Background image */}
                    <div style={{
                      position:"absolute", inset:0,
                      backgroundImage:`url("${getCatImage(cat.name)}")`,
                      backgroundSize:"cover", backgroundPosition:"center",
                      filter:"brightness(0.4)",
                    }} />
                    {/* Gradient */}
                    <div style={{
                      position:"absolute", inset:0,
                      background:"linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)",
                    }} />
                    {/* Content */}
                    <div style={{
                      position:"absolute", inset:0, padding:"16px",
                      display:"flex", flexDirection:"column", justifyContent:"flex-end",
                    }}>
                      <div style={{ fontSize:"28px", marginBottom:"6px" }}>{cat.icon}</div>
                      <div style={{ fontWeight:700, fontSize:"15px", color:"#fff" }}>{cat.name}</div>
                      <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.6)", marginTop:"3px" }}>
                        {products.filter(p => p.categoryId === cat._id).length} parts
                      </div>
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

      {/* empty state */}
      {products.length === 0 && (
        <section className="section">
          <div className="container" style={{ textAlign:"center", color:"var(--t3)", padding:"60px 0" }}>
            <div style={{ fontSize:"48px", marginBottom:"16px" }}>📦</div>
            <h3 className="h3">No products yet</h3>
            <p style={{ marginTop:"8px" }}>Add products from the Admin Dashboard to see them here.</p>
          </div>
        </section>
      )}

     

      {toast && <Toast message={toast} />}
    </div>
  )
}