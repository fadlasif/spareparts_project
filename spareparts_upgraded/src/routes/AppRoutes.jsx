import React, { useState } from "react"
import { Routes, Route, useLocation } from "react-router-dom"

import Navbar          from "../components/Navbar"
import Home            from "../pages/Home"
import Products        from "../pages/Products"
import ProductDetails  from "../pages/ProductDetails"
import Cart            from "../pages/Cart"
import Checkout        from "../pages/Checkout"
import Login           from "../pages/Login"
import AdminDashboard  from "../pages/AdminDashboard"
import MyOrders        from "../pages/MyOrders"

export default function AppRoutes() {
  const [searchQuery, setSearchQuery] = useState("")
  const location = useLocation()

  const hideNavbar = location.pathname === "/login" || location.pathname.startsWith("/admin")

  return (
    <>
      {!hideNavbar && (
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      )}
      <Routes>
        <Route path="/"            element={<Home searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        <Route path="/products"    element={<Products searchQuery={searchQuery} />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart"        element={<Cart />} />
        <Route path="/checkout"    element={<Checkout />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/admin"       element={<AdminDashboard />} />
        <Route path="/my-orders"   element={<MyOrders />} />
      </Routes>
    </>
  )
}