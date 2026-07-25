import React from "react";
import DentellePages from "./pages";
export default function DentellePreview() {
  return (
    <div dir="rtl" data-template-id="dentelle-preview" className="min-h-screen w-full" style={{ background: "#F8FAFC", overflowX: "hidden" }}>
      <DentellePages initialPage="home" mode="preview" />
    </div>
  );
}
