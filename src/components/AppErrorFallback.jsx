import React from "react";

const AppErrorFallback = ({ resetErrorBoundary }) => {
  return (
    <div
      dir="rtl"
      style={{
        padding: "2rem",
        textAlign: "center",
        color: "#0f172a",
        background: "#f8fafc",
        borderRadius: "12px",
        margin: "4rem auto",
        maxWidth: "600px",
        boxShadow: "0 0 10px rgba(0,0,0,0.08)",
        fontFamily: "sans-serif"
      }}
    >
      <h2>אירעה שגיאה זמנית</h2>
      <p>לא הצלחנו לטעון את העמוד. רעננו ונסו שוב.</p>
      <button
        onClick={resetErrorBoundary}
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "1rem",
          cursor: "pointer"
        }}
      >
        רענון העמוד
      </button>
    </div>
  );
};

export default AppErrorFallback;
