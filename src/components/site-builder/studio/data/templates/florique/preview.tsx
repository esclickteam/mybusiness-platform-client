import React from "react";
import FloriquePages from "./pages";
export default function FloriquePreview() {
  return (
    <div dir="rtl" data-template-id="florique-preview" className="min-h-screen w-full" style={{ background: "#FFF7FB", overflowX: "hidden" }}>
      <FloriquePages initialPage="home" mode="preview" />
    </div>
  );
}
