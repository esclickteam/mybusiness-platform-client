import React from "react";
import EstateoPages from "./pages";

export default function EstateoPreview() {
  return (
    <div dir="rtl" data-template-id="estateo-preview" className="min-h-screen w-full" style={{ background: "#100e0c", color: "#f4ecdf" }}>
      <EstateoPages initialPage="home" mode="preview" />
    </div>
  );
}
