import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { formatINR } from "../data/dummyData"
import api from "../services/api"

const STATUS_COLORS = {
  Pending:    { bg:"rgba(234,179,8,.15)",    color:"#eab308" },
  Processing: { bg:"rgba(59,130,246,.15)",   color:"#3b82f6" },
  Shipped:    { bg:"rgba(249,115,22,.15)",   color:"#f97316" },
  Delivered:  { bg:"rgba(34,197,94,.15)",    color:"#22c55e" },
  Cancelled:  { bg:"rgba(239,68,68,.15)",    color:"#ef4444" },
}

const STATUS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"]

export default function MyOrders() {
  const { user, isLoggedIn } = useSelector(s => s.auth)
  const navigate = useNavigate()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState("")

  useEffect(() => {
    if (!isLoggedIn) { navigate("/login"); return }
    fetchMyOrders()

    // Poll every 30 seconds so status updates from admin reflect automatically
    const interval = setInterval(fetchMyOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchMyOrders = async () => {
    try {
      const res = await api.get("/orders/my")
      setOrders(res.data)
    } catch (err) {
      setError("Failed to load orders.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div style={{ textAlign:"center", padding:"80px 20px", color:"var(--t3)" }}>
      <div style={{ fontSize:"40px", marginBottom:"12px" }}>⏳</div>
      <p>Loading your orders...</p>
    </div>
  )

  if (error) return (
    <div style={{ textAlign:"center", padding:"80px 20px", color:"#ef4444" }}>
      <div style={{ fontSize:"40px", marginBottom:"12px" }}>❌</div>
      <p>{error}</p>
      <button className="btn btn-primary" style={{ marginTop:"16px" }} onClick={fetchMyOrders}>Retry</button>
    </div>
  )

  return (
    <div className="page-wrap">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"24px", flexWrap:"wrap", gap:"12px" }}>
        <h1 className="h2">📦 My Orders</h1>
        <button className="btn btn-outline btn-sm" onClick={fetchMyOrders}>🔄 Refresh</button>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px 20px" }}>
          <div style={{ fontSize:"64px", marginBottom:"16px" }}>🛍️</div>
          <h2 className="h3" style={{ marginBottom:"8px" }}>No orders yet</h2>
          <p style={{ color:"var(--t3)", marginBottom:"24px" }}>Browse our catalogue and place your first order!</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/products")}>Shop Now</button>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
          {orders.map(order => {
            const sc     = STATUS_COLORS[order.status] || STATUS_COLORS.Pending
            const stepIdx = STATUS_STEPS.indexOf(order.status)

            return (
              <div key={order._id} className="card" style={{ padding:"20px 24px" }}>
                {/* Order Header */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px", marginBottom:"16px" }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
                      <span style={{ fontFamily:"monospace", fontSize:"12px", color:"var(--t3)" }}>
                        #{order._id?.slice(-10).toUpperCase()}
                      </span>
                      <span style={{ background:sc.bg, color:sc.color, padding:"3px 10px", borderRadius:"var(--rF)", fontSize:"12px", fontWeight:700 }}>
                        {order.status}
                      </span>
                    </div>
                    <div style={{ fontSize:"12px", color:"var(--t3)", marginTop:"4px" }}>
                      🕐 {order.placedAt || new Date(order.createdAt).toLocaleString("en-IN")}
                      &nbsp;·&nbsp;💳 {order.paymentMode}
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"var(--ff-head)", fontSize:"22px", fontWeight:900, color:"var(--orange)" }}>
                      {formatINR(order.total)}
                    </div>
                    <div style={{ fontSize:"12px", color:"var(--t3)" }}>{order.items?.length} item(s)</div>
                  </div>
                </div>

                {/* Progress Bar — only for non-cancelled */}
                {order.status !== "Cancelled" && (
                  <div style={{ marginBottom:"16px" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative" }}>
                      <div style={{ position:"absolute", top:"50%", left:"0", right:"0", height:"2px", background:"var(--border)", zIndex:0, transform:"translateY(-50%)" }} />
                      <div style={{ position:"absolute", top:"50%", left:"0", height:"2px", background:"var(--orange)", zIndex:1, transform:"translateY(-50%)", width: stepIdx >= 0 ? `${(stepIdx / (STATUS_STEPS.length - 1)) * 100}%` : "0%", transition:"width .4s" }} />
                      {STATUS_STEPS.map((step, i) => (
                        <div key={step} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"6px", zIndex:2 }}>
                          <div style={{
                            width:"28px", height:"28px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:700,
                            background: i <= stepIdx ? "var(--orange)" : "var(--bg-3)",
                            color:      i <= stepIdx ? "#fff" : "var(--t3)",
                            border:     `2px solid ${i <= stepIdx ? "var(--orange)" : "var(--border)"}`,
                          }}>
                            {i < stepIdx ? "✓" : i + 1}
                          </div>
                          <span style={{ fontSize:"10px", color: i <= stepIdx ? "var(--orange)" : "var(--t3)", fontWeight: i === stepIdx ? 700 : 400 }}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {order.status === "Cancelled" && (
                  <div style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.2)", borderRadius:"var(--r2)", padding:"10px 14px", marginBottom:"16px", fontSize:"13px", color:"#ef4444" }}>
                    ❌ This order has been cancelled.
                  </div>
                )}

                {/* Items */}
                <div style={{ background:"var(--bg-3)", borderRadius:"var(--r2)", padding:"12px 14px", marginBottom:"14px" }}>
                  {order.items?.map((item, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"8px 0", borderBottom: i < order.items.length - 1 ? "1px solid var(--border)" : "none" }}>
                      {item.image && <img src={item.image} alt="" style={{ width:"44px", height:"44px", borderRadius:"8px", objectFit:"cover" }} />}
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:600, fontSize:"13px" }}>{item.title}</div>
                        <div style={{ fontSize:"11px", color:"var(--t3)" }}>{item.partNumber} · Qty: {item.qty}</div>
                      </div>
                      <div style={{ fontFamily:"var(--ff-head)", fontWeight:700, color:"var(--orange)", fontSize:"14px" }}>
                        {formatINR(item.price * item.qty)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Address */}
                {order.address && (
                  <div style={{ fontSize:"12px", color:"var(--t3)" }}>
                    📍 {order.address}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}