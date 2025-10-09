import React from "react";

export function LoginSkeleton() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {/* Spinner from index.css */}
      <div className="spinner" style={{ marginBottom: "2rem" }}></div>

      {/* Loading skeleton */}
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={skeletonStyle("75%", 24)} />
        <div style={skeletonStyle("100%", 16)} />
        <div style={skeletonStyle("83%", 16)} />
        <div style={skeletonStyle("66%", 16)} />
      </div>
    </div>
  );
}

// Small function for uniform styling
function skeletonStyle(width, height) {
  return {
    height,
    width,
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
    marginBottom: "1rem",
  };
}
