import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addToCart, fetchProducts } from "../store/store"
import Toast from "../components/Toast"
import ProductCard from "../components/ProductCard"
import { formatINR, disc, badgeColor } from "../data/dummyData"

export default function ProductDetails() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const dispatch  = useDispatch()
  const [qty, setQty]     = useState(1)
  const [toast, setToast] = useState(null)

  const products   = useSelector(s => s.products.list)
  const categories = useSelector(s => s.categories.list)
  const product    = products.find(p => p._id === id)

  // ── Always fetch fresh stock from MongoDB when page loads ──
  useEffect(() => {
    dispatch(fetchProducts())
  }, [id])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600) }

  if (!product) return (
    <div className="container" style={{ padding:"80px 20px", textAlign:"center" }}>
      <div style={{ fontSize:"64px", marginBottom:"16px" }}>😕</div>
      <h2 className="h2">Product Not Found</h2>
      <button className="btn btn-primary" style={{ marginTop:"20px" }} onClick={() => navigate("/products")}>
        Back to Products
      </button>
    </div>
  )

  const outOfStock = product.stock <= 0
  const cat     = categories.find(c => c._id === product.categoryId)
  const d       = disc(product.originalPrice, product.price)
  const related = products.filter(p => p.categoryId === product.categoryId && p._id !== product._id).slice(0, 4)

  const handleAddToCart = () => {
    if (outOfStock) return
    for (let i = 0; i < qty; i++) dispatch(addToCart(product))
    showToast(`${product.title} (×${qty}) added to cart!`)
  }

  const specs = [
    ["Part Number",   product.partNumber],
    ["Unique Code",   product.uniqueCode],
    ["Vehicle Model", product.vehicleModel],
    ["Model Year",    product.modelYear],
    ["Weight",        product.weight],
    ["In Stock",      outOfStock ? "Out of Stock" : `${product.stock} units`],
    ["Category",      `${cat?.icon || ""} ${cat?.name || "—"}`],
    ["Rating",        `⭐ ${product.rating || "N/A"} (${product.reviews || 0} reviews)`],
  ]

  return (
    <div>
      <div className="pd-page">
        <div className="breadcrumb">
          <Link to="/" style={{ color:"var(--t3)" }}>Home</Link> ›
          <Link to="/products" style={{ color:"var(--t3)" }}>Products</Link> ›
          <span>{product.title}</span>
        </div>

        <div className="pd-grid">
          {/* Image */}
          <div>
            <div className="pd-img-main" style={{ position:"relative" }}>
              <img src={product.image} alt={product.title} />
              {outOfStock ? (
                <span className="tag badge-abs" style={{ background:"#6b7280", color:"#fff" }}>Out of Stock</span>
              ) : product.badge ? (
                <span className="tag badge-abs" style={{ background:badgeColor(product.badge), color:"#fff" }}>
                  {product.badge}
                </span>
              ) : null}
              {!outOfStock && d > 0 && <span className="disc-tag">{d}% OFF</span>}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="pd-cat">
              <span className="tag tag-orange">{cat?.icon} {cat?.name}</span>
            </div>
            <h1 className="h2 pd-title">{product.title}</h1>

            <div className="pd-rating">
              <span className="pd-stars">{"★".repeat(Math.round(product.rating || 4))}</span>
              <span style={{ fontWeight:600 }}>{product.rating || "4.5"}</span>
              <span>({product.reviews || 0} reviews)</span>
              <span style={{ color: outOfStock ? "#ef4444" : product.stock > 20 ? "#22c55e" : "#eab308" }}>
                {outOfStock ? "● Out of Stock" : product.stock > 20 ? "● In Stock" : `● Only ${product.stock} left`}
              </span>
            </div>

            <div className="pd-price-row">
              <span className="pd-price">{formatINR(product.price)}</span>
              {!outOfStock && <span className="pd-orig">{formatINR(product.originalPrice)}</span>}
              {!outOfStock && d > 0 && <span className="pd-disc">{d}% OFF</span>}
            </div>

            <p className="pd-desc">{product.description}</p>

            {product.features && product.features.length > 0 && (
              <div style={{ marginBottom:"20px" }}>
                <div className="h4" style={{ marginBottom:"8px", fontSize:"13px", letterSpacing:".08em", color:"var(--t3)", textTransform:"uppercase" }}>Key Features</div>
                {product.features.map((f, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"5px", fontSize:"13px", color:"var(--t2)" }}>
                    <span style={{ color:"#22c55e", fontSize:"14px" }}>✓</span>{f}
                  </div>
                ))}
              </div>
            )}

            <div className="pd-spec-grid">
              {specs.map(([l, v]) => (
                <div key={l} className="pd-spec">
                  <div className="pd-spec-lbl">{l}</div>
                  <div className="pd-spec-val" style={{ color: l === "In Stock" && outOfStock ? "#ef4444" : "" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Qty + Actions */}
            {outOfStock ? (
              <div style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.2)", borderRadius:"var(--r2)", padding:"14px 16px", marginTop:"20px", fontSize:"14px", color:"#ef4444", fontWeight:600 }}>
                ❌ This product is currently out of stock.
              </div>
            ) : (
              <>
                <div className="pd-qty">
                  <span className="pd-qty-label">Quantity:</span>
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                    <span className="qty-val">{qty}</span>
                    <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                  </div>
                  {product.stock <= 10 && (
                    <span style={{ fontSize:"12px", color:"#eab308" }}>⚠️ Only {product.stock} left!</span>
                  )}
                </div>
                <div className="pd-actions">
                  <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>🛒 Add to Cart</button>
                  <button className="btn btn-outline btn-lg" onClick={() => { handleAddToCart(); navigate("/cart") }}>⚡ Buy Now</button>
                </div>
              </>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop:"48px" }}>
            <div className="sec-header"><h2 className="h3 sec-title">Related Parts</h2></div>
            <div className="product-grid">
              {related.map(p => <ProductCard key={p._id} product={p} showToast={showToast} />)}
            </div>
          </div>
        )}
      </div>
      {toast && <Toast message={toast} />}
    </div>
  )
}