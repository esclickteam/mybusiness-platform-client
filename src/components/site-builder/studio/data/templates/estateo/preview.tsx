import React from "react";
import EstateoPages from "./pages";
export default function EstateoPreview() {
  return (
    <div dir="rtl" data-template-id="estateo-preview" className="min-h-screen w-full" style={{ background: "#14110f", color: "#f5efe6" }}>
      <EstateoPages initialPage="home" mode="preview" />
    </div>
  );
}
