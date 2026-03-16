import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { clearCart, apiPlaceOrder } from "../store/store"
import { formatINR } from "../data/dummyData"

export default function Checkout() {
  const { items }  = useSelector(s => s.cart)
  const { user }   = useSelector(s => s.auth)
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const [placed, setPlaced]     = useState(false)
  const [orderId, setOrderId]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")
  const [form, setForm] = useState({
    fname: user?.name?.split(" ")[0] || "",
    lname: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone:"", address:"", city:"", state:"", pincode:"", payment:"upi"
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = subtotal >= 999 ? 0 : 99
  const total    = subtotal + shipping
  const itemId   = (item) => item._id || item.id

  const handlePlace = async () => {
    if (!form.fname || !form.email || !form.phone || !form.address || !form.city || !form.pincode) {
      setError("Please fill in all required fields.")
      return
    }
    setError("")
    setLoading(true)
    try {
      const result = await dispatch(apiPlaceOrder({
        userId:      user?._id || user?.id || null,
        customer:    `${form.fname} ${form.lname}`.trim(),
        email:       form.email,
        phone:       form.phone,
        address:     `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
        items:       items.map(i => ({
          productId:  itemId(i),
          title:      i.title,
          partNumber: i.partNumber,
          image:      i.image,
          price:      i.price,
          qty:        i.qty,
        })),
        total,
        paymentMode: form.payment,
        status:      "Pending",
        placedAt:    new Date().toLocaleString("en-IN"),
      }))
      setOrderId(result.payload?._id)
      dispatch(clearCart())
      setPlaced(true)
    } catch (err) {
      setError("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (placed) return (
    <div style={{ maxWidth:"520px", margin:"80px auto", padding:"20px", textAlign:"center" }}>
      <div style={{ fontSize:"72px", marginBottom:"16px" }}>🎉</div>
      <h1 className="h2" style={{ marginBottom:"10px", color:"var(--orange)" }}>Order Placed!</h1>
      {orderId && (
        <div style={{ background:"var(--bg-3)", border:"1px solid var(--border)", borderRadius:"var(--r2)", padding:"12px 16px", marginBottom:"20px", fontSize:"13px", color:"var(--t2)" }}>
          Order ID: <span style={{ fontFamily:"monospace", color:"var(--orange)", fontWeight:700 }}>{orderId}</span>
        </div>
      )}
      <p style={{ color:"var(--t2)", marginBottom:"24px", fontSize:"15px" }}>
        Your order has been confirmed. Track it anytime from <strong>My Orders</strong>.
      </p>
      <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
        <button className="btn btn-primary btn-lg" onClick={() => navigate("/my-orders")}>View My Orders</button>
        <button className="btn btn-outline btn-lg" onClick={() => navigate("/")}>Back to Home</button>
      </div>
    </div>
  )

  return (
    <div className="checkout-page">
      <h1 className="h2" style={{ marginBottom:"28px", display:"flex", alignItems:"center", gap:"10px" }}>
        🛍️ Checkout
      </h1>
      <div className="checkout-grid">
        <div>
          <div className="checkout-card">
            <div className="checkout-card-title">📦 Shipping Details</div>
            <div className="form-row">
              {[["First Name","fname","text"],["Last Name","lname","text"]].map(([l,k,t]) => (
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-input" type={t} value={form[k]}
                    onChange={e => set(k, e.target.value)} placeholder={l} />
                </div>
              ))}
            </div>
            <div className="form-row">
              {[["Email","email","email"],["Phone","phone","tel"]].map(([l,k,t]) => (
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-input" type={t} value={form[k]}
                    onChange={e => set(k, e.target.value)} placeholder={l} />
                </div>
              ))}
            </div>
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input className="form-input" value={form.address}
                onChange={e => set("address", e.target.value)} placeholder="House no., Street, Area" />
            </div>
            <div className="form-row">
              {[["City","city"],["State","state"],["Pincode","pincode"]].map(([l,k]) => (
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-input" value={form[k]}
                    onChange={e => set(k, e.target.value)} placeholder={l} />
                </div>
              ))}
            </div>
          </div>

          <div className="checkout-card">
            <div className="checkout-card-title">💳 Payment Method</div>
            {[["upi","📱 UPI / GPay / PhonePe"],["card","💳 Credit / Debit Card"],["cod","💰 Cash on Delivery"]].map(([v,l]) => (
              <label key={v} style={{
                display:"flex", alignItems:"center", gap:"10px", padding:"12px 14px",
                borderRadius:"var(--r2)", border:`1px solid ${form.payment===v?"var(--orange)":"var(--border)"}`,
                background: form.payment===v?"rgba(249,115,22,.08)":"var(--bg-3)",
                cursor:"pointer", marginBottom:"8px", transition:"all .2s",
                fontSize:"14px", color:form.payment===v?"var(--orange)":"var(--t2)"
              }}>
                <input type="radio" name="pay" value={v} checked={form.payment===v}
                  onChange={() => set("payment", v)} style={{ accentColor:"var(--orange)" }} />
                {l}
              </label>
            ))}
          </div>

          {error && <p style={{ color:"#ef4444", fontSize:"13px", marginBottom:"12px" }}>⚠️ {error}</p>}

          <button className="btn btn-primary btn-lg btn-block"
            style={{ padding:"14px" }} onClick={handlePlace}
            disabled={loading || items.length === 0}>
            {loading ? "Placing Order..." : `✅ Place Order — ${formatINR(total)}`}
          </button>
        </div>

        <div>
          <div className="checkout-card">
            <div className="checkout-card-title">🧾 Order Summary</div>
            {items.map(i => (
              <div key={itemId(i)} className="order-item">
                <img src={i.image} alt={i.title} />
                <div style={{ flex:1 }}>
                  <div className="order-item-name">{i.title}</div>
                  <div className="order-item-meta">Qty: {i.qty} · {i.partNumber}</div>
                </div>
                <div className="order-item-price">{formatINR(i.price * i.qty)}</div>
              </div>
            ))}
            <div className="divider" />
            {[["Subtotal", formatINR(subtotal)], ["Shipping", shipping === 0 ? "FREE" : formatINR(shipping)]].map(([l,v]) => (
              <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:"13px", marginBottom:"8px", color:"var(--t2)" }}>
                <span>{l}</span>
                <span style={{ color: v === "FREE" ? "#22c55e" : "var(--t1)" }}>{v}</span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"var(--ff-head)", fontSize:"20px", fontWeight:900, marginTop:"10px", paddingTop:"10px", borderTop:"1px solid var(--border)" }}>
              <span>Total</span>
              <span style={{ color:"var(--orange)" }}>{formatINR(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}