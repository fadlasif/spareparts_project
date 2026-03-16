import React, { useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { useSelector } from "react-redux"
import ProductCard from "../components/ProductCard"
import Toast from "../components/Toast"

const SORTS = [
  { v:"default",   l:"Featured"         },
  { v:"price-asc", l:"Price: Low→High"  },
  { v:"price-desc",l:"Price: High→Low"  },
  { v:"rating",    l:"Top Rated"        },
  { v:"newest",    l:"New Arrivals"     },
]

export default function Products() {
  const [params]          = useSearchParams()
  const initCat           = params.get("cat") || null   // now a string (_id)
  const initQ             = params.get("q") || ""

  const [selCat, setSelCat] = useState(initCat)
  const [search, setSearch] = useState(initQ)
  const [sort,   setSort]   = useState("default")
  const [toast,  setToast]  = useState(null)

  // ── Read from Redux (MongoDB) ──
  const products   = useSelector(s => s.products.list)
  const categories = useSelector(s => s.categories.list)
  const loading    = useSelector(s => s.products.loading)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600) }

  const filtered = useMemo(() => {
    let list = [...products]
    if (selCat) list = list.filter(p => p.categoryId === selCat)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.partNumber?.toLowerCase().includes(q) ||
        p.vehicleModel?.toLowerCase().includes(q) ||
        p.uniqueCode?.toLowerCase().includes(q)
      )
    }
    switch (sort) {
      case "price-asc":  list.sort((a, b) => a.price - b.price); break
      case "price-desc": list.sort((a, b) => b.price - a.price); break
      case "rating":     list.sort((a, b) => b.rating - a.rating); break
      default: break
    }
    return list
  }, [products, selCat, search, sort])

  const clearFilters = () => { setSelCat(null); setSearch(""); setSort("default") }

  return (
    <div className="products-page">
      <div className="page-wrap" style={{ paddingTop:0, paddingBottom:0 }}>

        {/* Category Strip */}
        <div className="cat-strip" style={{ margin:"0 -20px" }}>
          <div className="cat-strip-inner">
            <button className={`cat-pill${!selCat ? " active" : ""}`} onClick={() => setSelCat(null)}>
              All Parts
            </button>
            {categories.map(c => (
              <button key={c._id}
                className={`cat-pill${selCat === c._id ? " active" : ""}`}
                onClick={() => setSelCat(selCat === c._id ? null : c._id)}>
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding:"28px 0" }}>
          {/* Search bar */}
          <div style={{ position:"relative", marginBottom:"20px", maxWidth:"500px" }}>
            <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", color:"var(--t3)" }}>🔍</span>
            <input className="form-input" style={{ paddingLeft:"40px" }}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by part name, number, or vehicle..." />
          </div>

          {/* Topbar */}
          <div className="products-topbar">
            <span className="products-count">
              {loading ? "Loading..." : (
                <>
                  {filtered.length} <span style={{ color:"var(--t2)" }}>part{filtered.length !== 1 ? "s" : ""} found</span>
                  {(selCat || search) && (
                    <button onClick={clearFilters} style={{ color:"var(--orange)", fontSize:"12px", marginLeft:"12px" }}>
                      Clear filters ✕
                    </button>
                  )}
                </>
              )}
            </span>
            <div className="products-sort">
              <span>Sort:</span>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                {SORTS.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
              </select>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div style={{ textAlign:"center", padding:"60px 0", color:"var(--t3)" }}>
              <div style={{ fontSize:"40px", marginBottom:"12px" }}>⏳</div>
              <p>Loading products...</p>
            </div>
          )}

          {/* Grid */}
          {!loading && filtered.length === 0 && (
            <div className="no-result">
              <div style={{ fontSize:"56px", marginBottom:"14px" }}>🔍</div>
              <h2 className="h3" style={{ marginBottom:"8px" }}>No parts found</h2>
              <p style={{ color:"var(--t3)", marginBottom:"20px" }}>
                {products.length === 0
                  ? "No products added yet. Add products from the Admin Dashboard."
                  : "Try a different search term or browse all categories"}
              </p>
              {products.length > 0 && (
                <button className="btn btn-primary" onClick={clearFilters}>Show All Parts</button>
              )}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="product-grid">
              {filtered.map(p => <ProductCard key={p._id} product={p} showToast={showToast} />)}
            </div>
          )}
        </div>
      </div>
      {toast && <Toast message={toast} />}
    </div>
  )
}