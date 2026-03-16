import React from "react"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { addToCart } from "../store/store"
import { formatINR, disc, badgeColor } from "../data/dummyData"

export default function ProductCard({ product, showToast }) {
  const dispatch = useDispatch()
  const d = disc(product.originalPrice, product.price)
  const outOfStock = product.stock <= 0

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (outOfStock) return
    dispatch(addToCart(product))
    showToast && showToast(`${product.title} added to cart!`)
  }

  return (
    <Link to={`/product/${product._id}`} className="pcard" style={{ display:"block", opacity: outOfStock ? 0.75 : 1 }}>
      <div className="pcard-img">
        <img src={product.image} alt={product.title} loading="lazy" />
        {outOfStock ? (
          <span className="tag badge-abs" style={{ background:"#6b7280", color:"#fff" }}>Out of Stock</span>
        ) : product.badge ? (
          <span className="tag badge-abs" style={{ background:badgeColor(product.badge), color:"#fff" }}>{product.badge}</span>
        ) : null}
        {!outOfStock && d > 0 && <span className="disc-tag">{d}% OFF</span>}
      </div>
      <div className="pcard-body">
        <p className="pcard-part">{product.partNumber}</p>
        <h3 className="pcard-title">{product.title}</h3>
        <p className="pcard-vehicle">🚗 {product.vehicleModel} · {product.modelYear}</p>
        <div className="pcard-price-row">
          <span className="pcard-price">{formatINR(product.price)}</span>
          {!outOfStock && <span className="pcard-orig">{formatINR(product.originalPrice)}</span>}
        </div>
        {outOfStock ? (
          <button className="pcard-btn" disabled
            style={{ background:"#6b7280", cursor:"not-allowed", opacity:0.7 }}>
            ❌ Out of Stock
          </button>
        ) : (
          <button className="pcard-btn" onClick={handleAdd}>🛒 Add to Cart</button>
        )}
      </div>
    </Link>
  )
}