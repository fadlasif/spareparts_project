import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { login } from "../store/store"
import api from "../services/api"

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

export default function Login() {
  const [tab, setTab]         = useState("signin")
  const [form, setForm]       = useState({ name:"", email:"", password:"", confirm:"" })
  const [err, setErr]         = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSignIn = async () => {
    setErr("")
    if (!form.email || !form.password) { setErr("Please enter email and password."); return }
    if (!isValidEmail(form.email))     { setErr("Please enter a valid email address."); return }
    try {
      setLoading(true)
      const res = await api.post("/auth/login", { email: form.email, password: form.password })
      localStorage.setItem("token", res.data.token)
      dispatch(login({ isAdmin: res.data.isAdmin, user: res.data.user }))
      navigate(res.data.isAdmin ? "/admin" : "/")
    } catch (err) {
      setErr(err.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setErr(""); setSuccess("")
    if (!form.name || !form.email || !form.password || !form.confirm) { setErr("Please fill in all fields."); return }
    if (!isValidEmail(form.email))      { setErr("Please enter a valid email address."); return }
    if (form.password !== form.confirm) { setErr("Passwords do not match."); return }
    if (form.password.length < 6)       { setErr("Password must be at least 6 characters."); return }
    try {
      setLoading(true)
      const res = await api.post("/auth/register", { name: form.name, email: form.email, password: form.password })
      localStorage.setItem("token", res.data.token)
      dispatch(login({ isAdmin: res.data.isAdmin, user: res.data.user }))
      navigate("/")
    } catch (err) {
      setErr(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const emailBorder = (val) => {
    if (!val) return {}
    return isValidEmail(val)
      ? { borderColor:"#22c55e", boxShadow:"0 0 0 3px rgba(34,197,94,.1)" }
      : { borderColor:"#ef4444", boxShadow:"0 0 0 3px rgba(239,68,68,.1)" }
  }

  const EyeBtn = ({ show, onToggle }) => (
    <button type="button" onClick={onToggle} style={{
      position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)",
      background:"none", border:"none", cursor:"pointer", color:"var(--t3)",
      fontSize:"16px", padding:"0", lineHeight:1, display:"flex", alignItems:"center"
    }}>
      {show
        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </button>
  )

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🚗</div>
        <h1 className="login-title">{tab === "signin" ? "Welcome Back" : "Create Account"}</h1>
        <p className="login-sub">
          {tab === "signin" ? "Sign in to your AutoParts Hub account" : "Join AutoParts Hub and start shopping"}
        </p>

        <div className="tab-row">
          <button className={`tab-btn${tab === "signin" ? " active" : ""}`}
            onClick={() => { setTab("signin"); setErr(""); setSuccess("") }}>Sign In</button>
          <button className={`tab-btn${tab === "register" ? " active" : ""}`}
            onClick={() => { setTab("register"); setErr(""); setSuccess("") }}>Register</button>
        </div>

        {/* ── Sign In ── */}
        {tab === "signin" && (
          <>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" value={form.email}
                placeholder="you@example.com"
                style={emailBorder(form.email)}
                onChange={e => set("email", e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSignIn()} />
              {form.email && !isValidEmail(form.email) && (
                <p style={{ color:"#ef4444", fontSize:"11px", marginTop:"4px" }}>⚠️ Invalid email format</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position:"relative" }}>
                <input className="form-input" type={showPass ? "text" : "password"} value={form.password}
                  placeholder="••••••••" style={{ paddingRight:"42px" }}
                  onChange={e => set("password", e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSignIn()} />
                <EyeBtn show={showPass} onToggle={() => setShowPass(v => !v)} />
              </div>
            </div>

            <div style={{ textAlign:"right", marginBottom:"16px", marginTop:"-8px" }}>
              <span style={{ fontSize:"12px", color:"var(--orange)", cursor:"pointer" }}>Forgot password?</span>
            </div>

            {err && <p style={{ color:"#ef4444", fontSize:"13px", marginBottom:"12px" }}>⚠️ {err}</p>}

            <button className="btn btn-primary btn-block" style={{ padding:"13px", marginBottom:"10px" }}
              onClick={handleSignIn} disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
            <button className="btn btn-outline btn-block" style={{ padding:"11px" }}
              onClick={() => { dispatch(login({ isAdmin:false, user:{ name:"Guest" } })); navigate("/") }}>
              Continue as Guest
            </button>

            <p style={{ textAlign:"center", marginTop:"20px", fontSize:"13px", color:"var(--t3)" }}>
              Don't have an account?{" "}
              <span style={{ color:"var(--orange)", cursor:"pointer", fontWeight:600 }}
                onClick={() => { setTab("register"); setErr("") }}>Register here</span>
            </p>
          </>
        )}

        {/* ── Register ── */}
        {tab === "register" && (
          <>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" value={form.name}
                placeholder="John Doe" onChange={e => set("name", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" value={form.email}
                placeholder="you@example.com" style={emailBorder(form.email)}
                onChange={e => set("email", e.target.value)} />
              {form.email && !isValidEmail(form.email) && (
                <p style={{ color:"#ef4444", fontSize:"11px", marginTop:"4px" }}>⚠️ Invalid email format</p>
              )}
              {form.email && isValidEmail(form.email) && (
                <p style={{ color:"#22c55e", fontSize:"11px", marginTop:"4px" }}>✅ Valid email</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position:"relative" }}>
                <input className="form-input" type={showPass ? "text" : "password"} value={form.password}
                  placeholder="Min. 6 characters" style={{ paddingRight:"42px" }}
                  onChange={e => set("password", e.target.value)} />
                <EyeBtn show={showPass} onToggle={() => setShowPass(v => !v)} />
              </div>
              {form.password && form.password.length < 6 && (
                <p style={{ color:"#ef4444", fontSize:"11px", marginTop:"4px" }}>⚠️ At least 6 characters required</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position:"relative" }}>
                <input className="form-input" type={showConfirm ? "text" : "password"} value={form.confirm}
                  placeholder="••••••••"
                  style={{
                    paddingRight:"42px",
                    ...(form.confirm ? (form.confirm === form.password
                      ? { borderColor:"#22c55e", boxShadow:"0 0 0 3px rgba(34,197,94,.1)" }
                      : { borderColor:"#ef4444", boxShadow:"0 0 0 3px rgba(239,68,68,.1)" }) : {})
                  }}
                  onChange={e => set("confirm", e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleRegister()} />
                <EyeBtn show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p style={{ color:"#ef4444", fontSize:"11px", marginTop:"4px" }}>⚠️ Passwords do not match</p>
              )}
              {form.confirm && form.confirm === form.password && (
                <p style={{ color:"#22c55e", fontSize:"11px", marginTop:"4px" }}>✅ Passwords match</p>
              )}
            </div>

            {err     && <p style={{ color:"#ef4444", fontSize:"13px", marginBottom:"12px" }}>⚠️ {err}</p>}
            {success && <p style={{ color:"#22c55e", fontSize:"13px", marginBottom:"12px" }}>✅ {success}</p>}

            <button className="btn btn-primary btn-block" style={{ padding:"13px", marginBottom:"10px" }}
              onClick={handleRegister} disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>

            <p style={{ textAlign:"center", marginTop:"16px", fontSize:"13px", color:"var(--t3)" }}>
              Already have an account?{" "}
              <span style={{ color:"var(--orange)", cursor:"pointer", fontWeight:600 }}
                onClick={() => { setTab("signin"); setErr("") }}>Sign in here</span>
            </p>
          </>
        )}

        <p style={{ textAlign:"center", marginTop:"16px", fontSize:"12px", color:"var(--t3)" }}>
          <span style={{ color:"var(--orange)", cursor:"pointer" }} onClick={() => navigate("/")}>← Back to shop</span>
        </p>
      </div>
    </div>
  )
}