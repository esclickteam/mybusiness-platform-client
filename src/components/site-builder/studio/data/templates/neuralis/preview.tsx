import React from "react";
import NeuralisPages from "./pages";
export default function NeuralisPreview() {
  return (
    <div dir="rtl" data-template-id="neuralis" className="min-h-screen w-full" style={{ background: "#050816", overflowX: "hidden" }}>
      <NeuralisPages initialPage="home" mode="preview" />
    </div>
  );
}
