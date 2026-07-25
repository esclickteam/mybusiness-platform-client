import React from "react";
import BakoraPages from "./pages";
export default function BakoraPreview() {
  return (
    <div dir="rtl" data-template-id="bakora-preview" className="min-h-screen w-full" style={{ background: "#faf6f0", color: "#2a1f18" }}>
      <BakoraPages initialPage="home" mode="preview" />
    </div>
  );
}
