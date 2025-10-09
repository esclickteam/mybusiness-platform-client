jsx
// src/components/Unauthorized.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>❌ You do not have permission to view this page</h2>
      <p>Please log in with an appropriate account or contact the system administrator.</p>
      <Link to="/">Back to home page</Link>
    </div>
  );
}
