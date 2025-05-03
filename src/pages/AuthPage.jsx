// src/pages/AuthPage.jsx
import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "../styles/AuthPage.css";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            התחבר
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            הרשמה
          </button>
        </div>
        <div className="form-container">
          {mode === "login" ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  );
}
