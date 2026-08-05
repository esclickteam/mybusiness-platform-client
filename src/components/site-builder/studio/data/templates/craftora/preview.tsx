import React from "react";
import CraftoraPages from "./pages";

export default function CraftoraPreview() {
  return (
    <div dir="rtl" data-template-id="craftora" className="min-h-screen w-full" style={{ background: "#F5F5F4", overflowX: "hidden" }}>
      <CraftoraPages initialPage="home" mode="preview" />
    </div>
  );
}
