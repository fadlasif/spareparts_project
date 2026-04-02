import React, { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import { useDispatch } from "react-redux"
import AppRoutes from "./routes/AppRoutes"
import { fetchProducts, fetchCategories } from "./store/store"

function AppInner() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
    const interval = setInterval(() => {
      dispatch(fetchProducts())
      dispatch(fetchCategories())
    }, 15000)
    return () => clearInterval(interval)
  }, [])
  return <AppRoutes />
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppInner />
    </BrowserRouter>
  )
}                                                           