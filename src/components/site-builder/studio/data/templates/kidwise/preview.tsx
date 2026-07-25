import React from "react";
import KidwisePages from "./pages";

export default function KidwisePreview() {
  return (
    <div dir="rtl" data-template-id="kidwise-preview" className="min-h-screen w-full" style={{ background: "#ECFDF5", overflowX: "hidden" }}>
      <KidwisePages initialPage="home" mode="preview" />
    </div>
  );
}
