// src/data/dummyData.js — utility functions only (data now comes from MongoDB)

export const ALL_PERMISSIONS = ["all","products","categories","orders","users","roles","reports","settings"]

export const badgeColor = (badge) => {
  const m = {
    Bestseller:"#22c55e", "New Arrival":"#3b82f6", "OEM Grade":"#8b5cf6",
    Premium:"#f59e0b", Hot:"#ef4444", "Value Pack":"#06b6d4",
  }
  return m[badge] || "#6b7280"
}

export const formatINR = (n) => `₹${Number(n).toLocaleString("en-IN")}`
export const disc = (o, c) => o > 0 ? Math.round(((o - c) / o) * 100) : 0