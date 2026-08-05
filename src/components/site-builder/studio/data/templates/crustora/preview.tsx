import React from "react";
import CrustoraPages from "./pages";
export default function CrustoraPreview() {
  return (
    <div dir="rtl" data-template-id="crustora" className="min-h-screen w-full" style={{ background: "#faf4eb", color: "#2a1810" }}>
      <CrustoraPages initialPage="home" mode="preview" />
    </div>
  );
}
