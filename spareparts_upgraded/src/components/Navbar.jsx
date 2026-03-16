import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/store"

export default function Navbar({ searchQuery, setSearchQuery }) {
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
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" style={{ textDecoration:"none" }}>
          <div className="navbar-logo-icon">🚗</div>
          <div>
            <div className="navbar-logo-text">AUTO<span className="text-orange">PARTS</span></div>
            <div className="navbar-logo-sub">HUB</div>
          </div>
        </Link>

        {/* Search */}
        <div className="navbar-search">
          <span className="navbar-search-icon">🔍</span>
          <input
            value={searchQuery || ""}
            onChange={e => { setSearchQuery && setSearchQuery(e.target.value); if (loc.pathname !== "/products") navigate("/products") }}
            placeholder="Search part, number or vehicle..."
          />
        </div>

        {/* Desktop Nav */}
        <div className="navbar-nav">
          <Link to="/"         className={active("/")}>        <span>🏠</span> Home</Link>
          <Link to="/products" className={active("/products")}><span>📦</span> Products</Link>
          <Link to="/cart"     className={active("/cart")} style={{ position:"relative" }}>
            <span>🛒</span> Cart
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>

          {auth.isLoggedIn ? (
            <>
              <Link to="/my-orders" className={active("/my-orders")}><span>📋</span> My Orders</Link>
              {auth.isAdmin && <Link to="/admin" className={active("/admin")}><span>🛡️</span> Admin</Link>}
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login"><button className="btn btn-primary btn-sm">👤 Login</button></Link>
          )}
        </div>

        {/* Hamburger */}
        <button className="navbar-hamburger" onClick={() => setOpen(v => !v)}>{open ? "✕" : "☰"}</button>
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