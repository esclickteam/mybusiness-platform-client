import React from "react";
import SkyholdPages from "./pages";
export default function SkyholdPreview() {
  return (
    <div dir="rtl" data-template-id="skyhold" className="min-h-screen w-full" style={{ background: "#0f1419", color: "#e8edf5" }}>
      <SkyholdPages initialPage="home" mode="preview" />
    </div>
  );
}
