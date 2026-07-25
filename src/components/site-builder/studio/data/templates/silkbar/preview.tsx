import React from "react";
import SilkbarPages from "./pages";

export default function SilkbarPreview() {
  return (
    <div dir="rtl" data-template-id="silkbar-preview" className="min-h-screen w-full" style={{ background: "#F7FCFB", overflowX: "hidden" }}>
      <SilkbarPages initialPage="home" mode="preview" />
    </div>
  );
}
