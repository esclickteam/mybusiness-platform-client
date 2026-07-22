import React from "react";
import DwellistPages from "./pages";
export default function DwellistPreview() {
  return (
    <div dir="rtl" data-template-id="dwellist-preview" className="min-h-screen w-full" style={{ background: "#faf8f5", color: "#2c2419" }}>
      <DwellistPages initialPage="home" mode="preview" />
    </div>
  );
}
