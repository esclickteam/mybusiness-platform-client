import React from "react";
import SpiceforgePages from "./pages";
export default function SpiceforgePreview() {
  return (
    <div dir="rtl" data-template-id="spiceforge" className="min-h-screen w-full" style={{ background: "#1a0f0a", color: "#fff1e0" }}>
      <SpiceforgePages initialPage="home" mode="preview" />
    </div>
  );
}
