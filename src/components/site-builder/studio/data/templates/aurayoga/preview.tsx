import React from "react";
import AurayogaPages from "./pages";
export default function AurayogaPreview() {
  return (
    <div dir="rtl" data-template-id="aurayoga" className="min-h-screen w-full" style={{ background: "#1C1526", overflowX: "hidden" }}>
      <AurayogaPages initialPage="home" mode="preview" />
    </div>
  );
}
