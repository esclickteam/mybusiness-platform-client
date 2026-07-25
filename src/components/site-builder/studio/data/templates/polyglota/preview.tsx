import React from "react";
import PolyglotaPages from "./pages";

export default function PolyglotaPreview() {
  return (
    <div dir="rtl" data-template-id="polyglota-preview" className="min-h-screen w-full" style={{ background: "#F0F9FF", overflowX: "hidden" }}>
      <PolyglotaPages initialPage="home" mode="preview" />
    </div>
  );
}
