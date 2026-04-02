import React from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

export default function Footer() {
  // Read real categories from MongoDB via Redux
  const categories = useSelector(s => s.categories.list)

  return (
    <footer style={{ background:"#000", color:"#fff" }}>

      {/* ── Main grid ── */}
      <div style={{
        maxWidth:"1280px", margin:"0 auto",
        padding:"64px 40px 48px",
        display:"grid",
        gridTemplateColumns:"1.2fr 1fr 1fr 1.2fr 1fr",
        gap:"40px",
      }}>

        {/* Brand */}
        <div style={{ display:"flex", alignItems:"flex-start", gap:"10px" }}>
          <span style={{ fontSize:"20px", marginTop:"2px" }}>🚗</span>
          <span style={{ fontSize:"15px", fontWeight:600, color:"#fff", letterSpacing:"0.02em" }}>
            autopartshub
          </span>
        </div>

        {/* Shop — dynamic categories from MongoDB */}
        <div>
          <div style={{ fontSize:"14px", fontWeight:600, color:"#fff", marginBottom:"22px" }}>Shop</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            <Link to="/products" style={{ fontSize:"14px", color:"rgba(255,255,255,0.75)", textDecoration:"none" }}
              onMouseEnter={e => e.target.style.color="#fff"}
              onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.75)"}>
              All Parts
            </Link>
            {categories.map(cat => (
              <Link key={cat._id} to={`/products?cat=${cat._id}`}
                style={{ fontSize:"14px", color:"rgba(255,255,255,0.75)", textDecoration:"none" }}
                onMouseEnter={e => e.target.style.color="#fff"}
                onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.75)"}>
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* The Company */}
        <div>
          <div style={{ fontSize:"14px", fontWeight:600, color:"#fff", marginBottom:"22px" }}>The Company</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            {["About Us","Careers","FAQ","Blog"].map(l => (
              <a key={l} href="#" style={{ fontSize:"14px", color:"rgba(255,255,255,0.75)", textDecoration:"none" }}
                onMouseEnter={e => e.target.style.color="#fff"}
                onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.75)"}>
                {l}
              </a>
            ))}
          </div>
        </div>

        {/* Contact Us */}
        <div>
          <div style={{ fontSize:"14px", fontWeight:600, color:"#fff", marginBottom:"22px" }}>Contact Us</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px", fontSize:"14px", color:"rgba(255,255,255,0.75)", lineHeight:1.6 }}>
            <div>support@autopartshub.in</div>
            <div>Mavoor Road</div>
            <div>Kozhikode, Kerala,</div>
            <div>IN 673001</div>
            <div>Tel: +91 98765 43210</div>
          </div>
        </div>

        {/* Follow Us */}
        <div>
          <div style={{ fontSize:"14px", fontWeight:600, color:"#fff", marginBottom:"22px" }}>Follow Us</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            {["Facebook","Instagram","Youtube","X"].map(l => (
              <a key={l} href="#" style={{ fontSize:"14px", color:"rgba(255,255,255,0.75)", textDecoration:"none" }}
                onMouseEnter={e => e.target.style.color="#fff"}
                onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.75)"}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.15)" }} />

      {/* ── Policy bar ── */}
      <div style={{
        maxWidth:"1280px", margin:"0 auto",
        padding:"20px 40px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        flexWrap:"wrap", gap:"16px",
      }}>
        {["Terms & Conditions","Privacy Policy","Shipping Policy","Refund Policy","Accessibility Statement"].map(l => (
          <a key={l} href="#" style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", textDecoration:"none" }}
            onMouseEnter={e => e.target.style.color="#fff"}
            onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.6)"}>
            {l}
          </a>
        ))}
      </div>

      {/* ── Divider ── */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.15)" }} />

      {/* ── Copyright ── */}
      <div style={{ textAlign:"center", padding:"16px 40px", fontSize:"13px", color:"rgba(255,255,255,0.4)" }}>
        © {new Date().getFullYear()} AutoParts Hub. All rights reserved.
      </div>

    </footer>
  )
}