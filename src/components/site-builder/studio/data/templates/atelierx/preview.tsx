import React from "react";
import AtelierxPages from "./pages";
export default function AtelierxPreview() {
  return (
    <div dir="rtl" data-template-id="atelierx" className="min-h-screen w-full" style={{ background: "#FAFAFA", overflowX: "hidden" }}>
      <AtelierxPages initialPage="home" mode="preview" />
    </div>
  );
}
