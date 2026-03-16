import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { updateQty, removeFromCart } from "../store/store"
import { formatINR } from "../data/dummyData"

export default function Cart() {
  const { items }      = useSelector(s => s.cart)
  const { isLoggedIn } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const count    = items.reduce((s, i) => s + i.qty, 0)
  const savings  = items.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.qty, 0)

  // helper — works for both _id (MongoDB) and id (legacy)
  const itemId = (item) => item._id || item.id

  return (
    <div className="cart-page">
      <h1 className="cart-page-title">
        🛒 My Cart {count > 0 && <span className="tag tag-orange">{count} items</span>}
      </h1>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <div className="empty-title">Your cart is empty</div>
          <p className="empty-sub">Browse our catalogue and add spare parts to your cart</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/products")}>Shop Now</button>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={itemId(item)} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-item-img" />
                <div className="cart-item-info">
                  <Link to={`/product/${itemId(item)}`} className="cart-item-title"
                    style={{ display:"block", marginBottom:"4px" }}>{item.title}</Link>
                  <div className="cart-item-meta">{item.partNumber} · {item.vehicleModel}</div>
                  <div className="cart-item-price">{formatINR(item.price)}</div>
                </div>
                <div className="cart-item-right">
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => dispatch(updateQty({ id: itemId(item), qty: item.qty - 1 }))}>−</button>
                    <span className="qty-val">{item.qty}</span>
                    <button className="qty-btn" onClick={() => dispatch(updateQty({ id: itemId(item), qty: item.qty + 1 }))}>+</button>
                  </div>
                  <div style={{ fontSize:"14px", fontWeight:600, color:"var(--orange)" }}>{formatINR(item.price * item.qty)}</div>
                  <button className="btn btn-danger btn-sm" onClick={() => dispatch(removeFromCart(itemId(item)))}>🗑 Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary-box">
            <div className="summary-title">Order Summary</div>
            {items.map(i => (
              <div key={itemId(i)} className="summary-row">
                <span className="lbl" style={{ maxWidth:"160px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {i.title} ×{i.qty}
                </span>
                <span>{formatINR(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="summary-row"><span className="lbl">Subtotal</span><span>{formatINR(subtotal)}</span></div>
            <div className="summary-row"><span className="lbl">Shipping</span><span style={{ color:"#22c55e" }}>FREE</span></div>
            {savings > 0 && (
              <div className="summary-row"><span className="lbl">You Save</span><span style={{ color:"#22c55e" }}>−{formatINR(savings)}</span></div>
            )}
            <div className="summary-row" style={{ marginTop:"6px", paddingTop:"6px", borderTop:"1px solid var(--border-2)" }}>
              <span style={{ fontFamily:"var(--ff-head)", fontSize:"18px", fontWeight:800 }}>Total</span>
              <span className="summary-total">{formatINR(subtotal)}</span>
            </div>
            {!isLoggedIn && <div className="login-warn">⚠️ Please login to complete checkout</div>}
            <button className="btn btn-primary btn-block"
              style={{ marginTop:"12px", padding:"13px" }}
              onClick={() => isLoggedIn ? navigate("/checkout") : navigate("/login")}>
              {isLoggedIn ? "Proceed to Checkout →" : "Login to Checkout"}
            </button>
            <Link to="/products">
              <button className="btn btn-outline btn-block" style={{ marginTop:"10px", padding:"11px" }}>
                ← Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}