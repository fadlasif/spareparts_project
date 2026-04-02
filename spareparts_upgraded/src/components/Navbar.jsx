import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/store"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const cart  = useSelector(s => s.cart.items)
  const auth  = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loc = useLocation()
  const count = cart.reduce((s, i) => s + i.qty, 0)
  const active = (p) => loc.pathname === p ? "navbar-link active-link" : "navbar-link"

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
    setOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner" style={{ display:"flex", alignItems:"center", gap:"0" }}>

        {/* Logo — left */}
        <Link to="/" className="navbar-logo" style={{ textDecoration:"none", marginRight:"auto" }}>
          <div className="navbar-logo-icon">🚗</div>
          <div>
            <div className="navbar-logo-text">AUTO<span className="text-orange">PARTS</span></div>
            <div className="navbar-logo-sub">HUB</div>
          </div>
        </Link>

        {/* Nav links — center */}
        <div className="navbar-nav" style={{ position:"absolute", left:"50%", transform:"translateX(-50%)" }}>
          <Link to="/"         className={active("/")}>        <span>🏠</span> Home</Link>
          <Link to="/products" className={active("/products")}><span>📦</span> Products</Link>
          <Link to="/cart"     className={active("/cart")} style={{ position:"relative" }}>
            <span>🛒</span> Cart
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
          {auth.isLoggedIn && (
            <Link to="/my-orders" className={active("/my-orders")}><span>📋</span> My Orders</Link>
          )}
          {auth.isLoggedIn && auth.isAdmin && (
            <Link to="/admin" className={active("/admin")}><span>🛡️</span> Admin</Link>
          )}
        </div>

        {/* Login / Logout — far right */}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"right" }}>
          {auth.isLoggedIn ? (
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login"><button className="btn btn-primary btn-sm">👤 Login</button></Link>
          )}
        </div>

        {/* Hamburger */}
        <button className="navbar-hamburger" onClick={() => setOpen(v => !v)} style={{ marginLeft:"12px" }}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile${open ? " open" : ""}`}>
        <Link to="/"         className="navbar-link" onClick={() => setOpen(false)}>🏠 Home</Link>
        <Link to="/products" className="navbar-link" onClick={() => setOpen(false)}>📦 Products</Link>
        <Link to="/cart"     className="navbar-link" onClick={() => setOpen(false)}>🛒 Cart {count > 0 && `(${count})`}</Link>
        {auth.isLoggedIn ? (
          <>
            <Link to="/my-orders" className="navbar-link" onClick={() => setOpen(false)}>📋 My Orders</Link>
            {auth.isAdmin && <Link to="/admin" className="navbar-link" onClick={() => setOpen(false)}>🛡️ Admin</Link>}
            <button className="navbar-link" style={{ background:"none", border:"none", cursor:"pointer", textAlign:"left", color:"#ef4444" }} onClick={handleLogout}>🚪 Logout</button>
          </>
        ) : (
          <Link to="/login" className="navbar-link" onClick={() => setOpen(false)}>👤 Login</Link>
        )}
      </div>
    </nav>
  )
}