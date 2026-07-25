import React from "react";
import ShawarmiaPages from "./pages";
export default function ShawarmiaPreview() {
  return (
    <div dir="rtl" data-template-id="shawarmia-preview" className="min-h-screen w-full" style={{ background: "#14110e", color: "#f5ebe0" }}>
      <ShawarmiaPages initialPage="home" mode="preview" />
    </div>
  );
}
