import React from "react";
import PropnexPages from "./pages";
export default function PropnexPreview() {
  return (
    <div dir="rtl" data-template-id="propnex-preview" className="min-h-screen w-full" style={{ background: "#f4f6f9", color: "#111827" }}>
      <PropnexPages initialPage="home" mode="preview" />
    </div>
  );
}
