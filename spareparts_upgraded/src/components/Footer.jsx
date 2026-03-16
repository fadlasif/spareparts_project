import React from "react"
import { Link } from "react-router-dom"
import { CATEGORIES } from "../data/dummyData"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">AUTO <span>PARTS </span>HUB</div>
            <p className="footer-desc">Your trusted marketplace for genuine OEM and aftermarket automobile spare parts. Fast delivery, guaranteed fitment.</p>
          </div>
          <div>
            <div className="footer-head">Categories</div>
            {CATEGORIES.slice(0,5).map(c => (
              <Link key={c.id} to={`/products?cat=${c.id}`} className="footer-link">{c.icon} {c.name}</Link>
            ))}
          </div>
          <div>
            <div className="footer-head">Quick Links</div>
            {[["Home","/"],["Products","/products"],["Cart","/cart"],["Login","/login"]].map(([l,p]) => (
              <Link key={p} to={p} className="footer-link">{l}</Link>
            ))}
          </div>
          <div>
            <div className="footer-head">Contact</div>
            <p className="footer-link">📞 +91 98765 43210</p>
            <p className="footer-link">✉️ support@autopartshub.in</p>
            <p className="footer-link">🕐 Mon–Sat 9AM–6PM</p>
          </div>
        </div>
        <div className="footer-bottom">© 2025 AutoParts Hub. All rights reserved.</div>
      </div>
    </footer>
  )
}
