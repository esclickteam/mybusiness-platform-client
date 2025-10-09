import React from "react";

const AppErrorFallback = ({ error, resetErrorBoundary }) => {
  console.error("🔥 שגיאה שנתפסה ע״י ErrorBoundary:", error);

  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        color: "#b00020",
        background: "#fff3f3",
        borderRadius: "12px",
        margin: "4rem auto",
        maxWidth: "600px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        fontFamily: "sans-serif"
      }}
    >
      <h2>⚠️ שגיאה באפליקציה</h2>
      <p>משהו השתבש... נסה לרענן את הדף או לחזור מאוחר יותר.</p>
      {error?.message && (
        <div
          style={{
            background: "#fce4e4",
            color: "#b00020",
            padding: "1rem",
            borderRadius: "8px",
            marginTop: "1rem",
            textAlign: "left",
            direction: "ltr",
            whiteSpace: "pre-wrap",
            fontSize: "0.9rem"
          }}
        >
          {error.message}
        </div>
      )}
      <button
        onClick={resetErrorBoundary}
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          background: "#b00020",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "1rem",
          cursor: "pointer"
        }}
      >
        🔁 רענן את הדף
      </button>
    </div>
  );
};

export default AppErrorFallback;
