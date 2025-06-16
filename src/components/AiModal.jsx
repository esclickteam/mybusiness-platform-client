import React from "react";
import { useAi } from "../context/AiContext";
import { useLocation } from "react-router-dom";

export default function AiModal() {
  const { activeSuggestion, approveSuggestion, rejectSuggestion, closeModal, loading } = useAi();
  const location = useLocation();

  // בדיקה האם מיקום ה-URL מתאים לטאבים של ניהול העסק
  const isBusinessManagementTab =
    location.pathname.startsWith("/business/") &&
    (location.pathname.includes("/dashboard") || location.pathname.includes("/chat"));

  if (!activeSuggestion || !isBusinessManagementTab) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={closeModal}
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 24,
          maxWidth: 400,
          width: "90%",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: 16 }}>הודעת AI חדשה</h2>
        <p style={{ marginBottom: 24, whiteSpace: "pre-wrap" }}>{activeSuggestion.text}</p>
        <div>
          <button
            onClick={() => approveSuggestion(activeSuggestion.id)}
            disabled={loading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            אשר ושלח
          </button>
          <button
            onClick={() => rejectSuggestion(activeSuggestion.id)}
            disabled={loading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: loading ? "not-allowed" : "pointer",
              marginLeft: 12,
            }}
          >
            דחה
          </button>
          <button
            onClick={closeModal}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              marginLeft: 12,
            }}
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
}
