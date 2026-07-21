import React from "react";
import MiragePages from "./pages";
export default function MiragePreview() {
  return (
    <div dir="rtl" data-template-id="mirage-preview" className="min-h-screen w-full" style={{ background: "#f7f0e4", color: "#4a3828" }}>
      <MiragePages initialPage="home" mode="preview" />
    </div>
  );
}
