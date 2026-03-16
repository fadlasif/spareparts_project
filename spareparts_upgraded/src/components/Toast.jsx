import React from "react"
export default function Toast({ message }) {
  return (
    <div className="toast">
      <span className="toast-dot" />
      {message}
    </div>
  )
}
