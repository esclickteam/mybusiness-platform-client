import React from "react";
import DriftwoodPages from "./pages";
export default function DriftwoodPreview() {
  return (
    <div dir="rtl" data-template-id="driftwood-preview" className="min-h-screen w-full" style={{ background: "#f0e8dc", color: "#3c2e22" }}>
      <DriftwoodPages initialPage="home" mode="preview" />
    </div>
  );
}
