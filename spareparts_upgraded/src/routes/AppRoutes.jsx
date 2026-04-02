import React from "react"
import { Routes, Route, useLocation } from "react-router-dom"

import Navbar          from "../components/Navbar"
import Footer          from "../components/Footer"
import Home            from "../pages/Home"
import Products        from "../pages/Products"
import ProductDetails  from "../pages/ProductDetails"
import Cart            from "../pages/Cart"
import Checkout        from "../pages/Checkout"
import Login           from "../pages/Login"
import AdminDashboard  from "../pages/AdminDashboard"
import MyOrders        from "../pages/MyOrders"

export default function AppRoutes() {
  const location = useLocation()
  const hideNavbar = location.pathname === "/login" || location.pathname.startsWith("/admin")
  const hideFooter = location.pathname.startsWith("/admin")

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
      {!hideNavbar && <Navbar />}
      <div style={{ flex:1 }}>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/products"    element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart"        element={<Cart />} />
          <Route path="/checkout"    element={<Checkout />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/admin"       element={<AdminDashboard />} />
          <Route path="/my-orders"   element={<MyOrders />} />
        </Routes>
      </div>
      {!hideFooter && <Footer />}
    </div>
  )
}