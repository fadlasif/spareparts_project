import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  logout,
  fetchProducts, fetchCategories, fetchOrders, fetchRoles, fetchUsers,
  apiAddProduct    as addProduct,
  apiUpdateProduct as updateProduct,
  apiDeleteProduct as deleteProduct,
  apiAddCategory    as addCategory,
  apiUpdateCategory as updateCategory,
  apiDeleteCategory as deleteCategory,
  apiAddRole    as addRole,
  apiDeleteRole as deleteRole,
  apiUpdateOrderStatus as updateOrderStatus,
} from "../store/store"
import { ALL_PERMISSIONS, formatINR } from "../data/dummyData"
import Toast from "../components/Toast"

const STATUS_COLORS = {
  Pending:    "tag-yellow",
  Processing: "tag-blue",
  Shipped:    "tag-orange",
  Delivered:  "tag-green",
  Cancelled:  "tag-red",
}

function ProductModal({ product, categories, onClose, onSave }) {
  const blank = {
    title:"", partNumber:"", vehicleModel:"", modelYear:"", weight:"",
    categoryId: categories[0]?._id || "",
    uniqueCode:"", price:"", originalPrice:"", stock:"",
    image:"", badge:"", description:"", rating:4.5, reviews:0, features:[]
  }
  const [f, setF] = useState(product ? { ...product } : blank)
  const s = (k, v) => setF(x => ({ ...x, [k]: v }))

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div className="modal-title">{product ? "Edit Product" : "Add New Product"}</div>
          <button onClick={onClose} style={{ color:"var(--t3)", fontSize:"20px" }}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-grid">
            {[
              ["title","Product Title",2],
              ["partNumber","Part Number",1],
              ["uniqueCode","Unique Code",1],
              ["vehicleModel","Vehicle Model & Compatibility",1],
              ["modelYear","Model Year",1],
              ["weight","Weight (e.g. 1.2 kg)",1],
              ["price","Selling Price (₹)",1],
              ["originalPrice","Original Price (₹)",1],
              ["stock","Stock Qty",1],
              ["image","Product Image URL",2],
            ].map(([k, lbl, cols]) => (
              <div key={k} className={cols === 2 ? "col2" : ""}>
                <label className="form-label">{lbl}</label>
                <input className="form-input"
                  type={["price","originalPrice","stock"].includes(k) ? "number" : "text"}
                  value={f[k] || ""} onChange={e => s(k, e.target.value)} />
              </div>
            ))}
            <div className="col2">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" value={f.description || ""} onChange={e => s("description", e.target.value)} />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select className="form-select" value={f.categoryId || ""} onChange={e => s("categoryId", e.target.value)}>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Badge</label>
              <select className="form-select" value={f.badge || ""} onChange={e => s("badge", e.target.value || "")}>
                <option value="">None</option>
                {["Bestseller","New Arrival","OEM Grade","Premium","Hot","Value Pack"].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => {
            onSave({
              ...f,
              price:         Number(f.price),
              originalPrice: Number(f.originalPrice),
              stock:         Number(f.stock),
              rating:        product?.rating || 4.5,
              reviews:       product?.reviews || 0,
              features:      f.features || [],
            })
            onClose()
          }}>
            {product ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  )
}

function DashTab({ products, categories, orders }) {
  const stockValue    = products.reduce((s, p) => s + p.price * p.stock, 0)
  const pendingOrders = orders.filter(o => o.status === "Pending").length
  return (
    <div>
      <div className="admin-page-title">Dashboard</div>
      <div className="stat-cards">
        {[
          [products.length,       "📦", "Total Products",  "var(--orange)"],
          [categories.length,     "🗂️",  "Categories",      "#3b82f6"],
          [orders.length,         "🧾", "Total Orders",    "#22c55e"],
          [formatINR(stockValue), "💰", "Stock Value",     "#a855f7"],
        ].map(([v, icon, lbl, color]) => (
          <div key={lbl} className="stat-card">
            <div className="stat-card-icon">{icon}</div>
            <div className="stat-card-val" style={{ color }}>{v}</div>
            <div className="stat-card-label">{lbl}</div>
          </div>
        ))}
      </div>
      {pendingOrders > 0 && (
        <div style={{ background:"rgba(234,179,8,.1)", border:"1px solid rgba(234,179,8,.3)", borderRadius:"var(--r2)", padding:"12px 16px", marginBottom:"20px", display:"flex", alignItems:"center", gap:"10px", fontSize:"14px" }}>
          <span style={{ fontSize:"20px" }}>🔔</span>
          <span style={{ color:"#eab308", fontWeight:600 }}>{pendingOrders} new pending order{pendingOrders > 1 ? "s" : ""} awaiting your action!</span>
        </div>
      )}
      <h2 className="h3" style={{ marginBottom:"14px" }}>Recent Orders</h2>
      {orders.length === 0 ? (
        <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--r3)", padding:"32px", textAlign:"center", color:"var(--t3)" }}>No orders yet.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr>{["Order ID","Customer","Items","Total","Payment","Status","Placed At"].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {orders.slice(0, 8).map(o => (
                <tr key={o._id}>
                  <td><span className="tbl-mono">{o._id?.slice(-8)}</span></td>
                  <td style={{ fontWeight:600 }}>{o.customer}<div style={{ fontSize:"11px", color:"var(--t3)" }}>{o.email}</div></td>
                  <td>{o.items?.length || 0} item(s)</td>
                  <td style={{ fontFamily:"var(--ff-head)", fontWeight:800, color:"var(--orange)" }}>{formatINR(o.total)}</td>
                  <td style={{ textTransform:"capitalize", color:"var(--t2)" }}>{o.paymentMode}</td>
                  <td><span className={`tbl-badge ${STATUS_COLORS[o.status] || "tag-blue"}`}>{o.status}</span></td>
                  <td style={{ color:"var(--t3)", fontSize:"12px" }}>{o.placedAt || new Date(o.createdAt).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <h2 className="h3" style={{ margin:"28px 0 14px" }}>Inventory Snapshot</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr>{["Product","Part No.","Vehicle","Price","Stock","Status"].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {products.slice(0, 6).map(p => (
              <tr key={p._id}>
                <td style={{ fontWeight:600, maxWidth:180 }}>{p.title}</td>
                <td><span className="tbl-mono">{p.partNumber}</span></td>
                <td style={{ color:"var(--t2)" }}>{p.vehicleModel}</td>
                <td style={{ fontFamily:"var(--ff-head)", fontWeight:800, color:"var(--orange)" }}>{formatINR(p.price)}</td>
                <td><span className={`tbl-badge ${p.stock > 20 ? "tag-green" : p.stock > 0 ? "tag-yellow" : "tag-red"}`}>{p.stock}</span></td>
                <td><span className={`tbl-badge ${p.stock > 0 ? "tag-green" : "tag-red"}`}>{p.stock > 0 ? "In Stock" : "Out of Stock"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function OrdersTab({ orders, dispatch }) {
  const [filter, setFilter] = useState("All")
  const statuses = ["All","Pending","Processing","Shipped","Delivered","Cancelled"]
  const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter)

  const handleStatusUpdate = async (id, status) => {
    await dispatch(updateOrderStatus({ id, status }))
    await dispatch(fetchOrders())
  }

  return (
    <div>
      <div className="admin-page-title">Order Management</div>
      <div className="cat-strip-inner" style={{ padding:"0 0 16px", flexWrap:"wrap" }}>
        {statuses.map(s => (
          <button key={s} className={`cat-pill${filter === s ? " active" : ""}`}
            onClick={() => setFilter(s)} style={{ fontSize:"12px", padding:"6px 14px" }}>
            {s} {s !== "All" && <span style={{ opacity:.7 }}>({orders.filter(o => o.status === s).length})</span>}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--r3)", padding:"40px", textAlign:"center", color:"var(--t3)" }}>
          {filter === "All" ? "No orders yet." : `No ${filter} orders.`}
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          {filtered.map(order => (
            <div key={order._id} className="card" style={{ padding:"18px 20px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px", marginBottom:"12px" }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
                    <span className="tbl-mono" style={{ fontSize:"13px" }}>{order._id?.slice(-10)}</span>
                    <span className={`tbl-badge ${STATUS_COLORS[order.status] || "tag-blue"}`}>{order.status}</span>
                  </div>
                  <div style={{ marginTop:"4px", fontSize:"13px", color:"var(--t2)" }}>
                    👤 {order.customer}
                    {order.email && <span style={{ color:"var(--t3)", marginLeft:"8px" }}>{order.email}</span>}
                  </div>
                  {order.phone   && <div style={{ fontSize:"12px", color:"var(--t3)" }}>📞 {order.phone}</div>}
                  {order.address && <div style={{ fontSize:"12px", color:"var(--t3)" }}>📍 {order.address}</div>}
                  <div style={{ fontSize:"12px", color:"var(--t3)", marginTop:"2px" }}>
                    🕐 {order.placedAt || new Date(order.createdAt).toLocaleString("en-IN")} · 💳 {order.paymentMode}
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"var(--ff-head)", fontSize:"22px", fontWeight:900, color:"var(--orange)" }}>{formatINR(order.total)}</div>
                  <div style={{ fontSize:"12px", color:"var(--t3)" }}>{order.items?.length || 0} item(s)</div>
                </div>
              </div>
              {order.items?.length > 0 && (
                <div style={{ background:"var(--bg-3)", borderRadius:"var(--r2)", padding:"10px 14px", marginBottom:"14px" }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"6px 0", borderBottom: i < order.items.length-1 ? "1px solid var(--border)" : "none" }}>
                      {item.image && <img src={item.image} alt="" style={{ width:"36px", height:"36px", borderRadius:"6px", objectFit:"cover" }} />}
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"13px", fontWeight:600 }}>{item.title}</div>
                        <div style={{ fontSize:"11px", color:"var(--t3)" }}>{item.partNumber} · Qty: {item.qty}</div>
                      </div>
                      <div style={{ fontFamily:"var(--ff-head)", fontWeight:700, color:"var(--orange)", fontSize:"14px" }}>{formatINR(item.price * item.qty)}</div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
                <span style={{ fontSize:"13px", color:"var(--t2)" }}>Update Status:</span>
                {["Pending","Processing","Shipped","Delivered","Cancelled"].map(s => (
                  <button key={s}
                    className={`tbl-badge ${order.status === s ? STATUS_COLORS[s] : ""}`}
                    style={{ cursor:"pointer", border: order.status === s ? "none" : "1px solid var(--border)", background: order.status === s ? "" : "var(--bg-3)", color: order.status === s ? "" : "var(--t3)", padding:"5px 12px", borderRadius:"var(--rF)", fontSize:"12px", fontWeight:700 }}
                    onClick={() => handleStatusUpdate(order._id, s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProductsTab({ products, categories, dispatch, showToast }) {
  const [show, setShow] = useState(false)
  const [edit, setEdit] = useState(null)

  const handleSave = async (p) => {
    if (edit) await dispatch(updateProduct({ ...p, _id: edit._id }))
    else      await dispatch(addProduct(p))
    await dispatch(fetchProducts())
    showToast(edit ? "Product updated!" : "Product added!")
  }

  const handleDelete = async (id) => {
    await dispatch(deleteProduct(id))
    await dispatch(fetchProducts())
    showToast("Product deleted!")
  }

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px" }}>
        <div className="admin-page-title" style={{ marginBottom:0 }}>Product Management</div>
        <button className="btn btn-primary btn-sm" onClick={() => { setEdit(null); setShow(true) }}>+ Add Product</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr>{["","Title","Part No.","Unique Code","Vehicle","Year","Wt","Category","Price","Stock","Actions"].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {products.map(p => {
              const cat = categories.find(c => c._id === p.categoryId)
              return (
                <tr key={p._id}>
                  <td><img src={p.image} alt="" className="tbl-img" /></td>
                  <td style={{ fontWeight:600, maxWidth:150 }}>{p.title}</td>
                  <td><span className="tbl-mono">{p.partNumber}</span></td>
                  <td><span className="tbl-mono">{p.uniqueCode}</span></td>
                  <td style={{ color:"var(--t2)" }}>{p.vehicleModel}</td>
                  <td style={{ color:"var(--t2)" }}>{p.modelYear}</td>
                  <td style={{ color:"var(--t2)" }}>{p.weight}</td>
                  <td>{cat?.icon} {cat?.name}</td>
                  <td style={{ fontFamily:"var(--ff-head)", fontWeight:800, color:"var(--orange)" }}>{formatINR(p.price)}</td>
                  <td><span className={`tbl-badge ${p.stock > 20 ? "tag-green" : p.stock > 0 ? "tag-yellow" : "tag-red"}`}>{p.stock}</span></td>
                  <td>
                    <div className="tbl-actions">
                      <button className="btn btn-outline btn-sm" style={{ padding:"4px 10px", fontSize:"12px" }}
                        onClick={() => { setEdit(p); setShow(true) }}>✏️</button>
                      <button className="btn btn-danger btn-sm" style={{ padding:"4px 10px", fontSize:"12px" }}
                        onClick={() => handleDelete(p._id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {show && (
        <ProductModal product={edit} categories={categories}
          onClose={() => setShow(false)} onSave={handleSave} />
      )}
    </div>
  )
}

function CatsTab({ categories, products, dispatch, showToast }) {
  const [form, setForm] = useState({ name:"", icon:"🔧" })
  const [edit, setEdit] = useState(null)
  const s = (k, v) => edit ? setEdit(e => ({ ...e, [k]:v })) : setForm(f => ({ ...f, [k]:v }))
  const v = (k) => edit ? edit[k] : form[k]

  const handleAdd = async () => {
    if (!form.name) return
    await dispatch(addCategory({ ...form }))
    await dispatch(fetchCategories())
    setForm({ name:"", icon:"🔧" })
    showToast("Category added!")
  }

  const handleUpdate = async () => {
    await dispatch(updateCategory({ ...edit }))
    await dispatch(fetchCategories())
    setEdit(null)
    showToast("Category updated!")
  }

  const handleDelete = async (id) => {
    await dispatch(deleteCategory(id))
    await dispatch(fetchCategories())
    showToast("Category deleted!")
  }

  return (
    <div>
      <div className="admin-page-title">Category Management</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"24px" }}>
        <div>
          <h3 className="h4" style={{ marginBottom:"16px" }}>{edit ? "Edit" : "Add"} Category</h3>
          {[["name","Category Name"],["icon","Icon (emoji)"]].map(([k,lbl]) => (
            <div key={k} className="form-group">
              <label className="form-label">{lbl}</label>
              <input className="form-input" value={v(k) || ""} onChange={e => s(k, e.target.value)} />
            </div>
          ))}
          <div style={{ display:"flex", gap:"10px" }}>
            {edit ? (
              <>
                <button className="btn btn-primary" style={{ flex:1 }} onClick={handleUpdate}>Save Changes</button>
                <button className="btn btn-outline" onClick={() => setEdit(null)}>Cancel</button>
              </>
            ) : (
              <button className="btn btn-primary btn-block" onClick={handleAdd}>+ Add Category</button>
            )}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          {categories.map(c => (
            <div key={c._id} className="card" style={{ padding:"12px 14px", display:"flex", alignItems:"center", gap:"12px" }}>
              <span style={{ fontSize:"22px" }}>{c.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:"14px" }}>{c.name}</div>
                <div style={{ fontSize:"12px", color:"var(--t3)" }}>{products.filter(p => p.categoryId === c._id).length} products</div>
              </div>
              <button className="btn btn-outline btn-sm" style={{ padding:"4px 10px", fontSize:"12px" }}
                onClick={() => setEdit({ ...c })}>✏️</button>
              <button className="btn btn-danger btn-sm" style={{ padding:"4px 10px", fontSize:"12px" }}
                onClick={() => handleDelete(c._id)}>🗑</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RolesTab({ roles, dispatch, showToast }) {
  const [form, setForm] = useState({ name:"", permissions:[] })
  const toggle = (p) => setForm(f => ({
    ...f, permissions: f.permissions.includes(p) ? f.permissions.filter(x => x !== p) : [...f.permissions, p]
  }))

  const handleAdd = async () => {
    if (!form.name || !form.permissions.length) return
    await dispatch(addRole({ ...form }))
    await dispatch(fetchRoles())
    setForm({ name:"", permissions:[] })
    showToast("Role created!")
  }

  const handleDelete = async (id) => {
    await dispatch(deleteRole(id))
    await dispatch(fetchRoles())
    showToast("Role deleted!")
  }

  return (
    <div>
      <div className="admin-page-title">Roles & Permissions</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"24px" }}>
        <div>
          <h3 className="h4" style={{ marginBottom:"16px" }}>Create New Role</h3>
          <div className="form-group">
            <label className="form-label">Role Name</label>
            <input className="form-input" value={form.name} placeholder="e.g. Warehouse Manager"
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={{ marginBottom:"16px" }}>
            <label className="form-label" style={{ display:"block", marginBottom:"10px" }}>Feature Access Control</label>
            <div className="perm-grid">
              {ALL_PERMISSIONS.map(p => (
                <div key={p} className={`perm-chip${form.permissions.includes(p) ? " on" : ""}`} onClick={() => toggle(p)}>
                  <div className="perm-check">{form.permissions.includes(p) && <span style={{ color:"#fff", fontSize:"10px", fontWeight:800 }}>✓</span>}</div>
                  <span style={{ textTransform:"capitalize" }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-primary btn-block" onClick={handleAdd}>+ Create Role</button>
        </div>
        <div>
          <h3 className="h4" style={{ marginBottom:"16px" }}>Existing Roles</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            {roles.map(r => (
              <div key={r._id} className="role-card">
                <div className="role-card-head">
                  <div className="role-card-name">🛡️ {r.name}</div>
                  <button className="btn btn-danger btn-sm" style={{ padding:"3px 10px", fontSize:"11px" }}
                    onClick={() => handleDelete(r._id)}>Remove</button>
                </div>
                <div className="perm-tags">
                  {r.permissions.map(p => (
                    <span key={p} className={`tag ${p === "all" ? "tag-orange" : "tag-blue"}`}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function UsersTab() {
  const users    = useSelector(s => s.users.list)
  const dispatch = useDispatch()
  useEffect(() => { dispatch(fetchUsers()) }, [])
  return (
    <div>
      <div className="admin-page-title">User Management</div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr>{["Name","Email","Role","Joined"].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td style={{ fontWeight:600 }}>{u.name}</td>
                <td style={{ color:"var(--t2)" }}>{u.email}</td>
                <td><span className={`tbl-badge ${u.isAdmin ? "tag-orange" : "tag-blue"}`}>{u.isAdmin ? "Admin" : "User"}</span></td>
                <td style={{ color:"var(--t3)" }}>{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [tab, setTab]     = useState("dashboard")
  const [toast, setToast] = useState(null)

  const products   = useSelector(s => s.products.list)
  const categories = useSelector(s => s.categories.list)
  const orders     = useSelector(s => s.orders.list)
  const roles      = useSelector(s => s.roles.list)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
    dispatch(fetchOrders())
    dispatch(fetchRoles())
    const interval = setInterval(() => {
      dispatch(fetchProducts())
      dispatch(fetchOrders())
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const showToast     = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600) }
  const pendingOrders = orders.filter(o => o.status === "Pending").length

  const TABS = [
    { id:"dashboard",  lbl:"📊 Dashboard" },
    { id:"orders",     lbl:`🧾 Orders${pendingOrders > 0 ? ` (${pendingOrders})` : ""}` },
    { id:"products",   lbl:"📦 Products"  },
    { id:"categories", lbl:"🗂️ Categories" },
    { id:"roles",      lbl:"🛡️ Roles"     },
    { id:"users",      lbl:"👥 Users"     },
  ]

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="admin-brand">AUTO<span>PARTS</span></div>
          <div className="admin-subbrand">ADMIN PANEL</div>
        </div>
        <nav className="admin-nav">
          {TABS.map(t => (
            <button key={t.id} className={`admin-nav-item${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
              {t.lbl}
              {t.id === "orders" && pendingOrders > 0 && (
                <span style={{ marginLeft:"auto", background:"#ef4444", color:"#fff", fontSize:"11px", fontWeight:700, padding:"1px 7px", borderRadius:"var(--rF)" }}>
                  {pendingOrders}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-nav-item" onClick={() => navigate("/")}>🏠 View Store</button>
          <button className="admin-nav-item" style={{ color:"#ef4444" }}
            onClick={() => { dispatch(logout()); navigate("/") }}>🚪 Logout</button>
        </div>
      </aside>

      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <div className="admin-mobile-bar">
          {TABS.map(t => (
            <button key={t.id} className={`admin-mobile-tab${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
              {t.lbl}
            </button>
          ))}
          <button className="admin-mobile-tab" onClick={() => navigate("/")}>🏠</button>
          <button className="admin-mobile-tab" style={{ color:"#ef4444" }}
            onClick={() => { dispatch(logout()); navigate("/") }}>Exit</button>
        </div>
        <div className="admin-main">
          {tab === "dashboard"   && <DashTab products={products} categories={categories} orders={orders} />}
          {tab === "orders"      && <OrdersTab orders={orders} dispatch={dispatch} />}
          {tab === "products"    && <ProductsTab products={products} categories={categories} dispatch={dispatch} showToast={showToast} />}
          {tab === "categories"  && <CatsTab categories={categories} products={products} dispatch={dispatch} showToast={showToast} />}
          {tab === "roles"       && <RolesTab roles={roles} dispatch={dispatch} showToast={showToast} />}
          {tab === "users"       && <UsersTab />}
        </div>
      </div>
      {toast && <Toast message={toast} />}
    </div>
  )
}