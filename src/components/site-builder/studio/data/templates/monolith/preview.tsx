import React from "react";
import MonolithPages from "./pages";

export default function MonolithPreview() {
  return (
    <div dir="rtl" data-template-id="monolith-preview" className="min-h-screen w-full" style={{ background: "#eef0f4", overflowX: "hidden" }}>
      <MonolithPages initialPage="home" mode="preview" />
    </div>
  );
}
