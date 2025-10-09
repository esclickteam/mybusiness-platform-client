// src/components/Unauthorized.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>❌ אין לך הרשאה לצפות בעמוד זה</h2>
      <p>אנא התחבר עם חשבון מתאים או פנה למנהל המערכת.</p>
      <Link to="/">חזרה לעמוד הבית</Link>
    </div>
  );
}
